import { faculty_info, Prisma, subject_batch } from '@prisma/client';
import prisma from '../../client';
import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError';

const getAttendance = async (computer_code: number, academic_session: number) => {
  const batches = await prisma.student_college_info_new.findMany({
    where: {
      computer_code: computer_code,
      academic_session: academic_session
    },
    select: {
      batch_id: true,
      batch_name: true,
      lab_group_name: true
    }
  });

  if (!batches) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }

  const responseArray: Response[] = [];
  for (const element of batches) {
    // const labGroup = element.lab_group_name || 'AB';
    const attend_info = await prisma.attend_info_new.findMany({
      where: {
        batch_id: element.batch_id,
        academic_session: academic_session,
        OR: [{ lab_group: element.lab_group_name }, { lab_group: 'AB' }]
      },
      select: {
        attend_info: true,
        lecture_type: true,
        time_slot_id: true,
        date: true
      }
    });

    const attendInfoIds = attend_info.map((e) => e.attend_info);
    const attendanceCounts = await prisma.attend_record_new.groupBy({
      by: ['attend_info'],
      _count: {
        attend: true
      },
      where: {
        student_computer_code: computer_code,
        attend_info: {
          in: attendInfoIds
        },
        attend: 1
      }
    });

    const attendanceMap = new Map(
      attendanceCounts.map((count) => [count.attend_info, count._count.attend])
    );

    const lectures = await Promise.all(
      attend_info.map(async (e) => {
        const lec_id = e.lecture_type || 100000;
        const lecture_type_name = await prisma.lecture_type.findUnique({
          where: {
            lecture_id: lec_id
          },
          select: {
            lecture_type: true
          }
        });

        const time = e.time_slot_id || 0;
        const time_slot = await prisma.time_slots.findUnique({
          where: {
            id: time
          },
          select: {
            start_time: true,
            end_time: true
          }
        });

        const attendance = attendanceMap.get(e.attend_info) || 0;

        return {
          lecture_type: lecture_type_name?.lecture_type || null,
          time_slot: time_slot ? `${time_slot.start_time} - ${time_slot.end_time}` : null,
          attendance: attendance,
          date: e.date,
          time_slot_id: e.time_slot_id,
          lecture_type_id: e.lecture_type
        };
      })
    );

    responseArray.push({
      //@ts-ignore
      batch_id: element.batch_id,
      batch_name: element.batch_name,
      lectures: lectures
    });
  }

  return responseArray;
};

const markStudentAttendance = async (
  students: Array<{
    computer_code: number;
    attend: boolean;
  }>,
  faculty_computer_code: number,
  academic_session: number,
  date: string,
  lecture_type: number,
  group: string,
  time_slot: Array<number>,
  topic_id: number,
  topic_name: string,
  batch_id: number,
  remark: string
) => {
  if (topic_name != undefined && topic_id == 0) {
    let subject = await prisma.subject_batch.findUnique({
      where: {
        batch_id: batch_id
      }
    });
    let topic = await prisma.topic.create({
      data: {
        subject_code: subject?.clg_sub_code || '',
        topic_name: topic_name,
        active: 1
      }
    });
    topic_id = topic.topic_id;
  }

  for (let i = 0; i < time_slot.length; i++) {
    const dateObject = new Date(date);
    let attend_info_new = await prisma.attend_info_new.create({
      data: {
        batch_id: batch_id,
        faculty_computer_code: faculty_computer_code,
        date: dateObject,
        lecture_type: lecture_type,
        time_slot_id: time_slot[i],
        academic_session: academic_session,
        remark: remark,
        lab_group: group,
        topic: topic_id
      }
    });
    for (let j = 0; j < students.length; j++) {
      let attend_record_new = await prisma.attend_record_new.create({
        data: {
          student_computer_code: students[j].computer_code,
          attend_info: attend_info_new.attend_info,
          attend: Number(students[j].attend)
        }
      });
    }
  }
  
};

const getStudentForAttendance = async (batch_id: number) => {
  let students = await prisma.student_college_info_new.findMany({
    where: {
      batch_id: batch_id
    }
  });
  let subject_batch = await prisma.subject_batch.findFirst({
    where: {
      batch_id: batch_id
    }
  });
  let response = {
    status: 200,
    msg: 'successful',
    data: students
  };
  return response;
};
const getTopicForAttendance = async (batch_id: number) => {
  let subject_batch = await prisma.subject_batch.findFirst({
    where: {
      batch_id: batch_id
    }
  });
  let topics = await prisma.topic.findMany({
    where: {
      subject_code: subject_batch?.clg_sub_code,
      active: 1
    },
    select: {
      topic_name: true,
      subject_code: true,
      topic_id: true
    }
  });
  let data = {
    status: 200,
    msg: 'fetched successfully',
    data: topics
  };
  return data;
};
const getModifyAttendance = async (batch_id: number) => {
  let all_attendance = await prisma.attend_info_new.findMany({
    where: {
      batch_id: batch_id
    },
    orderBy:{
      date : 'desc'
    }
  });
  let allattendance = all_attendance.map((attendance) => ({
    ...attendance,
    attend_info: attendance.attend_info.toString()
  }));
  return allattendance;
};

