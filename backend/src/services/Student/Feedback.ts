import { faculty_info, subject_batch } from '@prisma/client';
import prisma from '../../client';
import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError';

const getFeedbackNba = async (
  computer_code: number,
  academic_session: number,
) => {
  try {
    let student = await prisma.student_college_info_new.findMany({
      where: {
        computer_code: computer_code,
        academic_session: academic_session
      },
      select: {
        batch_id: true,
        batch_name: true
      }
    });

    if (!student) {
      throw new ApiError(httpStatus.NOT_FOUND, 'student not found');
    }

    let response: any[] = [];
    // return student = batch id 
    for (const student_batch of student) {
      let element_co_response: any[] = [];
      let feedbackco = await prisma.feedback_co.findMany({
        where: {
          batch_id: student_batch.batch_id,
          academic_session: academic_session
        }
      })
      let status: boolean = false
      let feedback_already_filled = await prisma.feedback_student_co.findFirst({
        where: {
          feedback_id: feedbackco[0].feedback_id,
          computer_code: computer_code
        }
      })
      if (feedback_already_filled) {
        status = true
      }
      for (const element_feedback of feedbackco) {
        const co_details = await prisma.co.findFirst({
          where: {
            co_id: Number(element_feedback.co_id),
            academic_session: academic_session
          },
        });
        element_co_response.push({
          co_id: Number(co_details?.co_id),
          co: co_details?.co,
          co_name: co_details?.co_name,
          feedback_id: element_feedback.feedback_id
        })
      }
      response.push({
        batch: student_batch.batch_name,
        submitted: status,
        co_list: element_co_response
      })
    }

    return response
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
};
const InsertNbaFeedbackCo = async (
  academic_session: number,
  computer_code:number,
  feedback_id: string,
  data: any
) => {
  try {
    let feedbacks = await prisma.feedback_co.findMany({
      where: {
        feedback_id: String(feedback_id),
        academic_session: academic_session,
      },
    });

    if (!feedbacks) {
      throw new ApiError(httpStatus.NOT_FOUND, 'student not found');
    }
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      let old_feedback = await prisma.feedback_co.findFirst({
        where: {
          co_id: String(element.co_id),
        },
      });
      let grade: 'a' | 'b' | 'c' | 'd' | 'e' = 'e';

      if (old_feedback) {
        switch (element.value) {
          case 1:
            grade = 'e';
            break;
          case 2:
            grade = 'd';
            break;
          case 3:
            grade = 'c';
            break;
          case 4:
            grade = 'b';
            break;
          case 5:
            grade = 'a';
            break;
          default:
            break;
        }
        // If old_feedback exists, update the value
        const newValue = old_feedback[grade] + 1 || 1;

        let feedback_Details_update = await prisma.feedback_co.updateMany({
          where: {
            co_id: String(element.co_id),
          },
          data: {
            [grade]: newValue,
          },
        });
        let feedback_already_filled = await prisma.feedback_student_co.create({
          data: {
            feedback_id: feedback_id,
            computer_code: computer_code
          }
        })
        if (!feedback_already_filled) {
          throw new ApiError(httpStatus.NOT_FOUND, 'attendance not marked');
        }
      } else {
        // Handle the case where old_feedback doesn't exist
        console.error(`No feedback found for co_id ${element.co_id}`);
      }
    }

    return "success";
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${error}`);
  }
};
const getfacilityfeedback = async (
  computer_code: number,
  academic_session: number,
) => {
  try {
    let student = await prisma.student_college_info_new.findFirst({
      where: {
        academic_session: academic_session,
        computer_code: computer_code
      }
    });

    if (!student) {
      throw new ApiError(httpStatus.NOT_FOUND, 'student not found');
    }

    let feedback_facility_id = await prisma.feedback_facility_id.findFirst({
      where: {
        semester: student.semester,
        department: student.home_dept,
        academic_session: academic_session
      }
    })
    if (!feedback_facility_id) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No feedback Generated');
    }
    let already_feedback_submitted = await prisma.feedback_facility_comments.findFirst({
      where: {
        computer_code: computer_code
      }
    })
    let feedback_id = feedback_facility_id?.feedback_id || 0
    let status: boolean = false
    if (already_feedback_submitted) {
      status = true
    }
    const instituteCriteria = [
      "The institute campus is green & eco-friendly",
      "The institute participates in Swachh Bharat Abhiyan",
      "The institute has adequate regular & backup power supply",
      "Canteen is hygienic & maintained properly",
      "Medical facility is available on the campus & satisfactory",
      "The institution administration is efficient, effective & transparent",
      "The mentoring system, Grievance cell is in place & functions efficiently",
      "The training & placement department caters very well to the students for on-campus placement",
      "Drinking water facility is available in the campus",
      "Hostel facilities are satisfactory",
      "Toilets/ washrooms are cleaned properly and hygiene is maintained",
      "Transport facilities are adequate",
      "Indoor/ outdoor games & gymnastic facilities are satisfactory",
      "Internet facilities are available with high speed",
      "Photocopying facility",
      "Available reading space in library is satisfactory",
      "The prescribed books/ reading material are available in library in ample quantity & variety",
      "Online educational resources are available and accessible",
      "The classrooms are equipped with modern teaching aids",
      "Equipments available in the laboratory meet out the curriculum & syllabi requirements",
      "Equipments in labs. are in good working condition",
      "The overall classroom & laboratory ambiance is good"
    ];
    return ({
      instituteCriteria,
      status,
      feedback_id
    })
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${error}`);
  }
};



