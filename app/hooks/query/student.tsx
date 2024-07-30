import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "react-query";
import { studentApi } from "../../api/API";
import { InsertFacultyFeedback, loginPayload, studentInsertNbaFeedback } from "../../api/student/studentApi";
import { storage } from "../../App";
import { useMMKVStorage } from "react-native-mmkv-storage";
import { useEffect, useState } from "react";


type queryOptions =  Omit<UseQueryOptions<unknown, unknown, any, string|any>, 'queryKey' | 'queryFn'>;
type mutationOptions =   Omit<UseMutationOptions<unknown, unknown, InsertFacultyFeedback|loginPayload|studentInsertNbaFeedback, unknown>, 'mutationFn'>;



export const useLogin=(options?:mutationOptions)=>{
    const mutation = useMutation( studentApi.login.fetch  , options);
    return {mutation}
}

export const useStudentCumulativeAttendance=(current_session:number , computer_code:number ,options?:queryOptions)=>{
  const [{CummulativeAttendance:attendance} ,setAttendance] = useMMKVStorage<any>("Student" , storage , {CummulativeAttendance:[]}) ;

  console.log(current_session)

    const queryStatus = useQuery([studentApi.studentCumulativeAttendance.name , computer_code , current_session] , ()=>studentApi.studentCumulativeAttendance.fetch({academic_session : current_session , computer_code : computer_code }) , {
        ...options,
        onSuccess : (data)=>{
          setAttendance(state=>({...state , CummulativeAttendance:data}));
        }
      });

      return {  attendance ,queryStatus}
}

export const useStudentAttendance=(current_session:number , computer_code:number ,options?:queryOptions)=>{
    const [{Attendance:attendance} , setAttendance] = useMMKVStorage<any>( "Student" , storage , {Attendance:[]})

    const queryStatus = useQuery(studentApi.studentAttendance.name , ()=>studentApi.studentAttendance.fetch({academic_session:current_session, computer_code:computer_code}),
    {
      onSuccess:(data)=>{
        setAttendance(state=>({...state, Attendance:data}));
        // dispatch({type:studentActionTypes.Attendance , payload : data})
      }
    });

    return {attendance , queryStatus    }
}

export const useStudentReport=(current_session:number , computer_code:number ,options?:queryOptions)=>{
    const [{Report:report} ,setReport] = useMMKVStorage<any>("Student" , storage , {Report:[]});
    const queryStatus = useQuery(studentApi.studentReport.name , ()=>studentApi.studentReport.fetch({academic_session:current_session, computer_code :computer_code , event_category : 6 }),
    {
        onSuccess : (data)=>{
            setReport(state=>({...state ,Report:data}));
        }
    });

    return {report , queryStatus}
}

export const useStudentNbaFeedback=(current_session:number , computer_code:number ,options?:queryOptions)=>{

    const [{NbaFeedback:nbaData} , setNbaData] = useMMKVStorage<any>("Student" , storage , {NbaFeedback:[]})

    const queryStatus =useQuery( studentApi.studentNbaFeedback.name , ()=>studentApi.studentNbaFeedback.fetch(
        {
            computer_code : computer_code,
            academic_session : current_session,
        },
    ),
    {
      onSuccess: data => {
        // console.log(data)
        setNbaData(state=>({...state , NbaFeedback:data}))
      },
    },
  );


  return {nbaData , queryStatus};
}

export const useStudentInsertNbaFeedback=(options?:mutationOptions)=>{
    const mutation = useMutation( (res:studentInsertNbaFeedback)=>studentApi.studentInsertNbaFeedback.fetch(res),options)
    return {mutation}
}

export const useStudentFacilityFeedback=(current_session:number , computer_code:number ,options?:queryOptions)=>{
    const [{FacilityFeedback:feedbackData} , setFeedbackData] = useMMKVStorage<any>("Student" , storage , {FacilityFeedback:{}})
    
    const queryStatus = useQuery( studentApi.studentFacilityFeedback.name , ()=>studentApi.studentFacilityFeedback.fetch(
        {
            computer_code : computer_code,
            academic_session : current_session,
        },
    ),
    {   ...options,
        onSuccess : (data)=>{
            setFeedbackData(state=>({...state , FacilityFeedback:data}))
        },
    }
)

return {feedbackData , queryStatus}
}

export const useStudentFacultyfeedback=(current_session:number , computer_code:number ,options?:queryOptions)=>{
    const [{FacultyFeedback:feedbackData} , setFeedbackData] = useMMKVStorage<any>("Student" , storage , {FacultyFeedback:{}})
    const queryStatus = useQuery( studentApi.studentFacultyfeedback.name , ()=>studentApi.studentFacultyfeedback.fetch(
        {
            computer_code : computer_code,
            academic_session : current_session,
        },
    ),
    {   ...options,
        onSuccess : (data)=>{
            setFeedbackData(state=>({...state , FacultyFeedback:data}))
        },
    }
)

return {feedbackData , queryStatus}
}
export const useInsertFacultyFeedback=(options?:mutationOptions)=>{
    const mutation = useMutation( (res:InsertFacultyFeedback)=>studentApi.InsertFacultyFeedback.fetch(res),options)
    return {mutation}
}
