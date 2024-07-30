import { View, Text } from 'react-native'
import React , { createContext, useEffect, useState }  from 'react'
import { boolean } from 'yup'
import { useMMKVStorage } from 'react-native-mmkv-storage'
import { storage } from '../App'
import { reducerData } from '../redux/common/reducer'


type User = Pick<reducerData['User'], 'user'>;

export const LoginContext = createContext<{isLoggedIn:boolean , user:null|User , setLogin:(prevalue:any)=>void}>({isLoggedIn:false , user:null , setLogin:(value)=>null })
const LoginContextProvder = ({children}) => {

    const [loginState , setLoginState] = useState({
        isLoggedIn:false,
        user:null
    })
    const [userLogin , setUserLogin] = useMMKVStorage('user-login' , storage , null)

    // console.log(loginState.user)

    useEffect( ()=>{
        if ( userLogin ) {
            setLoginState({
                isLoggedIn:true,
                user:userLogin
            })
          }
    }, [userLogin])
  return (
    <LoginContext.Provider value={{isLoggedIn:loginState.isLoggedIn  , user:loginState.user , setLogin:setLoginState}}>
        {children}
    </LoginContext.Provider>
  )
}

export default LoginContextProvder