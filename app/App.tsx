/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import 'react-native-gesture-handler';
import React, { useEffect, useMemo, useState } from 'react';
import { Portal, PortalProvider } from '@gorhom/portal';
import type { PropsWithChildren } from 'react';
import {
  Dimensions,
  LogBox, StatusBar,
  StatusBarStyle,
  StyleSheet, useColorScheme
} from 'react-native';

import customTheme, { fontConfig } from './theme';
import { createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import { PaperProvider, configureFonts } from 'react-native-paper';
import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './redux/store';
import Routes, { RootStackParamList } from './routes/routes';
import Icon from 'react-native-vector-icons/Feather';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';
import messaging from '@react-native-firebase/messaging';
import { notificationListener } from './utils/notification';
import Toast from 'react-native-toast-message';
import useToastConfig from './hooks/toastConfig';
import { useDeviceOrientation } from '@react-native-community/hooks';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { ToastProvider } from 'react-native-toast-notifications';
import HeaderCollapseContext from './context/headerCollapse';
import useCollapsibleCustomHeader from './hooks/useCollapsibleHeader';
import { NotificationType } from './types';
import LoginContextProvder from './context/loginContext';


export const storage = new MMKVLoader().initialize();

export const navigationRef = createNavigationContainerRef<NativeStackNavigationProp<RootStackParamList>>();

const Stack = createNativeStackNavigator();
const query_client = new QueryClient();

function App(): JSX.Element {


  const isDarkMode = useColorScheme() === 'dark';
  const [splash, setSplash] = useState(true);
  const orientation = useDeviceOrientation();
  const dark = useColorScheme() == 'dark';
  const {theme} = useMaterial3Theme({sourceColor: '#002877'});

  const applyTheme = useMemo(()=>dark
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
      } ,[]);
      
      
      
      const linking = {
        prefixes: ['http://cms.ipsacademy.net/', 'ips://'],
      };
      
      const [ notifications , setNotifications ] = useMMKVStorage<any>( "Notification" , storage , []);
      const [bar_color , set_bar_color] = useState<{style : StatusBarStyle , color : string}>({color:applyTheme.colors.white , style:"dark-content"});
      


      useEffect(()=>{
        setTimeout(  ()=>set_bar_color({color:"#002877" , style : "light-content"}) ,  1150)
      },[])

  useEffect(() => {
        

    const unsubscribe = messaging().onMessage(async remoteMessage => {

      let notification:NotificationType = {
        title : remoteMessage.notification.title,
        description : remoteMessage.notification.body,
        message : remoteMessage.data.message,
        sender : remoteMessage.data.sender,
        timestamp : remoteMessage.data.timestamp,
        seen:false,
      }
      setNotifications([notification,...notifications])

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
          if (navigationRef.isReady()) navigationRef.navigate<any>("Notification")
        }
      })
    });
    // requestUserPermission();
    notificationListener();
    return unsubscribe;
  }, [notifications]);
  
  
  
  const toastConfig = useToastConfig(applyTheme);
  

  const splashScreen = useMemo(()=>(
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
  ) , [bar_color])



  return (
    // <SafeAreaProvider
    //   style={{
    //     flex: 1,
    //     backgroundColor: applyTheme.colors.container_background,
    //   }}>
    <ToastProvider
      placement="top"
      duration={6000}
      offset={50+StatusBar.currentHeight}
      renderType={toastConfig}
      renderToast={toastConfig.success}>
      <PortalProvider>
        <QueryClientProvider client={query_client}>
          <Provider store={store}>
            <LoginContextProvder>
                <HeaderCollapseContext>
                <PaperProvider
                  settings={{
                    icon: props => (
                      <Icon {...props} suppressHighlighting={true} />
                    ),
                  }}
                  theme={applyTheme}>
                  {splash?           
                  splashScreen
                  :<Routes />}
                  <Portal>
                    <Toast config={toastConfig} />
                  </Portal>
                </PaperProvider>
              </HeaderCollapseContext>

            </LoginContextProvder>
          </Provider>
        </QueryClientProvider>
      </PortalProvider>
    </ToastProvider>
            // </SafeAreaProvider>
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
