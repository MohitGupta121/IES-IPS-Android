import { StyleSheet, View,TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import CMScard from '../../../components/cms_card'
import {Col, Row, Grid} from 'react-native-paper-grid';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Surface, useTheme } from 'react-native-paper';
import { themeType } from '../../../theme';
import { useQuery } from 'react-query';
import { studentApi } from '../../../api/API';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { studentActionTypes } from '../../../redux/student/types';
import {Text } from "react-native-paper";
import { useNavigation } from '@react-navigation/native';
import ProgressCustom from '../../../components/progressCustom';
import { RootState } from '../../../redux/store';

const StudentViewAttendence = () => {
    
  const theme: themeType = useTheme();


  const user = useSelector((store:RootState)=>store.common.User.user);
  const dispatch = useDispatch();

  const current_session = useSelector((store:RootState)=>store.common.AcademicSession?.current?.academic_session_id)

  const { isFetching } = useQuery(studentApi.studentCumulativeAttendance.name , ()=>studentApi.studentCumulativeAttendance.fetch({academic_session : current_session , computer_code : user.computer_code }) , {
    onSuccess : (data)=>{
      dispatch({type:studentActionTypes.CommulativeAttendance , payload:data});
    }
  });

  const attendance = useSelector((store:RootState)=>store.student.CummulativeAttendance);

  return (
      <CMScard>
        <View style={{alignItems: 'center', flex: 1, minWidth: 100}}>
          <ProgressCustom
            size={90}
            width={5}
            fill={
              isFetching
                ? 5
                : ((attendance?.present || 1) /
                    ((attendance?.present || 72) + (attendance?.absent || 0))) *
                  100
            }
            color="green">
            {fill => (
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                variant="labelMedium"
                style={{flexWrap: 'wrap', textAlign: 'center'}}>
                {attendance?.present || 0}
                {'\n'}Lecture
              </Text>
            )}
          </ProgressCustom>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{padding: 15, color: theme.colors.black}}>
            Present
          </Text>
        </View>
        <View style={{alignItems: 'center', flex: 1, minWidth: 100}}>
          <ProgressCustom
            size={90}
            width={5}
            fill={
              isFetching
                ? 5
                : ((attendance?.absent || 1) /
                    ((attendance?.present || 72) +
                      (attendance?.present || 0))) *
                  100
            }
            color="red">
            {fill => (
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                variant="labelMedium"
                style={{flexWrap: 'wrap', textAlign: 'center'}}>
                {attendance?.absent || 0}
                {'\n'}Lecture
              </Text>
            )}
          </ProgressCustom>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{padding: 15, color: theme.colors.black}}>
            Absent
          </Text>
        </View>
        <View style={{alignItems: 'center', flex: 1, minWidth: 100}}>
          <ProgressCustom
            size={90}
            width={5}
            fill={isFetching ? 5 : attendance?.total || 2}
            color="blue">
            {fill => (
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                variant="labelMedium"
                style={{flexWrap: 'wrap', textAlign: 'center'}}>
                {attendance?.total || 0}%{'\n'}Total
              </Text>
            )}
          </ProgressCustom>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{padding: 15, color: theme.colors.black}}>
            Overall
          </Text>
        </View>
      </CMScard>
  );
}

export default StudentViewAttendence

const styles = StyleSheet.create({})