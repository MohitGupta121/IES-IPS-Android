import appConfig from "../../config";

const studentUrl = {
    login : `${appConfig.authURL}loginStudent`,
    studentCumulativeAttendance : `${appConfig.student}getCumulativeAttendance`,
    getAttendance : `${appConfig.student}getAttendance`,
    getReport : `${appConfig.student}getReport`,
    getNbaFeedback : `${appConfig.student}getNbaFeedback`,
    insertNbaFeedback : `${appConfig.student}insertNbaFeedback`,
    getFacilityFeedback : `${appConfig.student}getFacilityFeedback`,
    getFacultyFeedback : `${appConfig.student}getFacultyfeedback`,
    InsertFacultyFeedback : `${appConfig.student}InsertFacultyFeedback`,
};

export default studentUrl;