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
};

export default staffApi;