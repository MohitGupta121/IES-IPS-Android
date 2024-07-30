import { View, Text, StyleSheet } from 'react-native'
import React, { memo, useContext } from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { List, useTheme } from 'react-native-paper'
import { themeType } from '../../../theme'
import { CommonActions, useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { commonActionTypes } from '../../../redux/common/types'
import { storage } from '../../../App'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../routes/routes'
import { LoginContext } from '../../../context/loginContext'


type MenuListProps = {
    Modalref : any
}

const MenuList = (props:MenuListProps) => {

    const theme:themeType = useTheme();

    const styles = StyleSheet.create({
        listItem:{
            flex:1,
            height:20 , 

        }
    })

    const {setLogin} = useContext(LoginContext)

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();

    const data = [
        {
            id: '1',
            title: 'My Profile',
            icon:"user",
            textStyle:{
                color:theme.colors.black
            },
            onPress:()=>{
                console.log("My Profile")
                props.Modalref.current.dismiss();
                navigation.navigate("MyProfile")
            }
        },
        {
            id: '2',
            title: 'Change Password',
            icon:"lock",
            textStyle:{
                color:theme.colors.black
            },
            onPress:()=>{
                props.Modalref.current.dismiss();
            }
        },
        {
            id: '3',
            title: 'About',
            icon:"info",
            textStyle:{
                color:theme.colors.black
            },
            onPress:()=>{
                console.log("About")
                props.Modalref.current.dismiss();
                navigation.navigate("About")
            }
        },
        {
            id: '4',
            title: 'Contact Us',
            icon:"phone",
            textStyle:{
                color:theme.colors.black
            },
            onPress:()=>{
                props.Modalref.current.dismiss();
                // @ts-ignore
                navigation.navigate("Contact")
            }
        },
        {
            id: '5',
            title: 'Log Out',
            icon:"log-out",
            textStyle:{
                color:theme.colors.red
            },
            onPress:()=>{
                console.log("logOut")
                
                dispatch({type:commonActionTypes.ClearUserLoginDetails});
                
                storage.clearStore();
                setLogin({
                    isLoggedIn:false,
                    user:null
                })
                navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'Login' }],
                    })
                  );
                
            }
        },
    ] 

  return (
        <FlatList
        data = {data}
        renderItem={({item})=>(
        <List.Item 
        title={item.title}
        titleStyle={item.textStyle}
        left={()=><List.Icon icon={item.icon} color={item.textStyle.color} />}
        onPress={()=>item.onPress()}
        />
        )}
        keyExtractor={item=>item.id}
        />
  )
}

export default memo(MenuList)