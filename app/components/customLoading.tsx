import {
  Falsy,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import {ActivityIndicator , Text} from 'react-native-paper';
import LottieView from 'lottie-react-native';

type props = {
  style?: ViewStyle | Falsy;
};

const CustomLoading = ({style}: props) => {
  const window = useWindowDimensions();
  const styles = StyleSheet.create({});
  return (
    <>
    <View style={[{flex: 1,gap: 10, height: window.height}, style]}>
      <LottieView
        source={require('../assets/animations/loadingAnimation.json')}
        style={[{flex: 1, height: window.height}, style]}
        autoPlay
        loop={true}
      />
      <Text
        style={{
          position: 'absolute',
          bottom: 10,
          alignSelf: 'center',
          fontSize: 20,
        }}>
        Please wait while loading...
      </Text>
    </View>
      {/* <ActivityIndicator
        animating={true}
        style={{flex: 1, height: window.height}}
        size={'large'}
      /> */}
    </>
  );
};

export default CustomLoading;
