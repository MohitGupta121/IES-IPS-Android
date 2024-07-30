import { api } from "../../apiConfig";
import { getToken } from "../../utils/notification";
import staffUrl from "./urls";

export type loginPayload ={
    computer_code: number,
    password: string
  }
export type getBatchesPayload ={
    computer_code: number,
    session_id: number
  }
export type getStudentForAttendancePayload ={
    batch_id: number
  }
export type getTopicForAttendance ={
    batch_id: number
  }
  export type markAttendance = {
    topic_id  : number | null ,
    time_slot : number[],
    lecture_type : number|null,
    group : string|null,
    topic_name : string|null,
  date : string | null ,
  students: {
    computer_code : number,
    attend : boolean,
  }[],
  faculty_computer_code : number | null,
  academic_session : number | null,
  batch_id : number | null,
  remark : string,
  
}
export type getViewAttendance = {
  batch_id : number,
  academic_session : number,
  from_date : string,
  to_date : string,
}
export type getAttendanceToModify = {
  batch_id : number,
}
export type deleteAttendance = {
  attend_info : string,
}
export type getStudentByAttendInfoToModify = {
  attend_info : string,
}
// export type getLeaveBalance = {
//   cl : number,
//   dl : number,
//   el : number,
//   ol : number,
//   lwp : number,
//   sl : number,
//   ab : number,
//   ml : number,
//   sdl : number,
//   vl : number,
//   od : number,
// }
export type getLeaveBalance ={
  computer_code: number,
  academic_session: number
}

export type markAttendanceToModify = {
  attendance: {
    attend_record_id: string;
    student_computer_code: number;
    attend_info: string;
    attend: boolean;
    name: string;
    enrollment: string;
  }[];
};

export type getLeaveChart = {
  computer_code: number;
}

type LeaveType = 'cl' | 'el' | 'dl' | 'ol' | 'hdcl' | 'lwp' | 'sdl';

interface AssignedClass {
  assigned_class_dept: string;
  assigned_section: string;
  lecture_type: string;
  start_time: string;
  end_time: string;
}

interface LectureAssigned {
  faculty_computer_code: number;
  faculty_date: string;
  assigned_class: AssignedClass[];
}

interface Responsibility {
  faculty_computer_code: number;
  faculty_date: string;
  responsibility: string;
}

export interface leaveApply {
  computer_code: number;
  start_date: string;  // Date format
  end_date: string;    // Date format
  days: number;
  leave_type: LeaveType;
  reason: string;
  lectures_assigned: LectureAssigned[];
  other_responsibility: Responsibility[];
  academic_session: number;
}

export interface getFacultyAssingment {
  computer_code : number
}

export interface sendNotification {
  title: string,
  description: string,
  message: string,
  sender_computer_code: number,
  send_to: number[]
}
export interface acceptFacultyAssignment {
  assign_faculty_id : string,
}
export interface rejectFacultyAssignment {
  assign_faculty_id : string,
}
export interface getAssignedFacultiesByApplyId {
  apply_id : string
}





const staffApi = {
    login : {
        name : "login" , 
        fetch : (payload:loginPayload)=>getToken().then(data=>api.post(staffUrl.login , {...payload,deviceToken:data }).then(res=>res.data)) 
    },
    getBatches : {
        name : "getBatches",
        fetch : (payload : getBatchesPayload)=>api.post(staffUrl.getBatches , payload).then(res=>res.data)
    },
    getStudentForAttendance : {
        name : "getStudentForAttendance",
        fetch : (payload : getStudentForAttendancePayload)=>api.post(staffUrl.getStudentForAttendance , payload).then(res=>res.data)
    },
    getTopicForAttendance : {
        name : "getTopicForAttendance",
        fetch : (payload : getTopicForAttendance)=>api.post(staffUrl.getTopicForAttendance , payload).then(res=>res.data)
    },
    markAttendance : {
        name : "markAttendance",
        fetch : (payload : markAttendance)=>api.post(staffUrl.markAttendance , payload).then(res=>res.data)
    },
    getViewAttendance : {
        name : "getViewAttendance",
        fetch : (payload : getViewAttendance)=>api.post(staffUrl.getViewAttendance , payload).then(res=>res.data)
    },
    getAttendanceToModify : {
        name : "getAttendanceToModify",
        fetch : (payload : getAttendanceToModify)=>api.post(staffUrl.getAttendanceToModify , payload).then(res=>res.data)
    },
    deleteAttendance : {
        name : "deleteAttendance",
        fetch : (payload : deleteAttendance)=>api.delete(staffUrl.deleteAttendance , {data : payload}).then(res=>res.data)
    },
    getStudentByAttendInfoToModify : {
        name : "getStudentByAttendInfoToModify",
        fetch : (payload : getStudentByAttendInfoToModify)=>api.post(staffUrl.getStudentByAttendInfoToModify , payload).then(res=>res.data)
    },
    markAttendanceToModify : {
        name : "markAttendanceToModify",
        fetch : (payload : markAttendanceToModify)=>api.post(staffUrl.markAttendanceToModify , payload).then(res=>res.data)
    },
    getLeaveBalance : {
        name : "getLeaveBalance",
        fetch : (payload : getLeaveBalance)=>api.post(staffUrl.getLeaveBalance,payload).then(res=>res.data)
    },
    leaveApply : {
        name : "leaveApply",
        fetch : (payload : leaveApply)=>api.post(staffUrl.leaveApply,payload).then(res=>res.data)
    },
    getFacultyAssingment : {
        name : "getFacultyAssingment",
        fetch : (payload : getFacultyAssingment)=>api.post(staffUrl.getFacultyAssingment,payload).then(res=>res.data)
    },
    sendNotification : {
        name : "sendNotification",
        fetch : (payload : sendNotification)=>api.post(staffUrl.sendNotification,payload).then(res=>res.data)
    },
    acceptFacultyAssignment : {
        name : "acceptFacultyAssignment",
        fetch : (payload : acceptFacultyAssignment)=>api.post(staffUrl.acceptFacultyAssignment,payload).then(res=>res.data)
    },
    rejectFacultyAssignment : {
        name : "rejectFacultyAssignment",
        fetch : (payload : rejectFacultyAssignment)=>api.post(staffUrl.rejectFacultyAssignment,payload).then(res=>res.data)
    },
    getLeaveChart : {
        name : "getLeaveChart",
        fetch : (payload : getLeaveChart)=>api.post(staffUrl.getLeaveChart,payload).then(res=>res.data)
    },
    getAssignedFacultiesByApplyId : {
        name : "getAssignedFacultiesByApplyId",
        fetch : (payload : getAssignedFacultiesByApplyId)=>api.post(staffUrl.getAssignedFacultiesByApplyId,payload).then(res=>res.data)
    },
};

export default staffApi;