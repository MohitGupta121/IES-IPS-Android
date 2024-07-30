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

const FacilityFeedbackStatus = () => {
    const styles = StyleSheet.create({});
    const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    useBackHandler(()=>{
      navigator.pop();
      return true;
    })
    
      const [error ,setError] = useState('');
      const current_session = useSelector((store:RootState)=>store.common.AcademicSession.current.academic_session_id)
      const user  = useSelector((store:RootState)=>store.common.User.user);
      const dispatch = useDispatch();

    const {isFetching , isError} = useQuery( studentApi.studentFacilityFeedback.name , ()=>studentApi.studentFacilityFeedback.fetch(
        {
            computer_code : user.computer_code,
            academic_session : current_session,
        },
    ),
    {
        onSuccess : (data)=>{
            // console.log(data);
            dispatch({type : studentActionTypes.FacilityFeedback , payload : {...data}})
        },
        onError : (err:AxiosError)=>{
          console.error("from Facility",err.response?.data?.message)
          setError(err.response?.data?.message)
        }
    }
    )

    if ( isFetching ) return (
      <CustomLoading />
    )


    if ( isError ) return  (
      <CustomError text={error} />
    )


  return (
    <View style = {{marginTop : 50}}>
      <Text>FacilityFeedbackStatus</Text>
    </View>
  )
}

export default FacilityFeedbackStatus
