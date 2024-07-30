import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { Pressable, StyleSheet, TouchableNativeFeedback, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Button, ButtonProps, useTheme } from 'react-native-paper';
import { themeType } from '../theme';
import { buttonClickHapticFeedback } from '../utils/vibrations';


interface AnimatedOutlineButtonProps extends ButtonProps{
  color : "red"|"green"|"blue"|"yellow"
}

const AnimatedOutlineButton = (props:AnimatedOutlineButtonProps) => {
    const theme:themeType = useTheme();
    const [color , setColor] = useState(theme.colors.blue);
    const [colorBackground , setColorBackground] = useState(theme.colors.container_background);

    const colorSelector = useCallback(function(){
      switch(props.color){
        case 'red':  return theme.colors.red
        case 'green': return theme.colors.green
        case 'blue':return theme.colors.blue
        case 'yellow':return theme.colors.yellow
        default : theme.colors.blue
      }
    }  , [props.color]) 
    const colorSelectorBackground = useCallback(function(){
      switch(props.color){
        case 'red':  return theme.colors.container_red
        case 'green': return theme.colors.container_green
        case 'blue':return theme.colors.container_background
        case 'yellow':return theme.colors.container_yellow
        default : theme.colors.container_background
      }
    }  , [props.color]) 
    const styles = useMemo(()=>StyleSheet.create({
        buttonStyle : {
          borderColor: color,
          backgroundColor : colorBackground,
        }
    }),[color])

    
    useEffect( ()=>{
      setColor(colorSelector()||theme.colors.blue);
      setColorBackground(colorSelectorBackground()|| theme.colors.container_background);
    }, [props.color , colorSelector , colorSelectorBackground])

    const zoomOut = useSharedValue(1);
    const animateIn = useCallback(()=>zoomOut.value=withTiming(0.9,{duration:250}) , []);
    const animateOut = useCallback(()=>zoomOut.value=withTiming(1,{duration:250}) , []);

    const onPress = useCallback((event)=>{
      buttonClickHapticFeedback();
      if ( props.onPress) props.onPress(event);
    }, [props.onPress])

  return (
    <Animated.View style={{transform:[{scale:zoomOut}]}}>
        <TouchableOpacity disabled={props.disabled} onPressIn={animateIn} onPressOut={animateOut} onPress={onPress} >
          <Button {...props} onPress={undefined}  textColor={color} style={[props.style,styles.buttonStyle]} mode="outlined" >
            {props.children}
          </Button>
        </TouchableOpacity>
    </Animated.View>
  )
}

export default AnimatedOutlineButton;