import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { Button, DataTable, Text, useTheme } from 'react-native-paper'
import {Carousel} from "react-native-basic-carousel";
import CMScard from '../../../components/cms_card';
import { useBackHandler } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from 'react-query';
import { commonApi, staffApi } from '../../../api/API';
import { useDispatch, useSelector } from 'react-redux';
import store, { RootState } from '../../../redux/store';
import { reducerData } from '../../../redux/common/reducer';
import { staffActionType } from '../../../redux/staff/types';
import { themeType } from '../../../theme';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import CustomError from '../../../components/customError';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../routes/routes';
import CustomLoading from '../../../components/customLoading';
import NoData from '../../../components/noData';
import { commonActionTypes } from '../../../redux/common/types';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import Animated, { useSharedValue, withSpring, withTiming  } from 'react-native-reanimated';
import { storage } from '../../../App';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import AnimatedOutlineButton from '../../../components/animatedOutlineButton';
import { useAcademicSession } from '../../../hooks/query/common';
import { useGetBatches } from '../../../hooks/query/staff';
import useCollapsibleCustomHeader from '../../../hooks/useCollapsibleHeader';

const AttendancePanel = () => {
  
  const dispatch = useDispatch()
  const dimension = useWindowDimensions();
  const theme : themeType = useTheme()
  const styles = StyleSheet.create({
    cardStyle: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.51,
      shadowRadius: 13.16,

      elevation: 20,
      width: dimension.width - 30,
      maxWidth: 700,
      alignItems: 'center',
      textAlign : "center", 
      paddingTop : 30,
      // marginVertical : "auto",
      // backgroundColor: theme.colors.container_background
    },
    carousel: {
      alignItems : "center",
      marginVertical : 'auto',
      alignSelf : "center",
      paddingBottom : 50,
    },
    rootContainer: {
      flex: 1, 
      // alignItems: 'center',
    },
    buttonConatiner:{
      flexDirection : "row",
      flexWrap : "wrap",
      justifyContent : "space-evenly",
      gap : 10 ,
      // padding : 10 ,
      paddingVertical : 20
    },
    button : {
      // flexBasis : "40%",
      width : 150,
    },
    properties : {
       fontWeight : "700"
    },
    fontLarge : {
      fontSize : 15
    },
    row : {
    },
    heading :{
      fontWeight : "700",
      textAlign : "center",
      fontSize : 20
    },
    buttonLabel:{
      fontSize : 12,
      textAlign :"left"
    }
  });



  type User = Pick<reducerData["User"] , "user" >;
  const [ {user} , setUser ] = useMMKVStorage<User>("User" , storage , {user:{}});
  
  const {current_academic_session_id:current_session} = useAcademicSession();
  const [departments ,setDepartments]:[any, (prevalue:any)=>void]  = useMMKVStorage("Departments" , storage , []);



  const { facultySubjects , queryState:{isLoading , isError}} = useGetBatches(user.computer_code ,current_session);
  // useEffect(()=>{console.log("session : " , current_session)} , [current_session])

  const {onScroll , headerHeight} = useCollapsibleCustomHeader();

  const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useBackHandler(()=>{
      navigator.pop();
      return true;
    })


  const renderItem = useCallback(({ index , item }:{index:number , item:any|undefined}) =>{
    if( !item) return null;
    if( !item.subject ) return null;
    return (
    <CMScard style={styles.cardStyle} >
     <Text variant='labelLarge' style={styles.heading} >{item.subject.subject_name}</Text>
     <DataTable>
        <DataTable.Row style={styles.row} borderless>
        <View style={{width: '30%', justifyContent: 'center'}}>
                  <Text style={[styles.properties , styles.fontLarge]}>Department</Text>
        </View>
        <View style={{width: 30, justifyContent: 'center'}}>
                  <Text style={[styles.properties,{textAlign : "center"}]}>:</Text>
        </View>
        <View style={{width: '60%', justifyContent: 'center'}}>
                  <Text style={styles.fontLarge} numberOfLines={2}>{departments.find(department=>department.id===item.subject.department)?.name}</Text>
        </View>
        </DataTable.Row>
        <DataTable.Row style={styles.row} borderless>
        <View style={{width: '30%', justifyContent: 'center'}}>
                  <Text style={[styles.properties , styles.fontLarge]}>Batch</Text>
        </View>
        <View style={{width: 30, justifyContent: 'center'}}>
                  <Text style={[styles.properties,{textAlign : "center"}]}>:</Text>
        </View>
        <View style={{width: 'auto', justifyContent: 'center'}}>
                  <Text style={styles.fontLarge}>{item.subject.batch}</Text>
        </View>
        </DataTable.Row>
        <DataTable.Row style={[styles.row , {height : 90}]} borderless>
        <View style={{width: '30%', justifyContent: 'center'}}>
                  <Text style={[styles.properties , styles.fontLarge]}>University Subject Code</Text>
        </View>
        <View style={{width: 30, justifyContent: 'center'}}>
                  <Text style={[styles.properties,{textAlign : "center"}]}>:</Text>
        </View>
        <View style={{width: 'auto', justifyContent: 'center'}}>
                  <Text style={styles.fontLarge}>{item.subject.university_sub_code}</Text>
        </View>
        </DataTable.Row>
        <DataTable.Row style={styles.row} borderless>
        <View style={{width: '30%', justifyContent: 'center'}}>
                  <Text style={[styles.properties , styles.fontLarge]}>Type</Text>
        </View>
        <View style={{width: 30, justifyContent: 'center'}}>
                  <Text style={[styles.properties,{textAlign : "center"}]}>:</Text>
        </View>
        <View style={{width: 'auto', justifyContent: 'center'}}>
                  <Text style={styles.fontLarge}>{(item.subject.type=="T"?"Theory":"Practical")}</Text>
        </View>
        </DataTable.Row>
        <DataTable.Row style={styles.row} borderless>
        <View style={{width: '30%', justifyContent: 'center'}}>
                  <Text style={[styles.properties , styles.fontLarge]}>Course</Text>
        </View>
        <View style={{width: 30, justifyContent: 'center'}}>
                  <Text style={[styles.properties,{textAlign : "center"}]}>:</Text>
        </View>
        <View style={{width: 'auto', justifyContent: 'center'}}>
                  <Text style={styles.fontLarge}>{item.subject.course}</Text>
        </View>
        </DataTable.Row>
     </DataTable>
     <View style={styles.buttonConatiner}>
          <AnimatedOutlineButton onPress={()=>navigator.navigate('Take Attendance' , {batch_id : item.subject.batch_id})} icon="edit" labelStyle={styles.buttonLabel} style={styles.button} color='blue'>Take Attendance</AnimatedOutlineButton>
          <AnimatedOutlineButton onPress={()=>navigator.navigate('View Attendance' , {batch_id : item.subject.batch_id})} icon="align-center" labelStyle={styles.buttonLabel} style={styles.button} color='red' >View Attendance</AnimatedOutlineButton>
          <AnimatedOutlineButton onPress={()=>navigator.navigate('Modify Attendance' , {batch_id : item.subject.batch_id})} icon="edit-3" labelStyle={styles.buttonLabel} style={styles.button} color='yellow' >Modify</AnimatedOutlineButton>
          <AnimatedOutlineButton onPress={()=>navigator.navigate('Lecture Plan' , {batch_id : item.subject.batch_id})} icon="clipboard" labelStyle={styles.buttonLabel} style={styles.button} color='green' >Lecture Plan</AnimatedOutlineButton>
        </View>
    </CMScard>
   )} , [facultySubjects , departments])


   if(isError) return  <CustomError text={"data not Fetched"} />
   if(isLoading) return(
    <CustomLoading />
  )


   
   return (
    <GestureHandlerRootView style={{flex :1}}>
    <ScrollView onScroll={onScroll} style={[styles.rootContainer, {paddingTop:headerHeight}]} >
      <CMScard>
      <View>
        <Text>Total Batches : {facultySubjects?.length}</Text>
      </View>
      </CMScard>

    {/* Working fine */}
        <Carousel
          windowSize={5}
          initialNumToRender={3}
          itemWidth={dimension.width}
          data={facultySubjects}
          renderItem={renderItem}
          contentContainerStyle={styles.carousel}
          placeholderContent={<NoData text="No Batches assigned" />}
          disableIntervalMomentum
          getItemLayout={(date , index)=>({
            length : dimension.width - 30 , offset :  (dimension.width - 30)*index, index
          })}
          pagination
          paginationType='circle'
        />

        

    </ScrollView>
    </GestureHandlerRootView>
  )
}

export default memo(AttendancePanel)

