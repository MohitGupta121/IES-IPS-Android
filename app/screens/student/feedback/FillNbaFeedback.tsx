import { BackHandler, StyleSheet, View , ScrollView} from 'react-native'
import React, { useEffect, useState } from 'react'
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler'
import { Button, Text, useTheme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { themeType } from '../../../theme';
import { useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { Formik, FormikFormProps, FormikProps } from "formik";
import CMScard from '../../../components/cms_card';
import { Rating, AirbnbRating } from 'react-native-ratings';
import studentApi, { studentInsertNbaFeedback } from '../../../api/student/studentApi';
import { useMutation } from 'react-query';
import { useBackHandler } from '@react-native-community/hooks';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../../../routes/routes';
import { RootState } from '../../../redux/store';
import { reducerData } from '../../../redux/common/reducer';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { commonActionTypes } from '../../../redux/common/types';
import { storage } from '../../../App';
import useCollapsibleCustomHeader from '../../../hooks/useCollapsibleHeader';
import { useStudentInsertNbaFeedback } from '../../../hooks/query/student';
import { useAcademicSession } from '../../../hooks/query/common';

const FillNbaFeedback = () => {
    
    const window = useWindowDimensions();
    const styles = StyleSheet.create({
      container: {
        minHeight: window.height - 100,
      },
    });
    const theme:themeType = useTheme();
    const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    useBackHandler(()=>{
      navigator.pop();
      return true;
    })
    
    const {current_academic_session_id:current_session} = useAcademicSession();

    type User = Pick<reducerData['User'], 'user'>;
    const [ {user} , setUser ] = useMMKVStorage<User>("User" , storage , {user:{}});
    const feedback_list = useRoute<any>().params?.feedback_list;


    const [initial_values, set_initial_values] = useState({});

    const {mutation:feedback_mutation} = useStudentInsertNbaFeedback({
      onSuccess : (data)=>{
        console.log(data) ;
        console.info("Feedback Submitted");
      }
    }
    );

    useEffect( ()=>{
        let values = {};
        for( let feedback of feedback_list ){
            values[feedback.co_name] = {
              co_id : feedback.co_id,
              value : 3
            };
        }
        set_initial_values({...values})
    } , [feedback_list])

    const onSubmit = (values:object):void=>{
      let res:studentInsertNbaFeedback = {
        academic_session : current_session ,
        feedback_id : feedback_list[0].feedback_id,
        computer_code : user.computer_code,
        data : Object.values(values)
      }
      console.log(res);
      feedback_mutation.mutate(res);
      navigator.popTo("NbaFeedbackStatus" , { reload: true });

    }

    const {onScroll , headerHeight} = useCollapsibleCustomHeader();

    
  return (
    <Formik initialValues={initial_values} onSubmit={onSubmit}>
        {(props)=>(
        <ScrollView onScroll={onScroll} style={styles.container} contentContainerStyle={{paddingVertical:20 , alignItems:"center" ,paddingTop : 50}}>
            {feedback_list.map(
              item=><PostNbaFeedback item={item} 
              set_feedback_rating={(rating)=>props.setFieldValue(item?.co_name , {co_id : item?.co_id,value:rating})} />
            )}
        <Button loading={feedback_mutation.isLoading} style={{width : 100 , marginVertical : 20}}  mode="contained" onPress={()=>props.submitForm()} >Submit</Button>
        </ScrollView>
        )}
    </Formik>
  )
}

function PostNbaFeedback({item , set_feedback_rating}) {
    const theme:themeType = useTheme();
    const window = useWindowDimensions();
    const styles = StyleSheet.create({
        cardStyle:{
            flexWrap : "nowrap",
            gap : 10,
            flexDirection : "column",
            width : window.width - 20,
            maxWidth : 500,
            
        }
    })
    const rating_titles = [
      "Worse",
      "Bad",
      "Good",
      "Very Good",
      "Excellent",
    ]

    const rating_colors = [
      theme.colors.red,
      theme.colors.error,
      theme.colors.yellow,
      theme.colors.green,
      theme.colors.primary,
    ]
    const [rating , set_rating ] = useState(3);

    useEffect(()=>{
      set_feedback_rating(rating);
    },[rating])


  return (
    <CMScard
    style={styles.cardStyle}
    >
        <Text variant='headlineSmall' numberOfLines={1} style={{}}>{item?.co_name}</Text>
        <View style={{ gap:20 }}>
            <Text variant='titleMedium' style={{textAlign:"left"}}>{item?.co}</Text>
            <Text variant='headlineSmall' style={{textAlign : "center" ,color : rating_colors[rating-1]}} >{rating_titles[rating-1]}</Text>
            <Rating
            type='custom'
            ratingCount={5}
            imageSize={30}
            startingValue={rating}
            minValue={1}
            jumpValue={1}
            showReadOnlyText={false}
            ratingColor={rating_colors[rating - 1]}
            tintColor={theme.colors.cms_card_background}
            ratingBackgroundColor={theme.colors.backdrop}
            fractions={0}
            onSwipeRating={(rating)=>{
              set_rating(rating);
            }}
            onFinishRating={(rating)=>{
              set_rating(rating);
            }}
            />
        </View>
    </CMScard>
  )
}

export default FillNbaFeedback
