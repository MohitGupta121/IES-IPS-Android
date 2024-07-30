import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native'
import { Button, Text, TextInput, useTheme } from 'react-native-paper'
import useCollapsibleCustomHeader from '../../../hooks/useCollapsibleHeader';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../routes/routes';
import { themeType } from '../../../theme';
import Icon from 'react-native-vector-icons/Feather';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dropdown } from 'react-native-element-dropdown';
import CMScard from '../../../components/cms_card';
import { useCallback, useEffect, useState } from 'react';
import { useGetBatches, useGetStudentsByBatchId, useSendNotification } from '../../../hooks/query/staff';
import { reducerData } from '../../../redux/common/reducer';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { storage } from '../../../App';
import { useAcademicSession } from '../../../hooks/query/common';
import { Toast } from 'react-native-toast-notifications';
import { useBackHandler } from '@react-native-community/hooks';

export const notificationValidationSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required('Title is required')
    .max(100, 'Title must be at most 100 characters')
    .test('is-not-empty', 'Title cannot be an empty string', (value) => value !== ''),
  description: Yup.string()
    .trim()
    .required('Description is required')
    .max(500, 'Description must be at most 500 characters')
    .test('is-not-empty', 'Description cannot be an empty string', (value) => value !== ''),
  message: Yup.string()
    .trim()
    .required('Message is required')
    // .max(1000, 'Message must be at most 1000 characters')
    .test('is-not-empty', 'Message cannot be an empty string', (value) => value !== ''),
  sender_computer_code: Yup.number()
    .required('Sender Computer Code is required')
    .positive('Sender Computer Code must be a positive number')
    .integer('Sender Computer Code must be an integer'),
  send_to: Yup.array()
    .of(
      Yup.number()
        .positive('Recipient Code must be a positive number')
        .integer('Recipient Code must be an integer')
    )
    .min(1, 'At least one recipient is required')
    .required('Send To is required'),
});




interface NotificationFormValues {
    title: string|null;
    description: string|null;
    message: string|null;
    sender_computer_code: number|null;
    send_to: number[];
}

const defaultValues: NotificationFormValues = {
    title: null,
    description: null,
    message: null,
    sender_computer_code: null,
    send_to: []
};



