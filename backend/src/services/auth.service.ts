import { temp_student_data } from '@prisma/client';
import httpStatus from 'http-status';
import md5 from 'md5';
import prisma from '../client';
import ApiError from '../utils/ApiError';

interface userResponse {
  name: string | null;
  dob: string | null;
  gender: string | null;
  homedept: number | null;
  studydept: number | null;
  student_mobile: string | null;
  computer_code: number | null;
  uid: string;
  enrollment: string | null;
  // student_mobile: bigint | null;
  email: string | null;
  // student_date_of_birth:string | null;
  // father_name:string | null;
  // mother_name:string | null;
  address: string | null;
  // studentSession : bigint | null;
  // academicSession : string | null;

  // pincode:string | null;
  // district:string | null;
  // state:string | null ;
}
const getShorthandDepartment = (fullName: string): string => {
  const hasBrackets = fullName.includes('(');

  if (hasBrackets) {
    const contentInBrackets = fullName.match(/\((.*?)\)/)?.[1];
    if (contentInBrackets) {
      const contentWithoutSpacesAndAmpersand = contentInBrackets
        .replace(/[\s&]+/g, '')
        .toUpperCase();
      return contentWithoutSpacesAndAmpersand;
    }
  }

  // If no brackets or no content inside brackets, use initials
  const words = fullName
    .replace(/\bAND\b/gi, '')
    .replace(/&/g, '')
    .toUpperCase()
    .split(' ');
  const initials = words.map((word) => word[0]);
  return initials.join('');
};
const convertToCamelCase = (name: string): string => {
  const words = name.toLowerCase().split(' ');

  const camelCaseWords = words.map((word) => {
    if (word.length === 0) {
      return word; // Skip empty words
    }
    return word[0].toUpperCase() + word.slice(1);
  });

  return camelCaseWords.join(' ');
};
/**
 * Login with username and password
 * @param {number} computer_code
 * @param {string} password
 * @returns {Promise<temp_student_data>}
 * @param {string} fullName - Full department name
 * @returns {string} Shorthand version of the department name
 */

