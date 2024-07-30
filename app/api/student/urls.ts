import appConfig from "../../config";

const studentUrl = {
    login : `${appConfig.authURL}loginStudent`,
    studentCumulativeAttendance : `${appConfig.student}getCumulativeAttendance`,
    getAttendance : `${appConfig.student}getAttendance`,
    getReport : `${appConfig.student}getReport`,
    getNbaFeedback : `${appConfig.student}getNbaFeedback`,
    getFacilityFeedback : `${appConfig.student}getFacilityFeedback`,
    getFacultyFeedback : `${appConfig.student}getFacultyfeedback`,
    insertNbaFeedback : `${appConfig.student}insertNbaFeedback`,
};

export default studentUrl;