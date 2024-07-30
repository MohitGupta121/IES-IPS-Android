import { ParamListBase, RouteConfig, StackNavigationState } from "@react-navigation/native";
import { NativeStackNavigationEventMap, NativeStackNavigationOptions } from "@react-navigation/native-stack";
import AttendancePanel from "../screens/staff/attendancePanel/attendancePanel";
import TakeAttendance from "../screens/staff/attendancePanel/takeAttendance";
import ViewAttendance from "../screens/staff/attendancePanel/viewAttendance";
import ModifyAttendance from "../screens/staff/attendancePanel/modifyAttendance";
import LecturePlan from "../screens/staff/attendancePanel/lecturePlan";


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
]

export default staffScreenProps;

const staffRouteNames  = staffScreenProps.map(item=>item.name)

export type staffRoutes = Partial<{
    [key in typeof staffRouteNames[number] ]: undefined | any
}>