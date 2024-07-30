import 'react-native-gesture-handler';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions, StatusBar
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import IosSafeArea from '../../../components/iosSafeArea';
import { Avatar, IconButton, useTheme, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import { themeType } from '../../../theme';
import BottomSheet, {
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import MenuBottomSheet from './MenuBottomSheet';
import { StaffDashOptions, StudentDashOptions } from './DashOptions';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import CMScard from '../../../components/cms_card';
import StudentViewAttendence from './StudentViewAttendence';
import { storage } from '../../../App';
import { userType } from '../../../constants';
import StudentProfile from './StudentProfile';
import { useQuery } from 'react-query';
import { commonApi } from '../../../api/API';
import { commonActionTypes } from '../../../redux/common/types';
import { useBackHandler } from '@react-native-community/hooks';
import { RootState } from '../../../redux/store';
import { reducerData } from '../../../redux/common/reducer';
import ExitDialog from '../../../components/exitDialog';
import StaffProfile from './StaffProfile';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../routes/routes';
import { useToast } from 'react-native-toast-notifications';


const Dashboard = () => {
  const theme: themeType = useTheme();
  const window = Dimensions.get('screen');
  const styles = StyleSheet.create({
    dashboardContainer: {
      flex: 1,
      backgroundColor: theme.colors.secondary,
    },
    topButtons: {
      flexDirection: 'row',
      paddingHorizontal: 5,
    },
    IconButton: {
      borderRadius: 20,
    },
    SheetViewStyle: {
      backgroundColor: theme.colors.white,
      borderRadius: 35,
      padding: 20,
    },

    progressStyle: {
      flexDirection: 'column',
      flex: 1,
      minWidth: 60,
      alignContent: 'center',
      alignItems: 'center',
      // alignSelf : "baseline",
    },
    academicCalendar: {
      width: window.width - 20,
      minWidth: 200,
      maxWidth: 600,
      borderRadius: 35,
      padding: 15,
      backgroundColor: theme.colors.cms_card_background,
    },
    profileHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
      alignSelf: 'center',
    },
    previewProfileScrollView: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      width: window.width,
      maxWidth: 500,
      alignSelf: 'center',
      gap: 20,
      paddingBottom : window.height < 700?0: 240,
    },
    profileContainer: {
      marginHorizontal: 30,
      paddingVertical: 20,
      gap: 20,
    },
    headingsFont: {
      paddingLeft: 20,
      lineHeight: 30,
      fontSize: 14,
      fontWeight: '700',
      color: theme.colors.black,
    },
    nameHeadingsFont: {
      fontSize: 22,
      fontWeight: '700',
    },
    rootView : {
      flex: 1,
      width: '100%',
      height: StatusBar.currentHeight,
      backgroundColor: theme.colors.container_background,
    },
    dashboardHeader:{
      flex: 1,
      backgroundColor: theme.colors.container_background,
      justifyContent: 'flex-start',
    }
    
  });

  const [snapPoints , setSnapPoints] = useState([230 , window.height - 200, window.height]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const profileSVRef = useRef<ScrollView>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState(false);


  const updateOnProfileHeaderLoad = useCallback( (event)=>{
    const {height} = event.nativeEvent.layout;
    console.log(height)
    setSnapPoints([230 , window.height - (height+120), window.height])
  } ,[])


  useQuery(commonApi.getDepartments.name , commonApi.getDepartments.fetch ,{
    onSuccess : (data)=>{
      dispatch({type : commonActionTypes.Departments ,  payload : data})
    }
  })

  type User = Pick<reducerData['User'], 'user'>;
  const user: User['user'] = useSelector(
    (store: RootState) => store.common.User.user,
  );

  useEffect(() => {
    if (user.type === userType.student) setDashOptions(StudentDashOptions);
    else setDashOptions(StaffDashOptions);
    // console.log('dashboard : ', user);
  }, [user]);

  const [DashOptions, setDashOptions] = useState<
    typeof StaffDashOptions | typeof StudentDashOptions | []
  >([]);

  const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [newNotification, setNewNotification] = useState(0);

  useEffect(() => {
    // Permission for android 13+
    // PermissionsAndroid.request('android.permission.POST_NOTIFICATIONS');

    // Check for unseen notification
    const change_dimension = Dimensions.addEventListener(
      'change',
      ({window}) => {
        setProfile(false);
      },
    );

    const notifications = storage.getString('notifications');
    let count = 0;
    if (notifications !== undefined) {
      let notificationArray = JSON.parse(notifications);
      notificationArray.map(item => {
        if (!item.seen) count++;
      });
      setNewNotification(count);
    }

    return () => change_dimension.remove();
  }, []);

  useBackHandler(() => {
    setExitDialogVisible(true);
    return true;
  });

  const [exitDialogVisible, setExitDialogVisible] = useState(false);

  useEffect(() => {
    // profile
    //   ? bottomSheetRef.current?.snapToIndex(0)
    //   : bottomSheetRef.current?.snapToIndex(1);
    window.height < 700 && profile
      ? bottomSheetRef.current?.close()
      : null;

    if (!profile)
      profileSVRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
  }, [profile, bottomSheetRef.current , snapPoints]);

  const dispatch = useDispatch();

  const chaggeProfileonSnapPoint = useCallback((index : number)=>{
    console.log(index)
    if ( index === 0 ) {
      setProfile(true);
    }else {
      setProfile(false)
    }
  } , [bottomSheetRef , profile])

  useQuery(
    commonApi.academicSession.name,
    () => commonApi.academicSession.fetch(),
    {
      onSuccess: data => {
        let current = data.find(item => item.active)
        dispatch({
          type: commonActionTypes.AcademicSession,
          payload: {
            sessions: [...data],
            current: {...current},
          },
        });
      },
    },
  );


  

  return (
    <GestureHandlerRootView
      style={styles.rootView}>
      <StatusBar barStyle="default" backgroundColor="black" />
      <IosSafeArea
        color={theme.colors.container_background}
        barStyle="dark-content">
        <ExitDialog
          exitDialogVisible={exitDialogVisible}
          setExitDialogVisible={setExitDialogVisible}
        />
        <View
          style={styles.dashboardHeader}>
          <View style={styles.topButtons}>
            <IconButton
              style={styles.IconButton}
              rippleColor={theme.colors.backdrop}
              onPress={() => setMenuOpen(!menuOpen)}
              icon="menu"
              iconColor={menuOpen ? theme.colors.primary : theme.colors.black}
              size={theme.icon.button_size}
              containerColor={menuOpen ? theme.colors.white : undefined}
            />
            <View style={{flex: 1, height: 50}}></View>
            <IconButton
              // @ts-ignore
              onPress={() => navigator.push('Notification')}
              style={styles.IconButton}
              icon="bell"
              iconColor={theme.colors.black}
              rippleColor={theme.colors.backdrop}
              size={theme.icon.button_size}
            />
            <IconButton
              onPress={() => null}
              style={styles.IconButton}
              icon={'user'}
              iconColor={profile ? theme.colors.primary : theme.colors.black}
              rippleColor={theme.colors.backdrop}
              size={theme.icon.button_size}
              containerColor={profile ? theme.colors.white : undefined}
            />
          </View>
          <View>
            <ScrollView
              ref={profileSVRef}
              contentContainerStyle={styles.previewProfileScrollView}
              scrollEnabled={profile}
              >
              <View onLayout={updateOnProfileHeaderLoad} style={styles.profileHeader}>
                <Avatar.Image
                  size={window.width < 500 ? window.width / 4 : 110}
                  source={
                    user?.photograph
                      ? {
                          uri: user?.photograph,
                        }
                      : require('../../../assets/images/avatar.png')
                  }
                />
                {user.type === userType.student ? (
                  <View style={{flexWrap: 'wrap'}}>
                    <Text
                      variant="bodyLarge"
                      numberOfLines={2}
                      style={styles.nameHeadingsFont}>
                      Hey,{'\n'}
                      {user?.name || ''}
                    </Text>
                    <Text
                      numberOfLines={1}
                      selectable
                      selectionColor={theme.colors.yellow}
                      style={{
                        fontSize: 15,
                        color: theme.colors.scrim,
                        flexWrap: 'wrap',
                      }}>
                      {user?.department || ''} • {user?.enrollment || ''}
                    </Text>
                  </View>
                ) : (
                  <View style={{flexWrap: 'wrap'}}>
                    <Text
                      variant="bodyLarge"
                      numberOfLines={2}
                      style={styles.nameHeadingsFont}>
                      Hey,{'\n'}
                      {user?.name || ''}
                    </Text>
                    <Text
                      numberOfLines={1}
                      selectable
                      selectionColor={theme.colors.yellow}
                      style={{
                        fontSize: 15,
                        color: theme.colors.scrim,
                        flexWrap: 'wrap',
                      }}>
                      {user?.departmentFaculty || ''} •{' '}
                      {user?.computer_code || ''}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.profileContainer}>
                <Text variant="headlineMedium" style={{textAlign: 'center'}}>
                  <Icon name="user" size={30} />
                  Profile
                </Text>
                {user.type === userType.student ? (
                  <StudentProfile user={user} profile={profile} />
                ) : (
                  <StaffProfile user={user} profile={profile} />
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </IosSafeArea>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={1}
        handleIndicatorStyle={{backgroundColor: theme.colors.primary}}
        backgroundStyle={styles.SheetViewStyle}
        onChange={chaggeProfileonSnapPoint}
        >
        <BottomSheetScrollView contentContainerStyle={{gap: 10}}>
          <View>
            <Text
              numberOfLines={1}
              // @ts-ignore
              style={styles.headingsFont}>
              RECENTLY USED
            </Text>
            <CMScard>
              {DashOptions.map((item, index) => (
                <View key={index} style={styles.progressStyle}>
                  <IconButton
                    // @ts-ignore
                    onPress={() => navigator.navigate(item.to)}
                    style={styles.IconButton}
                    icon={item.icon}
                    iconColor={theme.colors.scrim}
                    rippleColor={theme.colors.backdrop}
                    size={theme.icon.button_size}
                  />
                  <Text
                    numberOfLines={2}
                    style={{color: theme.colors.scrim, textAlign: 'center'}}>
                    {item.name}
                  </Text>
                </View>
              ))}
            </CMScard>
          </View>
          {user.type===userType.student?
          <View>
            <Text style={styles.headingsFont}>ATTENDANCE</Text>
            <StudentViewAttendence />
          </View>
          :null
        }
          <View>
            <Text
              numberOfLines={1}
              // @ts-ignore
              style={styles.headingsFont}>
              ACADEMIC CALENDAR
            </Text>
            <CMScard style={{padding: 0}}>
              <Calendar
                enableSwipeMonths
                hideExtraDays
                // displayLoadingIndicator
                style={styles.academicCalendar}
                markingType={'custom'}
                markedDates={{
                  '2023-08-03': {
                    customStyles: {
                      container: {
                        backgroundColor: 'red',
                        borderRadius: 20,
                      },
                      text: {
                        color: 'white',
                        fontWeight: 'bold',
                      },
                    },
                  },
                  '2023-08-05': {
                    customStyles: {
                      container: {
                        backgroundColor: theme.colors.container_background,
                        borderRadius: 20,
                      },
                      text: {
                        color: theme.colors.primary,
                        fontWeight: 'bold',
                      },
                    },
                  },
                }}
              />
            </CMScard>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
      <BottomSheetModalProvider>
        <MenuBottomSheet open={menuOpen} changeOpen={setMenuOpen} />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Dashboard;
