import httpStatus from 'http-status';
import prisma from '../../client';
import ApiError from '../../utils/ApiError';

const getNotificationPrincipal = async (computer_code: number, academic_session: number) => {
  let principal = await prisma.assigned_roles.findFirst({
    where: {
      faculty_computer_code: computer_code
    },
    select: {
      principal: true
    }
  });
  if (!principal) {
    throw new ApiError(httpStatus.NOT_FOUND, 'principal not found');
  }
  let hodlist = await prisma.assigned_roles.findMany({
    where: {
      hod: 1
    },
    select: {
      faculty_computer_code: true,
      department: true
    }
  });
  let hl: any;
  hl = hodlist;
  for (let i = 0; i < hodlist.length; i++) {
    let details = await prisma.faculty_info.findFirst({
      where: {
        computer_code: hodlist[i].faculty_computer_code
      },
      select: {
        first_name: true,
        middle_name: true,
        last_name: true
      }
    });
    hl[i]['facultyname'] = `${details?.first_name} ${details?.middle_name} ${details?.last_name}`;
    hl[i]['computerCode'] = hodlist[i].faculty_computer_code;
    hl[i]['department'] = hodlist[i].department;
  }
  let yearCoordinatorList = await prisma.year_coordinator.findMany({
    where: {
      academic_session: academic_session
    },
    select: {
      year: true,
      dept_id: true,
      faculty_computer_code: true
    }
  });
  let ycl: any;
  ycl = yearCoordinatorList;
  for (let i = 0; i < yearCoordinatorList.length; i++) {
    let details = await prisma.faculty_info.findFirst({
      where: {
        computer_code: yearCoordinatorList[i].faculty_computer_code
      },
      select: {
        first_name: true,
        middle_name: true,
        last_name: true
      }
    });
    ycl[i]['facultyname'] = `${details?.first_name} ${details?.middle_name} ${details?.last_name}`;
    ycl[i]['year'] = yearCoordinatorList[i].year;
    ycl[i]['dept_id'] = yearCoordinatorList[i].dept_id;
  }

  let batchCoordinatorList = await prisma.batch_coordinate.findMany({
    where: {
      academic_session: academic_session
    },
    select: {
      batch: true,
      faculty_computer_code: true
    }
  });
  let bcl: any;
  bcl = batchCoordinatorList;
  for (let i = 0; i < batchCoordinatorList.length; i++) {
    let details = await prisma.faculty_info.findFirst({
      where: {
        computer_code: batchCoordinatorList[i].faculty_computer_code
      },
      select: {
        first_name: true,
        middle_name: true,
        last_name: true
      }
    });
    bcl[i]['facultyname'] = `${details?.first_name} ${details?.middle_name} ${details?.last_name}`;
    bcl[i]['batch'] = batchCoordinatorList[i].batch;
  }

  let studentList = await prisma.student_data.findMany({
    select: {
      semester: true,
      computer_code: true
    }
  });
  let sl: any;
  sl = studentList;
  for (let i = 0; i < studentList.length; i++) {
    let details = await prisma.temp_student_data.findFirst({
      where: {
        computer_code: studentList[i].computer_code
      }
    });
    sl[i]['studentName'] = details?.student_name;
  }

  return {
    hl,
    ycl,
    bcl,
    sl
  };
};
const getNotificationHod = async (computer_code: number, academic_session: number) => {
  let hod = await prisma.assigned_roles.findFirst({
    where: {
      faculty_computer_code: computer_code,
      hod:1
    }
  });
  if (!hod) {
    throw new ApiError(httpStatus.NOT_FOUND, 'principal not found');
  }
  let yearCoordinatorList = await prisma.year_coordinator.findMany({
    where: {
      academic_session: academic_session
    },
    select: {
      year: true,
      dept_id: true,
      faculty_computer_code: true
    }
  });
  let ycl: any;
  ycl = yearCoordinatorList;
  for (let i = 0; i < yearCoordinatorList.length; i++) {
    let details = await prisma.faculty_info.findFirst({
      where: {
        computer_code: yearCoordinatorList[i].faculty_computer_code
      },
      select: {
        first_name: true,
        middle_name: true,
        last_name: true
      }
    });
    ycl[i]['facultyname'] = `${details?.first_name} ${details?.middle_name} ${details?.last_name}`;
    ycl[i]['year'] = yearCoordinatorList[i].year;
    ycl[i]['dept_id'] = yearCoordinatorList[i].dept_id;
  }

  let batchCoordinatorList = await prisma.batch_coordinate.findMany({
    where: {
      academic_session: academic_session
    },
    select: {
      batch: true,
      faculty_computer_code: true
    }
  });
  let bcl: any;
  bcl = batchCoordinatorList;
  for (let i = 0; i < batchCoordinatorList.length; i++) {
    let details = await prisma.faculty_info.findFirst({
      where: {
        computer_code: batchCoordinatorList[i].faculty_computer_code
      },
      select: {
        first_name: true,
        middle_name: true,
        last_name: true
      }
    });
    bcl[i]['facultyname'] = `${details?.first_name} ${details?.middle_name} ${details?.last_name}`;
    bcl[i]['batch'] = batchCoordinatorList[i].batch;
  }

  let studentList = await prisma.student_data.findMany({
    select: {
      semester: true,
      computer_code: true
    }
  });
  let sl: any;
  sl = studentList;
  for (let i = 0; i < studentList.length; i++) {
    let details = await prisma.temp_student_data.findFirst({
      where: {
        computer_code: studentList[i].computer_code
      }
    });
    sl[i]['studentName'] = details?.student_name;
  }

  return {
    ycl,
    bcl,
    sl
  };
};
const getNotificationYearCoordinator = async (computer_code: number, academic_session: number) => {
  let year_coordinator = await prisma.year_coordinator.findFirst({
    where: {
      faculty_computer_code: computer_code,
    }
  });
  if (!year_coordinator) {
    throw new ApiError(httpStatus.NOT_FOUND, 'principal not found');
  }
  

  let batchCoordinatorList = await prisma.batch_coordinate.findMany({
    where: {
      academic_session: academic_session
    },
    select: {
      batch: true,
      faculty_computer_code: true
    }
  });
  let bcl: any;
  bcl = batchCoordinatorList;
  for (let i = 0; i < batchCoordinatorList.length; i++) {
    let details = await prisma.faculty_info.findFirst({
      where: {
        computer_code: batchCoordinatorList[i].faculty_computer_code
      },
      select: {
        first_name: true,
        middle_name: true,
        last_name: true
      }
    });
    bcl[i]['facultyname'] = `${details?.first_name} ${details?.middle_name} ${details?.last_name}`;
    bcl[i]['batch'] = batchCoordinatorList[i].batch;
  }

  let studentList = await prisma.student_data.findMany({
    select: {
      semester: true,
      computer_code: true
    }
  });
  let sl: any;
  sl = studentList;
  for (let i = 0; i < studentList.length; i++) {
    let details = await prisma.temp_student_data.findFirst({
      where: {
        computer_code: studentList[i].computer_code
      }
    });
    sl[i]['studentName'] = details?.student_name;
  }

  return {
    bcl,
    sl
  };
};
const getNotificationBatchCoordinator = async (computer_code: number, academic_session: number) => {
  let batch_coordinate = await prisma.batch_coordinate.findFirst({
    where: {
      faculty_computer_code: computer_code,
    }
  });
  if (!batch_coordinate) {
    throw new ApiError(httpStatus.NOT_FOUND, 'principal not found');
  }

  let studentList = await prisma.student_data.findMany({
    select: {
      semester: true,
      computer_code: true
    }
  });
  let sl: any;
  sl = studentList;
  for (let i = 0; i < studentList.length; i++) {
    let details = await prisma.temp_student_data.findFirst({
      where: {
        computer_code: studentList[i].computer_code
      }
    });
    sl[i]['studentName'] = details?.student_name;
  }

  return {
    sl
  };
};
export default {
  getNotificationPrincipal,
  getNotificationHod,
  getNotificationYearCoordinator,
  getNotificationBatchCoordinator
};