const loginStudent = async (
  computer_code: number,
  password: string,
  deviceToken: string
): Promise<userResponse> => {
  if (!deviceToken) {
    throw new ApiError(httpStatus.NOT_FOUND, 'fcm token not found');
  }
  const deleteToken = await prisma.notification_device_token.deleteMany({
    where: {
      computer_code: computer_code
    }
  });
  const insertToken = await prisma.notification_device_token.create({
    data: {
      computer_code: computer_code,
      device_token: deviceToken
    }
  });
  const cred = await prisma.login.findMany({
    where: {
      password: md5(password),
      computer_code
    }
  });
  if (!cred) {
    throw new ApiError(httpStatus.NOT_FOUND, 'invalid credential');
  }
  if (!insertToken) {
    throw new ApiError(httpStatus.NOT_FOUND, 'fcm token insert error');
  }

  const user = await prisma.temp_student_data.findFirst({
    where: {
      computer_code: computer_code
    }
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  const depart = user.study_dept ? user.study_dept : 0;
  const dept = await prisma.department.findUnique({
    where: {
      id: depart
    }
  });

  const session_student = user.student_session ? user.student_session : 0;
  const session = await prisma.student_session.findFirst({
    where: {
      student_session_id: session_student
    }
  });
  const academic_session_student = user.academic_session ? user.academic_session : '';
  const academic_session = prisma.academic_session.findFirst({
    where: {
      academic_session: academic_session_student
    }
  });
  console.log(academic_session_student);
  const shorthandDepartment = dept ? getShorthandDepartment(dept.name) : '';
  const addressFull = [
    user.add_permanent,
    user.district_permanent,
    user.state_permanent,
    user.pincode_permanent
  ]
    .filter(Boolean)
    .join(', ');
  let uid = BigInt(user.uid);
  const img = await prisma.counselling_documents_name.findFirst({
    where: {
      uid: Number(uid),
      document_name: {
        contains: '-'
      }
    }
  });
  const data = {
    //@ts-ignore
    name: convertToCamelCase(user.student_name),
    dob: user.student_date_of_birth,
    gender: user.student_gender,
    homedept: user.home_dept,
    studydept: user.study_dept,
    //@ts-ignore
    student_mobile: user.student_mobile.toString(),
    computer_code: user.computer_code,
    uid: uid.toString(),
    enrollment: user.enrollment_number,
    department: shorthandDepartment,
    //@ts-ignore
    father_name: convertToCamelCase(user.father_name),
    //@ts-ignore
    mother_name: convertToCamelCase(user.mother_name),
    email: user.student_email,
    address: convertToCamelCase(addressFull),
    student_session: session,
    academic_session: academic_session_student,
    //@ts-ignore
    fatherMobile: user.father_mobile.toString(),
    //@ts-ignore
    motherMobile: user.mother_mobile.toString(),
    motherEmail: user.mother_email,
    fatherEmail: user.father_email,
    photograph: process.env.UPLOAD+'Student_Photograph/'+img?.document_name,
    // pincode:user.pincode_permanent,
    // district:user.district_permanent,
    // state:user.state_permanent,
  };
  return data;
};

interface facultyresponse {
  id: number;
  temp_hod: boolean;
  department: number;
  computer_code: number | null;
  title: string | null;
  // first_name: string | null;
  // middle_name: string | null;
  // last_name: string | null;
  date_of_birth: Date;
  gender: string | null;
  mobile: string | null;
  email: string | null;
  facultyType: string | null;
  designation : string  | null;
  father_name : string | null;
  mother_name : string | null;
  edu_qualification : string | null ;
  blood_group : string | null ;
  // date_join : Date ;
}

const loginFaculty = async (
  computer_code: number,
  password: string,
  deviceToken: string
): Promise<facultyresponse> => {
  const cred = await prisma.login.findFirst({
    where: {
      password: md5(password),
      computer_code
    }
  });
  if (!cred) {
    throw new ApiError(httpStatus.NOT_FOUND, 'invalid credential');
  }
  if (!deviceToken) {
    throw new ApiError(httpStatus.NOT_FOUND, 'fcm token not found');
  }
  const deleteToken = await prisma.notification_device_token.deleteMany({
    where: {
      computer_code: computer_code
    }
  });
  const insertToken = await prisma.notification_device_token.create({
    data: {
      computer_code: computer_code,
      device_token: deviceToken
    }
  });
  const user = await prisma.faculty_info.findFirst({
    select: {
      id: true,
      temp_hod: true,
      department: true,
      mobile1: true,
      computer_code: true,
      title: true,
      first_name: true,
      middle_name: true,
      last_name: true,
      date_of_birth: true,
      gender: true,
      email: true,
      faculty_type: true,
      address_line1: true,
      address_line2: true,
      district: true,
      pincode: true,
      city: true,
      state: true,
      designation: true,
      father_name : true,
      mother_name : true,
      edu_qualification : true,
      blood_group : true,
      // date_join : true ,
    },
    where: {
      computer_code: computer_code
    }
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  const fullNameParts = [user.first_name, user.middle_name, user.last_name]
    .filter(Boolean)
    .join(' ');
  const depart = user.department ? user.department : 0;
  const dept = await prisma.department.findUnique({
    where: {
      id: depart
    }
  });
  const shorthandDepartment = dept ? getShorthandDepartment(dept.name) : '';
  const addressFull = [user.address_line1, user.address_line2, user.city, user.state, user.pincode]
    .filter(Boolean)
    .join(', ');
  let mobile = BigInt(user.mobile1);
  const data = {
    name: convertToCamelCase(fullNameParts),
    id: user.id,
    temp_hod: user.temp_hod,
    department: user.department,
    computer_code: user.computer_code,
    title: user.title,
    date_of_birth: user.date_of_birth,
    gender: user.gender,
    mobile: mobile.toString(),
    email: user.email,
    facultyType: user.faculty_type,
    departmentFaculty: shorthandDepartment,
    address: convertToCamelCase(addressFull),
    designation: user.designation,
    // first_name: user.first_name,
    // middle_name: user.middle_name,
    // last_name: user.last_name,
    father_name : user.father_name,
    mother_name : user.mother_name,
    edu_qualification : user.edu_qualification,
    blood_group : user.blood_group,
    // // date_join : user.date_join ,
  };
  return data;
};
export default {
  loginStudent,
  loginFaculty
};
