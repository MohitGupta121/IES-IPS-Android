import { faculty_info, subject_batch } from '@prisma/client';
import prisma from '../../client';
import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError';

const getResult = async (
  computer_code: number,
  academic_session: number,
  event_category: number
) => {
  try {
    let batches = await prisma.student_college_info_new.findMany({
      where: {
        computer_code: computer_code,
        academic_session: academic_session
      },
      select: {
        batch_id: true,
        batch_name: true
      }
    });

    if (!batches || batches.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'student not found');
    }

    let response: any[] = [];

    for (const element_batch of batches) {
      const event_info = await prisma.event_info.findMany({
        where: {
          section: element_batch.batch_id,
          academic_session: academic_session,
          event_category: event_category
        },
        select: {
          event_info_id: true,
          event_name: true
        }
      });

      let element_event_info_response: any[] = [];

      for (const element_event_info of event_info) {
        const event_data = await prisma.event_data.findMany({
          where: {
            event_info: Number(element_event_info.event_info_id)
          }
        });

        let event_total_marks: any = 0;
        let attend;
        for (const element_event_data of event_data) {
          const event_marks = await prisma.event_marks.findFirst({
            where: {
              event_data: Number(element_event_data.event_data_id),
              student_computer_code: computer_code
            }
          });
          attend = event_marks?.attend;
          event_total_marks += event_marks?.marks || 0;
        }

        let sum = 0;

        event_data.forEach((num) => {
          sum += num.max_marks;
        });
        if (!attend) {
          event_total_marks = -1;
        }
        element_event_info_response.push({
          event_name: element_event_info.event_name,
          event_max_marks: sum,
          event_total_marks: event_total_marks
        });
      }

      response.push({
        batch_id: element_batch.batch_id,
        batch_name: element_batch.batch_name,
        marks_list: element_event_info_response
      });
    }

    return response;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
};

export default {
  getResult
};
