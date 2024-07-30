import { commonActionTypes } from "./types";
import { userType } from "../../constants";
import { Url } from "url";


export interface reducerData  {
  User: {
    user:
      | {
          computer_code: number;
          academic_session?: string;
          address?: string;
          department?: string;
          departmentFaculty?: string;
          dob?: string;
          email?: string;
          enrollment?: string;
          father_name?: string;
          mother_name?: string;
          gender?: string;
          homedept?: number;
          name?: string;
          photograph?: Url;
          student_mobile: string;
          student_session: {
            name: string;
            student_session_id: number;
          };
          studydept: 21;
          type: string;

          // [key:string] : any
        }
      | Record<string, never>;
    [key: string]: any;
  };
  Notification: Array<Object>;
  AcademicSession: {
    sessions: {
      academic_session: string;
      academic_session_id: number;
      active: boolean;
    }[];
    current: {
      academic_session: string;
      academic_session_id: number;
      active: boolean;
    }| Record<string,never>;
  };
  TimeSlots: {
    id: number;
    start_time: string;
    end_time: string;
  }[];
  LectureTypes :  {
    lecture_id: number,
    lecture_type: string,
    weight: number
  }[],
  Departments : {
    id: number,
    dept_code: string,
    name:  string
  }[],
};

const initialState:reducerData = {
    User : { user : {}},
    Notification:[],
    AcademicSession:{
        sessions : [],
        current : {},
    },
    TimeSlots : [],
    LectureTypes : [],
    Departments : [],
};

export default function commonReducer(state:reducerData = initialState , action: any):reducerData{
    switch (action.type){
        case commonActionTypes.UserLoginDetails : 
            return {
                ...state , User : action.payload
            }

        case commonActionTypes.ClearUserLoginDetails:
            return initialState
        

        case commonActionTypes.ClearNotification:
            return {
                ...state , Notification : []
            }
        
        case commonActionTypes.GetNotification:
            return {
                ...state , Notification : [action.payload,...state.Notification]
            }
        
        case commonActionTypes.AcademicSession:
            return {
                ...state , AcademicSession : { sessions : action.payload.sessions , current : action.payload.current} 
            }
        case commonActionTypes.TimeSlots:
            return {
                ...state , TimeSlots : [...action.payload] 
            }
        case commonActionTypes.LectureTypes:
            return {
                ...state , LectureTypes : [...action.payload] 
            }
        case commonActionTypes.Departments:
            return {
                ...state , Departments : [...action.payload] 
            }
        
        default :
            return state;
    }
}