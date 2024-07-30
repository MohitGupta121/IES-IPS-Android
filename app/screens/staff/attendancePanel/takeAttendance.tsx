import { ParamListBase, RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect  , useMemo , useCallback, useRef, useState, Dispatch, SetStateAction, memo} from 'react'
import { Button, Chip, DataTable, Text, TextInput, useTheme , Switch} from 'react-native-paper'
import { useQuery, QueryClient, useMutation } from 'react-query';
import { commonApi, staffApi } from '../../../api/API'
import { RootStackParamList } from '../../../routes/routes'
import { useDispatch, useSelector } from 'react-redux'
import { staffActionType } from '../../../redux/staff/types'
import { RootState } from '../../../redux/store'
import CustomLoading from '../../../components/customLoading'
import NoData from '../../../components/noData'
import { getTopicForAttendance } from '../../../api/staff/staffApi';
import CMScard from '../../../components/cms_card'
import { View, ScrollView, StyleSheet, useWindowDimensions, VirtualizedList } from 'react-native';
import { commonActionTypes } from '../../../redux/common/types'
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { themeType } from '../../../theme';
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import Icon from 'react-native-vector-icons/Feather';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import CalendarPicker from "react-native-calendar-picker";
import  {Toast}  from 'react-native-toast-notifications';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { BottomSheetModalRef } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetModalProvider/types';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FlashList } from '@shopify/flash-list';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { storage } from '../../../App';
import { reducerData } from '../../../redux/common/reducer';
import dataTableStyles from '../../../cmsStyles/dataTableStyles';
import ModelCalendar from '../../../components/modelCalendar';
import { useGetLectureType, useGetTimeSlot } from '../../../hooks/query/common';
import { useGetStudentForAttendance, useGetTopicForAttendance, useMarkAttendance } from '../../../hooks/query/staff';
import useCollapsibleCustomHeader from '../../../hooks/useCollapsibleHeader';


type formValues ={
  topic_id  : number | null ,
  time_slot : number[],
  lecture_type : number|null,
  group : string|null,
  topic_name : string|null,
  date : string | null ,
  students: {
    computer_code : number,
    attend : boolean,
  }[],
  faculty_computer_code : number | null,
  academic_session : number | null,
  batch_id : number | null,
  remark : string,

}

const formDefualtValues:formValues = {
  topic_id  : null,
  time_slot : [],
  lecture_type : null,
  group : null,
  topic_name : null,
  date : null ,
  students : [],
  faculty_computer_code : null ,
  academic_session : null,
  batch_id : null ,
  remark : ""
}

const formValidation = yup.object().shape({
  topic_id  : yup.number().required(),
  time_slot : yup.array().of(yup.number().defined()).required(),
  lecture_type : yup.number().required(),
  group : yup.string().required(),
  topic_name : yup.string().required(),
  date : yup.string().required() ,
  students : yup.array(yup.object().shape({
    computer_code : yup.number(),
    attend : yup.boolean()
  })).min(1).required(),
  faculty_computer_code : yup.number().required() ,
  academic_session : yup.number().required(),
  batch_id : yup.number().required() ,
  remark : yup.string()
}).required()

