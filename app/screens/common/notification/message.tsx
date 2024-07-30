import { View, ScrollView, StyleSheet, useWindowDimensions } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../routes/routes';
import useCollapsibleCustomHeader from '../../../hooks/useCollapsibleHeader';
import { useBackHandler } from '@react-native-community/hooks';
import MarkDownCustom from '../../../components/markDownCustom';
import CMScard from '../../../components/cms_card';
import { NotificationType } from '../../../types';
import { Text, useTheme } from 'react-native-paper';
import { themeType } from '../../../theme';
import dayjs from 'dayjs';
import Animated from 'react-native-reanimated';

const Message = () => {
    const theme:themeType = useTheme();
    const dimension = useWindowDimensions()


    const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { headerHeight, onScroll } = useCollapsibleCustomHeader();

    const styles=StyleSheet.create({
        cardStyle:{
            flex:1,
            width: dimension.width-20,
            alignItems:"baseline",
            justifyContent:"flex-start",
            elevation:5,
            borderRadius:15
        },
        title:{
          fontWeight:'700',
          textAlign:"center",
          color: theme.colors.primary
        },
        titleContainer:{
          paddingVertical : 20,

        },
        header: {
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignSelf: 'stretch',
        },
        description: {
          flexWrap: 'nowrap',
          alignSelf: 'stretch',
          marginHorizontal: 10,
        },
        descriptionCard:{
          width: dimension.width - 40,
          maxWidth: 400,
          flexWrap: 'nowrap',
          flexDirection: 'column',
          gap: 10,
          borderWidth: 1,
          borderRadius: 15,
          elevation: 2,
          backgroundColor: theme.colors.surfaceBright,
        }
    })

    const params  = useRoute<any>().params
    const notification:NotificationType = params?.notification
    useBackHandler(() => {
        navigator.pop();
        return true;
    });

  return (
    <ScrollView
        onScroll={onScroll}
        contentContainerStyle={{ paddingTop: headerHeight }}
        contentInsetAdjustmentBehavior="automatic"
        style={{ height: '100%' }}
      >
        <View style={styles.titleContainer}>
          <Text variant='headlineSmall' textBreakStrategy='highQuality' style={styles.title}>{notification.title}</Text>
        </View>
        <Animated.View sharedTransitionTag={notification.timestamp}>
          
        <CMScard style={styles.descriptionCard} >
        <View style={styles.header}>
          <Text variant="titleMedium" style={styles.title}>{notification.sender}</Text>
          <Text variant="titleSmall" style={{color: theme.colors.backdrop}}>
            {dayjs(notification.timestamp).format('DD-MM-YYYY')}
          </Text>
        </View>
        <View style={styles.description}>
          <Text
            textBreakStrategy="balanced"
            variant="labelLarge"
            style={{maxWidth: 300}}
            ellipsizeMode="tail">
            {notification.description}
          </Text>
        </View>
      </CMScard>
        </Animated.View>
        <CMScard style={styles.cardStyle}>
        <MarkDownCustom>
            {notification.message}
        </MarkDownCustom>

        </CMScard>

      </ScrollView>
  )
}

export default Message