const getSubjectsForFaculty = async (computer_code : number , session_id : number) =>{

  const procedure_qurey = Prisma.sql`call h_assigned_subjects_to_faculty(${computer_code} , ${session_id});`;
  let all_subjects = await prisma.$queryRaw(procedure_qurey).then(

    value=>{
      let res:any[] = [];
      let columns = [
        "batch_id",
        "subject_name",
        "batch",
        "type",
        "clg_sub_code",
        "university_sub_code",
        "max_student",
        "academic_session_id",
        "department",
        "specialization",
        "course",
        "semester",
        "ip",
        "remark",
        "time_stamp",
        "user_stamp",
        "flag",
        "university_sub_code",
        "name",
        "dept_code"
      ];

      // @ts-ignore
      value.map((item:any)=>{
        let sub = {};
        
        Object.values(item).map((item:any , index : any)=>{
          // @ts-ignore
          sub[columns[index]] = item;
          
          res.push(sub);
        })
        
      })
      
      return res;
    }
  )

  return all_subjects;

};

const getViewAttendance = async ( batch_id : number , academic_session : number , from_date:string , to_date:string  , lecture_type : number) =>{
    const attendanceData = [];
    const attendance = await prisma.attend_info_new.findMany({
      where: {
        academic_session,
        batch_id,
        lecture_type,
        date :{
          gte : from_date,
          lte : to_date,
        },
      },
      orderBy : {
        date : 'desc'
      },
      select : {
        time_stamp : true,
        lab_group : true,
        attend_info : true,
        date : true,
        time_slot_id : true,
      },
    })


    
    for ( let i = 0 ; i< attendance.length ; i++){
      let data = attendance[i];
      let attend_record_new = await prisma.attend_record_new.findMany({
        where : {
          attend_info : data.attend_info,
        }
      })
      let time_slot = await prisma.time_slots.findFirst({
        where : {
          id : attendance[i].time_slot_id || 0
        }
      })
      for( let j = 0 ; j < attend_record_new.length ; j++){

      let student = await prisma.temp_student_data.findFirst({
        where : {
          computer_code : attend_record_new[j]?.student_computer_code
        }
      })
      
      attendanceData.push({
        enrollment_no : student?.enrollment_number,
        student_name : student?.student_name,
        lab_group_name : attendance[i].lab_group,
        time_stamp : attendance[i].time_stamp,
        date : attendance[i].date,
        time_slot : time_slot,
        attend : attend_record_new[j]?.attend,
      })
      }
    }

    return attendanceData;
}

const deleteAttendance = async( attend_info : string )=>{
  return prisma.$transaction([
    prisma.attend_record_new.deleteMany({
      where : {
        attend_info : Number(attend_info) ,
      }
    }),
    prisma.attend_info_new.delete({
      where : {
        attend_info : Number(attend_info)
      }
    })
  ])
}

const getStudentByAttendInfoToModify = async (attend_info : string )=>{
  const students = await prisma.attend_record_new.findMany({
    where :{
      attend_info : Number(attend_info),
    }
  })

  const result : any[] = [];
  for ( let i = 0 ; i< students.length ; i++){
    let student_data = await prisma.temp_student_data.findFirst({
      where : {
        computer_code : students[i].student_computer_code
      }
    });
    result.push({...students[i] , attend_info : students[i].attend_info.toString() , attend_record_id : students[i].attend_record_id.toString() , name : student_data?.student_name , enrollment : student_data?.enrollment_number});
  }


  return result;
}

const markAttendanceToModify = async ( attendance : any[] )=>{

  for ( let i = 0 ; i< attendance.length ; i++){
    await prisma.attend_record_new.update({
      where:{
        attend_record_id : Number(attendance[i].attend_record_id),
      },
      data :{
        attend : Number(attendance[i].attend)
      }
    })

  }
}


export default {
  getAttendance,
  getStudentForAttendance,
  markStudentAttendance,
  getTopicForAttendance,
  getModifyAttendance,
  getSubjectsForFaculty,
  getViewAttendance,
  deleteAttendance,
  getStudentByAttendInfoToModify,
  markAttendanceToModify,
};
