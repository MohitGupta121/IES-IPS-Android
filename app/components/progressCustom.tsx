import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AnimatedCircularProgress, CircularProgress, CircularProgressProps } from 'react-native-circular-progress'
import { useTheme } from 'react-native-paper'
import { themeType } from '../theme'

export type ProgressColorProp = 'green'|'blue'|'red'|'yellow'|undefined

export interface Props extends CircularProgressProps {
    color : ProgressColorProp
}

const ProgressCustom = (props:Props) => {
    const styles = StyleSheet.create({})
    const theme:themeType = useTheme();
    const colored = {
        green : {
            color : theme.colors.green,
            backgroundColor : theme.colors.container_green
        },
        blue : {
            color : theme.colors.primary,
            backgroundColor : theme.colors.container_background
        },
        red : {
            color : theme.colors.red,
            backgroundColor : theme.colors.container_red
        },
        yellow : {
            color : theme.colors.yellow,
            backgroundColor : theme.colors.container_yellow
        },
    }
  return (
    <AnimatedCircularProgress
        size={props.size}
        width={props.width}
        fill={props.fill}
        duration={2000}
        tintColor= {props.color?colored[props.color].color:theme.colors.primary}
        fillLineCap="butt"
        prefill={0}
        rotation={0}
        key={0}
        style={{margin:5}}
        childrenContainerStyle={{backgroundColor:(props.color?colored[props.color].backgroundColor:theme.colors.container_background)}}
        {...props}
    >
        {props.children}
        </AnimatedCircularProgress>
  )
}

export default ProgressCustom
