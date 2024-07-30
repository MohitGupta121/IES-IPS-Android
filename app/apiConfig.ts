import axios, { AxiosError } from 'axios';
import appConfig from './config';
import { storage } from './App';
import  {Toast}  from 'react-native-toast-notifications';


// console.log(process.env)

const config={
    baseURL: appConfig.baseURL,
    timeout: 3000,
    Headers:{
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }
}

const api = axios.create(config);

api.interceptors.request.use((config)=>{
    let token;
    // @ts-ignore
    if (storage.contains('user-login') ) token = JSON.parse(storage.getString('user-login'))
    config.headers.Authorization = token?.token?.token || "";
    return config
})

api.interceptors.response.use(null , (error:AxiosError)=>{
    console.info(error.request?._url);
    console.error(error.response?.data?.message);
    Toast.show( "some",{
        type : "error",
        text1 : error.response?.data?.message || "Some Error Occured",
        text2 : `${error.code}`,
        animationType:"zoom-in"
    })

    return Promise.reject(error);
})


export { config , api}