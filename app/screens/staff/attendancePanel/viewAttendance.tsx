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
  const academic_session = useSelector((store:RootState)=>store.common.AcademicSession.current.academic_session_id)
  const lectureTypes = useSelector((store:RootState)=>store.common.LectureTypes)||[]
  const dispatch = useDispatch();

  const {isFetching:isFetchingLectureTypes , isError:isErrorLectureTypes } = useQuery(commonApi.getLectureType.name ,()=>commonApi.getLectureType.fetch() , {
    onSuccess : (data:any)=>{
      dispatch({type : commonActionTypes.LectureTypes , payload : data})
    }
  })

  const [studentsData , setStudentsData] = useState<any[]|null>(null);

  const dateInputRef = useRef(null)

  const [page , setPage] = useState(0)
  const itemsPerPageList = useMemo(()=>[10 , 25 , 50 , 100] ,[])
  const [itemsPerPage,setItemsPerPage] = useState(itemsPerPageList[0]);
  
  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, studentsData?.length||0);

  useEffect(()=>{
    viewAttendanceForm.setValue('academic_session' , academic_session)
    viewAttendanceForm.setValue('batch_id' , params?.batch_id)
  } , [params , academic_session])



  
  const styles = StyleSheet.create({
    headerStyle: {
      // borderTopWidth: 1,
      borderBottomWidth: 2,
      height: 50,
      alignItems: 'center',
      justifyContent:"center",
      paddingHorizontal: 3,
    },
    cardStyle : {
      width: dimension.width - 30,
      flexWrap : 'nowrap',
      flexDirection:'column',
      gap : 20

    },
    rootContainer:{
      marginTop : 50,
      flex :1 ,
    },
    heading :{
      textAlign : "center",
      fontSize : 20
    },
    headerTextStyle:{
      
    },
    rowStyle : {
      gap: 25,
      // borderTopWidth: 1,
      borderBottomWidth: 1,
      paddingHorizontal: 3,
      justifyContent : 'center',
      alignItems:"center"
    },
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
      padding : 20,
      alignSelf:"center",
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

  const scrollViewRef = useRef<ScrollView>(null);

  const setDateRage  = useCallback((date , type)=>{
     if (type === 'START_DATE')viewAttendanceForm.setValue('from_date' , date);
     else viewAttendanceForm.setValue('to_date' , date);
   } , [viewAttendanceForm])


   const {mutate , isLoading } = useMutation(staffApi.getViewAttendance.fetch , {
    onSuccess : (data)=>{
      setStudentsData([...data.data])
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

  const studentRow = useCallback(({item})=>(

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
  ),[studentsData])


  return (
    <ScrollView style={styles.rootContainer}>
      <CMScard style={styles.cardStyle}>
        <Text variant="labelLarge" style={styles.heading}>
          Attendance Filter
        </Text>
        <View style={{gap: 5}}>
          <Text>From Date</Text>
          <Controller
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
          />
        </View>
        <View style={{gap: 5}}>
          <Text>To Date</Text>
          <Controller
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
      </CMScard>
      {studentsData === null ? null : studentsData.length === 0 ? (
        <NoData text={'No Students'} />
      ) : (
        <ScrollView
          horizontal
          ref={scrollViewRef}
          style={{alignSelf: 'center'}}
          contentContainerStyle={styles.tableContainer}>
          <DataTable>
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
              data={studentsData.slice(from, to)}
              estimatedItemSize={75}
              renderItem={studentRow}
              keyExtractor={(item, index) => `${index}`}
              extraData={studentsData}
              ListEmptyComponent={<NoData text="No Students" />}
            />

            <DataTable.Pagination
              page={page}
              onPageChange={setPage}
              numberOfPages={Math.ceil(studentsData.length / itemsPerPage)}
              showFastPaginationControls
              selectPageDropdownLabel={'Rows per page'}
              numberOfItemsPerPage={itemsPerPage}
              onItemsPerPageChange={index =>
                setItemsPerPage(itemsPerPageList[index])
              }
              label={`${from + 1}-${to} of ${studentsData.length}`}
            />
          </DataTable>
        </ScrollView>
      )}
    </ScrollView>
  );
}

export default ViewAttendance