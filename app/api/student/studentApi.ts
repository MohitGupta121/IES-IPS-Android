import { api } from "../../apiConfig";
import { getToken } from "../../utils/notification";
import studentUrl from "./urls";

export type loginPayload ={
    computer_code: number,
    password: string
  }

export type cumulativeAttendance = {
    computer_code: number,
    academic_session: number
  }
export type studentAttendance = {
    computer_code: number,
    academic_session: number
  }
export type studentReport = {
  computer_code: number,
  academic_session: number,
  event_category: number
}
export type studentNbaFeedback = cumulativeAttendance; 
export type studentFacilityFeedback = cumulativeAttendance; 
export type studentFacultyFeedback = cumulativeAttendance; 
export type studentInsertNbaFeedback = {
  academic_session : number ,
  computer_code : number ,
  feedback_id : number ,
  data : {
    "co_id": number,
    "value": number
  }[]
}; 

export type InsertFacultyFeedback = {
  computer_code: number,
  feedback_id: number,
  comment: string,
  data: {
      faculty_computer_code: number,
      clg_sub_code: string,
      batch_id: number,
      a: number,
      b: number,
      c: number,
      d: number,
      e: number,
      f: number,
      g: number,
      h: number,
      i: number,
      j: number,
      k: number,
      l: number,
      m: number,
      n: number
    }[]
}

const studentApi = {
    login : {
        name : "login" , 
        fetch : (payload:loginPayload)=>getToken().then(data=>api.post(studentUrl.login , {...payload,deviceToken:data }).then(res=>res.data))
        //fetch : (payload:loginPayload)=>getToken().then(data=>api.post(studentUrl.login , payload).then(res=>res.data)) 
    },
    studentCumulativeAttendance : {
        name : "studentCumulativeAttendance",
        fetch : (payload : cumulativeAttendance)=>api.post(studentUrl.studentCumulativeAttendance , payload).then(res=>res.data)

    },
    studentAttendance : {
      name : "studentAttendance",
      fetch : ( payload : studentAttendance )=>api.post(studentUrl.getAttendance, payload).then(res=>res.data)
    },
    studentReport : {
      name : "studentReport",
      fetch : ( payload : studentReport )=>api.post(studentUrl.getReport, payload).then(res=>res.data)
    },
    studentNbaFeedback : {
      name : "studentNbaFeedback",
      fetch : ( payload : studentNbaFeedback  )=>api.post(studentUrl.getNbaFeedback, payload).then(res=>res.data)
    },
    studentInsertNbaFeedback : {
      name : "studentInsertNbaFeedback",
      fetch : ( payload : studentInsertNbaFeedback  )=>api.post(studentUrl.insertNbaFeedback, payload).then(res=>res.data)
    },
    studentFacilityFeedback : {
      name : "studentFacilityFeedback",
      fetch : ( payload : studentFacilityFeedback  )=>api.post(studentUrl.getFacilityFeedback, payload).then(res=>res.data)
    },
    studentFacultyfeedback : {
      name : "studentFacultyFeedback",
      fetch : ( payload : studentFacultyFeedback  )=>api.post(studentUrl.getFacultyFeedback, payload).then(res=>res.data)
    },
    InsertFacultyFeedback : {
      name : "InsertFacultyFeedback",
      fetch : ( payload : InsertFacultyFeedback  )=>api.post(studentUrl.InsertFacultyFeedback, payload).then(res=>res.data)
    },
};

export default studentApi;