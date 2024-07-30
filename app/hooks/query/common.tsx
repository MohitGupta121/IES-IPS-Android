import { QueryKey, useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "react-query";
import { commonApi } from "../../api/API";
import { useMMKVStorage } from "react-native-mmkv-storage";
import { storage } from "../../App";
import { userType } from "../../constants";

type academicSession = {
    academic_session_id: number,
    academic_session: string,
    active: number
  }

type queryOptions =  Omit<UseQueryOptions<unknown, unknown, any, string|any>, 'queryKey' | 'queryFn'>;
type mutationOptions =   Omit<UseMutationOptions<unknown, unknown, void, unknown>, 'mutationFn'>;

export const useAcademicSession=(options?:queryOptions)=>{
    const [academicSessions, setAcademicSession]:[
        {sessions:academicSession[] ,
            current:null|academicSession
        },
        (prevalue:any)=>void
    ] = useMMKVStorage(
        'AcademicSession',
        storage,
        { sessions:[] ,
            current:null
        },
      );
    const queryStatus = useQuery(
        commonApi.academicSession.name,
        () => commonApi.academicSession.fetch(),
        { ...options,
          onSuccess: data => {
            let current = data.find(item => item.active);
            setAcademicSession({
              sessions: [...data],
              current: {...current},
            });
          },
        },
      );

      const current_academic_session_id = academicSessions.current?.academic_session_id||0;


      return {academicSessions , current_academic_session_id , queryStatus};

}


export const useGetTimeSlot=(options?:queryOptions)=>{

    const [timeSlots ,setTimeSlots]:[any , (prevalue:any)=>void] = useMMKVStorage("TimeSlots" , storage , [])

    const queryStatus = useQuery(commonApi.getTimeSlot.name ,()=>commonApi.getTimeSlot.fetch() , {
        ...options,
        onSuccess : (data:any)=>{
          setTimeSlots(data)
        }
      })

      return {timeSlots , queryStatus};
}


export const useGetLectureType=(options?:queryOptions)=>{

  const [lectureTypes , setLectureTypes]:[any , (prevalue:any)=>void] = useMMKVStorage("LectureTypes" , storage , []);


    const queryStatus = useQuery(commonApi.getLectureType.name ,()=>commonApi.getLectureType.fetch() , {
        ...options,
        onSuccess : (data:any)=>{
          setLectureTypes(data)
        }
      })

    return {lectureTypes , queryStatus};
}

export const useGetDepartments=(options?:queryOptions)=>{
    const [departments, setDepartments] = useMMKVStorage(
        'Departments',
        storage,
        [],
      );
    const queryStatus = useQuery(commonApi.getDepartments.name, commonApi.getDepartments.fetch, {
        ...options,
        onSuccess: data => {
          setDepartments(data);
        },
      });

    return {departments , queryStatus}
}

export const useGetFacultyByDepartment=(options?:mutationOptions)=>{

    const mutation = useMutation(commonApi.getFacultyByDepartment.fetch , options);
      return {mutation}

}

export const useGetNameByComputerCode=(computer_code:number , user_type:string,options?:queryOptions )=>{

    useQuery(
        [commonApi.getNameByComputerCode.name, computer_code],
        () =>
          commonApi.getNameByComputerCode.fetch({
            computer_code: computer_code,
            user_type: user_type,
          }),
        options
      );

}