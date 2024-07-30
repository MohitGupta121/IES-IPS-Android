import React, { useMemo, useRef, useState } from 'react';
import { Button, DataTable, Text, useTheme } from 'react-native-paper';
import CMScard from '../../../components/cms_card';
import { themeType } from '../../../theme';
import { useWindowDimensions, StyleSheet, View, ScrollView } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useCallback, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useMutation, useQuery } from 'react-query';
import staffApi from '../../../api/staff/staffApi';
import {Toast} from 'react-native-toast-notifications';
import NoData from '../../../components/noData';
import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import { yupResolver } from '@hookform/resolvers/yup';
import Icon from 'react-native-vector-icons/Feather';
import { Dropdown } from 'react-native-element-dropdown';
import { commonActionTypes } from '../../../redux/common/types';
import { commonApi } from '../../../api/API';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { storage } from '../../../App';
import dataTableStyles from '../../../cmsStyles/dataTableStyles';
import ModelCalendar from '../../../components/modelCalendar';
import { useGetLectureType } from '../../../hooks/query/common';
import { useGetViewAttendance } from '../../../hooks/query/staff';
import useCollapsibleCustomHeader from '../../../hooks/useCollapsibleHeader';


type viewAttendanceType = {
  batch_id : number | null,
  academic_session : number | null,
  from_date : string | null,
  to_date : string | null,
  lecture_type : number | null,
  
}

const viewAttendanceValues:viewAttendanceType = {
  batch_id : null ,
  academic_session : null ,
  from_date : null,
  to_date : null,
  lecture_type: null,
}

const viewAttendanceValidation= yup.object().shape({
  batch_id : yup.number().required() ,
  academic_session : yup.number().required() ,
  from_date : yup.string().required(),
  to_date : yup.string().required(),
  lecture_type : yup.number().required() ,
})

