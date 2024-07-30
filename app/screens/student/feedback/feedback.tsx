import {BackHandler, ScrollView, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Button, Chip, List, Text, useTheme} from 'react-native-paper';
import {Item} from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import {themeType} from '../../../theme';
import CMScard from '../../../components/cms_card';
import  Icon  from 'react-native-vector-icons/Feather';
import { useBackHandler } from '@react-native-community/hooks';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../../../routes/routes';
import Animated, { SlideInLeft } from 'react-native-reanimated';
import useCollapsibleCustomHeader from '../../../hooks/useCollapsibleHeader';

const Feedback = () => {
  const navigator = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const theme: themeType = useTheme();
  const {onScroll , headerHeight} = useCollapsibleCustomHeader();
  const styles = StyleSheet.create({
    listItem: {
      borderRadius: 10,
      margin: 5,
      backgroundColor: theme.colors.white,
      alignSelf: 'center',
      maxWidth: 500,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    listItemTitle: {
      fontSize: 18,
      fontWeight: '800',
    },
    description: {
      padding: 10,
    },
    listItemPresent: {
      backgroundColor: theme.colors.container_green,
      borderColor: theme.colors.green,
      borderWidth: 0,
      borderRadius: 20,
    },
    listItemAbsent: {
      backgroundColor: theme.colors.container_red,
      borderColor: theme.colors.red,
      borderWidth: 0,
      borderRadius: 20,
    },
    listItemTitlePresent: {
      color: theme.colors.green,
    },
    listItemTitleAbsent: {
      color: theme.colors.red,
    },
    ModalSheetStyle: {
      borderRadius: 35,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 12,
      },
    },
    bottomSheetContainer: {
      padding: 20,
      backgroundColor: theme.colors.backdrop,
    },
  });
  useBackHandler(()=>{
    navigator.pop();
    return true;
  })
  return (
    <ScrollView onScroll={onScroll} style={{paddingTop: 50}}>
      
      <Animated.View entering={SlideInLeft.duration(500)}>

      <List.Item
        // @ts-ignore
        title="NBA Feedback"
        titleNumberOfLines={1}
        // @ts-ignore
        style={[styles.listItem]}
        titleStyle={[styles.listItemTitle]}
        onPress={() =>
          navigator.navigate('NbaFeedbackStatus')
        }
        right={props => {
          return (
            <Icon name="arrow-right" size={30} color={theme.colors.primary} />
          );
        }}
      />
      </Animated.View>
      
      <Animated.View entering={SlideInLeft.duration(500)}>

      <List.Item
        // @ts-ignore
        title="Facility Feedback"
        titleNumberOfLines={1}
        // @ts-ignore
        style={[styles.listItem]}
        titleStyle={[styles.listItemTitle]}
        onPress={() =>
          navigator.navigate('FacilityFeedbackStatus')
        }
        right={props => {
          return (
            <Icon name="arrow-right" size={30} color={theme.colors.primary} />
          );
        }}
      />
      </Animated.View>
      
      <Animated.View entering={SlideInLeft.duration(500)}>

      <List.Item
        // @ts-ignore
        title="Faculty Feedback"
        titleNumberOfLines={1}
        // @ts-ignore
        style={[styles.listItem]}
        titleStyle={[styles.listItemTitle]}
        onPress={() => navigator.navigate('FacultyFeedbackStatus')}
        right={props => {
          return (
            <Icon name="arrow-right" size={30} color={theme.colors.primary} />
          );
        }}
      />
      </Animated.View>
    </ScrollView>
  );
};

export default Feedback;
