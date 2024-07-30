import { ParamListBase, RouteConfig, StackNavigationState } from "@react-navigation/native";
import { NativeStackNavigationEventMap, NativeStackNavigationOptions } from "@react-navigation/native-stack";
import LoginPage from "../screens/common/login/loginPage";
import Dashboard from "../screens/common/dashborad/dashboard";
import { storage } from "../App";
import Notification from "../screens/common/notification/notification";
import About from "../screens/common/About/about";
import ContactUs from "../screens/common/contactUs/contactUs";
import MyProfile from "../screens/common/MyProfile/myProfile";

const commonScreenProps: RouteConfig<
  ParamListBase,
  string,
  StackNavigationState<ParamListBase>,
  NativeStackNavigationOptions,
  NativeStackNavigationEventMap,
  any
>[] = [
  {
    name: 'Dashboard',
    component: Dashboard,
    options: {
      animation: 'fade_from_bottom',
    },
  },
  {
    name: 'Login',
    component: LoginPage,
    options: {
      animation: 'fade',
      // headerShown:true,
    },
  },
  {
    name: 'Notification',
    component: Notification,
    options: {
      animation: 'slide_from_left',
      headerShown: true,
    },
  },
  {
    name: 'MyProfile',
    component: MyProfile,
    options: {
      animation: 'slide_from_left',
      headerShown: true,
    },
  },
  {
    name: 'About',
    component: About,
    options: {
      animation: 'slide_from_left',
      headerShown: true,
    },
  },
  {
    name: 'Contact',
    component: ContactUs,
    options: {
      animation: 'slide_from_left',
      headerShown: true,
    },
  },
];

export default commonScreenProps;

const commonRouteNames  = commonScreenProps.map(item=>item.name)

export type commonRoutes = Partial<{
    [key in typeof commonRouteNames[number] ]: undefined
}>