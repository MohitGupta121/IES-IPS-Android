import { faculty_info, subject_batch } from '@prisma/client';
import prisma from '../client';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

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

export default {
  getAcademicSession,
  getAcademicCalender,
  getTimeSlot,
  getLectureType,
  getDepartments,
};
