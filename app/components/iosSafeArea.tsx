import React from "react";
import { type } from "os";
import { StatusBar, StatusBarStyle, View } from "react-native";
import { useTheme } from "react-native-paper"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { Platform } from "react-native";
import { ReactNode } from "react";

type props = {
    children : ReactNode,
    color? : string,
    barStyle? : StatusBarStyle
};


function IosSafeArea(props: props) {
    const theme = useTheme();
  return (
    <SafeAreaView style={{flex:1}}>
    <SafeAreaProvider >
        <StatusBar barStyle={props.barStyle}  backgroundColor={props.color?props.color : 'transparent'}  />
        {props.children}
    </SafeAreaProvider>
    </SafeAreaView>
    )
}

export default IosSafeArea