const ViewAttendance = () => {

  const theme:themeType  = useTheme();
  const dimension = useWindowDimensions();
  const viewAttendanceForm = useForm<viewAttendanceType>({
    defaultValues : viewAttendanceValues,
    resolver : yupResolver<viewAttendanceType>(viewAttendanceValidation)
  })
  const params:{batch_id : number} = useRoute<any>().params
  const [{current:{academic_session_id:academic_session}} , setAcademicSession] = useMMKVStorage("AcademicSession" , storage , {current:{academic_session_id:0}});

  const {lectureTypes} = useGetLectureType();

  const [studentsData , setStudentsData] = useState<any[]|null>(null);
  const {onScroll , headerHeight} = useCollapsibleCustomHeader();




  useEffect(()=>{
    viewAttendanceForm.setValue('academic_session' , academic_session)
    viewAttendanceForm.setValue('batch_id' , params?.batch_id)
  } , [params , academic_session])



  
  const styles = StyleSheet.create({
    cardStyle: {
      width: dimension.width - 30,
      flexWrap: 'nowrap',
      flexDirection: 'column',
      gap: 20,
    },
    fieldContainer :{
      gap : 20,
      alignSelf :"flex-start"
    },
    rootContainer:{
      flex :1 ,
    },
    heading :{
      textAlign : "center",
      fontSize : 20
    },
    datepickerContainer : {
      height : 70 , 
      // borderWidth : 2,
      borderRadius : 10, 
      // borderColor : theme.colors.backdrop,
      flex :1 ,
      // paddingHorizontal : 10,
      backgroundColor : theme.colors.surfaceContainer,
      justifyContent : "center" 
    },
    selectedTextStyle:{
      color : theme.colors.black,
    },
    itemTextStyle : {
      color : theme.colors.black

    },
    dropdown:{
      width : dimension.width - 60,
      backgroundColor : theme.colors.surfaceContainer,
      maxWidth:760,
      borderRadius : 5,
      padding : 10,
      paddingHorizontal : 15,
    },
    placeholder:{
      color : theme.colors.onPrimaryContainer,
      opacity : 0.6
    },
    dropdownConainter:{
      borderRadius : 5,
      maxHeight : dimension.height - 60,
    },
  });


  const [openModal , setOpenModal] = useState(false);

  const dismissModal = useCallback(()=>{
    setOpenModal(false);
  },[])

  const setDateRage  = useCallback((date , type)=>{
     if (type === 'START_DATE')viewAttendanceForm.setValue('from_date' , date);
     else viewAttendanceForm.setValue('to_date' , date);
   } , [viewAttendanceForm])


   const {mutation:{mutate , isLoading}} = useGetViewAttendance( {
    onSuccess : (data:any)=>{
      setStudentsData([...data.data])
      setOpenModal(true);
    }
   })


   const validateFields = useCallback(()=>{
      let formValues = viewAttendanceForm.getValues()
      const from_date = formValues.from_date && new Date(formValues.from_date)
      const to_date = formValues.to_date && new Date(formValues.to_date)
      viewAttendanceForm.control._executeSchema(['attendance']).then(error=>{
      let errorFields = Object.keys(error.errors)

      if ( errorFields.find((item)=>item=="students"?false:item in viewAttendanceValues)) {
        Toast.show("",{
          type : 'error',
          text1 : "Select a date Range",
          text2 : `${errorFields.map(item=>`${item} `)} are not provided`,
        })
      }
      if ( (from_date && to_date) && (from_date.getTime() > to_date.getTime()) ) {
        Toast.show("",{
          type : 'error',
          text1 : "Select a date Range",
          text2 : `To Date should be greater or same as From Date`,
        })
      }
      else{
      }
    });
    const req_data = viewAttendanceForm.getValues();
    //@ts-ignore
    mutate(req_data)
  } , [viewAttendanceForm])

  

  return (
    <GestureHandlerRootView style={{flex: 1}}>

        <BottomSheetModalProvider>
    <ScrollView style={styles.rootContainer} onScroll={onScroll} contentContainerStyle={{paddingBottom:50 , paddingTop:headerHeight}} >
      <CMScard style={styles.cardStyle}>
        <Text variant="labelLarge" style={styles.heading}>
          Attendance Filter
        </Text>
        <View style={styles.fieldContainer}>
        <View style={{gap: 5}}>
          <Text>From Date</Text>
          {/* <Controller
            control={viewAttendanceForm.control}
            name="from_date"
            render={({field: {onChange, onBlur, value, name}}) => (
              <CalendarPicker
                scrollable
                width={dimension.width - 60}
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
            control={viewAttendanceForm.control}
            name="from_date"
            render={({field: {onChange, onBlur, value, name}}) => (
              <ModelCalendar
                width={dimension.width - 60}
                onChange={onChange}
                // scrollDecelarationRate={30}
                selectedDayColor={theme.colors.container_background}
                showDayStragglers
                maxDate={new Date(Date.now())}
                restrictMonthNavigation
                headerText='From Date'
              />
            )}
          />
        </View>
        <View style={{gap: 5}}>
          <Text>To Date</Text>
          {/* <Controller
            control={viewAttendanceForm.control}
            name="to_date"
            render={({field: {onChange, onBlur, value, name}}) => (
              <CalendarPicker
                scrollable
                width={dimension.width - 60}
                onDateChange={onChange}
                scrollDecelarationRate={30}
                selectedDayColor={theme.colors.container_background}
                showDayStragglers
                maxDate={new Date(Date.now())}
                minDate={viewAttendanceForm.getValues().from_date || null}
                restrictMonthNavigation
              />
            )}
          /> */}
          <Controller
            control={viewAttendanceForm.control}
            name="to_date"
            render={({field: {onChange, onBlur, value, name}}) => (
              <ModelCalendar
                width={dimension.width - 60}
                onChange={onChange}
                scrollDecelarationRate={30}
                selectedDayColor={theme.colors.container_background}
                showDayStragglers
                maxDate={new Date(Date.now())}
                minDate={new Date(viewAttendanceForm.getValues().from_date!) || null}
                restrictMonthNavigation
                nextTitleStyle={{color:"black"}}
                headerText='To Date'
              />
            )}
          />
        </View>
        <View style={{gap: 5}}>
          <Text>Lecture Type</Text>
          <Controller
            control={viewAttendanceForm.control}
            name="lecture_type"
            render={({field: {onChange, onBlur, value, name}}) => (
              <Dropdown
                mode="modal"
                data={lectureTypes.map(item => ({
                  label: item.lecture_type,
                  value: item.lecture_id,
                }))}
                labelField={'label'}
                valueField={'value'}
                searchField={'label'}
                onChange={item => onChange(item.value)}
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
        <View>
          <Button
            onPress={validateFields}
            loading={isLoading}
            disabled={isLoading}
            mode="contained">
            Show
          </Button>
        </View>
      </View>
      </CMScard>
      
      <ViewAttendanceBottomsheet open={openModal} dismissModal={dismissModal} studentsData={studentsData} />

    </ScrollView>
    </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

export default ViewAttendance

type modalProps = {
  open : boolean,
  dismissModal : ()=>void,
  studentsData : any[]|null,
}

const ViewAttendanceBottomsheet = (props:modalProps)=>{

  const theme:themeType = useTheme();
  const window = useWindowDimensions();


  const styles = StyleSheet.create({
    ...dataTableStyles,
    headerContainerStyle:{
    },
    rowText:{
      
    },
    rowContainerStyle:{
      justifyContent : "center" ,
    },
    enroll : {
      width : 150,
    },
    name: {
      width : 200,
    },
    group:{
      width: 60,
      justifyContent:"center",
    },
    date: {
      width : 100,
    },
    time_slot: {
      width : 150,
    },
    status: {
      width : 70,
    },
    statusText : {
      fontWeight : "700",
    },
    tableContainer:{
      gap : 30,
      paddingHorizontal : 10,
      paddingBottom : 30,
      alignItems : "center",
      // maxWidth : 600,
      alignSelf:"center",
    },
    headingContainer:{
      paddingVertical:20,
    }
  })

  const Modalref = useRef<BottomSheetModal>(null);

  useEffect(()=>{
    if (props.open) Modalref.current?.present()
    // else Modalref.current?.dismiss()

  } , [props.open , Modalref])


  const backdrop = useCallback((backdropProps:BottomSheetBackdropProps)=>(
    <BottomSheetBackdrop {...backdropProps} onPress={props.dismissModal} appearsOnIndex={0} disappearsOnIndex={-1} />
  ) , [])


  const studentRow = useCallback(({item})=>(

    <Animated.View entering={FadeInDown.duration(500)}>
    <DataTable.Row style={styles.rowStyle} >
      <View style={[styles.rowContainerStyle , styles.enroll]}>
        <Text variant="labelLarge" ellipsizeMode='tail' style={styles.rowText} numberOfLines={2}>
          {item.enrollment_no}
        </Text>
      </View>
      <View style={[styles.rowContainerStyle , styles.name]}>
        <Text variant="labelLarge" ellipsizeMode='tail' style={styles.rowText} numberOfLines={2}>
          {item.student_name}
        </Text>
      </View>
      <View style={[styles.rowContainerStyle , styles.group]}>
        <Text variant="labelLarge" ellipsizeMode='tail' style={[styles.rowText]} numberOfLines={2}>
          {item.lab_group_name}
        </Text>
      </View>
      <View style={[styles.rowContainerStyle , styles.date]}>
        <Text variant="labelLarge" ellipsizeMode='tail' style={styles.rowText} numberOfLines={2}>
          {dayjs(item.date).format("DD-MM-YYYY")}
        </Text>
      </View>
      <View style={[styles.rowContainerStyle , styles.time_slot]}>
        <Text variant="labelLarge" ellipsizeMode='tail' style={styles.rowText} numberOfLines={2}>
          {`${item.time_slot.start_time}-${item.time_slot.end_time}`}
        </Text>
      </View>
      <View style={[styles.rowContainerStyle , styles.status]}>
        {item.attend ?(

        <Text variant="labelLarge" ellipsizeMode='tail' style={[styles.rowText , styles.statusText , {color:theme.colors.green}]} numberOfLines={2}>
          Present
        </Text>
        ):
        (
        <Text variant="labelLarge" ellipsizeMode='tail' style={[styles.rowText , styles.statusText , {color:theme.colors.red}]} numberOfLines={2}>
          Absent
        </Text>
      )}
      </View>
    </DataTable.Row>
    </Animated.View>
  ),[props.studentsData])


  const [page , setPage] = useState(0)
  const itemsPerPageList = useMemo(()=>[10 , 25 , 50 , 100] ,[])
  const [itemsPerPage,setItemsPerPage] = useState(itemsPerPageList[0]);
  
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, props.studentsData?.length||0);


  return (
    <BottomSheetModal
                ref = {Modalref}
                index={0}
                enableDismissOnClose
                snapPoints={[500 , window.height - 50]}
                onDismiss={props.dismissModal}
                handleIndicatorStyle={{
                    backgroundColor: theme.colors.primary,
                    width: 100,
                    height: 5,
                }}
                backdropComponent={backdrop}
                
                >
                  <BottomSheetScrollView nestedScrollEnabled>
                  <View style={styles.headingContainer}> 

                  <Text style={{textAlign:"center" , fontWeight:"700"}} variant='titleLarge'>Attendance</Text>
                  </View>
                  {props.studentsData === null ? null : props.studentsData.length === 0 ? (
        <NoData text={'No Students'} />
      ) : (
        <BottomSheetScrollView
          horizontal
          style={{alignSelf: 'center'}}
          contentContainerStyle={styles.tableContainer}>
          <DataTable style={{flex:1,flexShrink:1}}>
            <DataTable.Header style={styles.headerStyle}>
              <View style={[styles.enroll]}>
                <Text variant="titleMedium" style={styles.headerTextStyle}>
                  Enrollment No.
                </Text>
              </View>
              <View style={[styles.name]}>
                <Text variant="titleMedium" style={styles.headerTextStyle}>
                  Student Name
                </Text>
              </View>
              <View style={[styles.group]}>
                <Text variant="titleMedium" style={styles.headerTextStyle}>
                  Group
                </Text>
              </View>
              <View style={[styles.date]}>
                <Text variant="titleMedium" style={styles.date}>
                  Date
                </Text>
              </View>
              <View style={[styles.time_slot]}>
                <Text variant="titleMedium" style={styles.time_slot}>
                  Time
                </Text>
              </View>
              <View style={[styles.status]}>
                <Text variant="titleMedium" style={styles.status}>
                  Status
                </Text>
              </View>
            </DataTable.Header>
            <FlashList
              data={props.studentsData.slice(from, to)}
              estimatedItemSize={75}
              renderItem={studentRow}
              keyExtractor={(item, index) => `${index}`}
              extraData={props.studentsData}
              ListEmptyComponent={<NoData text="No Students" />}
            />

            <DataTable.Pagination
              page={page}
              onPageChange={setPage}
              numberOfPages={Math.ceil(props.studentsData.length / itemsPerPage)}
              showFastPaginationControls
              selectPageDropdownLabel={'Rows per page'}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={index =>
                setItemsPerPage(itemsPerPageList[index])
              }
              label={`${from + 1}-${to} of ${props.studentsData.length}`}
            />
          </DataTable>
        </BottomSheetScrollView>
      )}
      </BottomSheetScrollView>
  </BottomSheetModal>
  )
}