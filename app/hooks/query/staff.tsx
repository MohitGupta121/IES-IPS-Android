import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "react-query";
import { staffApi } from "../../api/API";
import { getViewAttendance, loginPayload, markAttendanceToModify, deleteAttendance, markAttendance, leaveApply, sendNotification, getStudentForAttendancePayload, acceptFacultyAssignment, rejectFacultyAssignment } from '../../api/staff/staffApi';
import { storage } from "../../App";
import { useMMKVStorage } from "react-native-mmkv-storage";
import { useState } from "react";
import { options } from "react-native-mmkv-storage/dist/src/utils";

type queryOptions =  Omit<UseQueryOptions<unknown, unknown, any, string|any>, 'queryKey' | 'queryFn'>;
type mutationOptions =   Omit<UseMutationOptions<unknown, unknown, acceptFacultyAssignment|rejectFacultyAssignment|getStudentForAttendancePayload|sendNotification|leaveApply|markAttendance|deleteAttendance|loginPayload|markAttendanceToModify|getViewAttendance, unknown>, 'mutationFn'>;


export const useLogin = (options?: mutationOptions) => {
  const mutate = useMutation(
    (data: loginPayload) => staffApi.login.fetch(data),
    options,
  );

  return {mutate};
};

export const useGetBatches=( computer_code:number , current_session:number, options?:queryOptions)=>{
  const [{Batches:facultySubjects} ,setFacultySubjects] = useMMKVStorage<any>("Staff" , storage , {Batches:[]})

    const queryState = useQuery(
        staffApi.getBatches.name,
        () =>
          staffApi.getBatches.fetch({
            computer_code: computer_code,
            session_id: current_session,
          }),
        { ...options,
          onSuccess: data => {
            setFacultySubjects(state => ({...state, Batches: data}));
          },
        },
      );

      return { facultySubjects ,queryState};
}

export const useGetStudentForAttendance=(batch_id:number , options?:queryOptions)=>{
  const [{StudentsForAttendance:studentList} ,setStudentList] = useMMKVStorage<any>("Staff"  , storage , {StudentsForAttendance:[]})

    const queryState = useQuery(staffApi.getStudentForAttendance.name ,()=>staffApi.getStudentForAttendance.fetch({
        batch_id : batch_id
      }) , { 
        ...options,
        onSuccess : (data:any)=>{
          setStudentList(state=>({...state , StudentsForAttendance:data.data}))
        }
      })

      return {studentList , queryState}
}


export const useGetTopicForAttendance=(batch_id:number , options?:queryOptions)=>{
  
  const [topicList , setTopicList] = useState([]);
  
  const queryState = useQuery(staffApi.getTopicForAttendance.name ,()=>staffApi.getTopicForAttendance.fetch({
    batch_id : batch_id
  }) , {
    ...options,
    onSuccess : (data:any)=>{
      setTopicList(data.data);
    }
  })
  return {topicList , queryState}
}


export const useMarkAttendanceToModify=(options?:mutationOptions)=>{
  const mutation=useMutation(staffApi.markAttendanceToModify.fetch , options)
  
  return {mutation}
}

export const useGetViewAttendance=(options?:mutationOptions)=>{
  const mutation = useMutation(staffApi.getViewAttendance.fetch , options)
  
  return {mutation}
}

export const useGetAttendanceToModify=(batch_id:number ,options?:queryOptions)=>{
  const [{ModifyAttendance:modifyAttendanceList} , setModifyAttendanceList]:[any , (prevalue:any)=>void] = useMMKVStorage<any>("Staff"  , storage , {ModifyAttendance:[]});
  
  const queryStatus = useQuery(staffApi.getAttendanceToModify.name , ()=>staffApi.getAttendanceToModify.fetch({batch_id : batch_id}) , {
    ...options,
    onSuccess : (data)=> { 
      setModifyAttendanceList(state=>({...state , ModifyAttendance:data}))
    },
  })
  
  return {modifyAttendanceList , queryStatus}
}
export const useDeleteAttendance=(options?:mutationOptions)=>{
  const mutation = useMutation(staffApi.deleteAttendance.fetch ,options);
  
  return {mutation}
}

