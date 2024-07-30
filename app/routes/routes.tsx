import { View, Text } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { NavigationContainer, useNavigation  , DefaultTheme} from '@react-navigation/native'
import { NativeStackHeaderProps, NativeStackNavigationOptions, createNativeStackNavigator } from '@react-navigation/native-stack'
import commonScreenProps, { commonRoutes } from './common';
import studentScreenProps , { studentRoutes } from './student';
import staffScreenProps, { staffRoutes } from './staff';
import { useTheme } from 'react-native-paper';
import { themeType } from '../theme';
import CustomHeader from '../components/customHeader';
import { navigationRef, storage } from '../App';
import { useDispatch } from 'react-redux';
import { commonActionTypes } from '../redux/common/types';


export type RootStackParamList = staffRoutes & studentRoutes & commonRoutes;

const Stack = createNativeStackNavigator<RootStackParamList>();



const Routes = () => {
    const theme: themeType= useTheme()
    const screenOptions:NativeStackNavigationOptions ={
        headerShown:false,
        animation:'slide_from_right',
        header: (props)=><CustomHeader {...props} />,
        fullScreenGestureEnabled:true,
        headerStyle : {
            backgroundColor : theme.colors.container_background,
        },
        // statusBarTranslucent : true,
        
    }
    const dispatch = useDispatch();
    const [isLoggedIn , setIsLoggedin] = useState(false)

    useEffect( ()=>{
        if ( storage.contains('user-login')) {
            setIsLoggedin(true)
            let loginStorageData = storage.getString('user-login');
            if (loginStorageData!== undefined)
            dispatch({type:commonActionTypes.UserLoginDetails , payload : JSON.parse(loginStorageData)})
          }
          }, [])
          
    useEffect(() => {
      if (!isLoggedIn) navigationRef.navigate('Login');
      else  navigationRef.navigate('Dashboard');
    }, [isLoggedIn]);

    const navigationTheme: ReactNavigation.Theme = { 
        ... DefaultTheme ,
        colors: { 
            text: theme.colors.primary, 
            background: theme.colors.white, 
            card: theme.colors.white,
            border: theme.colors.primary,
            notification: theme.colors.container_background,
            primary : theme.colors.primary,
        },
    }
  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>

        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Group>
                {commonScreenProps.map((item ,index)=><Stack.Screen {...item} key={index} />)}
            </Stack.Group>
            <Stack.Group>
                {studentScreenProps.map((item ,index)=><Stack.Screen {...item} key={index} />)}
            </Stack.Group>
            <Stack.Group>
                {staffScreenProps.map((item ,index)=><Stack.Screen {...item} key={index} />)}
            </Stack.Group>

        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Routes;