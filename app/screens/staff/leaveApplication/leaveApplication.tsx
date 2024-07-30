import {useAnimatedHeaderHeight} from '@react-navigation/native-stack';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {ScrollView, StyleSheet, useWindowDimensions} from 'react-native';
import {Button, DataTable, Text, useTheme} from 'react-native-paper';
import {View} from 'react-native-ui-lib';
import {Header} from 'react-native/Libraries/NewAppScreen';
import CMScard from '../../../components/cms_card';
import {TouchableOpacity} from '@gorhom/bottom-sheet';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes/routes';
import {themeType} from '../../../theme';
import {useNavigation} from '@react-navigation/native';
import {useBackHandler} from '@react-native-community/hooks';
import LeaveApply from './leaveApply';
import LeaveChart from './leaveChart';
import LeaveReport from './leaveReport';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import DataTableRow from 'react-native-paper/lib/typescript/components/DataTable/DataTableRow';
import Animated, {FadeInDown} from 'react-native-reanimated';
import dataTableStyles from '../../../cmsStyles/dataTableStyles';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {storage} from '../../../App';
import {useQuery} from 'react-query';
import {staffApi} from '../../../api/API';
import {reducerData} from '../../../redux/common/reducer';
import AnimatedOutlineButton from '../../../components/animatedOutlineButton';
import useCollapsibleCustomHeader from '../../../hooks/useCollapsibleHeader';
import { useAcceptFacultyAssignment, useGetFacultyAssingment, useGetLeaveBalance, useRejectFacultyAssignment } from '../../../hooks/query/staff';
import { useAcademicSession, useGetNameByComputerCode } from '../../../hooks/query/common';
import dayjs from 'dayjs';
import { userType } from '../../../constants';
import { Toast } from 'react-native-toast-notifications';

