import prisma from '../../client';

const getLeaveChart = async (computer_code: number, academic_session: number) => {
  const leaves = await prisma.lms.findFirst({
    where: {
      academic_session: academic_session,
      faculty_computer_code: computer_code
    }
  });
  if (leaves) {
    return { status: 1, data: leaves };
  } else {
    return { status: 1, data: 'no data found' };
  }
};

export default {
  getLeaveChart
};
