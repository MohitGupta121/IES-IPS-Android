/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App, { storage } from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import { timeStamp } from 'console';
messaging().setBackgroundMessageHandler(async remoteMessage => {

    let notification = {
      title : remoteMessage.notification.title,
      description : remoteMessage.notification.body,
      message : remoteMessage.data.message,
      sender : remoteMessage.data.sender,
      timestamp : remoteMessage.data.timestamp,
      seen:false,
    }

    let previous = storage.getMap("Notification");
    if ( previous){
      storage.setArray("Notification" , [notification , ...previous])
    }else{
      storage.setArray("Notification" , [notification])
    }

    console.log('Message handled in the background!', remoteMessage.notification.title);
  });
AppRegistry.registerComponent( appName, () => App);