const LeaveApplication = () => {
  const theme: themeType = useTheme();
  const dimension = useWindowDimensions();

  const styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
    },
    scrollViewcontainer: {
      gap: 20,
      paddingVertical: 30,
      paddingBottom:100
    },
    cardStyle: {
      gap: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.2,
      shadowRadius: 13.16,

      elevation: 20,
      // width: dimension.width - 30,
      maxWidth: 500,
      alignItems: 'center',
      textAlign: 'center',
      paddingTop: 30,
      flexDirection: 'column',
      // marginVertical: 'auto',
      // backgroundColor: theme.colors.container_background
    },
    cardHeading: {
      fontWeight: '700',
      color: theme.colors.primary,
      textAlign: 'center',
    },
    button: {
      // flexBasis: "40%",
      width: 250,
      height: 50,
      borderRadius: 50,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonContainer: {
      // flexDirection: "row",
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      gap: 20,
      // padding: 10,
      paddingVertical: 20,
    },
    buttonLabel: {
      fontSize: 18,
      textAlign: 'center',
    },
    ...dataTableStyles,
    headerContainerStyle: {},
    rowText: {},
    rowContainerStyle: {
      justifyContent: 'center',
    },
    headingContainer: {
      paddingVertical: 20,
    },
    leaveType: {
      width: 150,
      alignItems: 'center',
      justifyContent: 'center',
    },
    remaining: {
      width: 150,
      alignItems: 'center',
      justifyContent: 'center',
    },
    updatesHeading:{
      fontWeight:'700',
      textAlign:"center"
    },
    couseAssignedCard:{
      flexDirection:"column",
      backgroundColor : theme.colors.surfaceContainerLow,
      width:dimension.width-20,
      elevation: 5,
      flex: 1,
      flexWrap: 'nowrap',
      paddingVertical: 20,
      alignItems: 'center',
    }
  });

  type User = Pick<reducerData['User'], 'user'>;
  const [{user}, setUser] = useMMKVStorage<User>('User', storage, {user: {}});
  const faculty_computer_code = user.computer_code;
  const {current_academic_session_id:current_session} = useAcademicSession();
  
  const {expand, headerHeight,onScroll} = useCollapsibleCustomHeader();
  
  useEffect(() => {
    expand();
  }, []);
  
  const {leaveBalance} = useGetLeaveBalance(current_session , user.computer_code);
  const {facultyAssingment} = useGetFacultyAssingment(user.computer_code);
  // console.log(facultyAssingment)
  // const navigation = useNavigation();
  const navigator =
  useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  useBackHandler(() => {
    navigator.pop();
    return true;
  });

  
  const leaveBalanceCard = useMemo(()=>(
    <CMScard style={styles.cardStyle}>
          <Text variant="headlineSmall" style={styles.cardHeading}>
            Leave Status
          </Text>
          <View>
            <DataTable>
              <DataTable.Header style={styles.headerStyle}>
                <View style={[styles.leaveType]}>
                  <Text variant="titleMedium" style={styles.headerTextStyle}>
                    Leave Type
                  </Text>
                </View>
                <View style={[styles.remaining]}>
                  <Text variant="titleMedium" style={styles.headerTextStyle}>
                    Remaining
                  </Text>
                </View>
              </DataTable.Header>
              <Animated.View entering={FadeInDown.duration(500)}>
                <DataTable.Row style={styles.rowStyle}>
                  <View style={[styles.rowContainerStyle, styles.leaveType]}>
                    <Text
                      variant="labelLarge"
                      ellipsizeMode="tail"
                      style={styles.rowText}
                      numberOfLines={2}>
                      CL
                    </Text>
                  </View>
                  <View style={[styles.rowContainerStyle, styles.remaining]}>
                    <Text
                      variant="labelLarge"
                      ellipsizeMode="tail"
                      style={styles.rowText}
                      numberOfLines={2}>
                      {leaveBalance.cl}
                    </Text>
                  </View>
                </DataTable.Row>
                <DataTable.Row style={styles.rowStyle}>
                  <View style={[styles.rowContainerStyle, styles.leaveType]}>
                    <Text
                      variant="labelLarge"
                      ellipsizeMode="tail"
                      style={styles.rowText}
                      numberOfLines={2}>
                      DL
                    </Text>
                  </View>
                  <View style={[styles.rowContainerStyle, styles.remaining]}>
                    <Text
                      variant="labelLarge"
                      ellipsizeMode="tail"
                      style={styles.rowText}
                      numberOfLines={2}>
                      {leaveBalance.dl}
                    </Text>
                  </View>
                </DataTable.Row>
                <DataTable.Row style={styles.rowStyle}>
                  <View style={[styles.rowContainerStyle, styles.leaveType]}>
                    <Text
                      variant="labelLarge"
                      ellipsizeMode="tail"
                      style={styles.rowText}
                      numberOfLines={2}>
                      EL
                    </Text>
                  </View>
                  <View style={[styles.rowContainerStyle, styles.remaining]}>
                    <Text
                      variant="labelLarge"
                      ellipsizeMode="tail"
                      style={styles.rowText}
                      numberOfLines={2}>
                      {leaveBalance.el}
                    </Text>
                  </View>
                </DataTable.Row>
                <DataTable.Row style={styles.rowStyle}>
                  <View style={[styles.rowContainerStyle, styles.leaveType]}>
                    <Text
                      variant="labelLarge"
                      ellipsizeMode="tail"
                      style={styles.rowText}
                      numberOfLines={2}>
                      OL
                    </Text>
                  </View>
                  <View style={[styles.rowContainerStyle, styles.remaining]}>
                    <Text
                      variant="labelLarge"
                      ellipsizeMode="tail"
                      style={styles.rowText}
                      numberOfLines={2}>
                      {leaveBalance.ol}
                    </Text>
                  </View>
                </DataTable.Row>
              </Animated.View>
            </DataTable>
          </View>
        </CMScard>
  ) , [leaveBalance])

  const updates = useMemo(()=>(
    <>
    {facultyAssingment?(<>
      {facultyAssingment.course_assigned.length||facultyAssingment.other_responsibility.length?(<View>
        <Text variant="headlineLarge" style={styles.updatesHeading} >Updates</Text>
        {facultyAssingment.course_assigned.length?(<CMScard style={styles.couseAssignedCard}>
          <Text variant="headlineSmall" style={styles.cardHeading}>Course Assigned</Text>
          {
            facultyAssingment.course_assigned.map((item , index)=>(
              <CourseAssignedRequestItem faculty={item} key={index} />
            ))
          }
        </CMScard>):null}
        {facultyAssingment.other_responsibility.length?(<CMScard style={styles.couseAssignedCard}>
          <Text variant="headlineSmall" style={styles.cardHeading}>Other Responsiblity</Text>
          {
            facultyAssingment.other_responsibility.map((item , index)=>(
              <CourseAssignedRequestItem faculty={item} key={index} other />
            ))
          }
        </CMScard>):null}

      </View>):null}
    </>):null}
    </>
  
) ,[facultyAssingment,dimension])


if (!leaveBalance) return null;