const TakeAttendance = () => {
  const params:{batch_id : number} = useRoute<any>().params
  const dispatch = useDispatch()
  const dimension = useWindowDimensions()
  const theme : themeType = useTheme();


  const attendanceForm = useForm<formValues>({
    defaultValues : formDefualtValues,
    //@ts-ignore
    resolver : yupResolver<formValues>(formValidation)
    
  })

  const styles = StyleSheet.create({
    cardStyle : {
      width: dimension.width - 30,
      // backgroundColor:'red',
      flexWrap : 'nowrap',
      flexDirection:'column',
      gap : 20

    },
    rootContainer:{
      flex :1 ,
    },
    fieldContainer :{
      gap : 20,
      alignSelf :"flex-start",
    },
    heading :{
      textAlign : "center",
      fontSize : 20
    },
    input :{
      width: 200
    },
    selectedTextStyle:{
      color : theme.colors.black,
    },
    itemTextStyle : {
      color : theme.colors.black

    },
    dropdown:{
      width : dimension.width - 60,
      maxWidth:760,
      backgroundColor : theme.colors.surfaceContainer,
      borderRadius : 5,
      padding : 10,
      paddingHorizontal : 15,
    },
    placeholder:{
      color : theme.colors.onPrimaryContainer,
      opacity : 0.6
    },
    inputSearch:{
      backgroundColor : theme.colors.surfaceContainer,
      borderRadius : 5,
      
    },
    dropdownConainter:{
      borderRadius : 5,
      maxHeight : dimension.height - 60,
    },
    disableStyle:{
      opacity: 0.5
    }
  })

  // console.log(params.batch_id)

  const {onScroll , headerHeight} = useCollapsibleCustomHeader();


  const {topicList} = useGetTopicForAttendance(params.batch_id);
  const {timeSlots} = useGetTimeSlot()
  const {lectureTypes} = useGetLectureType();
  const groups = useMemo(()=>([
    {label : "A" , value : "A"},
    {label : "B" , value : "B"},
    {label : "Both A and B" , value : "AB" },
  ]) ,[])

  const [{current:{academic_session_id:academic_session}} , setAcademicSession] = useMMKVStorage("AcademicSession" , storage , {current:{academic_session_id:0}});

  type User = Pick<reducerData['User'] , "user">
  const [ {user} , setUser ] = useMMKVStorage<User>("User" , storage , {user:{}});
  const faculty_computer_code = user.computer_code
  const multiSelectRef = useRef<any>(null)

  useEffect(()=>{
    attendanceForm.setValue('academic_session' , academic_session);
    attendanceForm.setValue('faculty_computer_code' , faculty_computer_code);
    attendanceForm.setValue('batch_id' , params.batch_id);
  } , [attendanceForm , academic_session , faculty_computer_code , params])

  
  const [sheetOpen , setSheetOpen] = useState(false)

  const slectedItem = useCallback((item , unSelect)=>(
    <Chip compact style={{margin : 5}}>
      {item.label}
    </Chip>
  ) , [])

  const lecture_type_value = attendanceForm.watch('lecture_type')

  useEffect( ()=>{
    if (lecture_type_value !== 2){
      attendanceForm.setValue('group' , "AB")
    }else{
      attendanceForm.setValue('group' , null)
      
    }
  }, [lecture_type_value])


  const changeDropdonwValue = useCallback((item:{label : string , value : any} , name)=>{
      attendanceForm.setValue(name , item.value)
  } , [])


  const changeMultiSelectValue = useCallback((values:number[] , name , onChange)=>{
    let new_values ;
    if (lecture_type_value === 2){
      let index = values[values.length-1];
      if (index === timeSlots.length) new_values = [index-1,index]
      else new_values = [index , index+1]
    }else {
      let index = values[values.length-1];
      new_values = [index];
      setTimeout(()=>multiSelectRef.current.close() , 100)
    }
    onChange(new_values);

  } , [lecture_type_value , timeSlots , lectureTypes , multiSelectRef])

  const validateFields = useCallback(()=>{
    attendanceForm.control._executeSchema([]).then(error=>{
      let errorFields = Object.keys(error.errors)

      if ( errorFields.find((item)=>item=="students"?false:item in formDefualtValues)) {
        Toast.show("",{
          type : 'error',
          text1 : "All fields are required",
          text2 : `${errorFields.map(item=>`${item} `)} are not provided`,
        })
      }else{
        setSheetOpen(true);
      }
    });
    
  } , [attendanceForm])


  // if ( isFetching ) return <CustomLoading/>

  // if ( isError ) return <NoData text="No studnets found or Error occured" />

  if(!topicList) return (<></>)

  return (
    <FormProvider {...attendanceForm}>
      <GestureHandlerRootView style={{flex:1}}>
            <BottomSheetModalProvider>
    <ScrollView onScroll={onScroll} style={styles.rootContainer} contentContainerStyle={{paddingBottom:50 , paddingTop:headerHeight}} >
      <CMScard style={styles.cardStyle}>
        <Text variant="labelLarge" style={styles.heading}>
          Attendance Details
        </Text>
        <View style={styles.fieldContainer}>
          <View style={{gap: 5}}>
            <Text>Topics</Text>
            <Controller
              control={attendanceForm.control}
              name="topic_id"
              render={({field: {onChange, onBlur, value, name}}) => (
                <Dropdown
                  mode="modal"
                  data={topicList.map(item => ({
                    label: item.topic_name,
                    value: item.topic_id,
                  }))}
                  labelField={'label'}
                  valueField={'value'}
                  searchField={'label'}
                  onChange={item => {
                    changeDropdonwValue(item, name);
                    attendanceForm.setValue("topic_name" , item.label);
                  }}
                  onBlur={onBlur}
                  //@ts-ignore
                  value={value}
                  itemTextStyle={styles.itemTextStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  style={styles.dropdown}
                  selectedTextProps={{numberOfLines: 1, ellipsizeMode: 'tail'}}
                  placeholder={'Topics'}
                  placeholderStyle={styles.placeholder}
                  search={true}
                  inputSearchStyle={styles.inputSearch}
                  searchPlaceholder="Search"
                  containerStyle={styles.dropdownConainter}
                  flatListProps={{initialNumToRender: 20 , windowSize : 2}}
                  
                  renderLeftIcon={() => (
                    <Icon
                      name="align-center"
                      style={{
                        color: theme.colors.onPrimaryContainer,
                        paddingRight: 5,
                      }}
                      size={20}
                    />
                  )}
                />
              )}
            />

            <View style={{gap: 5}}>
              <Text>Lecture Type</Text>
              <Controller
                control={attendanceForm.control}
                name="lecture_type"
                render={({field: {onChange, onBlur, value, name}}) => (
                  <Dropdown
                    mode="default"
                    data={lectureTypes.map((item:any) => ({
                      label: item.lecture_type,
                      value: item.lecture_id,
                    }))}
                    labelField={'label'}
                    valueField={'value'}
                    searchField={'label'}
                    onChange={item => {
                      changeDropdonwValue(item, name);
                      attendanceForm.resetField('time_slot');
                    }}
                    onBlur={onBlur}
                    //@ts-ignore
                    value={value}
                    itemTextStyle={styles.itemTextStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    style={styles.dropdown}
                    selectedTextProps={{
                      numberOfLines: 1,
                      ellipsizeMode: 'tail',
                    }}
                    placeholder={'Lecture Type'}
                    placeholderStyle={styles.placeholder}
                    containerStyle={styles.dropdownConainter}
                    flatListProps={{initialNumToRender: 20}}
                    renderLeftIcon={() => (
                      <Icon
                        name="edit"
                        style={{
                          color: theme.colors.onPrimaryContainer,
                          paddingRight: 5,
                        }}
                        size={20}
                        />
                    )}
                  />
                )}
              />
            </View>
          </View>
          <View style={{gap: 5}}>
            <Text>Time Slot</Text>
            <Controller
              control={attendanceForm.control}
              name="time_slot"
              render={({field: {onChange, onBlur, value, name}}) => (
                <MultiSelect
                  mode="modal"
                  data={timeSlots.map((item:any) => ({
                    label: `${item.start_time}-${item.end_time}`,
                    value: item.id,
                  }))}
                  ref={multiSelectRef}
                  labelField={'label'}
                  valueField={'value'}
                  searchField={'label'}
                  onChange={values =>
                    //@ts-ignore
                    changeMultiSelectValue(values, name, onChange)
                  }
                  onBlur={onBlur}
                  //@ts-ignore
                  value={value}
                  itemTextStyle={styles.itemTextStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  style={[
                    styles.dropdown,
                    !lecture_type_value ? styles.disableStyle : null,
                  ]}
                  selectedTextProps={{numberOfLines: 1, ellipsizeMode: 'tail'}}
                  placeholder={'Time Slot'}
                  placeholderStyle={styles.placeholder}
                  containerStyle={styles.dropdownConainter}
                  flatListProps={{initialNumToRender: 20}}
                  renderLeftIcon={() => (
                    <Icon
                      name="clock"
                      style={{
                        color: theme.colors.onPrimaryContainer,
                        paddingRight: 5,
                      }}
                      size={20}
                    />
                  )}
                  activeColor={theme.colors.container_background}
                  inside
                  renderSelectedItem={slectedItem}
                  confirmSelectItem
                  disable={!lecture_type_value}
                />
              )}
            />
          </View>
          <View style={{gap: 5}}>
            <Text>Group</Text>
            <Controller
              control={attendanceForm.control}
              name="group"
              render={({field: {onChange, onBlur, value, name}}) => (
                <Dropdown
                  mode="default"
                  data={lecture_type_value!==2?groups:groups.slice(0 ,2)}
                  labelField={'label'}
                  valueField={'value'}
                  searchField={'label'}
                  onChange={item => changeDropdonwValue(item, name)}
                  onBlur={onBlur}
                  value={value}
                  itemTextStyle={styles.itemTextStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  style={[styles.dropdown , lecture_type_value!==2?styles.disableStyle:null]}
                  selectedTextProps={{numberOfLines: 1, ellipsizeMode: 'tail'}}
                  placeholder={'Group'}
                  placeholderStyle={styles.placeholder}
                  containerStyle={styles.dropdownConainter}
                  flatListProps={{initialNumToRender: 20}}
                  disable={lecture_type_value !== 2}
                  renderLeftIcon={() => (
                    <Icon
                      name="edit"
                      style={{
                        color: theme.colors.onPrimaryContainer,
                        paddingRight: 5,
                      }}
                      size={20}
                    />
                  )}
                />
              )}
            />
          </View>
          <View style={{gap: 5}}>
            <Text>Date</Text>
            {/* <Controller
              control={attendanceForm.control}
              name="date"
              render={({field: {onChange, onBlur, value, name}}) => (
                <CalendarPicker 
                scrollable
                width={dimension.width-60}
                 onDateChange={onChange} 
                 scrollDecelarationRate={30}
                 selectedDayColor={theme.colors.container_background}
                 showDayStragglers
                 maxDate={new Date(Date.now())}
                 restrictMonthNavigation
                 />
              )}
            /> */}
            <Controller
              control={attendanceForm.control}
              name="date"
              render={({field: {onChange, onBlur, value, name}}) => (
                <ModelCalendar 
                width={dimension.width-60}
                 onChange={onChange} 
                //  scrollDecelarationRate={30}
                 selectedDayColor={theme.colors.container_background}
                 showDayStragglers
                 maxDate={new Date(Date.now())}
                 headerText='Select Date'
                 restrictMonthNavigation
                 />
              )}
            />
          </View>
          <View>
            <Button onPress={validateFields} mode='contained'>Select Students</Button>
          </View>
              <StudentListBottomSheet open={sheetOpen} changeOpen={setSheetOpen} batch_id={params.batch_id} />
        </View>
      </CMScard>
    </ScrollView>
          </BottomSheetModalProvider>
    </GestureHandlerRootView>
    </FormProvider>
  );
}

export default memo(TakeAttendance)


const StudentListBottomSheet = memo((props: { open: boolean; changeOpen: Dispatch<SetStateAction<boolean>>; batch_id: number }) => {
  const theme: themeType = useTheme();
  const dimension = useWindowDimensions();
  const attendaceForm = useFormContext<formValues>();
  const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  
  const [studentAttend, setStudentAttend] = useState<Set<number>>(new Set());
  const { studentList } = useGetStudentForAttendance(props.batch_id);

  const styles = StyleSheet.create({
    ...dataTableStyles,
    headerContainerStyle: {},
    headerTextStyle: {},
    rowText: {},
    rowContainerStyle: {
      justifyContent: "center",
    },
    enroll: {
      width: "40%",
    },
    name: {
      width: "40%",
    },
    switch: {
      width: "15%",
      justifyContent: "center",
    },
    scrollView: {
      gap: 30,
      paddingBottom: 30,
      alignItems: "center",
      maxWidth: 600,
      alignSelf: "center",
    },
    submitButton: {
      width: dimension.width - 60,
      maxWidth: 500,
    },
  });

  const { mutation: { mutate, isLoading } } = useMarkAttendance({
    onSuccess: (data) => {
      Toast.show("", {
        type: "success",
        text1: "Attendance Complete",
        text2: "Attendance Successfully Taken",
      });
      dispatch({ type: staffActionType.StudentsForAttendance, payload: [] });
      dispatch({ type: staffActionType.AttendanceTopics, payload: [] });
      dispatch({ type: commonActionTypes.TimeSlots, payload: [] });
      dispatch({ type: commonActionTypes.LectureTypes, payload: [] });

      navigator.popTo('Attendance Panel');
    },
    onError: (error) => {
      console.error(error);
      Toast.show("", {
        type: "error",
        text1: "Attendance Failed",
        text2: "some error occurred",
      });
    },
  });

  const submitAttendance = useCallback(() => {
    attendaceForm.setValue('students', studentList.map(item => ({
      computer_code: item.computer_code,
      attend: studentAttend.has(item.computer_code),
    })));

    mutate(attendaceForm.getValues());
  }, [studentAttend, attendaceForm]);

  useEffect(() => {
    if (props.open) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.close();
    }
  }, [props.open]);

  const completeCloseBottomSheet = useCallback(() => {
    setStudentAttend(new Set());
    props.changeOpen(false);
  }, []);

  const [{ AllStudentChecked: selectAllStudent }, setSelectAllStudent] = useMMKVStorage<any>("Staff", storage, { AllStudentChecked: null });

  const selectStudentAllAttend = useCallback((value) => {
    const newAttend = new Set<number>();
    if (value) {
      studentList.forEach(item => newAttend.add(item.computer_code));
    }
    setStudentAttend(newAttend);
    setSelectAllStudent(state => ({ ...state, AllStudentChecked: value }));
    setTimeout(() => setSelectAllStudent(state => ({ ...state, AllStudentChecked: null })), 1000);
  }, [studentList]);

  const selectStudentAttend = useCallback((value: boolean, item: any) => {
    setStudentAttend(prev => {
      const newSet = new Set(prev);
      if (value) {
        newSet.add(item.computer_code);
      } else {
        newSet.delete(item.computer_code);
      }
      return newSet;
    });
  }, []);

  const backdrop = useCallback((backdropProps: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop {...backdropProps} appearsOnIndex={0} disappearsOnIndex={-1} />
  ), []);

  const sheetRef = useRef<BottomSheetModal>(null);

  const studentRow = useCallback(({ item }) => (
    <Animated.View entering={FadeInUp.duration(500)}>
      <DataTable.Row style={styles.rowStyle}>
        <View style={[styles.rowContainerStyle, styles.enroll]}>
          <Text variant="labelLarge" ellipsizeMode='tail' style={styles.rowText} numberOfLines={2}>
            {item.enrollment_no}
          </Text>
        </View>
        <View style={[styles.rowContainerStyle, styles.name]}>
          <Text variant="labelLarge" ellipsizeMode='tail' style={styles.rowText} numberOfLines={2}>
            {item.student_name}
          </Text>
        </View>
        <View style={[styles.rowContainerStyle, styles.switch]}>
          <Switch value={studentAttend.has(item.computer_code)} onValueChange={(value)=>selectStudentAttend(value , item)} theme={theme}></Switch>
          {/* <UncontrolledSwitchForAttendance defaultValue={false} onValueChange={(value) => selectStudentAttend(value, item)} theme={theme} /> */}
        </View>
      </DataTable.Row>
    </Animated.View>
  ), [studentList, studentAttend]);

  if (!studentList) return <></>;

  return (
    <BottomSheetModal
      index={0}
      snapPoints={[dimension.height / 2, dimension.height - 50]}
      enableDismissOnClose
      handleIndicatorStyle={{
        backgroundColor: theme.colors.primary,
        width: 100,
        height: 5,
      }}
      onDismiss={completeCloseBottomSheet}
      backdropComponent={backdrop}
      ref={sheetRef}>

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
              <Switch value={studentList.every(item => studentAttend.has(item.computer_code))} onValueChange={selectStudentAllAttend} theme={theme}></Switch>
              {/* <UncontrolledSwitchForAttendance defaultValue={false} onChange={selectStudentAllAttend} theme={theme} /> */}
            </View>
          </DataTable.Header>
          <FlashList
            data={studentList}
            estimatedItemSize={studentList.length * 30}
            renderItem={studentRow}
            keyExtractor={(item, index) => `${index}`}
            extraData={studentAttend.size}
            ListEmptyComponent={<NoData text="No Students" />}
          />

        </DataTable>
        <Chip>
          {studentAttend.size}/{studentList.length}
        </Chip>

        <Button mode="contained" loading={isLoading} onPress={submitAttendance} style={styles.submitButton}>Submit Attendance</Button>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});





const UncontrolledSwitchForAttendance = memo(({onValueChange , theme , defaultValue , }:{onValueChange : (value:boolean)=>void , theme : themeType , defaultValue : boolean}) => {

  const [value , setValue] = useState(defaultValue);

  const [{AllStudentChecked:selectAllStudent} ,setSelectAllStudent] = useMMKVStorage<any>("Staff"  , storage , {AllStudentChecked:null})


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