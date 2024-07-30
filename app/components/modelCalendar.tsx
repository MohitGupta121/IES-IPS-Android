import {
  Modal,
  Portal,
  Text,
  Button,
  PaperProvider,
  Dialog,
  TextInput,
} from 'react-native-paper';
import CalendarPicker from 'react-native-calendar-picker';
import {CalendarPickerProps} from "react-native-calendar-picker";
import {useTheme} from 'react-native-paper';
import {themeType} from '../theme';
import { StyleSheet, Pressable, StyleProp, TextStyle, ScrollView } from 'react-native';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';


interface ModalCalendarProps extends CalendarPickerProps {
  onChange : (value:string)=>void,
  textInputStyles? : StyleProp<TextStyle>,
  headerText : string,
  disabled? : boolean|undefined,
  value? : string|null,

}

const ModelCalendar = (props:ModalCalendarProps) => {
    const [visible, setVisible] = useState(false);
    const showModal = useCallback(() => {
      if(!props.disabled ) setVisible(true)
    } , [props])
    const hideModal = () => setVisible(false);
    const [value ,setValue ] = useState<string|undefined>(undefined)
    const containerStyle = {backgroundColor: 'white', padding: 20};
    const theme: themeType = useTheme();
  const styles = StyleSheet.create({
    calendar: {
    //   maxWidth: "auto",
    maxWidth : 600,
    alignSelf:"center" ,
    maxHeight : 400,
    },
    textInput: {
        borderRadius: 8,
        borderBottomLeftRadius : 0,
        borderBottomRightRadius : 0,
    },
    textStyle:{
      color: theme.colors.black
    }
  });

  useEffect(()=>{
    if( props?.value){
      let newVal = dayjs(props.value);
      setValue(newVal.format('DD-MM-YYYY'))
    }else{
      setValue(undefined);
    }
  },[props.value])


  return (
    <>
      <Portal theme={theme} >
        <Dialog visible={visible} onDismiss={hideModal} style={styles.calendar}>
          <ScrollView>
          <Dialog.Content>
            <Dialog.Title style={{textAlign:"center"}}>
                {props.headerText} 
            </Dialog.Title >
            <CalendarPicker
            {...props}
                width={330}
                selectedDayColor={theme.colors.container_background}
                textStyle={styles.textStyle}
                onDateChange={date=>{
                  let dataObj = dayjs(date);
                  props.onChange(date.toISOString());
                  setValue(dataObj.format('DD-MM-YYYY'))
                }}
                
            />
          </Dialog.Content>
          </ScrollView>
          <Dialog.Actions>
            <Button onPress={hideModal}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Pressable onPress={showModal}>
      <TextInput 
        style={[styles.textInput , props.textInputStyles]}
        disabled={props.disabled}
        value={value}
        onPress={showModal}
        left={<TextInput.Icon size={20} icon={"calendar"} color={theme.colors.black}  />}
        placeholder='Select Date'
        placeholderTextColor = "#808080"
        readOnly
      />
      </Pressable>
    </>
  );
};

export default ModelCalendar;
