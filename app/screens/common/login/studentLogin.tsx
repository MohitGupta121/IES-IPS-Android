import {Text, View} from 'react-native-ui-lib';
import {FC, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Dimensions} from 'react-native';
import {useTheme} from 'react-native-paper';
import {TextInput, Button} from 'react-native-paper';
import {useDispatch, useStore} from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import { useMutation, useQuery } from 'react-query';
import { studentApi } from '../../../api/API';
import { loginPayload } from '../../../api/student/studentApi';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { storage } from '../../../App';
import { commonActionTypes } from '../../../redux/common/types';
import { userType } from '../../../constants';
import { getToken } from '../../../utils/notification';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../../../routes/routes';
import { useMMKVStorage } from 'react-native-mmkv-storage';
import { useLogin } from '../../../hooks/query/student';


const StudentLogin: FC = () => {
  const theme:any = useTheme();
  

  const dispatch = useDispatch();

  const [ user , setUser ] = useMMKVStorage("User" , storage , {});


  const [input , setInput] = useState({
    computer_code : "",
    password : ""
  })

  const [showPass ,setShowPass] = useState(true);


  const {mutation:studentLoginMutation} = useLogin( {
    onSuccess : (data:any )=>{

        data.user.type = userType.student;
        storage.setString("user-login" , JSON.stringify(data));
        
        setUser(data)
        // dispatch({type:commonActionTypes.UserLoginDetails , payload : JSON.parse(storage.getString('user-login'))})
        // @ts-ignore
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Dashboard' }],
          })
        );
    },
  });

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  
  return (
    <SafeAreaView style={loginStyle.viewStyle}>
      <View
        style={[
          loginStyle.container,
          {backgroundColor: theme.colors.container_background},
        ]}>
        <TextInput
          mode="outlined"
          label="computer code"
          keyboardType='number-pad'
          value={input.computer_code}
          onChangeText={value=>setInput({...input , computer_code:value})}
          style={[
            loginStyle.inputStyle,
            {backgroundColor: theme.colors.primaryContainer},
          ]}
          // outlineStyle={loginStyle.outlineStyle}

          activeOutlineColor={theme.colors.primary}
          />
        <TextInput
          label="Password"
          mode='outlined'
          secureTextEntry={showPass}
          value={input.password}
          onChangeText={value=>setInput({...input , password:value})}
          right={<TextInput.Icon icon={!showPass?"eye":"eye-off"} color={!showPass?theme.colors.primary:'grey'} onPress={()=>setShowPass(!showPass)} />}
          style={[
            loginStyle.inputStyle,
            {backgroundColor: theme.colors.primaryContainer},
          ]}
          // outlineStyle={loginStyle.outlineStyle}
          activeOutlineColor={theme.colors.primary}
          />
        <Button
          rippleColor={theme.colors.backdrop}
          icon="arrow-right"
          mode="contained"
          loading={studentLoginMutation.isLoading}
          onPress={() =>{
            studentLoginMutation.mutate({computer_code : Number(input.computer_code) , password : input.password});            
          }}>
          Submit
        </Button>
      </View>
    </SafeAreaView>
  );
};

export const loginStyle = StyleSheet.create({
  viewStyle: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    margin: 50,
  },
  container: {
    margin: 20,
    padding: 30,
    borderRadius: 20,
    gap: 20,
    width: 350,
    maxWidth: 500,
    minWidth: 300,
    alignSelf: 'center',
  },
  inputStyle: {
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 10,
    paddingLeft: 10,
  },
  outlineStyle: {
    borderRadius:30
  },
});

export default StudentLogin;
