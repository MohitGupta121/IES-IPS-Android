import messaging from '@react-native-firebase/messaging';
import { commonActionTypes } from '../redux/common/types';
import store from '../redux/store'
import { storage } from '../App';
export const notificationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    // if (storage.contains('notifications')) {
    //   const previous=storage.getString('notifications')
    //   const data=[
    //     ...JSON.parse(previous),
    //     remoteMessage.notification
    //   ]
    //   storage.set("notifications" , JSON.stringify(data));
    // }else{
    //   storage.set("notifications" , JSON.stringify([remoteMessage.notification]));
    // }
    // console.log(storage.getString('notifications'))
    // store.dispatch({type:commonActionTypes.GetNotification , payload :storage.getString('notifications')})
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      // if (remoteMessage) {
      //   console.log(
      //     'Notification caused app to open from quit state:',
      //     remoteMessage.notification,
      //   );
      //   if (storage.contains('notifications')) {
      //     const previous=storage.getString('notifications')
      //     const data=[
      //       ...JSON.parse(previous),
      //       remoteMessage.notification
      //     ]
      //     storage.set("notifications" , JSON.stringify(data));
      //   }else{
      //     storage.set("notifications" , JSON.stringify([remoteMessage.notification]));
      //   }
      //   store.dispatch({type:commonActionTypes.GetNotification , payload :storage.getString('notifications')})
      // }
    });
};
export const getToken = async () => {
  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  return token
};

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}