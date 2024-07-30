import { BackHandler, Pressable, ScrollView, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view'
import NoData from '../../../components/noData';
import { useDispatch, useSelector } from 'react-redux';
import { storage } from '../../../App';
import { commonActionTypes } from '../../../redux/common/types';
import {Text, TouchableRipple, useTheme} from "react-native-paper";
import { themeType } from '../../../theme';
import  Icon  from 'react-native-vector-icons/Feather';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { setEnvironmentData } from 'worker_threads';
import { useBackHandler } from '@react-native-community/hooks';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../../../routes/routes';


const Notification = () => {
  const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const NotificationSheetRef = useRef(null);

  // @ts-ignore
  const notificationList = useSelector(store=>store.common.Notification);
  const dispatch = useDispatch();
  const window = useWindowDimensions();
  const theme:themeType = useTheme();
  
  const styles = StyleSheet.create({
    mainContianer : {
      marginTop : 50,
      maxWidth : 800,
      width: window.width,
      overflow:"visible"
    },
    hiddenRow : {
      height : 120,
      backgroundColor : theme.colors.white,
      flexDirection :"row",
      flex:1,
    },
    actionButton : {
      width: 75,
      height : 120 ,
      backgroundColor: theme.colors.error,
      alignItems:"center",
      justifyContent : "center",
    }
  });
  useBackHandler(()=>{
    navigator.pop();
    return true;
  })

  useEffect(()=>{
    
    // Check for unseen notification
    
    const notifications = storage.getString("notifications");
    if ( notifications !== undefined){
      let notificationArray = JSON.parse(notifications);
      // console.log( "storage ... " , notificationArray);
      // console.log( "redux ... " , notificationList);
      if ( notificationArray.length != notificationList.length ){
        dispatch({type:commonActionTypes.ClearNotification});
        notificationArray.map(item=>{
          dispatch({type:commonActionTypes.GetNotification , payload : item})
        })
      }
    }
  }, [notificationList]);
  
  
  const removeNotification = useCallback((index)=>{
    let notifications = notificationList.filter((item,i)=>i!==Number(index));
    dispatch({type:commonActionTypes.ClearNotification});
    storage.set("notifications" , JSON.stringify(notifications.reverse()));
    notifications.map(item=>{
      dispatch({type:commonActionTypes.GetNotification , payload : item})
    })  
  }
  ,[notificationList])

  const seenNotification = useCallback((index)=>{
    let notifications = notificationList.map((item,i)=>i===Number(index)?{...item , seen:true}:item);
    dispatch({type:commonActionTypes.ClearNotification});
    storage.set("notifications" , JSON.stringify(notifications.reverse()));
    notifications.map(item=>{
      dispatch({type:commonActionTypes.GetNotification , payload : item})
    })  
  }
  ,[notificationList])

  const [NotificationData , setNotificationData] = useState({
    open : false ,
    msg : null,
  });
  
  const closeSheetModal = useCallback(()=>{
    setNotificationData({...NotificationData , open : false})
  }, [NotificationData])

  return (
    notificationList.length==0?
    <NoData text="No Notifications" />
    :
      <GestureHandlerRootView style={{flex: 1}}>
        <BottomSheetModalProvider>
          <View style={{flex:1 , alignItems:"center"  }}>
                <SwipeListView 
                  useFlatList={true}
                  data={notificationList}
                  renderItem={(rowData , rowMap)=>(<NotificationItem notification={rowData.item} onPress={()=>{
                    setNotificationData({open:true,msg:rowData.item});
                    seenNotification(rowData.index);
                  }}
                    
                    />) }
                  keyExtractor={(item,index)=>`${index}`}
                  renderHiddenItem={(rowData , rowMap)=>(
                    <View style={styles.hiddenRow} >
                      <TouchableOpacity style={[styles.actionButton,{alignSelf:"flex-start"}]} onPress={()=>{
                        // removeNotification(rowData.index);
                        console.log(rowMap)
                        rowMap[rowData.index].manuallySwipeRow(rowMap[rowData.index].state?.hiddenWidth,
                          ()=>removeNotification(rowData.index)
                          );
                      }}>
                        <Icon name="trash-2" size={20} />
                      </TouchableOpacity>
                      <View style={{flex:1,alignItems: 'center',justifyContent: 'center',}}>
                        <Text variant='titleLarge'>Removed</Text>
                      </View>
                      <TouchableOpacity style={[styles.actionButton,{alignSelf:"flex-end"}]} onPress={()=>{
                        // removeNotification(rowData.index);
                        rowMap[rowData.index].manuallySwipeRow(rowMap[rowData.index].state?.hiddenWidth*(-1),
                        ()=>removeNotification(rowData.index)
                        );
                        }}>
                        <Icon name="trash-2" size={20} />
                      </TouchableOpacity>
                    </View>
                  )}
                  style={styles.mainContianer}
                  leftOpenValue={75}
                  rightOpenValue={-75}
                  overScrollMode='never'
                  stopLeftSwipe={150}
                  stopRightSwipe={-150}
                  closeOnScroll
                  closeOnRowPress
                />
                <NotificationBottomSheet data={NotificationData} close={closeSheetModal} />
            </View>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
  )
}

const NotificationItem = props =>{
  const theme:themeType = useTheme();
  const styles = StyleSheet.create({
    backgroundContainer : {
      backgroundColor : theme.colors.white,
      height : 120,
      padding : 10,
    },
    shadowContainer : {
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      borderRadius : 10,
      backgroundColor : theme.colors.white,
      padding : 10,
      height:100,
      gap : 5,
    },
    notificationDescription:{
      paddingHorizontal:10,
    },
    unseenNotification:{
      borderWidth:1,
      borderColor : theme.colors.primary,
      shadowColor:theme.colors.primary,
    }
  })
  return(
    <TouchableRipple onPress={props.onPress}>
      <View style={styles.backgroundContainer}>
        <View style={[styles.shadowContainer, !props.notification.seen?styles.unseenNotification:null]}>
          <Text numberOfLines={1} ellipsizeMode='tail' variant='titleLarge'>{props.notification.title}</Text>
          <Text numberOfLines={2} style={styles.notificationDescription} ellipsizeMode='tail'>{props.notification.body}</Text>
        </View>
      </View>
    </TouchableRipple>
  )
}

 const NotificationBottomSheet = (props)=>{
  const theme:themeType = useTheme();
  const window = useWindowDimensions();
  const modalRef = useRef(null);
  const styles = StyleSheet.create({
    SheetViewStyle: {
      backgroundColor: theme.colors.white,
      borderRadius: 35,
      padding: 20,
    },
    sheetBackground:{
      height:window.height,
      width:window.width,
      position:"absolute" ,
      backgroundColor:theme.colors.backdrop,
    },
    sheetScrollView : {
      padding: 10,
      gap  : 20,
    },
    msgBody:{
      padding:10,
      alignSelf:"center",
      maxWidth : 800,
      paddingBottom : 40 ,
      width:window.width-20,
    },
    msgTitle:{
      textAlign:"center",
      paddingHorizontal:40,
      paddingVertical: 10 , 
    }
  })
  useEffect(()=>{
    if ( props.data.open){
      modalRef.current?.present();
    }else{
      modalRef.current?.dismiss();
    }
  } , [props.data , modalRef])

  return (
    <Pressable onPress={props.close} style={[styles.sheetBackground,{ display:props.data.open?"flex":"none" }]}>

      <BottomSheetModal
        snapPoints={[window.height>600?500:window.height - 100  , window.height - 100]}
        ref = {modalRef}
        backgroundStyle={styles.SheetViewStyle}
        handleIndicatorStyle={{backgroundColor : theme.colors.primary}}
        onDismiss={props.close}
      >
        <BottomSheetScrollView style={styles.sheetScrollView}> 
          <Text variant="headlineMedium" style={styles.msgTitle} textBreakStrategy='highQuality'>
            {props.data.msg?.title}
          </Text>
          <View style={styles.msgBody}>
            <Text variant='bodyLarge' textBreakStrategy='balanced'>
              {props.data.msg?.body}
            </Text>
          </View>
        </BottomSheetScrollView>
    </BottomSheetModal>
  </Pressable>
  )
 }

export default Notification;

