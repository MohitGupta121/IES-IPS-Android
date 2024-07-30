import {View, useWindowDimensions, StyleSheet} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import useCollapsibleCustomHeader from '../../../../hooks/useCollapsibleHeader';
import {HeaderContext} from '../../../../context/headerCollapse';
import {themeType} from '../../../../theme';
import {useTheme, Text, TextInput, Button, DataTable} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form';
import CMScard from '../../../../components/cms_card';
import Icon from 'react-native-vector-icons/Feather';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import ModelCalendar from '../../../../components/modelCalendar';
import {useMutation, useQuery} from 'react-query';
import {commonApi} from '../../../../api/API';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {storage} from '../../../../App';
import {reducerData} from '../../../../redux/common/reducer';
import {LeaveApplyFormValues} from '../leaveApply';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {Toast} from 'react-native-toast-notifications';
import dataTableStyles from '../../../../cmsStyles/dataTableStyles';
import {Item} from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import AnimatedOutlineButton from '../../../../components/animatedOutlineButton';
import {userType} from '../../../../constants';
import Animated from 'react-native-reanimated';
import dayjs from 'dayjs';
import {useBackHandler} from '@react-native-community/hooks';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { useGetDepartments, useGetFacultyByDepartment, useGetLectureType, useGetTimeSlot, useGetNameByComputerCode } from '../../../../hooks/query/common';

const assignedClassSchema = yup.object().shape({
  assigned_class_dept: yup
    .string()
    .required('Assigned class department is required'),
  assigned_section: yup.string().required('Assigned section is required'),
  lecture_type: yup.string().required('Lecture type is required'),
  start_time: yup.string().required('Start time is required'),
  end_time: yup.string().required('End time is required'),
});

const lectureAssignedSchema = yup.object().shape({
  faculty_computer_code: yup
    .number()
    .required('Faculty computer code is required'),
  faculty_date: yup.string().required('Faculty date is required').nullable(),
  assigned_class: yup
    .array()
    .of(assignedClassSchema)
    .min(1, 'At least one assigned class is required')
    .required('Assigned class is required'),
});

interface AssignedClass {
  assigned_class_dept: string | null;
  assigned_section: string | null;
  lecture_type: string | null;
  start_time: string | null;
  end_time: string | null;
}

interface LectureAssigned {
  faculty_computer_code: number | null;
  faculty_date: string | null;
  assigned_class: AssignedClass[] | [];
}

const defaultLectureAssignedValues: LectureAssigned = {
  faculty_computer_code: null,
  faculty_date: null,
  assigned_class: [],
};

const defaultAssignedClassValues: AssignedClass = {
  assigned_class_dept: null,
  assigned_section: null,
  lecture_type: null,
  start_time: null,
  end_time: null,
};

