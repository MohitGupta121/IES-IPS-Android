import { Material3Scheme, Material3Theme } from "@pchmn/expo-material3-theme";
import { StyleSheet, View } from "react-native";
import { MD3Theme, Text } from "react-native-paper";
import { MD3Type, InternalTheme } from "react-native-paper/src/types";

export type themeType = InternalTheme&{
    colors : Material3Scheme&{
        container_background: string,
        container_background_opacity:string,
        white : string,
        red : string,
        black:string,
        yellow: string,
        green : string,
        blue : string,
        grayOpacity : string,
        container_green : string,
        container_red : string,
        container_yellow : string,
        cms_card_background: string,
    },
    icon:{
        button_size : number
    }
    fonts : MD3Theme['fonts']
}


const customTheme =  {
    conmponents:{
        TextInput : {
            mode : "flat"
        },
    },
    colors:{
        container_background: "#c7d1ff",
        container_background_opacity: "#838cb3",
        white : "#ffffff",
        red : "#9b0000",
        black:"#000000",
        yellow: "#ffa505",
        green : "#006400",
        blue : "blue",
        container_green : "#ddffdd",
        container_red : "#ffc7c7",
        container_yellow : "#fffec8",
        cms_card_background: "#fafafa",
        grayOpacity : "#6363631a"
    },
    icon:{
        button_size : 30
    }
} as const;

type fontsType = MD3Theme["fonts"] & {
  // customVariant  :MD3Type
};

export const fontConfig:fontsType = {
    // "customVariant": {
    //   "fontFamily": "'DM Sans', sans-serif",
    //   "fontWeight": '400',
    //   "letterSpacing": 0.5,
    //   "lineHeight": 22,
    //   "fontSize": 20*0.9,
    // },
    "displaySmall": {
        "fontFamily": "'DM Sans', sans-serif",
        "fontSize": 36*0.9,
        "fontWeight": "400",
        "letterSpacing": -0.5,
        "lineHeight": 44,
      },
      
      "displayMedium": {
        "fontFamily": "'DM Sans', sans-serif",
        "fontSize": 45*0.9,
        "fontWeight": "400",
        "letterSpacing": -0.5,
        "lineHeight": 52,
      },
      
      "displayLarge": {
        "fontFamily": "'DM Sans', sans-serif",
        "fontSize": 57*0.9,
        "fontWeight": "400",
        "letterSpacing": -0.5,
        "lineHeight": 64,
      },
      "headlineSmall": {
        "fontFamily": "'DM Sans', sans-serif",
        "fontSize": 24*0.9,
        "fontWeight": "400",
        "letterSpacing": -0.5,
        "lineHeight": 32,
      },
      
      "headlineMedium": {
        "fontFamily": "'DM Sans', sans-serif",
        "fontSize": 28*0.9,
        "fontWeight": "400",
        "letterSpacing": -0.5,
        "lineHeight": 36,
      },
      
      "headlineLarge": {
        "fontFamily": "'DM Sans', sans-serif",
        "fontSize": 32*0.9,
        "fontWeight": "400",
        "letterSpacing": -0.5,
        "lineHeight": 40,
      },
      "titleSmall": {
        "fontFamily": "'DM Sans', sans-serif",
        "fontSize": 14*0.9,
        "fontWeight": "500",
        "letterSpacing": 0.1,
        "lineHeight": 20,
      },
      
      "titleMedium": {
        "fontFamily": "'DM Sans', sans-serif",
        "fontSize": 16*0.9,
        "fontWeight": "500",
        "letterSpacing": 0.15,
        "lineHeight": 24,
      },
      
      "titleLarge": {
        "fontFamily": "'DM Sans', sans-serif",
        "fontSize": 22*0.9,
        "fontWeight": "400",
        "letterSpacing": -0.5,
        "lineHeight": 28,
      },
      "labelSmall": {
        "fontFamily": "'DM Sans', sans-serif",
        "fontSize": 11*0.9,
        "fontWeight": "500",
        "letterSpacing": 0.5,
        "lineHeight": 16,
      },
      
      "labelMedium": {
        "fontFamily": "'DM Sans', sans-serif",
        "fontSize": 12*0.9,
        "fontWeight": "500",
        "letterSpacing": 1,
        "lineHeight": 16,
      },
      
      "labelLarge": {
        "fontFamily": "'DM Sans', sans-serif",
        "fontSize": 14*0.9,
        "fontWeight": "500",
        "letterSpacing": 0.1,
        "lineHeight": 20,
      },
      "bodySmall": {
        "fontFamily": "'DM Sans', sans-serif",
        "fontSize": 12*0.9,
        "fontWeight": "400",
        "letterSpacing": 0.4,
        "lineHeight": 16,
      },
      
      "bodyMedium": {
        "fontFamily": "'DM Sans', sans-serif",
        "fontSize": 14*0.9,
        "fontWeight": "400",
        "letterSpacing": 0.25,
        "lineHeight": 20,
      },
      
      "bodyLarge": {
          "fontFamily": "'DM Sans', sans-serif",
          "fontSize": 16*0.9,
          "fontWeight": "400",
          "letterSpacing": 0.15,
          "lineHeight": 24,
        },
    "default": {
        "fontFamily": "'DM Sans', sans-serif",
        // "fontSize": 15*0.9,
        "fontWeight": "400",
        "letterSpacing": 0,
      },
  };





export default customTheme ;