return (
  <GestureHandlerRootView style={{flex: 1}}>
      <ScrollView
        style={styles.rootContainer}
        onScroll={onScroll}
        contentContainerStyle={[styles.scrollViewcontainer , {paddingTop:headerHeight}]}>
        {leaveBalanceCard}
        <CMScard style={styles.cardStyle}>
          <Text variant="headlineSmall" style={styles.cardHeading}>
            Leave Management System
          </Text>
          <View style={styles.buttonContainer}>
            <AnimatedOutlineButton
              onPress={() => navigator.navigate('Leave Apply')}
              color="blue"
              icon="clipboard"
              labelStyle={styles.buttonLabel}
              style={styles.button}>
              Leave Apply
            </AnimatedOutlineButton>
            <AnimatedOutlineButton
              onPress={() => navigator.navigate('Leave Chart')}
              color="yellow"
              icon="bar-chart-2"
              labelStyle={styles.buttonLabel}
              style={styles.button}>
              Leave Chart
            </AnimatedOutlineButton>
            <AnimatedOutlineButton
              onPress={() => navigator.navigate('Leave Report')}
              color="green"
              icon="file-text"
              labelStyle={styles.buttonLabel}
              style={styles.button}>
              Leave Report
            </AnimatedOutlineButton>
          </View>
        </CMScard>
        {updates}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default memo(LeaveApplication);



type CourseAssignedRequestItemProps = {
  faculty:any,
  other?: boolean,
}

const CourseAssignedRequestItem = (props:CourseAssignedRequestItemProps)=>{
  const theme: themeType = useTheme();
  const dimension = useWindowDimensions();
  const styles = StyleSheet.create({
    cardStyle: {
      width: dimension.width - 60,
      maxWidth: 400,
      flexWrap: 'nowrap',
      flexDirection: 'column',
      gap: 10,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius:15,
      elevation: 10,
      backgroundColor: theme.colors.surfaceContainerLow,
      alignSelf:"center"
    },
    header: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignSelf: 'stretch',
    },
    detailsContainer: {
      width:dimension.width - 120,
      maxWidth: 340,
    },
    buttonConatiner:{
      flex:1,
      flexDirection:"row",
      width: dimension.width - 60,
      maxWidth: 400,
      justifyContent:"space-evenly"
    },
    left :{
      width:100
    },
    mid:{
      width:10
    },
    right:{
      flex:1
    },
    row:{
      gap:10,
      flexDirection:'row'
    }
  })
  
  type User = Pick<reducerData['User'], 'user'>;
  const [{user}, setUser] = useMMKVStorage<User>('User', storage, {user: {}});
  const faculty_computer_code = user.computer_code;
  
  const {facultyAssingment , queryState:{refetch}} = useGetFacultyAssingment(user.computer_code);

  const {mutation:acceptMutation} = useAcceptFacultyAssignment({
    onSuccess : (data)=>{
      Toast.show("", {
        type: "success",
        text1: "Accepted Successfully",
        text2: "Accepted the Assignemnt",
      });
      refetch();
    },
    onError : (error)=>{
      Toast.show("", {
        type: "error",
        text1: "Failed to Accept",
        text2: "some error occurred",
      });
      refetch();
    }
  });
  const {mutation:rejectMutation} = useRejectFacultyAssignment({
    onSuccess : (data)=>{
      Toast.show("", {
        type: "success",
        text1: "Rejected Successfully",
        text2: "Rejected the Assignemnt",
      })
      refetch();
    },
    onError : (error)=>{
      Toast.show("", {
        type: "error",
        text1: "Failed to Reject",
        text2: "some error occurred",
      });
      refetch();
    }
  });
  
  
  const onAccept = useCallback(()=>{
    console.log(props.faculty.assign_faculty_id);
    acceptMutation.mutate({assign_faculty_id:props.faculty.assign_faculty_id});
  } , [acceptMutation , props])
  
  
  const onReject = useCallback(()=>{
    console.log(props.faculty.assign_faculty_id);
    rejectMutation.mutate({assign_faculty_id:props.faculty.assign_faculty_id});
  } , [rejectMutation , props])
  
  
  const details = useMemo(()=>(
    <>
    {props.other?(
      <View style={styles.detailsContainer}>
          <View style={styles.row}>
            <View style={styles.left} >
              <Text>Responsiblity</Text>
            </View>
            <View style={styles.mid} >
              <Text>:</Text>
            </View>
            <View style={styles.right} >
              <Text>{props.faculty.other_responsibility}</Text>
            </View>
          </View>
        </View>
    ):(
      <View style={styles.detailsContainer}>
      <View style={styles.row}>
        <View style={styles.left} >
          <Text>Department</Text>
        </View>
        <View style={styles.mid} >
          <Text>:</Text>
        </View>
        <View style={styles.right} >
          <Text>{props.faculty.assigned_class_dept}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.left} >
          <Text>Type</Text>
        </View>
        <View style={styles.mid} >
          <Text>:</Text>
        </View>
        <View style={styles.right} >
          <Text>{props.faculty.lecture_type}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.left} >
          <Text>Time Slot</Text>
        </View>
        <View style={styles.mid} >
          <Text>:</Text>
        </View>
        <View style={styles.right} >
          <Text>{`${props.faculty.start_time}-${props.faculty.end_time}`}</Text>
        </View>
      </View>
    </View>
    )}
    </>
  ) , [props])
  return (
    <Animated.View>
      <CMScard style={styles.cardStyle}>
        <View style={styles.header}>
          <Text variant="titleMedium">{props.faculty.request_faculty_name}</Text>
          <Text variant="titleSmall" style={{color: theme.colors.backdrop}}>
            {dayjs(props.faculty.faculty_date).format('DD-MM-YYYY')}
          </Text>
        </View>
        {details}

        <View style={styles.buttonConatiner}>
          <AnimatedOutlineButton
            icon="x"
            onPress={onReject}
            disabled={acceptMutation.isLoading||rejectMutation.isLoading}
            style={{marginTop: 10}}
            color="red">
            Remove
          </AnimatedOutlineButton>
          <AnimatedOutlineButton
            icon="check"
            onPress={onAccept}
            disabled={acceptMutation.isLoading||rejectMutation.isLoading}
            style={{marginTop: 10}}
            color="blue">
            Accept
          </AnimatedOutlineButton>
        </View>
      </CMScard>
    </Animated.View>
  )
}
