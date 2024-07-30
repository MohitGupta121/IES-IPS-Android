import React, { Dispatch, memo, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Chip, DataTable, Switch, Text, useTheme } from 'react-native-paper'
import { themeType } from '../../../theme'
import { useDispatch, useSelector } from 'react-redux';
import { FlatList, LayoutAnimation, LayoutAnimationConfig, Platform, ScrollView, StyleSheet, UIManager, useWindowDimensions } from 'react-native';
import { useMutation, useQuery } from 'react-query';
import staffApi from '../../../api/staff/staffApi';
import { useNavigation, useRoute, createNavigationContainerRef } from '@react-navigation/native';
import { staffActionType } from '../../../redux/staff/types';
import CustomLoading from '../../../components/customLoading';
import { TouchableOpacity, View } from 'react-native-ui-lib';
import { FlashList } from '@shopify/flash-list';
import { RootState } from '../../../redux/store';
import NoData from '../../../components/noData';
import { commonActionTypes } from '../../../redux/common/types';
import { commonApi } from '../../../api/API';
import dayjs from 'dayjs';
import CMScard from '../../../components/cms_card';
import { useBackHandler, useImageDimensions } from '@react-native-community/hooks';
import {Toast} from 'react-native-toast-notifications';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut, FadeOutUp, Layout, runOnJS, useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming, ZoomInEasyUp } from 'react-native-reanimated';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../routes/routes';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { storage } from '../../../App';
import dataTableStyles from '../../../cmsStyles/dataTableStyles';
import AnimatedOutlineButton from '../../../components/animatedOutlineButton';
import { useGetLectureType, useGetTimeSlot } from '../../../hooks/query/common';
import { useDeleteAttendance, useGetAttendanceToModify, useGetStudentByAttendInfoToModify, useGetTopicForAttendance, useMarkAttendanceToModify } from '../../../hooks/query/staff';
import useCollapsibleCustomHeader from '../../../hooks/useCollapsibleHeader';

