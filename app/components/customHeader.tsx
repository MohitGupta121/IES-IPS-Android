import { StyleSheet, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { NativeStackHeaderProps } from '@react-navigation/native-stack'
import { Button, IconButton, Text, useTheme, withTheme } from 'react-native-paper'
import { ScreenStackHeaderConfig, ScreenStackHeaderSubview } from 'react-native-screens'
import { themeType } from '../theme'
import IosSafeArea from './iosSafeArea'
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import { opacity } from 'react-native-reanimated/lib/typescript/reanimated2/Colors'
import { HeaderContext } from '../context/headerCollapse'
import useCollapsibleCustomHeader from '../hooks/useCollapsibleHeader';
import { buttonClickHapticFeedback } from '../utils/vibrations'


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
        },
        backButtonStyle:{height:40 , width:50,  backgroundColor:"white"},
        headerTextContainer:{flex:1 , flexDirection:"row" , justifyContent:"center" , alignItems:"center" , gap:10},
        headerAlignStyle:{flex:1, flexDirection : 'row' , paddingHorizontal:10, alignItems:"center" },
        
    })

    const animateButtonValue = useSharedValue(1);
    const {value:headerY , hidden} = useContext(HeaderContext)
    // useEffect(()=>{
    //   setTimeout(()=>headerY?headerY.value-=50:null  ,1000)
    // } , [])


    const animateHeaderStyle = useAnimatedStyle(()=>({
      backgroundColor: theme.colors.container_background , 
      transform:[{translateY:withSpring(headerY?headerY.value:0 , {
        damping:100,
        stiffness:250,
        overshootClamping: true,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      })}]
    }))

    const animateBackButtonStyle = useAnimatedStyle(()=>({transform:[{scale : animateButtonValue.value}]}))

    const animateBackButton = useMemo(()=>({
      pressIn : ()=>animateButtonValue.value=withTiming(0.9 , {duration:250}),
      pressOut: ()=>animateButtonValue.value=withTiming(1 , {duration:250}),
    }) ,[animateButtonValue])

    const onBack = useCallback(()=>{
      buttonClickHapticFeedback();
      props.navigation.pop();
    } , [props.navigation])



  return (
    <Animated.View style={animateHeaderStyle}>
      <IosSafeArea
        color={hidden ? undefined : theme.colors.container_background}
        barStyle="dark-content">
        {/* <SafeAreaProvider > */}
        <ScreenStackHeaderSubview collapsable style={styles.headerContainer}>
          <View style={styles.headerAlignStyle}>
            <Animated.View style={animateBackButtonStyle}>
              <IconButton
                style={styles.backButtonStyle}
                onPressIn={animateBackButton.pressIn}
                onPress={onBack}
                onPressOut={animateBackButton.pressOut}
                iconColor={theme.colors.primary}
                icon="arrow-left"
                size={25}
              />
            </Animated.View>
            <View style={styles.headerTextContainer}>
              {/* <Icon name="book-open" size={25} color={theme.colors.black} /> */}
              <Text
                style={styles.headerTextStyle}
                numberOfLines={1}
                ellipsizeMode="tail">
                {props.options.title ? props.options.title : props.route.name}
              </Text>
            </View>
            <View style={{width: 40}}></View>
          </View>
        </ScreenStackHeaderSubview>
        {/* </SafeAreaProvider> */}
      </IosSafeArea>
    </Animated.View>
  );
}

export default CustomHeader
