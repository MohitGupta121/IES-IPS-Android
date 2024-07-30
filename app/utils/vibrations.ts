import ReactNativeHapticFeedback from "react-native-haptic-feedback";

const options = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  };
export function buttonClickHapticFeedback(){  
    // Trigger haptic feedback
    ReactNativeHapticFeedback.trigger("effectTick", options);
}