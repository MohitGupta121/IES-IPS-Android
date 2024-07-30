import { BackHandler, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useQuery } from 'react-query';
import { studentApi } from '../../../api/API';
import { useDispatch, useSelector } from 'react-redux';
import { studentActionTypes } from '../../../redux/student/types';
import CustomLoading from '../../../components/customLoading';
import NoData from '../../../components/noData';
import CustomError from '../../../components/customError';
import { useBackHandler } from '@react-native-community/hooks';
import { RootState } from '../../../redux/store';
import { AxiosError } from 'axios';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../../../routes/routes';
import { reducerData } from '../../../redux/common/reducer';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { commonActionTypes } from '../../../redux/common/types';
import { storage } from '../../../App';
import { useAcademicSession } from '../../../hooks/query/common';
import { useStudentFacilityFeedback } from '../../../hooks/query/student';

const FacilityFeedbackStatus = () => {
    const styles = StyleSheet.create({});
    const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    useBackHandler(()=>{
      navigator.pop();
      return true;
    })
    
      const [error ,setError] = useState('');
      const {current_academic_session_id:current_session} = useAcademicSession();

      type User = Pick<reducerData['User'], 'user'>;
      const [ {user} , setUser ] = useMMKVStorage<User>("User" , storage , {user:{}});
      const dispatch = useDispatch();
      const {feedbackData , queryStatus:{isFetching , isError}} = useStudentFacilityFeedback(current_session ,user.computer_code);
    

    if ( isFetching ) return (
      <CustomLoading />
    )


    if ( isError ) return  (
      <CustomError text="No Feedback Generate or Some Error Occured" />
    )


  return (
    <View style = {{marginTop : 50}}>
      <Text>FacilityFeedbackStatus</Text>
    </View>
  )
}

export default FacilityFeedbackStatus
