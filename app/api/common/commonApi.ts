import { api } from "../../apiConfig";
import commonUrl from "./urls";

type getNameByComputerCode={
    computer_code: number,
    user_type:string
}

const commonApi = {
    academicSession : {
        name : "academicSession",
        fetch : ()=>api.get(commonUrl.academicSession).then(res=>res.data)

    },
    getTimeSlot : {
        name : "getTimeSlot",
        fetch : ()=>api.get(commonUrl.getTimeSlot).then(res=>res.data)

    },
    getLectureType : {
        name : "getLectureTypes",
        fetch : ()=>api.get(commonUrl.getLectureType).then(res=>res.data)

    },
    getDepartments : {
        name : "getDepartmentss",
        fetch : ()=>api.get(commonUrl.getDepartments).then(res=>res.data)

    },
    getFacultyByDepartment : {
        name : "getFacultyByDepartments",
        fetch : (department_id)=>api.get(`${commonUrl.getFacultyByDepartment}?department_id=${department_id}`).then(res=>res.data)
    },
    getNameByComputerCode : {
        name : "getNameByComputerCodes",
        fetch : (payload:getNameByComputerCode)=>api.post(commonUrl.getNameByComputerCode , payload).then(res=>res.data)
    },
};

export default commonApi;