const LectureAssignment = () => {
  const {collapse, expand} = useCollapsibleCustomHeader();
  const theme: themeType = useTheme();
  const dimension = useWindowDimensions();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

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
      width: 100,
      alignSelf: 'center',
      marginVertical: 20,
    },
    lecureAssignCard: {
      elevation: 5,
      flex: 1,
      flexDirection: 'column',
      width: dimension.width - 30,
      flexWrap: 'nowrap',
      paddingVertical: 20,
      alignItems: 'center',
    },
    lecureAssignContainer: {
      flex: 1,
      paddingVertical: 20,
      gap: 5,
    },
    proceedButton: {
      width: 150,
      alignSelf: 'center',
      marginVertical: 20,
    },
    classCard: {
      width: dimension.width - 60,
      maxWidth: 760,
      flexWrap: 'nowrap',
      flexDirection: 'column',
      gap: 20,
      paddingVertical: 20,
      margin: 0,
      backgroundColor: theme.colors.surfaceContainerLow,
    },
    nestedDropdown: {
      width: dimension.width - 100,
      maxWidth: 740,
      backgroundColor: theme.colors.surfaceContainer,
      borderRadius: 5,
      padding: 10,
      paddingHorizontal: 15,
    },
    nestedInput: {
      width: dimension.width - 100,
      maxWidth: 740,
    },
  });

  useEffect(() => {
    collapse();
    return expand;
  });

  useBackHandler(() => {
    navigation.pop();
    return true;
  });

  const {mutation} = useGetFacultyByDepartment({onSuccess:(data: any) => {
      setFacultyByDepartment(
        data.filter(item => item.computer_code != user.computer_code),
      );
    }});


  const [departments, setDepartments] = useMMKVStorage(
    'Departments',
    storage,
    [],
  );
  type User = Pick<reducerData['User'], 'user'>;
  const [{user}, setUser] = useMMKVStorage<User>('User', storage, {user: {}});

  // useEffect(()=>{console.log(departments)} , [departments])

  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [facultyByDepartment, setFacultyByDepartment] = useState([]);

  const {lectureTypes} = useGetLectureType();
  const {timeSlots} = useGetTimeSlot();

  const leaveApplyForm = useFormContext<LeaveApplyFormValues>();

  const start_date = new Date(leaveApplyForm.watch('start_date')!);
  const end_date = new Date(leaveApplyForm.watch('end_date')!);

  const lectures_assigned = leaveApplyForm.watch('lectures_assigned');

  const lectureAssignForm = useForm<LectureAssigned>({
    defaultValues: defaultLectureAssignedValues,
    resolver: yupResolver<any>(lectureAssignedSchema),
  });

  const assignedClassForm = useForm<AssignedClass>({
    defaultValues: defaultAssignedClassValues,
    resolver: yupResolver<any>(assignedClassSchema),
  });

  const assigned_class = lectureAssignForm.watch('assigned_class');

  const addClass = useCallback(() => {
    console.log('Assigned Classes', assignedClassForm.getValues());

    assignedClassForm.control
      ._executeSchema([])
      .then(error => {
        let errorFields = Object.keys(error.errors);

        if (errorFields.length != 0) {
          errorFields.map(item => {
            Toast.show('', {
              type: 'error',
              text1: `${error.errors[item]['message']}`,
              text2: `${item} is not provided`,
            });
          });
        } else {
          let prev = lectureAssignForm.getValues().assigned_class;
          lectureAssignForm.setValue('assigned_class', [
            assignedClassForm.getValues(),
            ...prev,
          ]);

          assignedClassForm.reset();
        }
      })
      .catch(error => console.log(error));
  }, [assignedClassForm, lectureAssignForm]);

  const addLectureAssignment = useCallback(() => {
    console.log('Lecutre Assignment', lectureAssignForm.getValues());

    lectureAssignForm.control
      ._executeSchema([])
      .then(error => {
        let errorFields = Object.keys(error.errors);
        console.log(errorFields)

        if (errorFields.length != 0) {
          errorFields.map(item => {
            Toast.show('', {
              type: 'error',
              text1: `${error.errors[item]['message']}`,
              text2: `${item} is not provided`,
            });
          });
        } else {

          let lecutureAssignFomValues = lectureAssignForm.getValues();
          if( lecutureAssignFomValues.faculty_date == null){
            Toast.show('', {
              type: 'error',
              text1: `Faculty Date is Require`,
              text2: `faculty_date is not provided`,
            });
            return ;
          }

          let prev = leaveApplyForm.getValues().lectures_assigned;
          leaveApplyForm.setValue('lectures_assigned', [
            lectureAssignForm.getValues(),
            ...prev,
          ]);

          assignedClassForm.reset();
          lectureAssignForm.reset();
          setSelectedDepartment(null);
        }
      })
      .catch(error => console.log(error));
  }, [lectureAssignForm, assigned_class, leaveApplyForm]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ScrollView
        style={styles.rootContainer}
        contentContainerStyle={{paddingBottom: 50}}>
        <FormProvider {...lectureAssignForm}>
          <CMScard style={styles.formCardStyle}>
            <Text variant="labelLarge" style={styles.heading}>
              Lecture Assignment
            </Text>
            <View style={styles.fieldContainer}>
              <View style={{gap: 5}}>
                <Text>Select Department</Text>
                <Dropdown
                  mode="modal"
                  data={departments}
                  labelField={'name'}
                  valueField={'id'}
                  searchField={'name'}
                  onChange={(item: any) => {
                    setSelectedDepartment(item.id);
                    mutation.mutate(item.id);
                    lectureAssignForm.setValue('faculty_computer_code', null);
                  }}
                  //@ts-ignore
                  value={selectedDepartment}
                  itemTextStyle={styles.itemTextStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  style={styles.dropdown}
                  selectedTextProps={{
                    numberOfLines: 1,
                    ellipsizeMode: 'tail',
                  }}
                  placeholder={'Department'}
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
                <Text>Select Faculty</Text>
                <Controller
                  control={lectureAssignForm.control}
                  name="faculty_computer_code"
                  render={({field: {onChange, onBlur, value, name}}) => (
                    <Dropdown
                      mode="modal"
                      data={facultyByDepartment}
                      labelField={'name'}
                      valueField={'computer_code'}
                      searchField={'name'}
                      onChange={(item: any) => {
                        onChange(item.computer_code);
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
                      placeholder={'Faculty'}
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
                <Text>Date</Text>

                <Controller
                  control={lectureAssignForm.control}
                  name="faculty_date"
                  render={({field: {onChange, onBlur, value, name}}) => (
                    <ModelCalendar
                      onChange={onChange}
                      value={value}
                      headerText="Date"
                      minDate={start_date}
                      maxDate={end_date}
                    />
                  )}
                />
              </View>
              <View style={{gap: 5}}>
                <CMScard style={styles.classCard}>
                  <Text variant="labelLarge" style={styles.heading}>
                    ADD Lectures
                  </Text>
                  <FormProvider {...assignedClassForm}>
                    <View style={{gap: 5}}>
                      <Text>Department</Text>

                      <Controller
                        control={assignedClassForm.control}
                        name="assigned_class_dept"
                        render={({field: {onChange, onBlur, value, name}}) => (
                          <Dropdown
                            mode="modal"
                            data={departments}
                            labelField={'name'}
                            valueField={'dept_code'}
                            searchField={'name'}
                            onChange={(item: any) => {
                              assignedClassForm.setValue(
                                'assigned_class_dept',
                                item.dept_code,
                              );
                            }}
                            value={value}
                            itemTextStyle={styles.itemTextStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            style={styles.nestedDropdown}
                            selectedTextProps={{
                              numberOfLines: 1,
                              ellipsizeMode: 'tail',
                            }}
                            placeholder={'Department'}
                            placeholderStyle={styles.placeholder}
                            search={true}
                            inputSearchStyle={styles.inputSearch}
                            searchPlaceholder="Search"
                            containerStyle={styles.dropdownConainter}
                            flatListProps={{
                              initialNumToRender: 20,
                              windowSize: 2,
                            }}
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
                      <Text>Section</Text>
                      <Controller
                        control={assignedClassForm.control}
                        name="assigned_section"
                        render={({field: {onChange, onBlur, value, name}}) => (
                          <TextInput
                            style={styles.nestedInput}
                            onChangeText={onChange}
                            value={value}
                            onBlur={onBlur}
                            placeholder="Section"
                          />
                        )}
                      />
                    </View>
                    <View style={{gap: 5}}>
                      <Text>Lecture Type</Text>
                      <Controller
                        control={assignedClassForm.control}
                        name="lecture_type"
                        render={({field: {onChange, onBlur, value, name}}) => (
                          <Dropdown
                            mode="default"
                            data={lectureTypes}
                            labelField={'lecture_type'}
                            valueField={'lecture_type'}
                            searchField={'label'}
                            onChange={(item: any) => {
                              // changeDropdonwValue(item, name);
                              assignedClassForm.setValue(
                                'lecture_type',
                                item.lecture_type,
                              );
                              assignedClassForm.resetField('start_time');
                              assignedClassForm.resetField('end_time');
                            }}
                            onBlur={onBlur}
                            value={value}
                            itemTextStyle={styles.itemTextStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            style={styles.nestedDropdown}
                            selectedTextProps={{
                              numberOfLines: 1,
                              ellipsizeMode: 'tail',
                            }}
                            placeholder={'Lecture Type'}
                            placeholderStyle={styles.placeholder}
                            containerStyle={styles.dropdownConainter}
                            flatListProps={{initialNumToRender: 20}}
                            renderLeftIcon={() => (
                              <Icon
                                name="edit"
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
                      <Text>Start Time</Text>

                      <Controller
                        control={assignedClassForm.control}
                        name="assigned_class_dept"
                        render={({field: {onChange, onBlur, value, name}}) => (
                          <Dropdown
                            mode="modal"
                            data={timeSlots}
                            labelField={'start_time'}
                            valueField={'start_time'}
                            onChange={(item: any) => {
                              assignedClassForm.setValue(
                                'start_time',
                                item.start_time,
                              );
                            }}
                            value={value}
                            itemTextStyle={styles.itemTextStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            style={styles.nestedDropdown}
                            selectedTextProps={{
                              numberOfLines: 1,
                              ellipsizeMode: 'tail',
                            }}
                            placeholder={'Start Time'}
                            placeholderStyle={styles.placeholder}
                            inputSearchStyle={styles.inputSearch}
                            searchPlaceholder="Search"
                            containerStyle={styles.dropdownConainter}
                            flatListProps={{
                              initialNumToRender: 20,
                              windowSize: 2,
                            }}
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
                      <Text>End Time</Text>

                      <Controller
                        control={assignedClassForm.control}
                        name="assigned_class_dept"
                        render={({field: {onChange, onBlur, value, name}}) => (
                          <Dropdown
                            mode="modal"
                            data={timeSlots}
                            labelField={'end_time'}
                            valueField={'end_time'}
                            onChange={(item: any) => {
                              assignedClassForm.setValue(
                                'end_time',
                                item.end_time,
                              );
                            }}
                            value={value}
                            itemTextStyle={styles.itemTextStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            style={styles.nestedDropdown}
                            selectedTextProps={{
                              numberOfLines: 1,
                              ellipsizeMode: 'tail',
                            }}
                            placeholder={'End Time'}
                            placeholderStyle={styles.placeholder}
                            inputSearchStyle={styles.inputSearch}
                            searchPlaceholder="Search"
                            containerStyle={styles.dropdownConainter}
                            flatListProps={{
                              initialNumToRender: 20,
                              windowSize: 2,
                            }}
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

                    <Button
                      mode="contained"
                      icon="plus"
                      onPress={addClass}
                      style={styles.submitButton}>
                      ADD
                    </Button>
                  </FormProvider>
                </CMScard>
                <View style={{gap: 5}}></View>
              </View>
            </View>
            <View style={{gap: 5}}>
              {assigned_class.map((item, index) => (
                <ClassListItem
                  index={index}
                  item={item}
                  key={index}
                  deletable={true}
                />
              ))}
            </View>
            <Button
              mode="contained"
              icon="plus"
              onPress={addLectureAssignment}
              disabled={assigned_class.length == 0}
              style={styles.submitButton}>
              ADD
            </Button>
          </CMScard>
        </FormProvider>
        <CMScard style={styles.lecureAssignCard}>
          <Text variant="labelLarge" style={styles.heading}>
            Assignments
          </Text>
          <View style={styles.lecureAssignContainer}>
            {lectures_assigned.map((faculty, index) => (
              <FacultyAssignedClassItem
                faculty={faculty}
                index={index}
                key={index}
              />
            ))}
          </View>
        </CMScard>
        <Button
          mode="contained"
          onPress={() => navigation.pop()}
          style={styles.proceedButton}>
          Proceed
        </Button>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default LectureAssignment;

type ClassListProps = {
  item: AssignedClass;
  index: number;
  deletable: boolean;
};

const ClassListItem = (props: ClassListProps) => {
  const theme: themeType = useTheme();
  const dimension = useWindowDimensions();
  const styles = StyleSheet.create({
    ...dataTableStyles,
    itemCard: {
      backgroundColor: theme.colors.surfaceContainerHigh,
      width: dimension.width - 80,
      maxWidth: 380,
      borderRadius: 10,
      flexDirection: 'column',
      marginVertical: 0,
    },
    title: {
      width: 100,
    },
    sep: {
      width: 5,
    },
    value: {
      flex: 1,
    },
    rowStyle: {
      flexDirection: 'row',
      flex: 1,
      gap: 10,
    },
    deleteButton: {
      marginTop: 10,
    },
  });
  const lectureAssignForm = useFormContext<LectureAssigned>();
  const assinClassList = lectureAssignForm.watch('assigned_class');

  const deleteItem = useCallback(() => {
    let newVal = assinClassList.filter((item, index) => index !== props.index);
    lectureAssignForm.setValue('assigned_class', newVal);
  }, [assinClassList, lectureAssignForm]);
  return (
    <CMScard style={styles.itemCard}>
      <View style={styles.rowStyle}>
        <View style={styles.title}>
          <Text variant="titleSmall" style={[styles.headerTextStyle]}>
            Department
          </Text>
        </View>
        <View style={styles.sep}>
          <Text variant="titleSmall" style={styles.headerTextStyle}>
            :
          </Text>
        </View>
        <View style={styles.value}>
          <Text variant="titleSmall" style={styles.headerTextStyle}>
            {props.item.assigned_class_dept}
          </Text>
        </View>
      </View>
      <View style={styles.rowStyle}>
        <View style={styles.title}>
          <Text variant="titleSmall" style={[styles.headerTextStyle]}>
            Section
          </Text>
        </View>
        <View style={styles.sep}>
          <Text variant="titleSmall" style={styles.headerTextStyle}>
            :
          </Text>
        </View>
        <View style={styles.value}>
          <Text variant="titleSmall" style={styles.headerTextStyle}>
            {props.item.assigned_section}
          </Text>
        </View>
      </View>
      <View style={styles.rowStyle}>
        <View style={styles.title}>
          <Text variant="titleSmall" style={[styles.headerTextStyle]}>
            Lecture Type
          </Text>
        </View>
        <View style={styles.sep}>
          <Text variant="titleSmall" style={styles.headerTextStyle}>
            :
          </Text>
        </View>
        <View style={styles.value}>
          <Text variant="titleSmall" style={styles.headerTextStyle}>
            {props.item.lecture_type}
          </Text>
        </View>
      </View>

      {props.deletable ? (
        <AnimatedOutlineButton
          style={styles.deleteButton}
          color="red"
          icon="trash-2"
          onPress={deleteItem}>
          Delete
        </AnimatedOutlineButton>
      ) : null}
    </CMScard>
  );
};

ClassListItem.defaultProps = {
  deletable: false,
};

type FacultyAssignedClassItemProps = {
  index: number;
  faculty: LectureAssigned;
};

export const FacultyAssignedClassItem = (
  props: FacultyAssignedClassItemProps,
) => {
  const dimension = useWindowDimensions();
  const theme: themeType = useTheme();
  const styles = StyleSheet.create({
    cardStyle: {
      width: dimension.width - 60,
      maxWidth: 400,
      flexWrap: 'nowrap',
      flexDirection: 'column',
      gap: 10,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 15,
      elevation: 2,
      backgroundColor: theme.colors.surfaceContainerLow,
    },
    header: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignSelf: 'stretch',
    },
    resString: {
      flexWrap: 'nowrap',
      flexDirection: 'row',
      alignSelf: 'stretch',
      marginHorizontal: 15,
    },
  });

  const leaveApplyForm = useFormContext<LeaveApplyFormValues>();

  const lectures_assigned = leaveApplyForm.watch('lectures_assigned');
  const onDelete = useCallback(() => {
    if (lectures_assigned) {
      let new_res = lectures_assigned.filter(
        (item, itemIndex) => itemIndex != props.index,
      );

      leaveApplyForm.setValue('lectures_assigned', [...new_res]);
    }
  }, [lectures_assigned, props.index, leaveApplyForm]);

  useGetNameByComputerCode(props.faculty.faculty_computer_code!, userType.staff,
    {
      onSuccess: data => {
        setName(data.name);
      },
    },
  )

  const [name, setName] = useState('');

  return (
    <Animated.View>
      <CMScard style={styles.cardStyle}>
        <View style={styles.header}>
          <Text variant="titleMedium">{name}</Text>
          <Text variant="titleSmall" style={{color: theme.colors.backdrop}}>
            {dayjs(props.faculty.faculty_date).format('DD-MM-YYYY')}
          </Text>
        </View>
        <View style={{gap: 5}}>
          {props.faculty.assigned_class.map((item, index) => (
            <ClassListItem index={index} item={item} key={index} />
          ))}
        </View>
        <AnimatedOutlineButton
          icon="trash-2"
          onPress={onDelete}
          key={`${props.index}`}
          style={{marginTop: 10}}
          color="red">
          Remove
        </AnimatedOutlineButton>
      </CMScard>
    </Animated.View>
  );
};
