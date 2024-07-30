import {Text, useTheme} from 'react-native-paper';
import {View} from 'react-native-ui-lib';

import {FC, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {loginStyle} from './studentLogin';
import {TextInput, Button} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {Link, useNavigation} from '@react-navigation/native';
import {themeType} from '../../../theme';
import { loginPayload } from '../../../api/student/studentApi';
import { useMutation } from 'react-query';
import { staffApi } from '../../../api/API';
import { userType } from '../../../constants';
import { storage } from '../../../App';
import { useDispatch } from 'react-redux';
import { commonActionTypes } from '../../../redux/common/types';
import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack/types';
import { RootStackParamList } from '../../../routes/routes';

const StaffLogin: FC = () => {
  const theme: themeType = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [input, setInput] = useState({
    computer_code: '',
    password: '',
  });
  const [showPass ,setShowPass] = useState(true);


  const dispatch = useDispatch();

  const staffLoginMutation = useMutation((data:loginPayload)=>staffApi.login.fetch(data) , {
    onSuccess : (data )=>{

        data.user.type = userType.staff;
        storage.set("user-login" , JSON.stringify(data));
        // @ts-ignore
        dispatch({type:commonActionTypes.UserLoginDetails , payload : JSON.parse(storage.getString('user-login'))}),
        // @ts-ignore
        navigation.navigate({name :"Dashboard" });
    }
  });
  

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
            style.inputStyles,
            {backgroundColor: theme.colors.primaryContainer},
          ]}
          // outlineStyle={style.outlineStyle}
          activeOutlineColor={theme.colors.primary}
          />
        <TextInput
          label="Password"
          mode="outlined"
          secureTextEntry={showPass}
          value={input.password}
          onChangeText={value=>setInput({...input , password:value})}
          right={<TextInput.Icon icon={!showPass?"eye":"eye-off"} color={!showPass?theme.colors.primary:"grey"} onPress={()=>setShowPass(!showPass)} />}
          style={[
            style.inputStyles,
            {backgroundColor: theme.colors.primaryContainer},
          ]}
          // outlineStyle={style.outlineStyle}
          activeOutlineColor={theme.colors.primary}
          />

        <Button
          rippleColor={theme.colors.backdrop}
          icon="arrow-right"
          mode="contained"
          loading={staffLoginMutation.isLoading}
          onPress={() =>{
            staffLoginMutation.mutate({computer_code : Number(input.computer_code) , password : input.password});            
          }}>
          Submit
        </Button>
        <Button>Forget Password</Button>
        
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  inputStyles: {
    backgroundColor: '#5e9eff',
    paddingLeft : 10
  },
  outlineStyle: {
    borderRadius:30
  },
});

export default StaffLogin;
