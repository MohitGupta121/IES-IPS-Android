import { BackHandler, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useBackHandler } from '@react-native-community/hooks';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../routes/routes';
import useCollapsibleCustomHeader from '../../../hooks/useCollapsibleHeader';

const About = () => {

  const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useBackHandler(()=>{
    navigator.pop();
    return true;
  })
  const {onScroll , headerHeight} = useCollapsibleCustomHeader();

  return (
    <ScrollView onScroll={onScroll} style={{paddingTop: headerHeight}}>
      <Text>About</Text>
    </ScrollView>
  )
}

export default About

const styles = StyleSheet.create({})