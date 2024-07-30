import httpStatus from 'http-status';
import prisma from '../../client';
import ApiError from '../../utils/ApiError';
import dayjs from 'dayjs';
import { genLmsApplyId, leaveTypes, remainingLeaves } from '../../utils/lmsUtils';
import commonService from '../common.service';
import { userType } from '../../utils/constants';


const getLeaveBalance = async (computer_code: number, academic_session: number) => {
  const leaves = await prisma.lms.findFirst({
    where: {
      academic_session: 15,
      faculty_computer_code: computer_code
    },
    select:{
     cl: true,
     dl: true,
     el: true,
     ol: true,
     lwp: true,
     sl: true,
     ab: true,
     ml: true,
     sdl: true,
     vl: true,
     od: true,
    }
  });
  if (leaves) {
    return { status: 1, data: leaves };
  } else {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
};

const getLeaveApplyLimit = async ( ) =>{
  const limits = await prisma.leave_apply_limit.findMany({
    where:{
      OR:[
        {leave_type : "cl"},
        {leave_type : "el"},
        {leave_type : "dl"},
        {leave_type : "ol"},
        {leave_type : "hdcl"},
        {leave_type : "lwp"},
        {leave_type : "sdl"},
      ]
    }
  });
  return limits;
}

type lecturesAssignedType = {
  faculty_computer_code: number,
  faculty_date: string,
  assigned_class: [
    {
      assigned_class_dept: string,
      assigned_section: string,
      lecture_type: string,
      start_time: string,
      end_time: string
    }
  ]
}[];

type otherResponsibilityType = {
  faculty_computer_code : number,
  faculty_date : string,
  responsibility : string,
}[];

const leaveApply = async (
  academic_session :number,
  computer_code: number,
  start_date: string,
  end_date: string,
  days: number,
  leave_type: leaveTypes | 'hdcl',
  reason:string,
  lectures_assigned:lecturesAssignedType,
  other_responsibility:otherResponsibilityType,
) => {  
  let current_date = dayjs();
  let max_date = dayjs(`${dayjs().year()}-06-30`);
  let apply_id  = await genLmsApplyId(computer_code);
  if ( leave_type == 'hdcl') leave_type = 'cl';

  // academic session hardcoded to 15
  academic_session = 15;

  if( (dayjs(end_date).isBefore(max_date.add(1,'day')) && dayjs(start_date).isBefore(max_date)) || (dayjs(end_date).isAfter(max_date) && dayjs(start_date).isAfter(max_date)) || (dayjs(end_date).isAfter(max_date)&& dayjs(start_date).isBefore(max_date)) ){
    
    let pre_balance = await remainingLeaves(computer_code,leave_type , academic_session);
    let post_balance:number;
    if ( leave_type == 'lwp' || leave_type == 'sdl') post_balance = pre_balance + days;
    else post_balance = pre_balance - days;

    if ( post_balance > 0){
      if ( lectures_assigned.length == 0 && other_responsibility.length == 0 ) throw new ApiError( httpStatus.BAD_REQUEST , `No Duties Assigned to Faculties`);
      const transaction_result = await prisma.$transaction(async(prisma)=>{
        await prisma.leave_apply.create({
          data : {
            apply_id,
            apply_date:  current_date.toDate() ,
            faculty_computer_code : computer_code,
            session : academic_session.toString(),
            start_date : new Date(start_date),
            end_date : new Date(end_date),
            days,
            pre_balance,
            leave_type,
            reason,
            hod_approval:0,
            principal_approval:0,              

          }
        })

        if ( lectures_assigned.length){
          lectures_assigned.forEach((lectureValue)=>{
            if(lectureValue.assigned_class.length){
              lectureValue.assigned_class.forEach(async(classValue)=>{
                if ( lectureValue.faculty_computer_code == computer_code) throw new ApiError( httpStatus.BAD_REQUEST , `Error in Faculty Assigned`)
                await prisma.assign_faculty_lms.create({
                  data:{
                    apply_id,
                    status:0,
                    faculty_date : new Date(lectureValue.faculty_date),
                    faculty_computer_code: lectureValue.faculty_computer_code,
                    assigned_class_dept : classValue.assigned_class_dept,
                    assigned_section : classValue.assigned_section,
                    lecture_type : classValue.lecture_type,
                    start_time: classValue.start_time,
                    end_time : classValue.end_time,
                    other_responsibility:'',
                  }
                })
              })
            }
          })
        }


        if ( other_responsibility.length){
          other_responsibility.forEach(async(value)=>{
            if ( value.faculty_computer_code == computer_code) throw new ApiError( httpStatus.BAD_REQUEST , `Error in Faculty Assigned`)

            await prisma.assign_faculty_lms.create({
              data:{
                apply_id,
                status:0,
                faculty_date : new Date(value.faculty_date),
                faculty_computer_code: value.faculty_computer_code,
                assigned_class_dept : '',
                assigned_section : '',
                lecture_type : '',
                start_time: '',
                end_time : '',
                other_responsibility:value.responsibility,
              }
            })
          })
        }

        prisma.lms.findFirst({select:{faculty_computer_code:true}})
        await prisma.lms.update({
          where:{
            faculty_computer_code_academic_session :{
              faculty_computer_code : computer_code,
              academic_session : academic_session,
            }
          },
          data:{
            [leave_type] : post_balance
          }
          
        });
        
      })
    }
    else throw new ApiError( httpStatus.BAD_REQUEST , `Can't Apply for ${leave_type.toUpperCase()}`)


  }else{
    throw new ApiError( httpStatus.BAD_REQUEST , `Can't Apply for ${leave_type.toUpperCase()}`)
  }


};


const getLeaveChart = async( computer_code:number)=>{

  try{
    const result = await prisma.leave_apply.findMany({
      where:{
        faculty_computer_code : computer_code
      }
    });


    return result;
  }catch(error){
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }

}

const getAssignedFacultiesByApplyId = async( apply_id:string)=>{

  try{
    const result:{
      course_assigned : any[],
      other_responsibility : any[],
    } = {
      course_assigned : [],
      other_responsibility : [],
    }

    result.course_assigned = await prisma.assign_faculty_lms.findMany({
      where : {
        apply_id,
        other_responsibility:'',
      }
    })

    result.other_responsibility = await prisma.assign_faculty_lms.findMany({
      where:{
        apply_id ,
        NOT:{
          other_responsibility:''
        }
      }
    })

    result.course_assigned = result.course_assigned.map((value)=>({
        ...value,
        assign_faculty_id:BigInt(value.assign_faculty_id).toString(),
      }));
    result.other_responsibility = result.other_responsibility.map((value)=>({
        ...value,
        assign_faculty_id:BigInt(value.assign_faculty_id).toString(),
      }));

    return result;
  }catch(error){
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }

}

const getFacultyAssingment = async (computer_code: number) => {
  try {
    const result: {
      course_assigned: any[],
      other_responsibility: any[],
    } = {
      course_assigned: [],
      other_responsibility: [],
    };

    // Fetch course assigned and other responsibilities concurrently
    const [courseAssignedData, otherResponsibilityData] = await Promise.all([
      prisma.assign_faculty_lms.findMany({
        where: {
          faculty_computer_code: computer_code,
          status: 0,
          other_responsibility: '',
        }
      }),
      prisma.assign_faculty_lms.findMany({
        where: {
          faculty_computer_code: computer_code,
          status: 0,
          NOT: {
            other_responsibility: '',
          },
        }
      })
    ]);

    // Process course_assigned data asynchronously
    result.course_assigned = await Promise.all(courseAssignedData.map(async (value) => {
      const req_faculty_application = await prisma.leave_apply.findFirst({
        where: { apply_id: value.apply_id },
      });

      const req_faculty = await commonService.getNameByComputerCode(req_faculty_application?.faculty_computer_code!, userType.staff);

      return {
        ...value,
        assign_faculty_id: BigInt(value.assign_faculty_id).toString(),
        request_faculty_name: req_faculty.name,
      };
    }));

    // Process other_responsibility data asynchronously
    result.other_responsibility = await Promise.all(otherResponsibilityData.map(async (value) => {
      const req_faculty_application = await prisma.leave_apply.findFirst({
        where: { apply_id: value.apply_id },
      });

      const req_faculty = await commonService.getNameByComputerCode(req_faculty_application?.faculty_computer_code!, userType.staff);

      return {
        ...value,
        assign_faculty_id: BigInt(value.assign_faculty_id).toString(),
        request_faculty_name: req_faculty.name,
      };
    }));

    return result;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
};

const acceptFacultyAssignment = async (assign_faculty_id:string) =>{
  try{
    await prisma.assign_faculty_lms.update({
      where:{
        assign_faculty_id : BigInt(assign_faculty_id),
      }, 
      data:{
        status : 1,
      }
    })
  }catch(error){
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');

  }
}
const rejectFacultyAssignment = async (assign_faculty_id:string) =>{
  try{
    await prisma.assign_faculty_lms.update({
      where:{
        assign_faculty_id : BigInt(assign_faculty_id),
      }, 
      data:{
        status : 2,
      }
    })
  }catch(error){
    console.log(error);
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');

  }
}




export default {
  getLeaveBalance,
  getLeaveApplyLimit,
  leaveApply,
  getLeaveChart,
  getAssignedFacultiesByApplyId,
  getFacultyAssingment,
  acceptFacultyAssignment,
  rejectFacultyAssignment,
};
