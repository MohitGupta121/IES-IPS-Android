import { BackHandler, StyleSheet, View, useWindowDimensions , RefreshControl ,FlatList, ScrollView, Pressable } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import {Button, List, Text, TextInput, useTheme } from "react-native-paper"
import { themeType } from '../../../theme';
import Icon from "react-native-vector-icons/Feather"
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Formik, useFormik, useFormikContext } from 'formik';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CMScard from '../../../components/cms_card';
import { Rating } from 'react-native-ratings';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../../../routes/routes';
import { reducerData } from '../../../redux/common/reducer';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { commonActionTypes } from '../../../redux/common/types';
import { storage } from '../../../App';
import { useInsertFacultyFeedback, useStudentFacultyfeedback } from '../../../hooks/query/student';
import { useAcademicSession } from '../../../hooks/query/common';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { Toast } from 'react-native-toast-notifications';


type feedbackType = {
  computer_code: number,
  feedback_id: number,
  comment: string,
  data: {
      faculty_computer_code: number,
      clg_sub_code: string,
      batch_id: number,
      a: number,
      b: number,
      c: number,
      d: number,
      e: number,
      f: number,
      g: number,
      h: number,
      i: number,
      j: number,
      k: number,
      l: number,
      m: number,
      n: number
    }[]
}

const defaultFeedbackValue = {
  computer_code: 0,
  feedback_id: 0,
  comment: "",
  data: []
}

