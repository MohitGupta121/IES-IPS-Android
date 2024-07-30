import { faculty_info, subject_batch } from '@prisma/client';
import prisma from '../../client';
import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError';

const getCumulativeAttendance = async (computer_code: number, academic_session: number) => {
  try {
    let cumulativeAttendance = await prisma.cumulative_attendance.findFirst({
      where: {
        computer_code: computer_code,
        academic_session: academic_session
      },
      select: {
        student_attendance: true,
        total_attendance: true,
        cumulative_attendance: true
      }
    });
    const data = {
      total: cumulativeAttendance?.cumulative_attendance,
      present: cumulativeAttendance?.student_attendance,
      absent:
        Number(cumulativeAttendance?.total_attendance) -
        Number(cumulativeAttendance?.student_attendance)
    };
    return data;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
};

export default {
  getCumulativeAttendance
};
