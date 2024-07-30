import React, { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import { Button, Chip, DataTable, Switch, Text, useTheme } from 'react-native-paper'
import { themeType } from '../../../theme'
import { useDispatch, useSelector } from 'react-redux';
import { LayoutAnimation, LayoutAnimationConfig, Platform, ScrollView, StyleSheet, UIManager, useWindowDimensions } from 'react-native';
import { useMutation, useQuery } from 'react-query';
import staffApi from '../../../api/staff/staffApi';
import { useNavigation, useRoute } from '@react-navigation/native';
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
import { useImageDimensions } from '@react-native-community/hooks';
import {Toast} from 'react-native-toast-notifications';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const ModifyAttendance = () => {

  const theme:themeType  = useTheme();
  const dispatch = useDispatch();
  const params:{batch_id : number} = useRoute<any>().params
  const dimension  = useWindowDimensions()
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
    cardStyle : {
      width: dimension.width - 30,
      flexWrap : 'nowrap',
      flexDirection:'column',
      gap : 20,

    },
    rootContainer:{
      marginTop : 50,
      flex :1 ,
    },
    heading :{
      textAlign : "center",
      fontSize : 20
    },
    headerStyle: {
      // borderTopWidth: 1,
      borderBottomWidth: 2,
      height: 50,
      alignItems: 'center',
      justifyContent:"center",
      paddingHorizontal: 3,
    },
    headerContainerStyle:{
    },
    headerTextStyle:{
      // textAlign : "center"
    },
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
    },
    buttonLabel:{
      fontSize : 12,
      textAlign :"left"
    },
    tableContainer:{
      padding : 20,
      
      },
      })
      
      if (Platform.OS === 'android') {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
          UIManager.setLayoutAnimationEnabledExperimental(true);
          }
          }
          
          const { isLoading , refetch } = useQuery(staffApi.getAttendanceToModify.name , ()=>staffApi.getAttendanceToModify.fetch({batch_id : params.batch_id}) , {
            onSuccess : (data)=> {
     LayoutAnimation.configureNext(layoutAnimConfig);
    dispatch({type : staffActionType.ModifyAttendance , payload : [...data]});
  },
})
const {isFetching:isFetchingTopic , isError:isErrorTopic } = useQuery(staffApi.getTopicForAttendance.name ,()=>staffApi.getTopicForAttendance.fetch({
  batch_id : params?.batch_id
}) , {
  onSuccess : (data:any)=>{
    dispatch({type : staffActionType.AttendanceTopics , payload : data.data})
  }
  })
  const {isFetching:isFetchingTimeSlot , isError:isErrorTimeSlot } = useQuery(commonApi.getTimeSlot.name ,()=>commonApi.getTimeSlot.fetch() , {
    onSuccess : (data:any)=>{
      dispatch({type : commonActionTypes.TimeSlots , payload : data})
    }
  })
  const {isFetching:isFetchingLectureTypes , isError:isErrorLectureTypes } = useQuery(commonApi.getLectureType.name ,()=>commonApi.getLectureType.fetch() , {
    onSuccess : (data:any)=>{
      dispatch({type : commonActionTypes.LectureTypes , payload : data})
    }
  })
  
  const deleteAttendanceMutation = useMutation(staffApi.deleteAttendance.fetch , {
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
  
  
  const topicList = useSelector((store:RootState)=>store.staff.AttendanceTopics)||[]
  const timeSlots = useSelector((store:RootState)=>store.common.TimeSlots)||[]
  const lectureTypes = useSelector((store:RootState)=>store.common.LectureTypes)||[]
  const modifyAttendanceList = useSelector((store:RootState)=>store.staff.ModifyAttendance);

  const [page , setPage] = useState(0);
  const itemsPerPage = 10 ;
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, modifyAttendanceList?.length||0);

  const [attendInfo , setAttendInfo] = useState<string>('')

  const [openSheet , setOpenSheet] = useState(false)


  const openAttendanceSheet = useCallback((attend_info : string)=>{
    setAttendInfo(attend_info)
    setOpenSheet(true)
  } , [attendInfo])


  
  
  
  
  const tableRow = useCallback(({item})=>{
    const topic_name = topicList.find(topic=>topic.topic_id===item.topic)?.topic_name
    const date = dayjs(item.date).format("DD-MM-YYYY")
    const start_time = timeSlots.find(time=>time.id === item.time_slot_id)?.start_time
    const end_time = timeSlots.find(time=>time.id === item.time_slot_id)?.end_time
    const lecture = lectureTypes.find(lecture=>lecture.lecture_id===item.lecture_type)?.lecture_type
    return (
    <DataTable.Row style={styles.rowStyle} >
      {/* <View style={[styles.rowContainerStyle , styles.sno]}>
        <Text variant="labelLarge" ellipsizeMode='tail' style={styles.rowText} numberOfLines={2}>
        {item.index + 1}
        </Text>
      </View> */}
      <View style={[styles.rowContainerStyle , styles.topic]}>
        <Text variant="labelLarge" ellipsizeMode='tail' style={styles.rowText} numberOfLines={2}>
          {topic_name}
        </Text>
      </View>
      <View style={[styles.rowContainerStyle , styles.lab_group]}>
        <Text variant="labelLarge" ellipsizeMode='tail' style={[styles.rowText]} numberOfLines={2}>
          {item.lab_group}
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
      <TouchableOpacity onPress={()=>openAttendanceSheet(item.attend_info)} ><Button icon="edit-3" labelStyle={styles.buttonLabel} textColor={theme.colors.yellow} style={[styles.button,{borderColor : theme.colors.yellow , backgroundColor : theme.colors.container_yellow}]} mode="outlined" >Modify</Button></TouchableOpacity>
      <TouchableOpacity onPress={()=>deleteAttendanceMutation.mutate({attend_info : item.attend_info})} ><Button icon="trash-2" labelStyle={styles.buttonLabel} textColor={theme.colors.red} style={[styles.button,{borderColor : theme.colors.red , backgroundColor : theme.colors.container_red}]} mode="outlined" disabled={deleteAttendanceMutation.isLoading} >Delete</Button></TouchableOpacity>
      </View>
      </DataTable.Row>
  )
},[modifyAttendanceList , timeSlots , topicList , lectureTypes])

  if (isLoading ) return <CustomLoading />
  
  return (<ScrollView  contentContainerStyle={styles.rootContainer}>
    <GestureHandlerRootView style={{flex  : 1}}>
    <BottomSheetModalProvider>
    <CMScard style={styles.cardStyle}>
        <Text variant="labelLarge" style={styles.heading}>
          Modify Attendance
        </Text>
      </CMScard>
    <ScrollView horizontal style={{alignSelf : "center"}} contentContainerStyle={styles.tableContainer} >
      <DataTable>
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
          estimatedItemSize={75}
          renderItem={tableRow}
          keyExtractor={(item, index) => `${index}`}
          extraData={modifyAttendanceList?.length}
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
    </GestureHandlerRootView>
    </ScrollView>
  )
}