const FacultyFeedbackStatus = () => {
    const window = useWindowDimensions();
    const theme:themeType = useTheme();
    const dimension = useWindowDimensions();
    const styles = StyleSheet.create({
      fListContainer: {
        paddingTop: 50,
        paddingBottom: 20,
        gap: 10,
        minHeight: window.height - 100,
      },
      mainContainer: {
        paddingBottom: 30,
      },
      comment: {margin: 10,
        alignSelf: 'center',
        maxWidth: 500,
        width:dimension.width-20,

      },
    });
    const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    useBackHandler(()=>{
        dispatch({type : studentActionTypes.FacultyFeedback , payload : {}})
        navigator.pop();
      return true;
    })
    
      const {current_academic_session_id:current_session} = useAcademicSession();
      type User = Pick<reducerData['User'], 'user'>;
      const [ {user} , setUser ] = useMMKVStorage<User>("User" , storage , {user:{}});
      const dispatch = useDispatch();
      const {feedbackData , queryStatus:{isFetching,isRefetching , isError}} = useStudentFacultyfeedback(current_session , user.computer_code);


      const [modal , setModal] = useState({
        open : false , 
        data : {}
      })

      const feedback_faculties = useMemo(()=>feedbackData?.response , [feedbackData])

      const feedbackFrom = useForm<feedbackType>({
        defaultValues:defaultFeedbackValue,
      })


      useEffect(()=>{
        console.log(feedbackData)
        if(feedbackData){
          let values = {
            feedback_id : feedbackData.feedback_id,
            computer_code: user.computer_code,
            comment:"",
            data:[]
          }

          feedbackFrom.setValue("feedback_id" , feedbackData.feedback_id);
          feedbackFrom.setValue("computer_code" , user.computer_code);


          feedback_faculties&&feedback_faculties.map((item)=>{
            values[item.clg_sub_code] = null;
          })

        }

      } ,[feedback_faculties , feedbackData])


    function onSubmit(values){
      console.log(values);
    }

    const setModalOpen = useCallback((value)=>setModal({...modal , open : value}),[])
    const setModalData = (value)=>{
      // console.log(modal , value);
      setModal({ ...modal , data : {...value}})
    }

    const {mutation} = useInsertFacultyFeedback({
      onSuccess:(data:any)=>{
        Toast.show("", {
          type: "success",
          text1: "Feedback Submited",
          text2: "Faculty Feedback complete",
        });
        navigator.pop();
      }
    });


    const handleSubmit = useCallback(()=>{
      const values  = feedbackFrom.getValues();

      console.log(values.data.length , feedback_faculties.length)

      if (values.data.length != feedback_faculties.length){
        Toast.show("", {
          type: "error",
          text1: "All Feedbacks are required",
          text2: "Not all feedbacks are filled",
        });

        return 
      }

      mutation.mutate(values)
      
    },[feedbackFrom , feedback_faculties])

    // useEffect( ()=>{console.log(modal)}, [modal.data])

    if ( isFetching && !isRefetching ) return (
      <CustomLoading />
    )

    if ( isError ) return  (
      <CustomError text="Feedback Already Submitted" />
    )


  return (
    <GestureHandlerRootView style={{flex:1}}>

    <BottomSheetModalProvider>
      <FormProvider {...feedbackFrom}>
      <ScrollView contentContainerStyle={styles.mainContainer}>
          <FlatList
                data={feedback_faculties}
                contentContainerStyle={styles.fListContainer}
                keyExtractor={(item , index) => `${index}`}
                renderItem={({item}) => <FeedbackItem item={item} setModal={setModal} onPress={()=>{
                  setModal({open:true , data:item})
                }} />}
                ListEmptyComponent={<NoData text="No Records" />}
              />

              <TextInput style={styles.comment} placeholder='Comment' multiline onChangeText={(text)=>{
                feedbackFrom.setValue("comment" , text)
              }} />

              <FacultyFeedbackBottomSheet open={modal.open} setModal={setModalOpen} item={modal.data} teacherCriteria={feedbackData.teacherCriteria} />

          <View style={{alignItems :"center"}}>
            <Button loading={false} style={{width : 100 , marginVertical : 15}}  mode="contained" onPress={handleSubmit} >Submit</Button>
          </View>
      </ScrollView>
          </FormProvider>
    </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

const FeedbackItem = ({item  , setModal , onPress})=>{
  const theme:themeType = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const styles = StyleSheet.create({

    listItem:{
      borderRadius : 10,
      margin: 5,
      backgroundColor: theme.colors.white,
      alignSelf: "center",
      maxWidth : 500 ,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    listItemTitle:theme.fonts.bodyLarge

  });

  const feedbackForm = useFormContext<feedbackType>()
  const [submit , setSubmit] = useState(false);

  useEffect(()=>{
    let data = feedbackForm.getValues()['data']
    if (data.find(feedback=>(feedback.faculty_computer_code == item.faculty_computer_code)&&(feedback.clg_sub_code == item.clg_sub_code))){
      setSubmit(true);
    }
  }, [item , feedbackForm.getValues()['data']])

  // useEffect( ()=>{console.log(submit)}, [formik])

  return(
    <List.Item title={item?.faculty_name} titleEllipsizeMode="tail"
        titleNumberOfLines={5}  
        style={styles.listItem}
        titleStyle={styles.listItemTitle} 
        // @ts-ignore
        onPress={()=>{
          if (!submit) onPress();
        }}
        description={()=><Text variant='labelMedium'>{item.clg_sub_code}</Text>}
        left={()=>{
          if (submit) return (<Icon color={theme.colors.green} name="check-circle" style={{alignSelf:"center", marginLeft:10}} size={35} />)
          else return (<Icon color={theme.colors.yellow} name="clock" style={{alignSelf:"center", marginLeft:10}} size={35} />)
        }}
        
        
        right={(props)=>{
          return(
          <Icon name="arrow-right" color={theme.colors.black} style={{alignSelf:"center", marginLeft:10}} size={25} />
          )
        }}
        
  />
  )
}

const FacultyFeedbackBottomSheet = props=>{

  const theme:themeType = useTheme();
  const window = useWindowDimensions();
  const styles = StyleSheet.create({
    ModalSheetStyle: {
        borderRadius: 35,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 12,
    },
   },
    bottomSheetContainer: {
        padding: 20,
        backgroundColor: theme.colors.backdrop,
      },

    feedbackContainer:{
      padding:10,
      paddingVertical:30,
    }

  });

  const Modalref = useRef(null);
  type User = Pick<reducerData['User'], 'user'>;
  const [ {user} , setUser ] = useMMKVStorage<User>("User" , storage , {user:{}});

  const [ facultyFeedback , setFacultyFeedback ] = useState({})

  const dismissModal = useCallback(()=>props.setModal(false) , []);

  useEffect(()=>{
    if(props.open){
      Modalref.current?.present();
    }else {
      Modalref.current?.dismiss();
    }
  }, [props.open])

  useEffect(()=>{

    setFacultyFeedback({
      faculty_computer_code:props.item.faculty_computer_code,
      clg_sub_code:props.item.clg_sub_code,
      batch_id: props.item.batch_id,
      a: 3,
      b: 3,
      c: 3,
      d: 3,
      e: 3,
      f: 3,
      g: 3,
      h: 3,
      i: 3,
      j: 3,
      k: 3,
      l: 3,
      m: 3,
      n: 3
    })

  } , [props.item])

  // useEffect(()=>{console.log("props" , facultyFeedback)} , [facultyFeedback])

  const feedbackForm = useFormContext<feedbackType>();

  const submitFacultyFeedback = useCallback(()=>{

    let prev = feedbackForm.getValues()['data']
    feedbackForm.setValue("data" , [...prev , facultyFeedback])
    console.log(feedbackForm.getValues()['data'])


    Modalref.current.dismiss();

  },[facultyFeedback])


  return (
    <Pressable
     onPress={()=>props.setModal(false)} style={{height:window.height, width:window.width, position:"absolute" , display:props.open?"flex":"none" }}>

    <BottomSheetModal
                ref = {Modalref}
                index={0}
                snapPoints={[500 , window.height - 100]}
                onDismiss={dismissModal}
                containerStyle={styles.bottomSheetContainer}
                backgroundStyle={styles.ModalSheetStyle}
                handleIndicatorStyle={{
                    backgroundColor: theme.colors.primary,
                    width: 100,
                    height: 5,
                }}
                
                >

                  <BottomSheetScrollView>
                    <View style={{flex:1}}>
                      <Text style={{textAlign:"center"}} variant='titleLarge'>{props.item.faculty_name}</Text>
                      <View style={styles.feedbackContainer}>
                        {
                          props.teacherCriteria.map((item , index)=>(
                            <View>
                              <FeedbackRating  item={`${index+1}. ${item}`} set_feedback_rating={(rating)=>{
                                setFacultyFeedback(prev=>({...prev , [String.fromCharCode(97+index)]:rating }))
                              }} />
                            </View>
                          ))
                        }
                      </View>
                      <View style={{alignItems :"center"}}>
                        <Button loading={false} style={{width : 100 , marginVertical : 15}}  mode="contained" onPress={submitFacultyFeedback} >Submit</Button>
                      </View>
                    </View>
                    
                  </BottomSheetScrollView>
                </BottomSheetModal>

    </Pressable>

  )
}


function FeedbackRating({item , set_feedback_rating}) {
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
      {/* <Text variant='headlineSmall' numberOfLines={1} style={{}}>{item?.co_name}</Text> */}
      <View style={{ gap:20 }}>
          <Text variant='titleMedium' style={{textAlign:"left"}}>{item}</Text>
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

export default FacultyFeedbackStatus
