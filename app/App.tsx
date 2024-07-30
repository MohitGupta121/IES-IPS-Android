/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {PortalProvider} from '@gorhom/portal'
import type {PropsWithChildren} from 'react';
import {
  Alert,
  Dimensions,
  LogBox,
  PermissionsAndroid,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StatusBarStyle,
  StyleSheet,
  Touchable,
  useColorScheme,
  View,
} from 'react-native';

import { useNetInfo } from "@react-native-community/netinfo"
import customTheme, { fontConfig } from './theme';
import {NavigationContainer, createNavigationContainerRef, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginPage from './screens/common/login/loginPage';
import {createAppContainer} from 'react-navigation';
import LottieView from 'lottie-react-native';
import {PaperProvider, Snackbar, TouchableRipple, configureFonts} from 'react-native-paper';
import {MD3DarkTheme, Text ,  MD3LightTheme} from 'react-native-paper';
import {useMaterial3Theme} from '@pchmn/expo-material3-theme';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider, useDispatch} from 'react-redux';
import store from './redux/store';
import Routes, { RootStackParamList } from './routes/routes';
import Icon from 'react-native-vector-icons/Feather';
import {QueryClient, QueryClientProvider} from 'react-query';
import {MMKV} from 'react-native-mmkv';
import { dispatchCommand } from 'react-native-reanimated';
import messaging from '@react-native-firebase/messaging';
import { getToken, notificationListener, requestUserPermission } from './utils/notification';
import { commonActionTypes } from './redux/common/types';
import { ToastConfig , ToastConfigParams } from 'react-native-toast-message'
import Toast from 'react-native-toast-message'
import useToastConfig from './hooks/toastConfig';
import { useDeviceOrientation } from '@react-native-community/hooks';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { ToastProvider } from 'react-native-toast-notifications'


export const storage = new MMKV();
type SectionProps = PropsWithChildren<{
  title: string;
}>;

export const navigationRef = createNavigationContainerRef<NativeStackNavigationProp<RootStackParamList>>();

const Stack = createNativeStackNavigator();
const query_client = new QueryClient();

function App(): JSX.Element {


  LogBox.ignoreLogs(['Warrning: ...']);
  LogBox.ignoreAllLogs();
  const isDarkMode = useColorScheme() === 'dark';
  const [splash, setSplash] = useState(true);
  const orientation = useDeviceOrientation();
  const dark = useColorScheme() == 'dark';
  const {theme} = useMaterial3Theme({sourceColor: '#002877'});

  const applyTheme = dark
    ? {
        ...MD3DarkTheme,
        // colors : customTheme,
        // colors : customTheme.colors,
        ...customTheme,
        colors: {...theme.light, ...customTheme.colors},
        font: configureFonts({config : fontConfig})
        
      }
    : {
        ...MD3LightTheme,
        // colors : customTheme,
        // colors : customTheme.colors,
        ...customTheme,
        colors: {...theme.light, ...customTheme.colors},
        font: configureFonts({config : fontConfig})
      };



  const linking = {
    prefixes: ['http://cms.ipsacademy.net/', 'ips://'],
  };


  useEffect(() => {

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (storage.contains('notifications')) {
        const previous = storage.getString('notifications');
        if (previous !== undefined) {
          const data = [  ...JSON.parse(previous),{...remoteMessage.notification , seen:false} ];
          storage.set('notifications', JSON.stringify(data));
        } else {
          storage.set(
            'notifications',
            JSON.stringify([{...remoteMessage.notification , seen:false}]),
          );
        }
      } else {
        storage.set(
          'notifications',
          JSON.stringify([{...remoteMessage.notification , seen:false}]),
        );
      }
      let notifications = storage.getString("notifications");
      if ( notifications !== undefined){
        let notificationArray = JSON.parse(notifications);
        store.dispatch({type:commonActionTypes.ClearNotification});
        notificationArray.map(item=>{
          store.dispatch({type:commonActionTypes.GetNotification , payload : item})
        })
      }

      

      Toast.show({
        type : "info",
        text1 : remoteMessage.notification?.title,
        text2 : remoteMessage.notification?.body,
        visibilityTime : 6000,
        topOffset : 55 ,
        props : {
          icon : "bell"
        },
        onPress : ()=>{
          Toast.hide();
          if (navigationRef.isReady()) navigationRef.navigate("Notification")
        }
      })
    });
    // requestUserPermission();
    notificationListener();
    return unsubscribe;
  }, []);


  
  const toastConfig:ToastConfig = useToastConfig(applyTheme);
  
  const [bar_color , set_bar_color] = useState<{style : StatusBarStyle , color : string}>({color:applyTheme.colors.white , style:"dark-content"});

  setTimeout(  ()=>set_bar_color({color:"#002877" , style : "light-content"}) ,  1150)


  if( splash) return (
    <>
    <StatusBar translucent barStyle={bar_color.style} animated backgroundColor={bar_color.color} />
    <LottieView
          source={require('./assets/splash/IPS_splash_improved.json')}
          style={{
            height: Dimensions.get('screen').height,
            backgroundColor: bar_color.color,
          }}
          autoPlay
          resizeMode={
            orientation == 'landscape' ? 'center' : 'cover'
          }
          loop={false}
          onAnimationFinish={() => {
            setSplash(false);
          }}
        />
        </>
  )



  return (
            <ToastProvider placement='top' duration={6000} offsetTop={50} renderType={toastConfig} renderToast={toastConfig.success} >
    <PortalProvider >
        <QueryClientProvider client = {query_client}>
        <Provider store={store}>
          <SafeAreaProvider style={{flex : 1 , backgroundColor:applyTheme.colors.container_background }}>
            <PaperProvider
              settings={{icon: props => <Icon {...props} suppressHighlighting={true} />}}
              theme={applyTheme}>
              <Routes />
              <Toast config={toastConfig}  />
            </PaperProvider>
          </SafeAreaProvider>
        </Provider>
        </QueryClientProvider>
        </PortalProvider>
        </ToastProvider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
