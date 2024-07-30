import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Button, DataTable, Text, useTheme} from 'react-native-paper';
import ModelCalendar from '../../../components/modelCalendar';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import {header} from '../../../node_modules/bower/lib/node_modules/bower-registry-client/node_modules/har-validator/src/async';
import dataTableStyles from '../../../cmsStyles/dataTableStyles';
import useCollapsibleCustomHeader from '../../../hooks/useCollapsibleHeader';
import {themeType} from '../../../theme';
import {StyleSheet} from 'react-native';
import {View} from 'react-native';
import {useGetLeaveChart} from '../../../hooks/query/staff';
import {reducerData} from '../../../redux/common/reducer';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {storage} from '../../../App';
import {FlashList} from '@shopify/flash-list';
import NoData from '../../../components/noData';
import data from '../../../node_modules/type-fest/source/readonly-deep.d';
import dayjs from 'dayjs';
import AnimatedOutlineButton from '../../../components/animatedOutlineButton';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../routes/routes';
import { useBackHandler } from '@react-native-community/hooks';

const LeaveChart = () => {
  const {headerHeight, onScroll} = useCollapsibleCustomHeader();
  const theme: themeType = useTheme();
  const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useBackHandler(() => {
    navigator.pop();
    return true;
  });

  const styles = StyleSheet.create({
    rootContainer: {
      flex: 1,
      paddingHorizontal:10,
      paddingBottom:50,
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
      // width: 150,
      alignItems: 'center',
      justifyContent: 'center',
    },
    apply_date: {
      width: 120,
      // alignItems: "center"
    },
    leave_type: {
      width: 100,
      // alignItems: "center"
    },
    start_date: {
      width: 120,
      // alignItems:"center"
    },
    end_date: {
      width: 120,
      // alignItems:"center"
    },
    days: {
      width: 60,
      // alignItems:"center"
    },
    reason: {
      width: 130,
      alignItems: 'center',
    },
    faculty_assigned: {
      width: 120,
      alignItems: 'center',
    },
    hod_approval: {
      width: 150,
      alignItems: 'center',
    },
    principal_approval: {
      width: 150,
      alignItems: 'center',
    },
    delete: {
      width: 130,
      alignItems: 'center',
    },
    button:{
      padding:0,
      margin:10
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
  const {leaveChart} = useGetLeaveChart(user.computer_code);
  useEffect(() => {
    console.log(leaveChart);
  }, [leaveChart]);

  const [page , setPage] = useState(0);
  const itemsPerPage = 10 ;
  const from = page * itemsPerPage;
  const to = useMemo(()=>Math.min((page + 1) * itemsPerPage, leaveChart?.length||0) , [leaveChart, page]);


  const pending = useMemo(
    () => (
      <Text
        variant="titleMedium"
        style={{color: theme.colors.yellow, fontWeight: '700'}}>
        Pending
      </Text>
    ),
    [],
  );
  const forwarded = useMemo(
    () => (
      <Text
        variant="titleMedium"
        style={{color: theme.colors.green, fontWeight: '700'}}>
        Forwarded
      </Text>
    ),
    [],
  );
  const Rejected = useMemo(
    () => (
      <Text
        variant="titleMedium"
        style={{color: theme.colors.red, fontWeight: '700'}}>
        Rejected
      </Text>
    ),
    [],
  );
  
  const tableRow = useCallback(
    ({item, index}) => {
      const apply_id = item.apply_id;
      const apply_date = dayjs(item.apply_date).format('DD-MM-YYYY');
      const leave_type = item.leave_type;
      const start_date = dayjs(item.start_date).format('DD-MM-YYYY');
      const end_date = dayjs(item.end_date).format('DD-MM-YYYY');
      const days = item.days;
      const reason = item.reason;
      const hod_approval = item.hod_approval;
      const principal_approval = item.principal_approval;
      
      const DeleteButton = (<AnimatedOutlineButton
        style={styles.button}
        icon="trash-2"
        color="red">
          Delete
        </AnimatedOutlineButton>)

      const ViewButton = (<AnimatedOutlineButton
        style={styles.button}
        onPress={()=>navigator.navigate("View Faculty Assigned" , {apply_id})}
        icon="eye"
        color="blue">
          View
        </AnimatedOutlineButton>)

      return (
        <DataTable.Row style={styles.rowStyle}>
          <View style={[styles.rowContainerStyle, styles.apply_date]}>
            <Text
              variant="labelLarge"
              ellipsizeMode="tail"
              style={styles.rowText}
              numberOfLines={2}>
              {apply_date}
            </Text>
          </View>
          <View style={[styles.rowContainerStyle, styles.leave_type]}>
            <Text
              variant="labelLarge"
              ellipsizeMode="tail"
              style={styles.rowText}
              numberOfLines={2}>
              {leave_type}
            </Text>
          </View>
          <View style={[styles.rowContainerStyle, styles.start_date]}>
            <Text
              variant="labelLarge"
              ellipsizeMode="tail"
              style={styles.rowText}
              numberOfLines={2}>
              {start_date}
            </Text>
          </View>
          <View style={[styles.rowContainerStyle, styles.end_date]}>
            <Text
              variant="labelLarge"
              ellipsizeMode="tail"
              style={styles.rowText}
              numberOfLines={2}>
              {end_date}
            </Text>
          </View>
          <View style={[styles.rowContainerStyle, styles.days]}>
            <Text
              variant="labelLarge"
              ellipsizeMode="tail"
              style={styles.rowText}
              numberOfLines={2}>
              {days}
            </Text>
          </View>
          <View style={[styles.rowContainerStyle, styles.reason]}>
            <Text
              variant="labelLarge"
              ellipsizeMode="tail"
              style={styles.rowText}
              numberOfLines={2}>
              {reason}
            </Text>
          </View>
          <View style={[styles.rowContainerStyle, styles.faculty_assigned]}>
              {ViewButton}
          </View>
          <View style={[styles.rowContainerStyle, styles.hod_approval]}>
            {hod_approval == 0
              ? pending
              : hod_approval == 1
              ? forwarded
              : Rejected}
            {/* <Text
                variant="labelLarge"
                ellipsizeMode="tail"
                style={styles.rowText}
                numberOfLines={2}>
                  (hod_approval)
              </Text> */}
          </View>
          <View style={[styles.rowContainerStyle, styles.principal_approval]}>
            {principal_approval == 0
              ? pending
              : principal_approval == 1
              ? forwarded
              : Rejected}
            {/* <Text
                variant="labelLarge"
                ellipsizeMode="tail"
                style={styles.rowText}
                numberOfLines={2}>
                  (principal_approval)
              </Text> */}
          </View>
          <View style={[styles.rowContainerStyle, styles.delete]}>
            {principal_approval == 0 && hod_approval == 0 ? (
              DeleteButton
            ) : null}
          </View>
        </DataTable.Row>
      );
    },
    [leaveChart],
  );

  if ( !leaveChart) return <></>

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ScrollView style={styles.rootContainer} onScroll={onScroll} contentContainerStyle={{paddingBottom:50 , paddingTop:headerHeight}}>
      <Text style={styles.heading} variant='headlineMedium'>Leave Chart</Text>
        <ScrollView horizontal={true}>
          <DataTable>
            <DataTable.Header style={styles.headerStyle}>
              <View style={[styles.headerContainerStyle, styles.apply_date]}>
                <Text style={styles.headerTextStyle}>Apply Date</Text>
              </View>
              <View style={[styles.headerContainerStyle, styles.leave_type]}>
                <Text style={styles.headerTextStyle}>Leave Type</Text>
              </View>
              <View style={[styles.headerContainerStyle, styles.start_date]}>
                <Text style={styles.headerTextStyle}>Start Dates</Text>
              </View>
              <View style={[styles.headerContainerStyle, styles.end_date]}>
                <Text style={styles.headerTextStyle}>End Date</Text>
              </View>
              <View style={[styles.headerContainerStyle, styles.days]}>
                <Text style={styles.headerTextStyle}>Days</Text>
              </View>
              <View style={[styles.headerContainerStyle, styles.reason]}>
                <Text style={styles.headerTextStyle}>Reason</Text>
              </View>
              <View style={[styles.headerContainerStyle, styles.faculty_assigned]}>
                <Text style={styles.headerTextStyle}>Faculty Assigned</Text>
              </View>
              <View style={[styles.headerContainerStyle, styles.hod_approval]}>
                <Text style={styles.headerTextStyle}>Status HOD</Text>
              </View>
              <View style={[styles.headerContainerStyle, styles.principal_approval]}>
                <Text style={styles.headerTextStyle}>Status PRINCIPAL</Text>
              </View>
              <View style={[styles.headerContainerStyle, styles.delete]}>
                <Text style={styles.headerTextStyle}>Delete</Text>
              </View>
            </DataTable.Header>
            <ScrollView>
              <FlashList 
                data={leaveChart.slice(from , to)} 
                renderItem={tableRow} 
                estimatedItemSize={itemsPerPage}
                extraData={[ from , to]}
                ListEmptyComponent={<NoData text="No Attendance Record" />}
              />
              <DataTable.Pagination
            page={page}
            onPageChange={setPage}
            numberOfPages={Math.ceil( leaveChart.length / itemsPerPage)}
            showFastPaginationControls
            selectPageDropdownLabel={'Rows per page'}
            numberOfItemsPerPage={itemsPerPage}
            label={`${from + 1}-${to} of ${leaveChart.length}`}
          />
            </ScrollView>
          </DataTable>
        </ScrollView>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default LeaveChart;
