
import React, {useEffect} from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import CMScard from '../../../components/cms_card';

const MyProfile = () => {
  
  return (
    <GestureHandlerRootView>
    <View style={{paddingTop: 50}}>
        <CMScard>
        <Text>My Profile</Text>
        </CMScard>
    </View>
    </GestureHandlerRootView>
  );
};

export default MyProfile;

