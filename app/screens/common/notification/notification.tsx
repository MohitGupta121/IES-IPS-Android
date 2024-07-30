
import { memo, useCallback, useEffect } from 'react';
import { ScrollView, StatusBar, SafeAreaView, Linking, useWindowDimensions, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import MarkDownCustom from '../../../components/markDownCustom';
import { useBackHandler } from '@react-native-community/hooks';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../routes/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import useCollapsibleCustomHeader from '../../../hooks/useCollapsibleHeader';
import { themeType } from '../../../theme';
import Animated, { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import CMScard from '../../../components/cms_card';
import { View } from 'react-native-ui-lib';
import dayjs from 'dayjs';
import { NotificationType } from '../../../types';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { storage } from '../../../App';
import {useAnimatedStyle} from 'react-native-reanimated';
import { buttonClickHapticFeedback } from '../../../utils/vibrations';
import NoData from '../../../components/noData';

const Notification = () => {
  const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { headerHeight, onScroll } = useCollapsibleCustomHeader();

  useBackHandler(() => {
    navigator.pop();
    return true;
  });

  const [notificationList, setNotificationList] = useMMKVStorage<any>('Notification', storage, []);

  // useEffect(()=>{
  //   console.log(notificationList.map(item=>item.seen))
  // } ,[notificationList])

  const seenNotification = useCallback((index)=>{
    setNotificationList(prev =>
      prev.map((notification: NotificationType, i: number) =>
        i == index ? {...notification, seen: true} : notification,
      ),
    );
  },[notificationList])

  return (
    <SafeAreaView>
      <ScrollView
        onScroll={onScroll}
        contentContainerStyle={{ paddingTop: headerHeight }}
        contentInsetAdjustmentBehavior="automatic"
        style={{ height: '100%'  }}
      >
        <View>
          {notificationList.map((item, index) => (
            <NotificationItem notification={item} key={index}  index={index} seenNotification={seenNotification} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notification;


type NotificationProps = {
  notification:NotificationType,
  index : number,
  seenNotification : (index:number)=>void,
}

const NotificationItem = (props:NotificationProps)=>{
  const theme:themeType = useTheme();
  const dimension = useWindowDimensions()
  const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const styles = StyleSheet.create({
    cardStyle: {
      width: dimension.width - 40,
      maxWidth: 400,
      flexWrap: 'nowrap',
      flexDirection: 'column',
      gap: 10,
      borderWidth: 1,
      borderRadius: 15,
      elevation: 2,
      backgroundColor: theme.colors.surfaceBright,
    },
    seen:{
      borderColor: theme.colors.backdrop,
    },
    unseen:{
      borderColor: theme.colors.primary,
    },
    header: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignSelf: 'stretch',
      flexWrap:"nowrap",
    },
    description: {
      flexWrap: 'nowrap',
      alignSelf: 'stretch',
      marginHorizontal: 15,
    },
    title:{
      fontWeight:'700',
      maxWidth:290,
    },
    dateStyle:{
      color:theme.colors.backdrop,
      shadowColor:theme.colors.white,
      elevation:5
    }
  });

  const onPress = useCallback(()=>{
    navigator.navigate("Message" , {notification : props.notification});
    props.seenNotification(props.index);
    buttonClickHapticFeedback();
  },[props])

  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(()=>({
    transform:[{scale : scale.value}],
  }))


  const animateIn = useCallback(()=>scale.value=withTiming(0.95,{duration:250}) , []);
  const animateOut = useCallback(()=>scale.value=withTiming(1,{duration:250}) , []);


  return (
    <Animated.View style={animatedStyle} sharedTransitionTag={props.notification.timestamp} >
      <Pressable onPress={onPress} onPressIn={animateIn} onPressOut={animateOut}>
      <CMScard style={[styles.cardStyle , props.notification.seen?styles.seen:styles.unseen]}>
        <View style={styles.header}>
          <Text numberOfLines={1} ellipsizeMode='tail' variant="titleMedium" style={styles.title}>{props.notification.title}</Text>
          <Text variant="titleSmall" style={styles.dateStyle}>
            {dayjs(props.notification.timestamp).format('DD-MM-YYYY')}
          </Text>
        </View>
        <View style={styles.description}>
          <Text
            textBreakStrategy="balanced"
            variant="labelLarge"
            numberOfLines={3}
            style={{maxWidth: 300}}
            ellipsizeMode="tail">
            {props.notification.description}
          </Text>
        </View>
      </CMScard>
      </Pressable>
    </Animated.View>
  );
}

