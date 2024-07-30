import React = require("react");
import Icon from 'react-native-vector-icons/Feather';
import { Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { ToastConfig, ToastConfigParams } from "react-native-toast-message";
import { themeType } from '../theme';

export default function useToastConfig(applyTheme:themeType):ToastConfig{

  // toaster setting up
  const toastStyles = StyleSheet.create({
    toastContainer :{
      flex:1,
      flexDirection : "row",
      alignItems : "center",
      padding:10,
      gap: 10 ,
      maxWidth : 500,
      borderRadius : 20 ,
      borderLeftWidth : 5,
      marginHorizontal : 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.34,
      shadowRadius: 6.27,

      // elevation: 10,
      marginBottom : 5,
    },
    toastDescription:{
      // paddingHorizontal: 10 ,
      color : applyTheme.colors.black
  
    },
    success : {
      borderLeftColor : applyTheme.colors.green,
      backgroundColor : applyTheme.colors.surface,
    },
    error : {
      borderLeftColor : applyTheme.colors.red,
      backgroundColor : applyTheme.colors.surface,
    },
    info : {
      borderLeftColor : applyTheme.colors.primary,
      backgroundColor : applyTheme.colors.surface,
    },
    warning : {
      borderLeftColor : applyTheme.colors.yellow,
      backgroundColor : applyTheme.colors.surface,
    },
  })
  
    const toastConfig:ToastConfig = {
        success : (props:ToastConfigParams<any>)=>(
          <Pressable style={{flex:1 ,flexDirection:"row"}}  onPress={props.onPress} >
          <View style={[toastStyles.toastContainer , toastStyles.success]}>
            <Icon name={props.props?.icon || "check-circle"} size={25} color={applyTheme.colors.green} />
            <View style={{flex:1 , gap:5}}>
              <Text variant="titleMedium" style={{color:applyTheme.colors.green}} numberOfLines={2} {...props.props?.title} >{props.text1}</Text>
              <Text variant="labelMedium" style={toastStyles.toastDescription} numberOfLines={2} {...props.props?.description} >{props.text2}</Text>
            </View>
          </View>
          </Pressable>
        ),
        error : (props:ToastConfigParams<any>)=>(
          <Pressable style={{flex:1 ,flexDirection:"row"}}  onPress={props.onPress} >
          <View style={[toastStyles.toastContainer , toastStyles.error]}>
            <Icon name={props.props?.icon || "x-circle"} size={25} color={applyTheme.colors.error} />
            <View style={{flex:1 , gap:5}}>
              <Text variant="titleMedium" style={{color:applyTheme.colors.error}} numberOfLines={2} {...props.props?.title} >{props.text1}</Text>
              <Text variant="labelMedium" style={toastStyles.toastDescription} numberOfLines={2} {...props.props?.description} >{props.text2}</Text>
            </View>
          </View>
          </Pressable>
        ),
        info : (props:ToastConfigParams<any>)=>(
          <Pressable style={{flex:1 ,flexDirection:"row"}}  onPress={props.onPress} >
          <View style={[toastStyles.toastContainer , toastStyles.info]}>
            <Icon name={props.props?.icon || "alert-circle"} size={25} color={applyTheme.colors.primary} />
            <View style={{flex:1 , gap:5}}>
              <Text variant="titleMedium" style={{color:applyTheme.colors.primary}} numberOfLines={2} {...props.props?.title} >{props.text1}</Text>
              <Text variant="labelMedium" style={toastStyles.toastDescription} numberOfLines={2} {...props.props?.description} >{props.text2}</Text>
            </View>
          </View>
          </Pressable>
        ),
        warning : (props:ToastConfigParams<any>)=>(
          <Pressable style={{flex:1 ,flexDirection:"row"}} onPress={props.onPress} >
          <View style={[toastStyles.toastContainer , toastStyles.warning]}>
            <Icon name={props.props?.icon || "alert-triangle"} size={25} color={applyTheme.colors.yellow} />
            <View style={{flex:1 , gap:5}}>
              <Text variant="titleMedium" style={{color:applyTheme.colors.yellow}} numberOfLines={2} {...props.props?.title} >{props.text1}</Text>
              <Text variant="labelMedium" style={toastStyles.toastDescription} numberOfLines={2} {...props.props?.description} >{props.text2}</Text>
            </View>
          </View>
          </Pressable>
        ),
      }

      return toastConfig;
}