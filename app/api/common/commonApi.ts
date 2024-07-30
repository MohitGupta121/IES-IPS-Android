import { type } from "os";
import { api } from "../../apiConfig";
import commonUrl from "./urls";


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
};

export default commonApi;