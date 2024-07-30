import {StyleSheet, View, Dimensions, useWindowDimensions} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import useCollapsibleCustomHeader from '../../../../hooks/useCollapsibleHeader';
import {GestureHandlerRootView, ScrollView} from 'react-native-gesture-handler';
import CMScard from '../../../../components/cms_card';
import {Button, Text, TextInput, useTheme, withTheme} from 'react-native-paper';
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from 'react-hook-form';
import {Dropdown} from 'react-native-element-dropdown';
import ModelCalendar from '../../../../components/modelCalendar';
import Icon from 'react-native-vector-icons/Feather';
import {themeType} from '../../../../theme';
import {LeaveApplyFormValues} from '../leaveApply';
import * as yup from 'yup';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {storage} from '../../../../App';
import {useMutation, useQuery} from 'react-query';
import {commonApi} from '../../../../api/API';
import {Toast} from 'react-native-toast-notifications';
import {yupResolver} from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import AnimatedOutlineButton from '../../../../components/animatedOutlineButton';
import {useNavigation} from '@react-navigation/native';
import {useBackHandler} from '@react-native-community/hooks';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  ZoomIn,
  ZoomInDown,
} from 'react-native-reanimated';
import {reducerData} from '../../../../redux/common/reducer';
import {userType} from '../../../../constants';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useGetFacultyByDepartment, useGetNameByComputerCode } from '../../../../hooks/query/common';

const responsibilitySchema = yup.object().shape({
  faculty_computer_code: yup
    .number()
    .required('Faculty computer code is required'),
  faculty_date: yup.string().required('Faculty date is required'),
  responsibility: yup.string().required('Responsibility is required'),
});

interface Responsibility {
  faculty_computer_code: number | null;
  faculty_date: string | null;
  responsibility: string | null;
}

const defaultResponsibilityValues: Responsibility = {
  faculty_computer_code: null,
  faculty_date: null,
  responsibility: null,
};

const OtherResponsibility = () => {
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
    proceedButton: {
      width: 150,
      alignSelf: 'center',
      marginVertical: 20,
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

  const leaveApplyForm = useFormContext<LeaveApplyFormValues>();

  const start_date = new Date(leaveApplyForm.watch('start_date')!);
  const end_date = new Date(leaveApplyForm.watch('end_date')!);

  const other_responsibilities = leaveApplyForm.watch('other_responsibility');

  const responsibleForm = useForm<Responsibility>({
    defaultValues: defaultResponsibilityValues,
    resolver: yupResolver<any>(responsibilitySchema),
  });

  const addResponsibility = useCallback(() => {
    responsibleForm.control
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
          let prev = leaveApplyForm.getValues().other_responsibility;
          leaveApplyForm.setValue('other_responsibility', [
            responsibleForm.getValues(),
            ...prev,
          ]);
          responsibleForm.reset();
          setSelectedDepartment(null);
        }
      })
      .catch(error => console.log(error));
  }, [leaveApplyForm, responsibleForm]);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ScrollView
        style={styles.rootContainer}
        contentContainerStyle={{paddingBottom: 50}}>
        <FormProvider {...responsibleForm}>
          <CMScard style={styles.formCardStyle}>
            <Text variant="labelLarge" style={styles.heading}>
              Other Responisibility
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
                    responsibleForm.setValue('faculty_computer_code', null);
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
                  control={responsibleForm.control}
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
                  control={responsibleForm.control}
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
                <Text>Responsibility</Text>
                <Controller
                  control={responsibleForm.control}
                  name="responsibility"
                  render={({field: {onChange, onBlur, value, name}}) => (
                    <TextInput
                      style={styles.input}
                      onChangeText={onChange}
                      value={value}
                      onBlur={onBlur}
                      placeholder="Responsibility"
                    />
                  )}
                />
              </View>
            </View>
            <Button
              mode="contained"
              icon="plus"
              onPress={addResponsibility}
              style={styles.submitButton}>
              ADD
            </Button>
          </CMScard>
        </FormProvider>

        <CMScard style={styles.reponsibilityAssignCard}>
          <Text variant="labelLarge" style={styles.heading}>
            Responsiblities
          </Text>
          <View style={styles.reponsibilityAssignContainer}>
            {other_responsibilities.map((item, index) => (
              <ResponsibilityItem
                index={index}
                key={`${index}`}
                facutly={item}
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

export default OtherResponsibility;

export const ResponsibilityItem = (props: {
  index: number;
  facutly: Responsibility;
}) => {
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

  const other_responsibilities = leaveApplyForm.watch('other_responsibility');
  const onDelete = useCallback(() => {
    if (other_responsibilities) {
      console.log(other_responsibilities);
      let new_res = other_responsibilities.filter(
        (item, itemIndex) => itemIndex != props.index,
      );

      leaveApplyForm.setValue('other_responsibility', [...new_res]);
    }
  }, [other_responsibilities, props.index, leaveApplyForm]);

  useGetNameByComputerCode(props.facutly.faculty_computer_code!, userType.staff,
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
            {dayjs(props.facutly.faculty_date).format('DD-MM-YYYY')}
          </Text>
        </View>
        <View style={styles.resString}>
          <Text variant="titleSmall">Responsiblity : </Text>
          <Text
            textBreakStrategy="balanced"
            variant="labelLarge"
            style={{maxWidth: 300}}
            ellipsizeMode="tail">
            {props.facutly.responsibility}
          </Text>
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