const InsertfacilityFeedback = async (
  computer_code: number,
  feedback_id: string,
  data: any,
  comment: string
) => {
  try {
    let facility_feedback_comment = await prisma.feedback_facility_comments.findFirst({
      where: {
        feedback_id: String(feedback_id),
        computer_code: computer_code
      },
    });

    if (facility_feedback_comment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'feedback already submitted');
    }
    let char = 'a'
    let data_to_update: { [key: string]: any } = {};
    for (const element of data) {
      data_to_update[`${char}`] = element;
      char = String.fromCharCode(char.charCodeAt(0) + 1);
    }
    await prisma.feedback_facility.updateMany({
      where: {
        feedback_id: String(feedback_id)
      },
      data: data_to_update
    })
    await prisma.feedback_facility_comments.create({
      data: {
        feedback_id: String(feedback_id),
        computer_code: computer_code,
        comment: comment
      }
    })
    return {
      msg: "sucess"
    }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${error}`);
  }
};
const getfacultyfeedback = async (
  computer_code: number,
  academic_session: number,
) => {
  try {
    let student = await prisma.student_college_info_new.findMany({
      where: {
        academic_session: academic_session,
        computer_code: computer_code
      }
    });

    if (!student) {
      throw new ApiError(httpStatus.NOT_FOUND, 'student not found');
    }

    let feedback_class = await prisma.feedback_class.findFirst({
      where: {
        semester: student[0].semester,
        department: student[0].home_dept,
        academic_id: academic_session,
        active: 1
      }
    })
    if (!feedback_class) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No feedback Generated');
    }
    let feeedback_student = await prisma.feedback_student.findFirst({
      where: {
        computer_code: computer_code,
        feedback_id: feedback_class.feedback_id
      }
    })
    if (feeedback_student) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'feedback Already filled');
    }
    const teacherCriteria = [
      "Teacher comes to the class on time and takes the attendance regularly.",
      "Teacher condu s class sincerely, regularly and enthusiastically.",
      "Teacher speaks clearly, is audible and can control the class.",
      "Teacher's writing is legible and visible.",
      "Teacher comes prepared and has a good command in the subject.",
      "Teacher encourages students to ask questions in a class and answers them satisfactorily.",
      "Teacher asks questions to promote interaction and enhance thinking capability of a student.",
      "Teacher covers the syllabus completely, in a manner that the average student can understand and keep his/her interest alive in the subject.",
      "Teacher evaluates mid-sessional test answer scripts promptly and discloses the marks to the students.",
      "The evaluation of the teacher in internal assessment (Theory / Laboratory) is fair and impartial.",
      "Teacher offers assistance and counseling to needy students.",
      "Teacher educates in a class about OBE (Outcome Based Education), COs (Course Outcomes), POs (Program Outcomes), etc.",
      "Teacher covers relevant topics beyond the syllabus.",
      "Teacher uses modern teaching aids."
    ];
    let response: any[] = []

    for (let i = 0; i < student.length; i++) {
      const element = student[i];
      let subject_batch = await prisma.batch_coordinate.findFirst({
        where: {
          batch: element.batch_id
        },
        select: {
          faculty_computer_code: true
        }
      })
      let faculty = await prisma.faculty_info.findFirst({
        where: {
          computer_code: subject_batch?.faculty_computer_code
        },
        select: {
          first_name: true,
          last_name: true,
          middle_name: true,
          computer_code: true
        }
      })
      let name: any = '';
      let first_name = faculty?.first_name || '';
      if (first_name.length > 0) {
        name += first_name + " "
      }
      let middle_name = faculty?.middle_name || '';
      if (middle_name.length > 0) {
        name += middle_name + " "
      }
      let last_name = faculty?.last_name || '';
      if (last_name.length > 0) {
        name += last_name + " "
      }
      let clg_code = await prisma.subject_batch.findFirst({
        where: {
          batch_id: element.batch_id
        },
        select: {
          clg_sub_code: true
        }
      })
      response.push({
        faculty_computer_code:faculty?.computer_code,
        faculty_name: name,
        batch_id: element.batch_id,
        clg_sub_code: clg_code?.clg_sub_code
      })
    }
    return {teacherCriteria,response};
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${error}`);
  }
};
const InsertfacultyFeedback = async (
  computer_code: number,
  feedback_id: string,
  data: any,
  comment: string
) => {
  try {
    let feedback_student = await prisma.feedback_student.findFirst({
      where: {
        feedback_id: String(feedback_id),
        computer_code: computer_code
      },
    });

    if (feedback_student) {
      throw new ApiError(httpStatus.NOT_FOUND, 'feedback already submitted');
    }
    for (let i = 0; i < data.subject.length; i++) {
      const element = data[i];
      await prisma.feedback_sub_cor.create({
        data: {
          feedback_id: feedback_id,
          faculty_computer_code: element.faculty_computer_code,
          clg_sub_code: element.clg_sub_code,
          student_comp_code: computer_code,
          batch_id: element.batch_id,
          active: 1,
          a: element.a,
          b: element.b,
          c: element.c,
          d: element.d,
          e: element.e,
          f: element.f,
          g: element.g,
          h: element.h,
          i: element.i,
          j: element.j,
          k: element.k,
          l: element.l,
          m: element.m,
          n: element.n,
        }
      })
    }
    await prisma.feedback_comments.create({
      data: {
        feedback_id: String(feedback_id),
        computer_code: computer_code,
        comments: comment
      }
    })
    return {
      msg: "sucess"
    }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${error}`);
  }
};

export default {
  getFeedbackNba,
  InsertNbaFeedbackCo,
  getfacilityfeedback,
  InsertfacilityFeedback,
  getfacultyfeedback,
  InsertfacultyFeedback
};
