import appConfig from "../../config";

const staffUrl = {
    login : `${appConfig.authURL}loginfaculty`,
    getBatches : `${appConfig.baseURL}batch/getBatch`,
    getStudentForAttendance : `${appConfig.attendance}getStudentForAttendance`,
    getTopicForAttendance : `${appConfig.attendance}getTopicForAttendance`,
    markAttendance : `${appConfig.attendance}markAttendance`,
    getViewAttendance : `${appConfig.attendance}getViewAttendance`,
    getAttendanceToModify : `${appConfig.attendance}getAttendanceToModify`,
    deleteAttendance : `${appConfig.attendance}deleteAttendance`,
    getStudentByAttendInfoToModify : `${appConfig.attendance}getStudentByAttendInfoToModify`,
    markAttendanceToModify : `${appConfig.attendance}markAttendanceToModify`,
    
};

export default staffUrl;