import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { themeType } from "../theme";
import { useEffect } from "react";

const Pagination = ({ dotsLength, activeDotIndex }: { dotsLength: number; activeDotIndex: number; progressValue: Animated.SharedValue<number> }) => {
  
    const theme:themeType = useTheme()
    const arr = Array.from({length : dotsLength})
    const styles = StyleSheet.create({
        paginationContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap : 5,
            paddingVertical : 10,
            position : "absolute",
            bottom : 30,
            zIndex : 20
          },
          dot: {
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor : theme.colors.grayOpacity,
            
          },
          activeDot : {
            transform : [{scale : 1.5}],
            backgroundColor : theme.colors.backdrop,
            marginHorizontal: 5,
          }

    })

    useEffect(()=>{
      console.log(activeDotIndex)
    }, [activeDotIndex])

    

    return (
      <View style={styles.paginationContainer} >
        {
          arr.map((_, index)=>(
            <View key={index} style={[styles.dot  , activeDotIndex === index?styles.activeDot : null]} >

            </View>
          ))
        }
      </View>
    );
  };

  export default Pagination;