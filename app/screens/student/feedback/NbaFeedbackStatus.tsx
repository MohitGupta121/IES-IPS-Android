import { BackHandler, FlatList, StyleSheet, View, useWindowDimensions } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from 'react-query';
import { studentApi } from '../../../api/API';
import { useDispatch, useSelector } from 'react-redux';
import { studentActionTypes } from '../../../redux/student/types';
import {List, Text, useTheme } from 'react-native-paper';
import NoData from '../../../components/noData';
import CustomLoading from '../../../components/customLoading';
import { RefreshControl } from 'react-native';
import { themeType } from '../../../theme';
import Icon from "react-native-vector-icons/Feather";
import CustomError from '../../../components/customError';
import { useBackHandler } from '@react-native-community/hooks'
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../../../routes/routes';
import { FlashList } from "@shopify/flash-list";
import { reducerData } from '../../../redux/common/reducer';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { commonActionTypes } from '../../../redux/common/types';
import { storage } from '../../../App';
import { RootState } from '../../../redux/store';
import useCollapsibleCustomHeader from '../../../hooks/useCollapsibleHeader';
import { useStudentNbaFeedback } from '../../../hooks/query/student';
import { useAcademicSession } from '../../../hooks/query/common';


const NbaFeedbackStatus = () => {
  
    const window = useWindowDimensions();
    const styles = StyleSheet.create({
      fListContainer: {
        paddingTop: 50,
        paddingBottom: 20,
        gap: 10,
        minHeight: window.height - 100,
      },
    });
    const theme:themeType = useTheme();
    const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const params:{reload:boolean} = useRoute<any>().params;



    useBackHandler(()=>{
        dispatch({type: studentActionTypes.NbaFeedback, payload: []});
        navigator.pop();
      return true;
    })

      useEffect( ()=>{
        if ( params?.reload){
          console.log(params)
           refetch();
          }
      }, [params])
    
      const {current_academic_session_id:current_session} = useAcademicSession();
      type User = Pick<reducerData['User'], 'user'>;
      const [ {user} , setUser ] = useMMKVStorage<User>("User" , storage , {user:{}});
      const {nbaData , queryStatus:{isRefetching , refetch , isFetching,isError}} = useStudentNbaFeedback(current_session,user.computer_code);


      const dispatch = useDispatch();


  const {onScroll , headerHeight} = useCollapsibleCustomHeader();

    if ( isFetching && !isRefetching) return (
      <CustomLoading />
    )


  if (isError) return <CustomError text="Error Occured" />;

  return (
    <FlashList
          data={nbaData}
          onScroll={onScroll}
          contentContainerStyle={styles.fListContainer}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({item}) => <FeedbackItem item={item} />}
          refreshControl={(
            <RefreshControl progressViewOffset={50} progressBackgroundColor={theme.colors.container_background} refreshing={isRefetching} onRefresh={refetch}/>
          )}
          ListEmptyComponent={<NoData text="No Records" />}
        />
  )
}


const FeedbackItem = ({item}:any) =>{
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
  return (
    <List.Item title={item?.batch} titleEllipsizeMode="tail"
            titleNumberOfLines={5}  
            style={styles.listItem}
            titleStyle={styles.listItemTitle} 
            // @ts-ignore
            onPress={()=>{
              if ( !item?.submitted ) return navigation.navigate("FillNbaFeedback" , {
                feedback_list:item?.co_list
              });
              else return null
            }}

            left={()=>{
              if (item?.submitted) return (<Icon color={theme.colors.green} name="check-circle" style={{alignSelf:"center", marginLeft:10}} size={35} />)
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
export default NbaFeedbackStatus
