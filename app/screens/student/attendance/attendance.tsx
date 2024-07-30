import { Animated, BackHandler, Dimensions, FlatList, ScrollView, StyleSheet,  View } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import { ActivityIndicator, IconButton, List, TouchableRipple, useTheme ,Text} from 'react-native-paper';
import IosSafeArea from '../../../components/iosSafeArea';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'react-query';
import { studentApi } from '../../../api/API';
import { studentActionTypes } from '../../../redux/student/types';
import { themeType } from '../../../theme';
import CustomHeader from '../../../components/customHeader';
import Icon from 'react-native-vector-icons/Feather';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useWindowDimensions } from 'react-native';
import ItemList from './ItemList';
import NoData from '../../../components/noData';
import { RefreshControl } from 'react-native';
import CustomLoading from '../../../components/customLoading';
import { useBackHandler } from '@react-native-community/hooks';
import { RootState } from '../../../redux/store';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../../../routes/routes';
import { FlashList } from "@shopify/flash-list";
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { storage } from '../../../App';
import { commonActionTypes } from '../../../redux/common/types';
import { reducerData } from '../../../redux/common/reducer';
import useCollapsibleCustomHeader from '../../../hooks/useCollapsibleHeader';
import { useAcademicSession } from '../../../hooks/query/common';
import { useStudentAttendance } from '../../../hooks/query/student';

const Attendance = () => {
    const theme:themeType = useTheme();
    type User = Pick<reducerData['User'], 'user'>;
    const [ {user} , setUser ] = useMMKVStorage<User>("User" , storage , {user:{}});

    // const attendance = useSelector((store:RootState)=>store.student.Attendance);
    const {current_academic_session_id:current_session} = useAcademicSession();
    const {attendance, queryStatus:{isLoading , refetch}} = useStudentAttendance(current_session , user.computer_code);
    const dispatch = useDispatch();


    
    const {onScroll , headerHeight} = useCollapsibleCustomHeader();

    const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    useBackHandler(()=>{
      dispatch({type:studentActionTypes.Attendance , payload : []});
      navigator.pop();
      return true;
    })

    const [refresh , setRefresh] = useState(false)

    function refetchData(){
      setRefresh(true);
      refetch().then((value)=>{
        // console.log(value);
        setRefresh(false);
      })
    }

    if(isLoading) return(
      <CustomLoading />
    )

  return (
    <>
        <FlashList
          data={attendance}
          onScroll={onScroll}
          contentContainerStyle={{ paddingBottom: 20 , paddingTop: headerHeight }}
          style={{flex:1 , }}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({item}) => <ItemList item={item} />}
          refreshControl={(
            <RefreshControl progressViewOffset={50} progressBackgroundColor={theme.colors.container_background} refreshing={refresh} onRefresh={refetchData}/>
          )}
          ListEmptyComponent={<NoData text="No Records" />}
        />
    </>
  );
}

export default memo(Attendance)
