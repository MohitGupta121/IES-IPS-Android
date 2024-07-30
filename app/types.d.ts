import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";

export interface NotificationType {
    title : any,
    description : any,
    message : any,
    timestamp:string,
    sender : any,
    seen:boolean,
}