const ModifyAttendance = () => {

  const theme:themeType  = useTheme();
  const dispatch = useDispatch();
  const params:{batch_id : number} = useRoute<any>().params
  const dimension  = useWindowDimensions();
  const {headerHeight , onScroll} = useCollapsibleCustomHeader()
  const layoutAnimConfig:LayoutAnimationConfig = {
    duration : 150,
    update : {
      type : LayoutAnimation.Types.easeInEaseOut,
      property : LayoutAnimation.Properties.opacity,
    },
    delete : {
      duration : 150,
      type : LayoutAnimation.Types.easeInEaseOut,
      property : LayoutAnimation.Properties.opacity,
    },
  }
  const styles = StyleSheet.create({
    ...dataTableStyles,
    cardStyle : {
      width: dimension.width - 30,
      flexWrap : 'nowrap',
      flexDirection:'column',
      gap : 20,

    },
    rootContainer:{
      flex :1 ,
    },
    heading:{
      color : theme.colors.primary,
      fontWeight:'700',
      textAlign:"center",
      marginVertical:20
    },
    ...dataTableStyles,
    headerContainerStyle:{
    },
    headerTextStyle:{
      // textAlign : "center"
    },
    rowContainerStyle:{
      justifyContent : "center" ,
    },
    rowText:{
      
    },
    sno:{
      width : 50,
    },
    topic:{
      width : 200,
    },
    lab_group:{
      width : 60,
      alignItems :"center",
    },
    date:{
      width : 100,
    },
    time_slot:{
      width : 150,
    },
    lecture_type:{
      width : 80,
    },
    action:{
      width : 220,
      flexDirection :"row",
    },
    button : {
      // flexBasis : "40%",
      width : 100,
      margin:5,
    },
    buttonLabel:{
      fontSize : 12,
      textAlign :"left"
    },
    tableContainer:{
      padding : 20,
      
    },
    table:{
    height : (10*55)+100
    }
  })
      
      if (Platform.OS === 'android') {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
          UIManager.setLayoutAnimationEnabledExperimental(true);
        }
      }

      const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useBackHandler(()=>{

    dispatch({type : staffActionType.ModifyAttendance , payload : []});
    dispatch({type : staffActionType.AttendanceTopics , payload : []})
      dispatch({type : commonActionTypes.TimeSlots , payload : []})
      dispatch({type : commonActionTypes.LectureTypes , payload : []})

    navigator.pop();
    return true;
  })
          
          

  
  
  const {mutation:deleteAttendanceMutation} = useDeleteAttendance( {
    onSuccess : (data:any)=>{
      if (data.msg === "successfull")
        Toast.show("",{
        type: "success",
        text1 : "Delete Complete",
        text2 : "Attendance Deleted Successfully",
      })
      refetch();
      
    },
    onError : (error)=>{
      Toast.show("",{
        type: "error",
        text1 : "Delete Failed",
        text2 : "Some error occured",
        // autoHide : true,
        // visibilityTime : 6000,
      })
    }
  })
  
  
  const {topicList} = useGetTopicForAttendance(params.batch_id)
  const {timeSlots} = useGetTimeSlot();
  const {lectureTypes} = useGetLectureType();
  const {modifyAttendanceList,queryStatus:{isLoading , isFetching, isError}} = useGetAttendanceToModify(params.batch_id);

  const [page , setPage] = useState(0);
  const itemsPerPage = 10 ;
  const from = page * itemsPerPage;
  const to = useMemo(()=>Math.min((page + 1) * itemsPerPage, modifyAttendanceList?.length||0) , [modifyAttendanceList , page]);


  const [attendInfo , setAttendInfo] = useState<string>('')

  const [openSheet , setOpenSheet] = useState(false)


  const openAttendanceSheet = useCallback((attend_info : string)=>{
    setAttendInfo(attend_info)
    setOpenSheet(true)
  } , [attendInfo])

  
  const tableRow = useCallback(({item , index})=>{
    const topic_name = topicList.find(topic=>topic.topic_id===item.topic)?.topic_name
    const date = dayjs(item.date).format("DD-MM-YYYY")
    const start_time = timeSlots.find(time=>time.id === item.time_slot_id)?.start_time
    const end_time = timeSlots.find(time=>time.id === item.time_slot_id)?.end_time
    const lecture = lectureTypes.find(lecture=>lecture.lecture_id===item.lecture_type)?.lecture_type

    const deleteItem = (attend_info)=>{
      deleteAttendanceMutation.mutate({attend_info})
    }
    const openSheet = ()=>{
      openAttendanceSheet(item.attend_info)
    }
    return ( <ModifyAttendanceRow date={date} topic_name={topic_name} start_time={start_time} end_time={end_time} lecture={lecture} attend_info={item.attend_info} openSheet={openSheet} deleteItem={deleteItem} lab_group={item.lab_group} isDeleting={deleteAttendanceMutation.isLoading} />  )
},[modifyAttendanceList , timeSlots , topicList , lectureTypes])

  if (isFetching ) return <CustomLoading />
  if (!modifyAttendanceList.length) return <NoData text="No attendance to Modify" />
  
  return (
    <GestureHandlerRootView style={{flex  : 1}}>
      <ScrollView onScroll={onScroll} nestedScrollEnabled  style={styles.rootContainer} contentContainerStyle={{paddingBottom:50 , paddingTop:headerHeight}}>
    <BottomSheetModalProvider>
        <Text variant="headlineMedium" style={styles.heading}>
          Modify Attendance
        </Text>
    <ScrollView horizontal style={{alignSelf : "center"}} contentContainerStyle={styles.tableContainer} >
      <DataTable style={styles.table}>
          <DataTable.Header style={styles.headerStyle}>
            {/* <View style={[styles.headerContainerStyle , styles.sno]}>
              <Text variant="titleMedium" style={styles.headerTextStyle}>
                S.No
              </Text>
            </View> */}
            <View style={[styles.headerContainerStyle , styles.topic]}>
              <Text variant="titleMedium" style={styles.headerTextStyle}>
                Topic
              </Text>
            </View>
            <View style={[styles.headerContainerStyle , styles.lab_group]}>
              <Text variant="titleMedium" style={styles.headerTextStyle}>
                Lab
              </Text>
            </View>
            <View style={[styles.headerContainerStyle , styles.date]}>
              <Text variant="titleMedium" style={styles.headerTextStyle}>
                Date
              </Text>
            </View>
            <View style={[styles.headerContainerStyle , styles.time_slot]}>
              <Text variant="titleMedium" style={styles.headerTextStyle}>
                time
              </Text>
            </View>
            <View style={[styles.headerContainerStyle , styles.lecture_type]}>
              <Text variant="titleMedium" style={styles.headerTextStyle}>
                Lecture
              </Text>
            </View>
            <View style={[styles.headerContainerStyle , styles.action]}>
              <Text variant="titleMedium" style={styles.headerTextStyle}>
                Action
              </Text>
            </View>
          </DataTable.Header>
          <FlashList 
          data={modifyAttendanceList.slice(from , to)}
          estimatedItemSize={itemsPerPage}
          renderItem={tableRow}
          keyExtractor={(item, index) => item.attend_info}
          extraData={[ from , to]}
          ListEmptyComponent={<NoData text="No Attendance Record" />}
          
          />

            <DataTable.Pagination
            page={page}
            onPageChange={setPage}
            numberOfPages={Math.ceil( modifyAttendanceList.length / itemsPerPage)}
            showFastPaginationControls
            selectPageDropdownLabel={'Rows per page'}
            numberOfItemsPerPage={itemsPerPage}
            label={`${from + 1}-${to} of ${modifyAttendanceList.length}`}
          />

        </DataTable>
    </ScrollView>
    <ModifyBottomSheet attend_info={attendInfo}   open={openSheet} changeOpen={setOpenSheet }/>
    </BottomSheetModalProvider>
    </ScrollView>
    </GestureHandlerRootView>
  )
}