const NotifyBatches = () => {
    const dimension = useWindowDimensions();
    const theme: themeType = useTheme();
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const styles = StyleSheet.create({
        formCardStyle: {
          width: dimension.width - 30,
          flexWrap: 'nowrap',
          flexDirection: 'column',
          gap: 20,
          paddingVertical: 20,
        },
        rootContainer: {
          flex: 1,
        },
        fieldContainer: {
          gap: 20,
          alignSelf: 'flex-start',
        },
        heading: {
          textAlign: 'center',
          fontSize: 20,
        },
        input: {
          // width: 200
        },
        selectedTextStyle: {
          color: theme.colors.black,
        },
        itemTextStyle: {
          color: theme.colors.black,
        },
        dropdown: {
          width: dimension.width - 60,
          maxWidth: 760,
          backgroundColor: theme.colors.surfaceContainer,
          borderRadius: 5,
          padding: 10,
          paddingHorizontal: 15,
        },
        placeholder: {
          color: theme.colors.onPrimaryContainer,
          opacity: 0.6,
        },
        inputSearch: {
          backgroundColor: theme.colors.surfaceContainer,
          borderRadius: 5,
        },
        dropdownConainter: {
          borderRadius: 5,
          maxHeight: dimension.height - 60,
        },
        disableStyle: {
          opacity: 0.5,
        },
        submitButton: {
            width: 150,
            alignSelf: 'center',
            marginVertical: 20,
        },
        messageInput:{
            height:100
        }

    })

    useBackHandler(() => {
        navigation.pop();
        return true;
      });

    const {onScroll , headerHeight} = useCollapsibleCustomHeader();

    const {mutation} = useSendNotification({
        onSuccess:(data:any)=>{
            Toast.show("",{
                type: "success",
                text1 : "Notifcation Sent",
                text2 : "Notification Sent to all Students",
              });
              notificationFrom.reset();
              navigation.pop();
        }
    });
    const {mutation:studentListMutation} = useGetStudentsByBatchId({
        onSuccess:(data:any)=>{
            notificationFrom.setValue("send_to" , data.data.map(item=>item.computer_code))
        }
    });

    type User = Pick<reducerData["User"] , "user" >;
    const [ {user} , setUser ] = useMMKVStorage<User>("User" , storage , {user:{}});

    const [departments, setDepartments] = useMMKVStorage(
        'Departments',
        storage,
        [],
      );
  
    const {current_academic_session_id:current_session} = useAcademicSession();
    const { facultySubjects , queryState:{isLoading , isError}} = useGetBatches(user.computer_code ,current_session);

    const [batches , setBatches ] = useState([])

    const [batch_id , setBatch_id ] = useState(null)

    
    useEffect(()=>{
        if(batch_id){
            studentListMutation.mutate({batch_id})
        }
    } , [batch_id])


    useEffect(()=>{
        if (facultySubjects) setBatches(facultySubjects.map(item=>({label : `${item.subject.subject_name} (${departments.find(department=>department.id===item.subject.department)?.dept_code})`, value : item.subject.batch_id})))
    } ,[departments , facultySubjects])

    // console.log(facultySubjects)

    const notificationFrom = useForm<NotificationFormValues>({
        defaultValues,
        resolver: yupResolver<any>(notificationValidationSchema)
      });
    
      const onSubmit = useCallback(() => {
        notificationFrom.setValue('sender_computer_code' , user.computer_code);
        console.log(notificationFrom.getValues());
        notificationFrom.control._executeSchema([]).then(error=>{
            let errorFields = Object.keys(error.errors)
      
            if ( errorFields.length !=0 ) {
                errorFields.map(item=>{
                    Toast.show('', {
                      type: 'error',
                      text1: `${error.errors[item]['message']}`,
                      text2: `${item} is not provided`,
                    });
      
                })
            }else{
                mutation.mutate(notificationFrom.getValues())
            }
          }).catch(error=>console.log(error));
      },[notificationFrom , user]);
    


  return (
    <ScrollView style={styles.rootContainer} onScroll={onScroll} contentContainerStyle={{paddingBottom:50 , paddingTop:headerHeight}}>
        <CMScard style={styles.formCardStyle}>
        <Text variant="labelLarge" style={styles.heading}>
          Create Notification
        </Text>
        <View style={styles.fieldContainer}>
          <View style={{gap: 5}}>
            <Text>Types of Leave</Text>
            
                <Dropdown
                  mode="modal"
                  data={batches.length?batches:[{label : "Loading..." , value:''}]}
                  labelField={'label'}
                  valueField={'value'}
                  searchField={'label'}
                  onChange={(item:any) => setBatch_id(item.value)}
                  //@ts-ignore
                  value={batch_id}
                  itemTextStyle={styles.itemTextStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  style={styles.dropdown}
                  selectedTextProps={{
                    numberOfLines: 1,
                    ellipsizeMode: 'tail',
                  }}
                  placeholder={'Select Batch'}
                  placeholderStyle={styles.placeholder}
                  search={true}
                  inputSearchStyle={styles.inputSearch}
                  searchPlaceholder="Search"
                  containerStyle={styles.dropdownConainter}
                  flatListProps={{initialNumToRender: 20, windowSize: 2}}
                  renderLeftIcon={() => (
                    <Icon
                      name="align-center"
                      style={{
                        color: theme.colors.onPrimaryContainer,
                        paddingRight: 5,
                      }}
                      size={20}
                    />
                  )}
                />
          </View>
          <View style={{gap: 5}}>
            <Text>Title</Text>

            <Controller
              control={notificationFrom.control}
              name="title"
              render={({field: {onChange, onBlur, value, name}}) => (
                <TextInput
                  style={styles.input}
                  // textContentType='telephoneNumber'
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value||undefined}
                  placeholder="Title"
                />
              )}
            />
        </View>
          <View style={{gap: 5}}>
            <Text>Description</Text>

            <Controller
              control={notificationFrom.control}
              name="description"
              render={({field: {onChange, onBlur, value, name}}) => (
                <TextInput
                  style={styles.input}
                  // textContentType='telephoneNumber'
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value||undefined}
                  placeholder="Descirption"
                />
              )}
            />
        </View>
          <View style={{gap: 5}}>
            <Text>Message</Text>

            <Controller
              control={notificationFrom.control}
              name="message"
              render={({field: {onChange, onBlur, value, name}}) => (
                <TextInput
                  contentStyle={styles.messageInput}
                  // textContentType='telephoneNumber'
                  multiline
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value||undefined}
                  placeholder="Message"
                />
              )}
            />
        </View>
        </View>
        <Button mode="contained" style={styles.submitButton} onPress={onSubmit} disabled={mutation.isLoading} 
      >Send</Button>
        </CMScard>
    </ScrollView>
  )
}

export default NotifyBatches