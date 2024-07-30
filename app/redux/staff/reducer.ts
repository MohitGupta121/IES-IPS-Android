import { staffActionType } from './types';
import Attendance from '../../screens/student/attendance/attendance';

type reducerData = {
    Batches : {
    batch_co_id: number,
    batch: number,
    subject: {
      batch_id: number,
      subject_name: string,
      batch: string,
      type: "T"|"P",
      clg_sub_code: string,
      university_sub_code: string,
      max_student: number,
      academic_session_id: number,
      department: number,
      specialization: number,
      course: string,
      semester: number,
      ip: string,
      remark: string|null,
      time_stamp: string,
      user_stamp: number,
      flag: number
    }
    }[],
    StudentsForAttendance : {
        id: number,
        computer_code: number,
        enrollment_no: string,
        student_name: string,
        student_session: number,
        academic_session: number,
        batch_id: number,
        batch_name: string,
        semester: number,
        lab_group_name: string,
        course: string,
        home_dept: number,
        specialization: number,
        show_attendance: boolean,
        user_stamp: number,
        time_stamp: string,
        ip: string,
        remark: string
      }[],
      AttendanceTopics: {
        topic_name: string,
        subject_code: string,
        topic_id: number
      }[],

      AllStudentChecked : null | boolean,
      AllStudentCheckedModify : null | boolean,
      ModifyAttendance : {
        attend_info: string ,
        batch_id: number,
        faculty_computer_code: number,
        date: string ,
        lecture_type: number,
        time_slot_id: number,
        topic: number,
        lab_group: string ,
        academic_session: number,
        ip: string | null,
        time_stamp: string ,
        remark: string , 
      }[],
}

const initialState:reducerData = {
    Batches : [],
    StudentsForAttendance : [],
    AttendanceTopics : [],
    AllStudentChecked : null,
    AllStudentCheckedModify : null,
    ModifyAttendance : [],
    LeaveBalance: {},
};

export default function staffReducer(state:reducerData = initialState , action: {type : keyof typeof staffActionType , payload : any}):reducerData{
    switch (action.type){
        case staffActionType.Batches :
            return {
                ...state , Batches : [...action.payload]
            }
        case staffActionType.StudentsForAttendance :
            return {
                ...state , StudentsForAttendance : [...action.payload]
            }
        case staffActionType.AttendanceTopics :
            return {
                ...state , AttendanceTopics : [...action.payload]
            }
        case staffActionType.AllStudentChecked :
            return {
                ...state , AllStudentChecked : action.payload
            }
        case staffActionType.AllStudentCheckedModify :
            return {
                ...state , AllStudentCheckedModify : action.payload
            }
        case staffActionType.ModifyAttendance :
            return {
                ...state , ModifyAttendance : action.payload
            }
        default :
            return state;
    }
}