export default ModifyAttendance

type modifyRowProps = {
  topic_name:string|undefined ,
  lab_group:string|undefined ,
  date:string|undefined ,
  start_time:string|undefined ,
  end_time:string|undefined ,
  lecture:string|undefined ,
  isDeleting:boolean ,
  attend_info:string,
  openSheet:()=>void ,
  deleteItem:(attend_info:string)=>void ,
}

const ModifyAttendanceRow = ({topic_name , lab_group , date , start_time , end_time , lecture , isDeleting , attend_info, openSheet , deleteItem}:modifyRowProps)=>{

  const theme:themeType = useTheme()
  const styles = StyleSheet.create({
    rowContainerStyle:{
      justifyContent : "center" ,
    },
    rowStyle : {
      gap: 25,
      // borderTopWidth: 1,
      borderBottomWidth: 1,
      paddingHorizontal: 3,
      justifyContent : 'center',
      alignItems:"center"
    },
    rowText:{
      
    },
    sno:{
      width : 50,
    },
    topic:{
      width : 200,
    },
    lab_group:{
      width : 60,
      alignItems :"center",
    },
    date:{
      width : 100,
    },
    time_slot:{
      width : 150,
    },
    lecture_type:{
      width : 80,
    },
    action:{
      width : 220,
      flexDirection :"row",
    },
    button : {
      // flexBasis : "40%",
      width : 100,
      margin:5,
      justifyContent:"center"
    },
    buttonLabel:{
      fontSize : 12,
      textAlign :"left"
    },
  })

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  
  const animDelete = useCallback(()=>{
    opacity.value = withTiming(0 , {duration:1000})
    translateX.value = withTiming(300 , {duration:1000})
    deleteItem(attend_info);
  } , [])

  
  return(
    <Animated.View style={{opacity , transform:[{translateX}]}}  entering={FadeInDown.duration(500)} exiting={FadeOut.duration(250)}>
    <DataTable.Row style={styles.rowStyle} >
      <View style={[styles.rowContainerStyle , styles.topic]}>
        <Text variant="labelLarge" ellipsizeMode='tail' style={styles.rowText} numberOfLines={2}>
          {topic_name}
        </Text>
      </View>
      <View style={[styles.rowContainerStyle , styles.lab_group]}>
        <Text variant="labelLarge" ellipsizeMode='tail' style={[styles.rowText]} numberOfLines={2}>
          {lab_group}
        </Text>
      </View>
      <View style={[styles.rowContainerStyle , styles.date]}>
        <Text variant="labelLarge" ellipsizeMode='tail' style={styles.rowText} numberOfLines={2}>
          {date}
        </Text>
      </View>
      <View style={[styles.rowContainerStyle , styles.time_slot]}>
        <Text variant="labelLarge" ellipsizeMode='tail' style={styles.rowText} numberOfLines={2}>
          {`${start_time}-${end_time}`}
        </Text>
      </View>
      <View style={[styles.rowContainerStyle , styles.lecture_type]}>
        <Text variant="labelLarge" ellipsizeMode='tail' style={styles.rowText} numberOfLines={2}>
          {lecture}
        </Text>
      </View>
      <View style={[styles.rowContainerStyle , styles.action]}>
      <AnimatedOutlineButton color="yellow" onPress={openSheet} icon="edit-3" labelStyle={styles.buttonLabel} style={styles.button} >Modify</AnimatedOutlineButton>
      <AnimatedOutlineButton color="red" onPress={animDelete} icon="trash-2" labelStyle={styles.buttonLabel} textColor={theme.colors.red} style={styles.button} disabled={isDeleting} >Delete</AnimatedOutlineButton>
      </View>
      </DataTable.Row>
      </Animated.View>
  )
}





