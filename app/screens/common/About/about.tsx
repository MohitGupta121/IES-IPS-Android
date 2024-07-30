import { BackHandler, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useBackHandler } from '@react-native-community/hooks';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../routes/routes';

const About = () => {

  const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useBackHandler(()=>{
    navigator.pop();
    return true;
  })

  return (
    <View>
      <Text>About</Text>
    </View>
  )
}

export default About

const styles = StyleSheet.create({})