export const useGetStudentByAttendInfoToModify=(attend_info:string , options?:queryOptions)=>{
  const [studentList, setStudentList] = useState<
  {
    attend_record_id: string;
    student_computer_code: number;
    attend_info: string;
    attend: boolean;
    name: string;
    enrollment: string;
  }[]
  >([]);
  const queryState = useQuery([staffApi.getStudentByAttendInfoToModify.name , attend_info] , ()=>staffApi.getStudentByAttendInfoToModify.fetch({attend_info : attend_info}) , {
    cacheTime : 0,
    onSuccess : (data:any)=>{
      setStudentList(data.data)
    }
  })
  
  return {studentList ,queryState} 
}

export const useMarkAttendance=(options?:mutationOptions)=>{
  const mutation = useMutation(staffApi.markAttendance.fetch ,options);
  return {mutation}
}

export const useGetLeaveBalance=(current_session:number , computer_code:number ,options?:queryOptions)=>{
  const [{LeaveBalance: leaveBalance}, setLeaveBalance]: [
    any,
    (prevalue: any) => void,
  ] = useMMKVStorage('Staff', storage, {LeaveBalance: {}});
  const queryState = useQuery(
    staffApi.getLeaveBalance.name,
    () =>
      staffApi.getLeaveBalance.fetch({
        computer_code: computer_code,
        academic_session: current_session,
      }),
      {
        onSuccess: (data: any) => {
          setLeaveBalance(state => ({...state, LeaveBalance: data.data}));
        },
      },
    );
    
    return {leaveBalance ,queryState}
  }
  
  export const useLeaveApply=(options?:mutationOptions)=>{
    const mutation = useMutation(staffApi.leaveApply.fetch , options); 
    
    return {mutation}
  }
  export const useGetLeaveChart=(computer_code:number , options?:queryOptions)=>{
    const [{LeaveChart:leaveChart} ,setLeaveChart] = useMMKVStorage<any>("Staff"  , storage , {LeaveChart:[]})
  
      const queryState = useQuery(staffApi.getLeaveChart.name ,()=>staffApi.getLeaveChart.fetch({
          computer_code : computer_code
        }) , { 
          ...options,
          onSuccess : (data:any)=>{
            setLeaveChart(state=>({...state , LeaveChart:data.data}))
          }
        })
  
        return {leaveChart , queryState}
  }
  
  export const useGetFacultyAssingment=(computer_code:number , options?:queryOptions)=>{
    const [{FacultyAssingment: facultyAssingment}, setFacultyAssingment]: [
      any,
      (prevalue: any) => void,
    ] = useMMKVStorage('Staff', storage, {FacultyAssingment: {}});
    const queryState = useQuery(staffApi.getFacultyAssingment.name , ()=>staffApi.getFacultyAssingment.fetch({computer_code}) , {
      ...options,
      onSuccess : (data:any)=>{
      setFacultyAssingment(state => ({...state, FacultyAssingment: data.data}));
    }
  })

  return {facultyAssingment , queryState}
}

export const useSendNotification=(options?:mutationOptions)=>{
    const mutation = useMutation(staffApi.sendNotification.fetch , options);
    return {mutation}
  }
  
  
  export const useGetStudentsByBatchId=(options?:mutationOptions)=>{
    const mutation = useMutation(staffApi.getStudentForAttendance.fetch , options);
    return {mutation}
  }
  
  
  export const useAcceptFacultyAssignment=(options?:mutationOptions)=>{
    const mutation = useMutation(staffApi.acceptFacultyAssignment.fetch , options);
    return {mutation}
  }
  
  export const useRejectFacultyAssignment=(options?:mutationOptions)=>{
    const mutation = useMutation(staffApi.rejectFacultyAssignment.fetch , options);
    return {mutation}
  }
  
  export const useGetAssignedFacultiesByApplyId=(apply_id , options?:queryOptions)=>{
    const [{FacultyAssigned: facultyAssigned}, setFacultyAssigned]: [
      any,
      (prevalue: any) => void,
    ] = useMMKVStorage('Staff', storage, {FacultyAssigned: {}});
    const queryState = useQuery(staffApi.getFacultyAssingment.name , ()=>staffApi.getAssignedFacultiesByApplyId.fetch({apply_id}) , {
      ...options,
      onSuccess : (data:any)=>{
        setFacultyAssigned(state => ({...state, FacultyAssingment: data.data}));
    }
  })
  
  return {facultyAssigned , queryState}
  }