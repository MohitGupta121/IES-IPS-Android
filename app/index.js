/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App, { storage } from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
messaging().setBackgroundMessageHandler(async remoteMessage => {

    if ( storage.contains("notifications")){
      let previous = JSON.parse(storage.getString("notifications"));
      storage.set("notifications" , JSON.stringify([...previous, {...remoteMessage.notification , seen:false}]))
    }else{
      storage.set("notifications" , JSON.stringify([{...remoteMessage.notification , seen:false}]))
    }

    console.log('Message handled in the background!', storage.getString("notifications"));
  });
AppRegistry.registerComponent( appName, () => App);
