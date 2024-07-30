import { ParamListBase, RouteConfig, StackNavigationState } from "@react-navigation/native";
import { NativeStackNavigationEventMap, NativeStackNavigationOptions } from "@react-navigation/native-stack";
import LoginPage from "../screens/common/login/loginPage";
import Attendance from "../screens/student/attendance/attendance";
import Result from "../screens/student/result/result";
import Feedback from "../screens/student/feedback/feedback";
import SubjectAttendance from "../screens/student/attendance/subjectAttendance/subjectAttendance";
import ViewReport from "../screens/student/result/viewReport/viewReport";
import NbaFeedbackStatus from "../screens/student/feedback/NbaFeedbackStatus";
import FacilityFeedbackStatus from "../screens/student/feedback/FacilityFeedbackStatus";
import FacultyFeedbackStatus from "../screens/student/feedback/FacultyFeedback";
import FillNbaFeedback from "../screens/student/feedback/FillNbaFeedback";

const studentScreenProps:(RouteConfig<ParamListBase, string, StackNavigationState<ParamListBase>, NativeStackNavigationOptions, NativeStackNavigationEventMap,any>)[] = [
    {
        name : "Attendance",
        component : Attendance,
        options : {
            headerShown : true
        }
    },
    {
        name : "SubjectAttendance",
        component : SubjectAttendance,
        options : {
            headerShown : true,
        }
    },
    {
        name : "Result",
        component : Result,
        options : {
            headerShown : true,
        }
    },
    {
        name : "ViewReport",
        component : ViewReport,
        options : {
            headerShown : true,
            title : "View Report",
        }
    },
    {
        name : "Feedback",
        component : Feedback,
        options : {
            headerShown : true,
        }
    },
    {
        name : "NbaFeedbackStatus",
        component : NbaFeedbackStatus,
        options : {
            headerShown : true,
            title : "NBA Feedback",
        }
    },
    {
        name : "FillNbaFeedback",
        component : FillNbaFeedback,
        options : {
            headerShown : true,
            title : "Feedback From",
        }
    },
    {
        name : "FacilityFeedbackStatus",
        component : FacilityFeedbackStatus,
        options : {
            headerShown : true,
            title : "Facility Feedback",
        }
    },
    {
        name : "FacultyFeedbackStatus",
        component : FacultyFeedbackStatus,
        options : {
            headerShown : true,
            title : "Faculty Feedback",
        }
    },
]

export default studentScreenProps;

const studentRouteNames  = studentScreenProps.map(item=>item.name)

export type studentRoutes = Partial<{
    [key in typeof studentRouteNames[number] ]: undefined
}>