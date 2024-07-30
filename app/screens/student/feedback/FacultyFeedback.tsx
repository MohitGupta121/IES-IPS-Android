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
import {Button, List, Text, useTheme } from "react-native-paper"
import { themeType } from '../../../theme';
import Icon from "react-native-vector-icons/Feather"
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Formik, useFormik, useFormikContext } from 'formik';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CMScard from '../../../components/cms_card';
import { Rating } from 'react-native-ratings';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../../../routes/routes';
const FacultyFeedbackStatus = () => {
    const window = useWindowDimensions();
    const theme:themeType = useTheme();
    const styles = StyleSheet.create({
      fListContainer: {
        paddingTop: 50,
        paddingBottom: 20,
        gap: 10,
        minHeight: window.height - 100,
      },
      mainContainer:{
        paddingBottom : 30,
      }
    });
    const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    useBackHandler(()=>{
      navigator.pop();
      return true;
    })
    
      const current_session = useSelector((store:RootState)=>store.common.AcademicSession?.current.academic_session_id)
      const user  = useSelector((store:RootState)=>store.common.User.user);
      const dispatch = useDispatch();
      const facultFeedbackData = useSelector((store:RootState)=>store.student.FacultyFeedback) 

      const [initial_values , set_initial_values] = useState({})
      const [modal , setModal] = useState({
        open : false , 
        data : {}
      })

      const feedback_faculties = useMemo(()=>facultFeedbackData?.response , [facultFeedbackData])


      useEffect(()=>{
        let values = {}
        feedback_faculties&&feedback_faculties.map((item)=>{
          values[item.clg_sub_code] = null;
        })

        set_initial_values(values);

      } ,[feedback_faculties])

      const {isFetching , isError , isRefetching , refetch} = useQuery( studentApi.studentFacultyfeedback.name , ()=>studentApi.studentFacultyfeedback.fetch(
          {
              computer_code : user.computer_code,
              academic_session : current_session,
          },
      ),
      {
          onSuccess : (data)=>{
            // console.log(data)
              dispatch({type : studentActionTypes.FacultyFeedback , payload : {...data}})
          }
      }
      )

    function onSubmit(values){
      console.log(values);
    }

    const setModalOpen = useCallback((value)=>setModal({...modal , open : value}),[])
    const setModalData = (value)=>{
      // console.log(modal , value);
      setModal({ ...modal , data : {...value}})
    }

    useEffect( ()=>{console.log(modal)}, [modal.data])

    if ( isFetching && !isRefetching ) return (
      <CustomLoading />
    )

    if ( isError ) return  (
      <CustomError text="Error Occured" />
    )


  return (
    <GestureHandlerRootView style={{flex:1}}>

    <BottomSheetModalProvider>
      <ScrollView contentContainerStyle={styles.mainContainer}>
        <Formik initialValues={initial_values} onSubmit={onSubmit}>

          {(props)=>(
            <>
          <FlatList
                data={feedback_faculties}
                contentContainerStyle={styles.fListContainer}
                keyExtractor={(item , index) => `${index}`}
                renderItem={({item}) => <FeedbackItem item={item} setModal={setModal} />}
                ListEmptyComponent={<NoData text="No Records" />}
              />

              <FacultyFeedbackBottomSheet open={modal.open} setModal={setModalOpen} item={modal.data} />

          <View style={{alignItems :"center"}}>
            <Button loading={false} style={{width : 100 , marginVertical : 15}}  mode="contained" onPress={()=>null} >Submit</Button>
          </View>
          </>
          )}
          
      </Formik>
      </ScrollView>
    </BottomSheetModalProvider>
    </GestureHandlerRootView>
  )
}

const FeedbackItem = ({item  , setModal})=>{
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

  const formik = useFormikContext();
  const submit = useMemo(()=>formik.values[item.clg_sub_code] , [formik])

  useEffect( ()=>{console.log(submit)}, [formik])

  return(
    <List.Item title={item?.faculty_name} titleEllipsizeMode="tail"
        titleNumberOfLines={5}  
        style={styles.listItem}
        titleStyle={styles.listItemTitle} 
        // @ts-ignore
        onPress={()=>{
          setModal({open:true , data : {...item}})
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

  });

  const Modalref = useRef(null);

  const dismissModal = useCallback(()=>props.setModal(false) , []);

  useEffect(()=>{
    if(props.open){
      Modalref.current?.present();
    }else {
      Modalref.current?.dismiss();
    }
  }, [props.open])

  useEffect(()=>{console.log(props.item)} , [props.data])


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
                      <View>
                        
                      </View>
                      <View style={{alignItems :"center"}}>
                        <Button loading={false} style={{width : 100 , marginVertical : 15}}  mode="contained" onPress={()=>null} >Submit</Button>
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

export default FacultyFeedbackStatus