export default ModifyAttendance





const ModifyBottomSheet = (props:{attend_info : string , open:boolean , changeOpen: Dispatch<SetStateAction<boolean>> }) => {
  const dimension = useWindowDimensions();
  const theme:themeType  = useTheme();

  const dispatch = useDispatch();
  
  const styles = StyleSheet.create({
    headerStyle: {
      // borderTopWidth: 1,
      borderBottomWidth: 2,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 3,
    },
    rowStyle: {
      gap: 25,
      // borderTopWidth: 1,
      borderBottomWidth: 1,
      paddingHorizontal: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
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
  const studentAttend  = useRef(new Set());
  const [studentList, setStudentList] = useState<
    {
      attend_record_id: string;
      student_computer_code: number;
      attend_info: string;
      attend: boolean;
      name: string;
      enrollment: string;
    }[]
  >([]);


  const submitModifyAttendance = useCallback(()=>{

      let modified_attendance:{
        attend_record_id: string;
        student_computer_code: number;
        attend_info: string;
        attend: boolean;
        name: string;
        enrollment: string;
      }[] = [];

      studentList.map(item=>{
        if (studentAttend.current.has(item.student_computer_code)) modified_attendance.push({...item , attend : true })
        else modified_attendance.push({...item , attend : false })
      })

      modifyStudentAttendanceMutation.mutate({attendance : modified_attendance})

  } , [studentAttend.current.size , studentList])
                
                
  const backdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  const selectStudentAttend = useCallback(
    (value: boolean, item: any) => {
      // console.log(studentAttend.current);
      if (value) studentAttend.current.add(item.student_computer_code);
      else studentAttend.current.delete(item.student_computer_code);
    },
    [studentAttend.current],
  );
  const selectStudentAllAttend = useCallback((value)=>{
    if(value) studentList.map(item=>{
      studentAttend.current.add(item.student_computer_code)
    })
    else studentAttend.current.clear();
    dispatch({type : staffActionType.AllStudentCheckedModify , payload : value})
    setTimeout(()=>dispatch({type : staffActionType.AllStudentCheckedModify , payload : null}) , 1000)

  }, [studentAttend.current])

    
    
    const { isLoading , refetch } = useQuery(staffApi.getStudentByAttendInfoToModify.name , ()=>staffApi.getStudentByAttendInfoToModify.fetch({attend_info : props.attend_info}) , {
      cacheTime : 0,
      onSuccess : (data:any)=>{
        data.data.map(item=>item.attend?studentAttend.current.add(item.student_computer_code):null)
        setStudentList(data.data)
    }
  })

  const modifyStudentAttendanceMutation = useMutation(staffApi.markAttendanceToModify.fetch , {
    onSuccess:(data)=>{
      Toast.show("",{
        type: "success",
        text1 : "Modifiy Complete",
        text2 : "Attendance Modified Successfully",
      })

      sheetRef.current?.close();
      
    },
    onError : (error)=>{
      console.error(error);
      Toast.show("",{
        type: "error",
        text1 : "Modify Failed",
        text2 : "some error occured",
      })
    }
  
  });


  // useEffect( ()=>{console.log(studentAttend.current)}, [studentAttend.current.size])
  
  useEffect(()=>{
    refetch();
    if ( props.open) sheetRef.current?.present();
    else sheetRef.current?.close();
    } , [props.open])

  const completeCloseBottomSheet = useCallback(()=>{
    studentAttend.current.clear();
    props.changeOpen(false);
  } , [])


  const studentRow = useCallback(({item})=>(

    <DataTable.Row style={styles.rowStyle} >
      <View style={[styles.rowContainerStyle , styles.enroll]}>
        <Text variant="labelLarge" ellipsizeMode='tail' style={styles.rowText} numberOfLines={2}>
          {item.enrollment}
        </Text>
      </View>
      <View style={[styles.rowContainerStyle , styles.name]}>
        <Text variant="labelLarge" ellipsizeMode='tail' style={styles.rowText} numberOfLines={2}>
          {item.name}
        </Text>
      </View>
      <View style={[styles.rowContainerStyle , styles.switch]}>
        {/* <Switch value={studentAttend.current.has(item.computer_code)} onValueChange={(value)=>selectStudentAttend(value , item)} theme={theme}></Switch> */}
        <UncontrolledSwitchForAttendanceModify defaultValue={studentAttend.current.has(item.student_computer_code)} onValueChange={(value)=>selectStudentAttend(value , item)}  theme={theme} />
      </View>
    </DataTable.Row>
  ),[studentList , studentAttend.current])





  return (
    <BottomSheetModal
    ref={sheetRef}
    // index={-1}
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
            <View style={[styles.headerContainerStyle , styles.enroll]}>
              <Text variant="titleMedium" style={styles.headerTextStyle}>
                Enrollment No.
              </Text>
            </View>
            <View style={[styles.headerContainerStyle , styles.name]}>
              <Text variant="titleMedium" style={styles.headerTextStyle}>
                Student Name
              </Text>
            </View>
            <View style={[styles.headerContainerStyle , styles.switch]}>
              <Switch value={studentList.every(item=>studentAttend.current.has(item.student_computer_code))} onValueChange={selectStudentAllAttend} theme={theme}></Switch>
              {/* <UncontrolledSwitchForAttendance defaultValue={false} onChange={selectStudentAllAttend} theme={theme} /> */}
            </View>
          </DataTable.Header>
          <FlashList 
          data={studentList}
          renderItem={studentRow}
          keyExtractor={(item, index) => `${index}`}
          extraData={studentAttend.current.size}
          ListEmptyComponent={<NoData text="No Students" />}
          // getItemCount={()=>studentList.length}
          // getItem={(data , index)=>studentList[index]}
          
          />

        </DataTable>
        <Chip>
          {studentAttend.current.size}/{studentList.length}
        </Chip>

        <Button mode="contained" loading={modifyStudentAttendanceMutation.isLoading} onPress={submitModifyAttendance} style={styles.submitButton}>Submit Attendance</Button>

      </BottomSheetScrollView>

    </BottomSheetModal>
  )
}


const UncontrolledSwitchForAttendanceModify = ({onValueChange , theme , defaultValue  }:{onValueChange : (value:boolean)=>void , theme : themeType , defaultValue : boolean}) => {

  const [value , setValue] = useState(defaultValue);

  const selectAllStudent = useSelector((store:RootState)=>store.staff.AllStudentCheckedModify)

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
}