import { faculty_info, subject_batch } from '@prisma/client';
import prisma from '../client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { userType, usertype } from '../utils/constants';
import { Console } from 'console';

const getAcademicSession = async () => {
  try {
    let academic_session = await prisma.academic_session.findMany();
    return academic_session;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
};
const getAcademicCalender = async () => {
  try {
    let academic_calender = await prisma.academic_calender.findMany();
    return academic_calender;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
};
const getTimeSlot = async () => {
  try {
    let time_slots = await prisma.time_slots.findMany();
    return time_slots;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
};
const getLectureType = async () => {
  try {
    let getLectureType = await prisma.lecture_type.findMany();
    return getLectureType;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
};
const getDepartments = async () => {
  try {
    let getDepartments = await prisma.department.findMany({
      select : {
        id : true , 
        dept_code : true , 
        name : true,
      }
    });
    return getDepartments;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
};
const getFacultyByDepartment = async (department_id:number) => {
  try {
    let faculties = await prisma.faculty_info.findMany({
      where:{
        department : department_id
      },
      select:{
        first_name:true,
        middle_name:true,
        last_name:true,
        computer_code:true,
      }
    });
    
    let result = faculties.map((item)=>({
      name : `${item.first_name} ${item.middle_name} ${item.last_name}`,
      computer_code : item.computer_code,
    }))
    
    return result;
    
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
};

const getNameByComputerCode = async (computer_code:number, user_type: string) => {
  try {
    console.log(computer_code , user_type)
    if( user_type == userType.staff ){
      let facutly_info = await prisma.faculty_info.findFirst({
        where : {
          computer_code
        },
        select:{designation:true , first_name:true , last_name:true}
      })

      let res = {
        name : `${facutly_info?.first_name+' '}${facutly_info?.last_name}`
      }
      
      return res;
    }
    else if ( user_type == userType.student){
      let student_info = await prisma.student_college_info_new.findFirst({
        where:{
          computer_code
        },
        select:{student_name:true}
      });

      let res = {
        name : student_info?.student_name
      }
      return res;
    }
    else throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'not valid type');
    return getDepartments;
  } catch (error) {
    console.log(error)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
};




export default {
  getAcademicSession,
  getAcademicCalender,
  getTimeSlot,
  getLectureType,
  getDepartments,
  getFacultyByDepartment,
  getNameByComputerCode,
};
