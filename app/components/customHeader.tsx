import { StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import { Button, IconButton, Text, useTheme } from 'react-native-paper'
import { ScreenStackHeaderConfig, ScreenStackHeaderSubview } from 'react-native-screens'
import { themeType } from '../theme'
import IosSafeArea from './iosSafeArea'
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaProvider } from 'react-native-safe-area-context'


const CustomHeader = (props:NativeStackHeaderProps) => {

    const theme:themeType  = useTheme();
    const styles = StyleSheet.create({
        headerContainer:{
            height : 50 ,
            backgroundColor: theme.colors.container_background, opacity : 1 , 
            justifyContent : "center",
            elevation : 24,
            shadowColor: "#000",
            // shadowOffset: {
            //   width: 0,
            //   height: 12,
            // },
            // shadowOpacity: 0.58,
            // shadowRadius: 16.00,
          },
          headerTextStyle : {
            fontSize : 22,
            fontWeight : "700",
            alignSelf : 'center',
            textAlign : "center",
        }
    })

  return (
    <View style={{backgroundColor : theme.colors.container_background}}>
    <IosSafeArea color={theme.colors.container_background} barStyle='dark-content'>
    {/* <SafeAreaProvider > */}
      <ScreenStackHeaderSubview collapsable  style={styles.headerContainer}>
        <View style={{flex:1, flexDirection : 'row' , paddingHorizontal:10, alignItems:"center" }}>
          <IconButton style={{height:40 , width:50,  backgroundColor:"white"}} onPress={()=>props.navigation.pop()} iconColor={theme.colors.primary} icon="arrow-left" size={25} />
          <View style={{flex:1 , flexDirection:"row" , justifyContent:"center" , alignItems:"center" , gap:10}}>
            {/* <Icon name="book-open" size={25} color={theme.colors.black} /> */}
            <Text style={styles.headerTextStyle} numberOfLines={1} ellipsizeMode='tail'>{props.options.title?props.options.title:props.route.name}</Text>
          </View>
          <View style={{width:40}} ></View>
        </View>
      </ScreenStackHeaderSubview>
      {/* </SafeAreaProvider> */}
      </IosSafeArea>
      </View>
  )
}

export default CustomHeader
