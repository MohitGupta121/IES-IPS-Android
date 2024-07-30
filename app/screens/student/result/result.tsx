import { BackHandler, ScrollView, StyleSheet, View , useWindowDimensions } from 'react-native'
import React, { memo, useEffect, useState , useCallback } from 'react'
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, List, Text, useTheme } from 'react-native-paper'
import { themeType } from '../../../theme';
import { useQuery } from 'react-query';
import { studentApi } from '../../../api/API';
import { studentActionTypes } from '../../../redux/student/types';
import { useDispatch, useSelector } from 'react-redux';
import NoData from '../../../components/noData';
import { getColorByPercent } from '../../../utils';
import ProgressCustom, { ProgressColorProp } from '../../../components/progressCustom';
import CustomLoading from '../../../components/customLoading';
import { RefreshControl } from 'react-native';
import { useBackHandler } from '@react-native-community/hooks';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../../../routes/routes';
import Animated, { FadeInDown, SlideInLeft } from 'react-native-reanimated';
import { RootState } from '../../../redux/store';
import { reducerData } from '../../../redux/common/reducer';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { commonActionTypes } from '../../../redux/common/types';
import { storage } from '../../../App';
import useCollapsibleCustomHeader from '../../../hooks/useCollapsibleHeader';
import { useStudentReport } from '../../../hooks/query/student';
import { useAcademicSession } from '../../../hooks/query/common';

const Result = () => {
  const theme:themeType = useTheme();
  const window = useWindowDimensions();
  const dispatch = useDispatch();
  const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const styles = StyleSheet.create({
    mainContainer : {
        marginTop : 50,
        gap:20
      },
      itemContianer : { 
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
    })
    type User = Pick<reducerData['User'], 'user'>;
    const [ {user} , setUser ] = useMMKVStorage<User>("User" , storage , {user:{}});
    const {current_academic_session_id:current_session} = useAcademicSession();
    const {report , queryStatus:{isLoading ,isRefetching , refetch}} = useStudentReport(current_session , user.computer_code);
    const [mst_data,set_mst_data] = useState({
      mst1 :  {},
      mst2 : {},
    })


    useBackHandler(()=>{
        dispatch({type:studentActionTypes.Report , payload : []})
        navigator.pop();
        return true;
    })
    

    useEffect(()=>{
      const mst1_data = {};
      const mst2_data = {};

      // console.log(JSON.stringify(report))

      if (report){report.map(item=>{
        item.marks_list.map(marks=>{
          if (marks.event_name=="MST1") mst1_data[item.batch_name] = {
            total : marks.event_max_marks,
            obtain : marks.event_total_marks,
          }
        })
      })
      report.map(item=>{
        item.marks_list.map(marks=>{
          if (marks.event_name=="MST2") mst2_data[item.batch_name] = {
            total : marks.event_max_marks,
            obtain : marks.event_total_marks,
          }
        })
      })}

      // console.log(mst1_data , mst2_data)

      set_mst_data({mst1:{...mst1_data} , mst2:{...mst2_data}})

    } , [report])

    const {onScroll , headerHeight} = useCollapsibleCustomHeader();


    const [percentage , set_percentage] =useState({
      mst1 : 0 ,
      mst2 : 0 ,
    })
    useEffect(()=>{
      let mst1 = 0;
      let mst2 = 0;
      let len = Object.values(mst_data.mst1).length;
      Object.values(mst_data.mst1).map((item:any)=>{
        mst1 += item.obtain/item.total;
      })
      Object.values(mst_data.mst2).map((item:any)=>{
        mst2 += item.obtain/item.total;
      })
      
      mst1 = Math.round((mst1/len)*100);
      mst2 = Math.round((mst2/len)*100);
      
      set_percentage({mst1 , mst2})
    }, [mst_data])
    
    const mst1Progess = useCallback((props)=>{
      let percent = percentage.mst1
      let color:ProgressColorProp = 'green'
      if ( percent < 75) color = 'blue'
      if ( percent < 50) color = 'red'

      return (
      <ProgressCustom
        size={50}
        width={3}
        fill={percent?percent:5}
        color={color}
        style={{marginLeft:15}}
      >
        {(fill)=><>
        <Text numberOfLines={2} ellipsizeMode='tail' variant='labelSmall' style={{flexWrap:"wrap", color:theme.colors.black , textAlign:"center"}} >{Math.round(percent)||0}%</Text>
        </>
        }
      </ProgressCustom>
    )} , [percentage.mst1])
    const mst2Progess = useCallback((props)=>{
      let percent = percentage.mst2;
      let color:ProgressColorProp = 'green'
      if ( percent < 75) color = 'yellow'
      if ( percent < 50) color = 'red'

      return (
      <ProgressCustom
        size={50}
        width={3}
        fill={percent?percent:5}
        color={color}
        style={{marginLeft:15}}
      >
        {(fill)=><>
        <Text numberOfLines={2} ellipsizeMode='tail' variant='labelSmall' style={{flexWrap:"wrap", color:theme.colors.black , textAlign:"center"}} >{Math.round(percent)||0}%</Text>
        </>
        }
      </ProgressCustom>
    )} , [percentage.mst2])

    if ( isLoading && !isRefetching ) return(
      <CustomLoading />
    )

    if ( report?.length == 0 ) return ( <NoData text="No Records" /> )


  return (
    <>
      {
        (
        // <RefreshControl style={{marginTop : 55}} refreshing={isRefetching} onRefresh={()=>refetch()}>
        <ScrollView style={styles.mainContainer} onScroll={onScroll} refreshControl={
          <RefreshControl onRefresh={refetch} refreshing={isRefetching}  />
        }>
          <Animated.View  entering={SlideInLeft.duration(500)}>
          <List.Item 
            title="MST-1"
            style={styles.itemContianer}
            titleStyle={theme.fonts.bodyLarge}
            right={()=><Text style={{color:getColorByPercent(percentage.mst1), alignSelf:"center"}} variant='titleMedium' >{percentage.mst1}%</Text>}
            onPress={()=>navigator.navigate("ViewReport" , {type : "MST-1" , report : mst_data.mst1 , percentage : percentage.mst1})}
            left={mst1Progess}
          />
          </Animated.View>

          <Animated.View entering={SlideInLeft.duration(500)}>
          <List.Item 
            title="MST-2"
            style={styles.itemContianer}
            titleStyle={theme.fonts.bodyLarge}
            right={()=><Text style={{color:getColorByPercent(percentage.mst2), alignSelf:"center"}} variant='titleMedium' >{percentage.mst2}%</Text>}
            onPress={()=>navigator.navigate("ViewReport" , {type : "MST-2" , report : mst_data.mst2 , percentage : percentage.mst2})}
            left={mst2Progess}
          />
          </Animated.View>
        </ScrollView>
      )
      }
    </>
  )
}

export default memo(Result)
