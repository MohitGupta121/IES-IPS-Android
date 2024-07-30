import { faculty_info, subject_batch } from '@prisma/client';
import prisma from '../../client';
import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError';

interface response extends Array<jointdata> {}

interface jointdata {
  batch_co_id: number;
  batch: number;
  subject: subject_batch | null; // Adjust the type to allow null
}


const getBatch = async (
  computer_code: number,
  academic_session: number
): Promise<response> => {
  const users = await prisma.batch_coordinate.findMany({
    where: {
      faculty_computer_code: computer_code,
      academic_session: academic_session,
      active: 1,
    },
    select: {
      batch_co_id: true,
      batch: true,
    },
  });

  if (!users) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }

  const data: Array<jointdata> = [];

  await Promise.all(
    users.map(async (element) => {
      const subject = await prisma.subject_batch.findFirst({
        where: {
          batch_id: element.batch,
        },
      });

      data.push({
        batch_co_id: element.batch_co_id,
        batch: element.batch,
        subject: subject || null,
      });
    })
  );

  return data;
};

export default {
  getBatch,
};
