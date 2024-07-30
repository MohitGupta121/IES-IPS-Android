import appConfig from "../../config";

const commonUrl = {
    academicSession : `${appConfig.common}academicSession`,
    getTimeSlot : `${appConfig.common}getTimeSlot`,
    getLectureType : `${appConfig.common}getLectureType`,
    getDepartments : `${appConfig.common}getDepartments`,
    getFacultyByDepartment : `${appConfig.common}getFacultyByDepartment`,
    getNameByComputerCode : `${appConfig.common}getNameByComputerCode`,
};

export default commonUrl;