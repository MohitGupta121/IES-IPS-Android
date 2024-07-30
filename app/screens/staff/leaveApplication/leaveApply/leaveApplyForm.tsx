import {
    ScrollView,
    StyleSheet,
    useWindowDimensions,
    View
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { Button, Chip, Text, TextInput, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import CMScard from '../../../../components/cms_card';
import ModelCalendar from '../../../../components/modelCalendar';
import { themeType } from '../../../../theme';
import { Controller, useFormContext } from 'react-hook-form';
import { LeaveApplyFormValues, LeaveType } from '../leaveApply';
import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { number } from 'yup';
import { storage } from '../../../../App';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import AnimatedOutlineButton from '../../../../components/animatedOutlineButton';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useCollapsibleCustomHeader from '../../../../hooks/useCollapsibleHeader';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../../routes/routes';
import { ResponsibilityItem } from './otherResponsibility';
import { FacultyAssignedClassItem } from './lectureAssignment';
import { Toast } from 'react-native-toast-notifications';
import { useMutation, useQuery } from 'react-query';
import { staffApi } from '../../../../api/API';
import { useLeaveApply } from '../../../../hooks/query/staff';


const LeaveApplyForm = (props:{parentNavigation:NativeStackNavigationProp<RootStackParamList>}) => {
  const dimension = useWindowDimensions();
  const theme: themeType = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


  const { onScroll , headerHeight} = useCollapsibleCustomHeader();


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
    chipStyle: {
      width: 150,
      borderRadius: 20,
      alignContent: 'center',
    },
    lectureAssignCard: {
      elevation: 5,
      flex: 1,
      flexDirection: 'column',
      width: dimension.width - 30,
      flexWrap: 'nowrap',
      paddingVertical: 20,
      alignItems: 'center',
    },
    lectureAssignContainer: {
      flex: 1,
      paddingVertical: 20,
      gap: 5,
    },
    reponsibilityAssignCard: {
      elevation: 5,
      flex: 1,
      flexDirection: 'column',
      width: dimension.width - 30,
      flexWrap: 'nowrap',
      paddingVertical: 20,
      alignItems: 'center',
    },
    reponsibilityAssignContainer: {
      flex: 1,
      paddingVertical: 20,
      gap: 5,
    },
    submitButton: {
      width: 150,
      alignSelf: 'center',
      marginVertical: 20,
    },
  });


  const {mutation:leaveApplyMutation} = useLeaveApply( {
    onSuccess : (data)=>{
      console.log(data);
      Toast.show("",{
        type: "success",
        text1 : "Leave Applied",
        text2 : "Leave Application has forwarded",
      });
      leaveApplyForm.reset();
      props.parentNavigation.pop();
    }
  })


  const leaveApplyForm = useFormContext<LeaveApplyFormValues>();

  const other_responsibilities = leaveApplyForm.watch('other_responsibility')
  const lectures_assigned = leaveApplyForm.watch('lectures_assigned')


  const leave_type = leaveApplyForm.watch('leave_type');

  const [{LeaveBalance: leaveBalance}, setLeaveBalance]:[any , (prevalue:any)=>void] = useMMKVStorage(
    'Staff',
    storage,
    {LeaveBalance: {}},
  );

  const [remDays ,setRemDays] = useState<number>(-1);

  const LeaveTypeDropdown = useMemo<{label:string, value:LeaveType}[]>(()=>([
    {label : 'CL' ,value:'cl'} ,
     {label : 'EL' ,value:'el'} ,
     {label : 'DL' ,value:'dl'} ,
     {label : 'OL' ,value:'ol'} ,
     {label : 'HDCL' ,value:'hdcl'} ,
     {label : 'LWP' ,value:'lwp'} ,
     {label : 'SDL' ,value:'sdl'} ,
  ]) , []);

  useEffect(()=>{
    console.log("leaveApply form :" , leaveApplyForm.getValues());
  } , [leaveApplyForm.formState])


  const submitLeaveApply = ()=>{
    console.log("Submit : ",JSON.stringify(leaveApplyForm.getValues() , null ,2) );
    leaveApplyForm.control._executeSchema([]).then(error=>{
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
        const ApplyData:Exclude<LeaveApplyFormValues , null|undefined> = leaveApplyForm.getValues();
        leaveApplyMutation.mutate(ApplyData);
      }
    }).catch(error=>console.log(error));
  }


  


  return (
    <GestureHandlerRootView style={{flex: 1}}>

    <ScrollView style={styles.rootContainer} onScroll={onScroll} contentContainerStyle={{paddingBottom:50 , paddingTop:headerHeight}}>
      <CMScard style={styles.formCardStyle}>
        <Text variant="labelLarge" style={styles.heading}>
          Attendance Details
        </Text>
        <View style={styles.fieldContainer}>
          <View style={{gap: 5}}>
            <Text>Types of Leave</Text>
            <Controller
              control={leaveApplyForm.control}
              name="leave_type"
              render={({field: {onChange, onBlur, value, name}}) => (
                <Dropdown
                  mode="modal"
                  data={LeaveTypeDropdown}
                  labelField={'label'}
                  valueField={'value'}
                  searchField={'label'}
                  onChange={item => {
                    onChange(item.value);
                    if (
                      item.value == 'cl' ||
                      item.value == 'el' ||
                      item.value == 'dl' ||
                      item.value == 'ol' ||
                      item.value == 'hdcl'
                    )
                      setRemDays(leaveBalance[item.value]);
                    else setRemDays(-1);
                  }}
                  //@ts-ignore
                  value={value}
                  itemTextStyle={styles.itemTextStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  style={styles.dropdown}
                  selectedTextProps={{
                    numberOfLines: 1,
                    ellipsizeMode: 'tail',
                  }}
                  placeholder={'Types of Leave'}
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
              )}
            />
          </View>
          <View style={{gap: 5}}>
            <Text>No Of Days</Text>

            <Controller
              control={leaveApplyForm.control}
              name="days"
              render={({field: {onChange, onBlur, value, name}}) => (
                <TextInput
                  disabled={!Boolean(remDays)}
                  style={styles.input}
                  inputMode="numeric"
                  // textContentType='telephoneNumber'
                  onChangeText={(value:string)=>{
                    leaveApplyForm.setValue("days",Number(value));
                    leaveApplyForm.resetField('start_date');
                    leaveApplyForm.resetField('end_date');
                  }}
                  onBlur={onBlur}
                  error={remDays!=-1?(Math.round(leaveApplyForm.watch('days')!) > remDays ) :false}
                  value={value?.toString()}
                  placeholder="Days"
                  keyboardType="numeric"
                />
              )}
            />
            {remDays != -1 ? (
              <Chip style={styles.chipStyle} compact >
                <Text variant="labelMedium">
                  {leaveBalance[leave_type&&leave_type!='hdcl'?leave_type:'cl']}{' '}
                  Leaves Remain
                </Text>
              </Chip>
            ) : null}
          </View>

          <View style={{gap: 5}}>
            <Text>Leave Start Date</Text>

            <Controller
              control={leaveApplyForm.control}
              name="start_date"
              render={({field: {onChange, onBlur, value, name}}) => (
                <ModelCalendar
                  disabled={!Boolean(leaveApplyForm.watch('days'))}
                  value={value}
                  onChange={(value: string) => {
                    onChange(value);
                    let start_date = dayjs(value);
                    let days: number = leaveApplyForm.watch('days')!;
                    let end_date = start_date.add(days-1, 'day').toISOString();
                    console.log(end_date);
                    leaveApplyForm.setValue('end_date', end_date);
                  }}
                  headerText="Leave Start Date"
                />
              )}
            />
          </View>
          <View style={{gap: 5}}>
            <Text>Leave End Date</Text>

            <Controller
              control={leaveApplyForm.control}
              name="end_date"
              render={({field: {onChange, onBlur, value, name}}) => (
                <ModelCalendar
                  disabled
                  onChange={onChange}
                  value={value}
                  headerText="Leave End Date"
                />
              )}
            />
          </View>
          <View style={{gap: 5}}>
            <Text>Reason for leave</Text>
            <Controller
              control={leaveApplyForm.control}
              name="reason"
              render={({field: {onChange, onBlur, value, name}}) => (
                <TextInput
                  style={styles.input}
                  onChangeText={onChange}
                  value={value || undefined}
                  onBlur={onBlur}
                  placeholder="Reason"
                />
              )}
            />
          </View>
        </View>
      </CMScard>
      <CMScard style={styles.lectureAssignCard}>
        <Text variant="labelLarge" style={styles.heading}>
          Lecture Assignment
        </Text>
        <View style={styles.lectureAssignContainer}>
        {
              lectures_assigned.map((faculty,index)=>(
                <FacultyAssignedClassItem faculty={faculty} index={index} key={index}  />
              ))
            }

        </View>
        <AnimatedOutlineButton 
        color='blue'
        icon={'plus'}
        onPress={()=>navigation.navigate("Lecture Assignment")}
        >ADD</AnimatedOutlineButton>
      </CMScard>
      <CMScard style={styles.reponsibilityAssignCard}>
        <Text variant="labelLarge" style={styles.heading}>
          Other Responsibility
        </Text>
        <View style={styles.reponsibilityAssignContainer}>
              {
                  other_responsibilities.map((item, index)=>(
                    <ResponsibilityItem index={index} key={`${index}`} facutly={item} />
                ))
              }
        </View>
        <AnimatedOutlineButton 
        color='blue'
        icon={'plus'}
        onPress={()=>navigation.navigate("Other Responsibility")}
        >ADD</AnimatedOutlineButton>
      </CMScard>
      <Button mode="contained" style={styles.submitButton} onPress={submitLeaveApply} 
      disabled={!Boolean(lectures_assigned.length||other_responsibilities.length)}
      >Apply</Button>
    </ScrollView>
    </GestureHandlerRootView>
  );
}

export default LeaveApplyForm