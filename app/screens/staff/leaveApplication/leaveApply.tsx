import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import LeaveApplyForm from './leaveApply/leaveApplyForm';
import LectureAssignment from './leaveApply/lectureAssignment';
import OtherResponsibility from './leaveApply/otherResponsibility';

import * as yup from 'yup';
import {FormProvider, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useEffect, useState} from 'react';
import {useMMKVStorage} from 'react-native-mmkv-storage';
import {storage} from '../../../App';
import {reducerData} from '../../../redux/common/reducer';
import {StatusBar} from 'react-native';
import {Button, Dialog, Portal, Text, useTheme} from 'react-native-paper';
import {themeType} from '../../../theme';
import {
  NavigationContainer,
  NavigationIndependentTree,
  useNavigation,
} from '@react-navigation/native';
import {RootStackParamList} from '../../../routes/routes';
import {useBackHandler} from '@react-native-community/hooks';

// Enum for leave type
const leaveTypeEnum = ['cl', 'el', 'dl', 'ol', 'hdcl', 'lwp', 'sdl'] as const;

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
  faculty_date: yup.string().required('Faculty date is required').nonNullable(),
  assigned_class: yup
    .array()
    .of(assignedClassSchema)
    .required('Assigned class is required'),
});

const responsibilitySchema = yup.object().shape({
  faculty_computer_code: yup
    .number()
    .required('Faculty computer code is required'),
  faculty_date: yup.string().required('Faculty date is required'),
  responsibility: yup.string().required('Responsibility is required'),
});

const leaveApplyFromValidation = yup.object().shape({
  computer_code: yup.number().required('Computer code is required'),
  start_date: yup.string().required('Start date is required'),
  end_date: yup.string().required('End date is required'),
  days: yup.number().required('Number of days is required'),
  leave_type: yup
    .string()
    .required('Leave type is required')
    .oneOf(leaveTypeEnum, 'Invalid leave type'),
  reason: yup.string().required('Reason is required'),
  lectures_assigned: yup
    .array()
    .of(lectureAssignedSchema)
    .required('Lectures assigned are required'),
  other_responsibility: yup
    .array()
    .of(responsibilitySchema)
    .required('Other responsibilities are required'),
  academic_session: yup.number().required('Academic session is required'),
});

export type LeaveType = 'cl' | 'el' | 'dl' | 'ol' | 'hdcl' | 'lwp' | 'sdl';

interface AssignedClass {
  assigned_class_dept: string;
  assigned_section: string;
  lecture_type: string;
  start_time: string;
  end_time: string;
}

interface LectureAssigned {
  faculty_computer_code: number;
  faculty_date: string;
  assigned_class: AssignedClass[];
}

interface Responsibility {
  faculty_computer_code: number;
  faculty_date: string;
  responsibility: string;
}

export interface LeaveApplyFormValues {
  computer_code: number | null;
  start_date: string | null;
  end_date: string | null;
  days: number | null;
  leave_type: LeaveType | null;
  reason: string | null;
  lectures_assigned: LectureAssigned[];
  other_responsibility: Responsibility[];
  academic_session: number | null;
}

const defaultFormValues: LeaveApplyFormValues = {
  computer_code: null,
  start_date: null,
  end_date: null,
  days: null,
  leave_type: null,
  reason: null,
  lectures_assigned: [],
  other_responsibility: [],
  academic_session: null,
};

const LeaveApply = () => {
  const LeaveApplyStack = createNativeStackNavigator();
  const screenOptions: NativeStackNavigationOptions = {
    headerShown: false,
  };

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useBackHandler(() => {
    setDiscardVisible(true);
    return true;
  });

  type User = Pick<reducerData['User'], 'user'>;
  const [{user}, setUser] = useMMKVStorage<User>('User', storage, {user: {}});
  const [
    {
      current: {academic_session_id: current_session},
    },
    setAcademicSession,
  ] = useMMKVStorage('AcademicSession', storage, {
    current: {academic_session_id: 0},
  });

  const leaveApplyForm = useForm<LeaveApplyFormValues>({
    defaultValues: defaultFormValues,
    resolver: yupResolver<LeaveApplyFormValues>(leaveApplyFromValidation),
  });

  useEffect(() => {
    leaveApplyForm.setValue('academic_session', current_session);
    leaveApplyForm.setValue('computer_code', user.computer_code);
  }, [leaveApplyForm]);

  const [discardVisible, setDiscardVisible] = useState(false);

  return (
    <FormProvider {...leaveApplyForm}>
      <NavigationIndependentTree>
        <NavigationContainer>
          <LeaveApplyStack.Navigator screenOptions={screenOptions}>
            <LeaveApplyStack.Screen
              name="Leave Apply Form"
              component={()=>(<LeaveApplyForm parentNavigation={navigation} />)}
            />
            <LeaveApplyStack.Screen
              name="Lecture Assignment"
              component={LectureAssignment}
            />
            <LeaveApplyStack.Screen
              name="Other Responsibility"
              component={OtherResponsibility}
            />
          </LeaveApplyStack.Navigator>
        </NavigationContainer>
      </NavigationIndependentTree>
      <DiscardApplication
        visible={discardVisible}
        setVisible={setDiscardVisible}
      />
    </FormProvider>
  );
};

export default LeaveApply;

const DiscardApplication = (props: {
  visible: boolean;
  setVisible: (prevalue: any) => void;
}) => {
  const theme: themeType = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Portal>
      {props.visible ? <StatusBar backgroundColor={'#838cb3'} /> : null}
      <Dialog visible={props.visible} onDismiss={() => props.setVisible(false)}>
        <Dialog.Title>Discard</Dialog.Title>
        <Dialog.Content>
          <Text variant="bodyMedium">Discard Leave Application</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => props.setVisible(false)}>Cancel</Button>
          <Button onPress={() => navigation.pop()}>OK</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
