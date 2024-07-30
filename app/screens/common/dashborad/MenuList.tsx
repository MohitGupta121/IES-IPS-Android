import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native-gesture-handler'
import { List, useTheme } from 'react-native-paper'
import { themeType } from '../../../theme'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { commonActionTypes } from '../../../redux/common/types'
import { storage } from '../../../App'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../routes/routes'


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
                
                storage.clearAll();
                // @ts-ignore
                navigation.navigate("Login")
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

export default MenuList