import 'react-native-gesture-handler';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  StatusBar,
} from 'react-native';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import IosSafeArea from '../../../components/iosSafeArea';
import {Avatar, IconButton, useTheme, Text, Badge} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import {themeType} from '../../../theme';
import BottomSheet, {
  ANIMATION_CONFIGS,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import MenuBottomSheet from './MenuBottomSheet';
import {StaffDashOptions, StudentDashOptions} from './DashOptions';
import {CommonActions, useNavigation} from '@react-navigation/native';
import {Calendar} from 'react-native-calendars';
import CMScard from '../../../components/cms_card';
import StudentViewAttendence from './StudentViewAttendence';
import {storage} from '../../../App';
import {userType} from '../../../constants';
import StudentProfile from './StudentProfile';
import {useQuery} from 'react-query';
import {commonApi} from '../../../api/API';
import {commonActionTypes} from '../../../redux/common/types';
import {useBackHandler} from '@react-native-community/hooks';
import {RootState} from '../../../redux/store';
import {reducerData} from '../../../redux/common/reducer';
import ExitDialog from '../../../components/exitDialog';
import StaffProfile from './StaffProfile';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../../routes/routes';
import {useToast} from 'react-native-toast-notifications';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import Leavesummary from './Leavesummary';
import getAvatar from '../../../utils/avatar';
import {PermissionsAndroid} from 'react-native';
import { NotificationType } from '../../../types';
import { useGetDepartments } from '../../../hooks/query/common';
import { ReduceMotion } from 'react-native-reanimated';

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
      height: 60,
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
      paddingBottom: window.height < 700 ? 0 : 240,
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
    rootView: {
      flex: 1,
      width: '100%',
      height: StatusBar.currentHeight,
      backgroundColor: theme.colors.container_background,
    },
    dashboardHeader: {
      flex: 1,
      backgroundColor: theme.colors.container_background,
      justifyContent: 'flex-start',
    },
    bottomSheetContentContainer: {
      gap: 20,
      maxWidth: 800,
    },
    badge: {
      position: 'absolute',
      top: 5,
      right: 10,
      zIndex: 2,
    },
  });

  const [snapPoints, setSnapPoints] = useState([
    window.height - 200,
    230,
    window.height - 60,
  ]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const profileSVRef = useRef<ScrollView>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [profile, setProfile] = useState(false);
  const [profileHeaderHeight, setProfileHeaderHeight] = useState(80);

  useGetDepartments();

  type User = Pick<reducerData['User'], 'user'>;
  const [{user}, setUser] = useMMKVStorage<User>('User', storage, {user: {}});

  const [DashOptions, setDashOptions] = useState<
    typeof StaffDashOptions | typeof StudentDashOptions | []
  >([]);

  const [notifications, setNotifications] = useMMKVStorage(
    'Notification',
    storage,
    [],
  );

  const [exitDialogVisible, setExitDialogVisible] = useState(false);

  const navigator =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [newNotification, setNewNotification] = useState(0);

  const [academicSessions, setAcademicSession] = useMMKVStorage(
    'AcademicSession',
    storage,
    {},
  );

  useBackHandler(() => {
    setExitDialogVisible(true);
    return true;
  });

  useQuery(
    commonApi.academicSession.name,
    () => commonApi.academicSession.fetch(),
    {
      onSuccess: data => {
        let current = data.find(item => item.active);
        setAcademicSession({
          sessions: [...data],
          current: {...current},
        });
      },
    },
  );

  useEffect(() => {
    // Permission for android 13+
    PermissionsAndroid.request('android.permission.POST_NOTIFICATIONS');

    let count = 0;
    notifications.map((item:NotificationType) => {
      if (!item.seen) count++;
    });
    console.log(notifications);
    setNewNotification(count);
  }, [notifications]);

  useEffect(() => {
    if (user.type === userType.student) setDashOptions(StudentDashOptions);
    else setDashOptions(StaffDashOptions);
    console.log('dashboard : ', user);
    console.log(getAvatar(user.computer_code));
  }, [user]);

  useEffect(()=>{
    setSnapPoints([
      window.height - (profileHeaderHeight + 60 + 20+(StatusBar.currentHeight||0)),
      230,
      window.height - (60 + (StatusBar.currentHeight||0)) ,
    ]);
    
    bottomSheetRef.current?.snapToIndex(0);
    
  },[profileHeaderHeight , window , bottomSheetRef])
  
  useEffect(() => {
    // profile
    //   ? bottomSheetRef.current?.snapToIndex(0)
    //   : bottomSheetRef.current?.snapToIndex(1);
    
    if (!profile)
      profileSVRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }, [profile, bottomSheetRef.current, snapPoints]);

  const updateOnProfileHeaderLoad = useCallback(event => {
    const {height} = event.nativeEvent.layout;
    setProfileHeaderHeight(height);
  }, []);

  const chaggeProfileonSnapPoint = useCallback((index: number) => {
    if (index === 0) {
      setProfile(true);
    } else {
      setProfile(false);
    }
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen(!menuOpen);
  }, []);

  const subHeaderText = useMemo(
    () =>
      user.type == userType.student
        ? `${user?.department || ''} • ${user?.enrollment || ''}`
        : `${user?.departmentFaculty || ''} • ${user?.computer_code || ''}`,
    [user],
  );

  const topButtons = useMemo(
    () => (
      <View style={styles.topButtons}>
        <IconButton
          style={styles.IconButton}
          rippleColor={theme.colors.backdrop}
          onPress={toggleMenu}
          icon="menu"
          size={theme.icon.button_size}
        />
        <View style={{flex: 1, height: 50}}></View>
        <View>
          {newNotification !== 0 ? (
            <Badge style={styles.badge}>{newNotification}</Badge>
          ) : null}
          <IconButton
            // @ts-ignore
            onPress={() => navigator.push('Notification')}
            style={styles.IconButton}
            icon="bell"
            iconColor={theme.colors.black}
            rippleColor={theme.colors.backdrop}
            size={theme.icon.button_size}
          />
        </View>
        <IconButton
          onPress={() => null}
          style={styles.IconButton}
          icon={'user'}
          rippleColor={theme.colors.backdrop}
          size={theme.icon.button_size}
        />
      </View>
    ),
    [newNotification],
  );

  const profileHeader = useMemo(
    () => (
      <View onLayout={updateOnProfileHeaderLoad} style={styles.profileHeader}>
        <Avatar.Image
          size={window.width < 500 ? window.width / 4 : 110}
          source={
            user?.photograph
              ? {uri: user?.photograph}
              // : {uri: getAvatar(user.computer_code)}
              : require("../../../assets/images/avatar.png")
          }
        />

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
            variant="bodyLarge">
            {subHeaderText}
          </Text>
        </View>
      </View>
    ),
    [user , window],
  );

  const attendanceProgressBarBlock = useMemo(
    () => (
      <View>
        <Text style={styles.headingsFont}>ATTENDANCE</Text>
        <StudentViewAttendence />
      </View>
    ),
    [],
  );

  const leaveSummaryBlock = useMemo(
    () => (
      <View>
        <Text style={styles.headingsFont}>LEAVE SUMMARY</Text>
        <Leavesummary />
      </View>
    ),
    [],
  );

  const academicCalendarBlock = useMemo(
    () => (
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
            style={styles.academicCalendar}
          />
        </CMScard>
      </View>
    ),
    [],
  );

  const backgroundProfile = useMemo(
    () => (
      <View>
        <ScrollView
          ref={profileSVRef}
          contentContainerStyle={styles.previewProfileScrollView}
          scrollEnabled={true}>
          {profileHeader}
          <View style={styles.profileContainer}>
            <Text variant="headlineMedium" style={{textAlign: 'center'}}>
              <Icon name="user" size={30} />
              Profile
            </Text>
            {user.type === userType.student ? (
              <StudentProfile user={user} />
            ) : (
              <StaffProfile user={user} />
            )}
          </View>
        </ScrollView>
      </View>
    ),
    [user , window],
  );

  const studentBlocks = useMemo(
    () => [attendanceProgressBarBlock, academicCalendarBlock],
    [],
  );
  const staffBlocks = useMemo(
    () => [leaveSummaryBlock, academicCalendarBlock],
    [],
  );

  return (
    <GestureHandlerRootView style={styles.rootView}>
      <IosSafeArea
        color='transparent'
        barStyle="dark-content">
        <ExitDialog
          exitDialogVisible={exitDialogVisible}
          setExitDialogVisible={setExitDialogVisible}
        />
        <View style={styles.dashboardHeader}>
          {topButtons}
          {backgroundProfile}
        </View>
      </IosSafeArea>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={0}
        handleIndicatorStyle={{backgroundColor: theme.colors.primary}}
        backgroundStyle={styles.SheetViewStyle}
        // onChange={chaggeProfileonSnapPoint}
        >
        <BottomSheetScrollView
          style={{alignSelf: 'center'}}
          contentContainerStyle={styles.bottomSheetContentContainer}
          showsVerticalScrollIndicator={false}
          >
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
                    onPress={() => navigator.push(item.to)}
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
          {user.type === userType.student
            ? studentBlocks.map(item => item)
            : staffBlocks.map(item => item)}
        </BottomSheetScrollView>
      </BottomSheet>
      <BottomSheetModalProvider>
        <MenuBottomSheet open={menuOpen} changeOpen={setMenuOpen} />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default memo(Dashboard);
