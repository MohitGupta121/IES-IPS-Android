import { studentActionTypes } from "./types";


type reducerData = {
    CummulativeAttendance : any,
    Attendance: any,
    Report: any,
    NbaFeedback : any,
    FacilityFeedback : any,
    FacultyFeedback : {
        teacherCriteria : string[],
        response : any,
    }|Record<string,never>,
}

const initialState:reducerData = {
    CummulativeAttendance : {},
    Attendance:[],
    Report:[],
    NbaFeedback :[],
    FacilityFeedback:[],
    FacultyFeedback:{},
};

export default function studentReducer(state:reducerData = initialState , action: any):reducerData{
    switch (action.type){
        case studentActionTypes.CommulativeAttendance:
            return {
                ...state , CummulativeAttendance : { ...action.payload}
            }

        case studentActionTypes.Attendance:
            return {
                ...state , Attendance : [...action.payload]
            }
        case studentActionTypes.Report :
            return {
                ...state , Report : [...action.payload]
            }
        case studentActionTypes.NbaFeedback : 
            return {
                ...state , NbaFeedback : [...action.payload]
            }
        case studentActionTypes.FacilityFeedback : 
            return {
                ...state , FacilityFeedback : [...action.payload]
            }
        case studentActionTypes.FacultyFeedback : 
            return {
                ...state , FacultyFeedback : {...action.payload}
            }

        default :
            return state;
    }
}