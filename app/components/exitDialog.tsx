import { StatusBar } from "react-native";
import RNExitApp from "react-native-exit-app";
import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper";
import { themeType } from "../theme";

const ExitDialog = props => {
  const theme : themeType = useTheme();
    return (
      <Portal>
        {props.exitDialogVisible ? <StatusBar backgroundColor={'#838cb3'} />: null}
        <Dialog
          visible={props.exitDialogVisible}
          onDismiss={() => props.setExitDialogVisible(false)}>
          <Dialog.Title>Exit App </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Do you really want to exit?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => props.setExitDialogVisible(false)}>
              Cancel
            </Button>
            <Button onPress={() => RNExitApp.exitApp()}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };

  export default ExitDialog;