import React, { useEffect } from 'react';
import {DataTable, useTheme , Text} from 'react-native-paper';
import useCollapsibleCustomHeader from '../../../hooks/useCollapsibleHeader';
import CMScard from '../../../components/cms_card';
import {ScrollView, View, StyleSheet} from 'react-native';
import {themeType} from '../../../theme';
import dataTableStyles from '../../../cmsStyles/dataTableStyles';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useGetLeaveBalance} from '../../../hooks/query/staff';
import {reducerData} from '../../../redux/common/reducer';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {storage} from '../../../App';
import {useAcademicSession} from '../../../hooks/query/common';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../../routes/routes';
import {useBackHandler} from '@react-native-community/hooks';
import Animated, {FadeInDown} from 'react-native-reanimated';

const LeaveReport = () => {
  const {expand, onScroll} = useCollapsibleCustomHeader();
  const theme: themeType = useTheme();

  const styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      paddingTop: 50,
      padding: 20
    },
    scrollViewcontainer: {
      gap: 20,
      paddingVertical: 30,
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
    ...dataTableStyles,
    headerContainerStyle: {},
    rowText: {},
    rowContainerStyle: {
      justifyContent: 'center',
    },
    headingContainer: {
      paddingVertical: 20,
    },
    datatableheader: {
      width: 150,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heading:{
      color : theme.colors.primary,
      fontWeight:'700',
      textAlign:"center",
      marginVertical:20
    }
  });

  type User = Pick<reducerData['User'], 'user'>;
  const [{user}, setUser] = useMMKVStorage<User>('User', storage, {user: {}});
  const faculty_computer_code = user.computer_code;
  const {current_academic_session_id: current_session} = useAcademicSession();

  const {leaveBalance} = useGetLeaveBalance(
    current_session,
    user.computer_code,
  );
  // useEffect(()=>{
  //   console.log(leaveBalance)
  // })

  // const navigation = useNavigation();
  const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useBackHandler(() => {
    navigator.pop();
    return true;
  });

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ScrollView style={styles.rootContainer} onScroll={onScroll}>
        <Text style={styles.heading} variant='headlineMedium'>Leave Report</Text>
        <ScrollView horizontal={true}>
          <DataTable>
            <DataTable.Header style={styles.headerStyle}>
              <View style={[styles.datatableheader]}>
                <Text style={styles.headerTextStyle}>Type of Leave</Text>
              </View>
              <View style={[styles.datatableheader]}>
                <Text style={styles.headerTextStyle}>Remaining Leaves</Text>
              </View>
              <View style={[styles.datatableheader]}>
                <Text style={styles.headerTextStyle}>Applied Leaves</Text>
              </View>
              <View style={[styles.datatableheader]}>
                <Text style={styles.headerTextStyle}>Special Leave Given</Text>
              </View>
            </DataTable.Header>
            {/* <Animated.View entering={FadeInDown.duration(500)}> */}
            <DataTable.Row style={styles.rowStyle}>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  CL
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  {leaveBalance.cl}
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  -
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  -
                </Text>
              </View>
            </DataTable.Row>
            <DataTable.Row style={styles.rowStyle}>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  DL
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  {leaveBalance.dl}
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  -
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  -
                </Text>
              </View>
            </DataTable.Row>
            <DataTable.Row style={styles.rowStyle}>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  EL
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  {leaveBalance.el}
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  -
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  -
                </Text>
              </View>
            </DataTable.Row>
            <DataTable.Row style={styles.rowStyle}>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  OL
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  {leaveBalance.ol}
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  -
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  -
                </Text>
              </View>
            </DataTable.Row>
            <DataTable.Row style={styles.rowStyle}>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  LWP
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  -
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  {leaveBalance.lwp}
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  -
                </Text>
              </View>
            </DataTable.Row>
            <DataTable.Row style={styles.rowStyle}>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  SDL
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  -
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  {leaveBalance.sdl}
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  -
                </Text>
              </View>
            </DataTable.Row>
            <DataTable.Row style={styles.rowStyle}>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  SL
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  -
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  -
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  {leaveBalance.sl}
                </Text>
              </View>
            </DataTable.Row>
            <DataTable.Row style={styles.rowStyle}>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  ML
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  -
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  -
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  {leaveBalance.ml}
                </Text>
              </View>
            </DataTable.Row>
            <DataTable.Row style={styles.rowStyle}>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  VL
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  -
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  -
                </Text>
              </View>
              <View style={[styles.rowContainerStyle, styles.datatableheader]}>
                <Text
                  ellipsizeMode="tail"
                  style={styles.rowText}
                  numberOfLines={2}>
                  {leaveBalance.vl}
                </Text>
              </View>
            </DataTable.Row>
            {/* </Animated.View> */}
          </DataTable>
        </ScrollView>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default LeaveReport;
