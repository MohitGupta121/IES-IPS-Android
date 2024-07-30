import { ParamListBase, RouteConfig, StackNavigationState } from "@react-navigation/native";
import { NativeStackNavigationEventMap, NativeStackNavigationOptions } from "@react-navigation/native-stack";
import AttendancePanel from "../screens/staff/attendancePanel/attendancePanel";
import TakeAttendance from "../screens/staff/attendancePanel/takeAttendance";
import ViewAttendance from "../screens/staff/attendancePanel/viewAttendance";
import ModifyAttendance from "../screens/staff/attendancePanel/modifyAttendance";
import LecturePlan from "../screens/staff/attendancePanel/lecturePlan";
import LeaveApplication from "../screens/staff/leaveApplication/leaveApplication";
import LeaveApply from "../screens/staff/leaveApplication/leaveApply";
import LeaveChart from "../screens/staff/leaveApplication/leaveChart";
import LeaveReport from "../screens/staff/leaveApplication/leaveReport";
import NotifyBatches from "../screens/staff/notifyBatches/notifyBatches";
import ViewFacultyAssigned from "../screens/staff/leaveApplication/ViewFacultyAssigned";


const staffScreenProps:(RouteConfig<ParamListBase, string, StackNavigationState<ParamListBase>, NativeStackNavigationOptions, NativeStackNavigationEventMap,any>)[] = [
    {
        name : "Attendance Panel",
        component : AttendancePanel,
        options : {
            headerShown : true,
        }
    },
    {
        name : "Take Attendance",
        component : TakeAttendance,
        options : {
            headerShown : true
        }
    },
    {
        name : "View Attendance",
        component : ViewAttendance,
        options : {
            headerShown : true
        }
    },
    {
        name : "Modify Attendance",
        component : ModifyAttendance,
        options : {
            headerShown : true
        }
    },
    {
        name : "Lecture Plan",
        component : LecturePlan,
        options : {
            headerShown : true
        }
    },
    {
        name : "Leave Application",
        component : LeaveApplication,
        options : {
            headerShown : true
        }
    },
    {
        name : "Leave Apply",
        component : LeaveApply,
        options : {
            headerShown : true
        }
    },
    {
        name : "Leave Chart",
        component : LeaveChart,
        options : {
            headerShown : true
        }
    },
    {
        name : "View Faculty Assigned",
        component : ViewFacultyAssigned,
        options : {
            headerShown : true,
            title:"Faculty Assigned"
        }
    },
    {
        name : "Leave Report",
        component : LeaveReport,
        options : {
            headerShown : true
        }
    },
    {
        name : "Notify Batches",
        component : NotifyBatches,
        options : {
            headerShown : true
        }
    },
]

export default staffScreenProps;

const staffRouteNames  = staffScreenProps.map(item=>item.name)

export type staffRoutes = Partial<{
    [key in typeof staffRouteNames[number] ]: undefined | any
}>