const ModifyBottomSheet = memo((props: { attend_info: string; open: boolean; changeOpen: Dispatch<SetStateAction<boolean>> }) => {
  const dimension = useWindowDimensions();
  const theme: themeType = useTheme();
  const dispatch = useDispatch();

  const [studentAttend, setStudentAttend] = useState<Set<number>>(new Set());
  const { studentList, queryState: { refetch, isFetching } } = useGetStudentByAttendInfoToModify(props.attend_info);

  const styles = StyleSheet.create({
    ...dataTableStyles,
    headerContainerStyle: {},
    headerTextStyle: {},
    rowText: {},
    rowContainerStyle: {
      justifyContent: 'center',
    },
    enroll: {
      width: '40%',
    },
    name: {
      width: '40%',
    },
    switch: {
      width: '15%',
      justifyContent: 'center',
    },
    scrollView: {
      gap: 30,
      paddingBottom: 30,
      alignItems: 'center',
      maxWidth: 600,
      alignSelf: 'center',
    },
    submitButton: {
      width: dimension.width - 60,
      maxWidth: 500,
    },
  });

  const sheetRef = useRef<BottomSheetModal>(null);

  const submitModifyAttendance = useCallback(() => {
    const modified_attendance = studentList.map(item => ({
      ...item,
      attend: studentAttend.has(item.student_computer_code),
    }));

    modifyStudentAttendanceMutation.mutate({ attendance: modified_attendance });
  }, [studentAttend, studentList]);

  const backdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  const [{ AllStudentCheckedModify: selectAllStudent }, setSelectAllStudent] = useMMKVStorage<any>("Staff", storage, { AllStudentCheckedModify: null });

  const selectStudentAttend = useCallback(
    (value: boolean, item: any) => {
      setStudentAttend(prev => {
        const newSet = new Set(prev);
        if (value) newSet.add(item.student_computer_code);
        else newSet.delete(item.student_computer_code);
        return newSet;
      });
    },
    []
  );

  const selectStudentAllAttend = useCallback((value: boolean) => {
    const newAttend = new Set<number>();
    if (value) {
      studentList.forEach(item => newAttend.add(item.student_computer_code));
    }
    setStudentAttend(newAttend);
    setSelectAllStudent(state => ({ ...state, AllStudentCheckedModify: value }));
    setTimeout(() => setSelectAllStudent(state => ({ ...state, AllStudentCheckedModify: null })), 1000);
  }, [studentList]);

  const { mutation: modifyStudentAttendanceMutation } = useMarkAttendanceToModify({
    onSuccess: (data) => {
      Toast.show("", {
        type: "success",
        text1: "Modify Complete",
        text2: "Attendance Modified Successfully",
      });

      sheetRef.current?.close();
    },
    onError: (error) => {
      console.error(error);
      Toast.show("", {
        type: "error",
        text1: "Modify Failed",
        text2: "some error occurred",
      });
    }
  });

  useEffect(() => {
    refetch();
    if (props.open) sheetRef.current?.present();
    else sheetRef.current?.close();
  }, [props.open]);

  useEffect(() => {
    const newAttend = new Set<number>();
    studentList.forEach(item => {
      if (item.attend) newAttend.add(item.student_computer_code);
    });
    setStudentAttend(newAttend);
  }, [studentList]);

  const completeCloseBottomSheet = useCallback(() => {
    setStudentAttend(new Set());
    props.changeOpen(false);
  }, []);

  const studentRow = useCallback(({ item }) => (
    <Animated.View entering={FadeInDown.duration(500)}>
      <DataTable.Row style={styles.rowStyle}>
        <View style={[styles.rowContainerStyle, styles.enroll]}>
          <Text variant="labelLarge" ellipsizeMode='tail' style={styles.rowText} numberOfLines={2}>
            {item.enrollment}
          </Text>
        </View>
        <View style={[styles.rowContainerStyle, styles.name]}>
          <Text variant="labelLarge" ellipsizeMode='tail' style={styles.rowText} numberOfLines={2}>
            {item.name}
          </Text>
        </View>
        <View style={[styles.rowContainerStyle, styles.switch]}>
          <Switch value={studentAttend.has(item.student_computer_code)} onValueChange={(value) => selectStudentAttend(value, item)} theme={theme} />
        </View>
      </DataTable.Row>
    </Animated.View>
  ), [studentList, studentAttend]);

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={[dimension.height / 2, dimension.height - 50]}
      enableDismissOnClose
      onDismiss={completeCloseBottomSheet}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.primary,
        width: 100,
        height: 5,
      }}
      backdropComponent={backdrop}
    >
      <BottomSheetScrollView contentContainerStyle={styles.scrollView}>
        <DataTable>
          <DataTable.Header style={styles.headerStyle}>
            <View style={[styles.headerContainerStyle, styles.enroll]}>
              <Text variant="titleMedium" style={styles.headerTextStyle}>
                Enrollment No.
              </Text>
            </View>
            <View style={[styles.headerContainerStyle, styles.name]}>
              <Text variant="titleMedium" style={styles.headerTextStyle}>
                Student Name
              </Text>
            </View>
            <View style={[styles.headerContainerStyle, styles.switch]}>
              <Switch value={studentList.every(item => studentAttend.has(item.student_computer_code))} onValueChange={selectStudentAllAttend} theme={theme}></Switch>
            </View>
          </DataTable.Header>
          <FlashList
            data={studentList}
            renderItem={studentRow}
            keyExtractor={(item, index) => `${index}`}
            extraData={studentAttend}
            ListEmptyComponent={isFetching ? <CustomLoading style={{ height: 500 }} /> : <NoData text="No Students" />}
          />
        </DataTable>
        <Chip>
          {studentAttend.size}/{studentList.length}
        </Chip>
        <Button mode="contained" loading={modifyStudentAttendanceMutation.isLoading} onPress={submitModifyAttendance} style={styles.submitButton}>Submit Attendance</Button>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});




const UncontrolledSwitchForAttendanceModify = memo(({onValueChange , theme , defaultValue  }:{onValueChange : (value:boolean)=>void , theme : themeType , defaultValue : boolean}) => {

  const [value , setValue] = useState(defaultValue);

  const [{AllStudentCheckedModify:selectAllStudent} ,setSelectAllStudent] = useMMKVStorage<any>("Staff"  , storage , {AllStudentCheckedModify:null})

  useEffect(  ()=>{
      if ( selectAllStudent !== null){
          setValue(selectAllStudent);
          onValueChange(selectAllStudent);
      }
  }, [selectAllStudent])


  const toggle = useCallback((switchValue)=>{
      setValue(switchValue);
      onValueChange(switchValue);
  }  , [value])

return (
  <Switch  value={value} theme={theme} onValueChange={toggle} />
)
})