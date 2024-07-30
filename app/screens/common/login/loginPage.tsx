
import React from "react";
import { Dimensions, ImageBackground, StatusBar, StyleSheet } from "react-native";
import { View } from "react-native-ui-lib";
import StaffLogin from "./staffLogin";
import StudentLogin from "./studentLogin";
import { themeType } from "../../../theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useTheme } from "react-native-paper";
import IosSafeArea from "../../../components/iosSafeArea";


const Tab = createMaterialTopTabNavigator();


const LoginPage = () =>{
    
    const theme:themeType = useTheme();
    

return (
    <IosSafeArea color={theme.colors.container_background}>
  <ImageBackground
    source={require('../../../assets/images/IPS-3417.png')}
    style={{flex: 1}}
    resizeMode="cover">
      {/* <StatusBar backgroundColor={theme.colors.primaryContainer} barStyle={"dark-content"}/> */}
      <View >
        </View>
    <Tab.Navigator
      sceneContainerStyle={style.sceneContainer}
      screenOptions={{
        tabBarIndicatorStyle: {backgroundColor: theme.colors.primary},
        tabBarStyle: {backgroundColor: theme.colors.container_background},
        tabBarLabelStyle : {
          color : "red"
        }
      }}>
      <Tab.Screen name="Student" component={StudentLogin} />
      <Tab.Screen name="Staff" component={StaffLogin} />
    </Tab.Navigator>
  </ImageBackground>
  </IosSafeArea>
);

}

const {height} = Dimensions.get("screen")
  
  const style = StyleSheet.create({

    sceneContainer : {
      backgroundColor:"transparent",
      backfaceVisibility:"hidden",
    }
   
  });

  export default LoginPage;