import httpStatus from 'http-status';
import pick from '../../utils/pick';
import ApiError from '../../utils/ApiError';
import catchAsync from '../../utils/catchAsync';
import {lmsService} from '../../services';
import { messaging } from 'firebase-admin';



const getLeaveBalance = catchAsync(async (req, res) => {
  try{
    const {computer_code,academic_session}=req.body
    const result=await lmsService.getLeaveBalance(computer_code,academic_session);
    console.log(result , computer_code , academic_session)
    res.status(200).send(result);
  } catch (error){    
    console.log(error)
    res.status(500).send({ status : 0 , message : "Error Fetching Leave Data"});
  }

});

const getLeaveApplyLimit = catchAsync(async (req, res) => {
  
  try{
    const result=await lmsService.getLeaveApplyLimit();
    res.status(200).send(result);
  }catch (error){    
    res.status(500).send({ status : 0 , message : error});
  }
});

const leaveApply = catchAsync(async (req, res) => {
  try{
    const {
      academic_session,
      computer_code,
      start_date,
      end_date,
      days,
      leave_type,
      reason,
      lectures_assigned,
      other_responsibility,
    }=req.body
    await lmsService.leaveApply(
      academic_session,
      computer_code,
      start_date,
      end_date,
      days,
      leave_type,
      reason,
      lectures_assigned,
      other_responsibility,  
    );
    res.status(200).send({ status : 1 , msg : 'successfull'});
  } catch (error){    
    console.log(error)
    res.status(500).send({ status : 0 , msg : 'unsuccessfull' , data : error});
  }
  
});


const getLeaveChart = catchAsync(async (req, res)=>{
  
  try{
    const { computer_code } = req.body;
    const result =  await lmsService.getLeaveChart(computer_code);
    res.status(200).send({ status : 1 , msg : 'successfull' , data : result});
    
  }catch(error){
    res.status(500).send({ status : 0 , msg : 'unsuccessfull' , data : error});
  }
  
});

const getAssignedFacultiesByApplyId = catchAsync(async (req, res)=>{
  
  try{
    const { apply_id } = req.body;
    const result =  await lmsService.getAssignedFacultiesByApplyId(apply_id);
    res.status(200).send({ status : 1 , msg : 'successfull' , data : result});
    
  }catch(error){
    console.log(error)
    res.status(500).send({ status : 0 , msg : 'unsuccessfull' , data : error});
  }
  
});

const getFacultyAssingment = catchAsync(async (req, res)=>{
  
  try{
    const { computer_code } = req.body;
    const result =  await lmsService.getFacultyAssingment(computer_code);
    res.status(200).send({ status : 1 , msg : 'successfull' , data : result});
    
  }catch(error){
    console.log(error)
    res.status(500).send({ status : 0 , msg : 'unsuccessfull' , data : error});
  }
  
});


const acceptFacultyAssignment = catchAsync(async (req, res)=>{
  
  try{
    const { assign_faculty_id } = req.body;
    const result =  await lmsService.acceptFacultyAssignment(assign_faculty_id);
    res.status(200).send({ status : 1 , msg : 'successfull' , data : result});
    
  }catch(error){
    res.status(500).send({ status : 0 , msg : 'unsuccessfull' , data : error});
  }
  
});

const rejectFacultyAssignment = catchAsync(async (req, res)=>{
  
  try{
    const { assign_faculty_id } = req.body;
    const result =  await lmsService.rejectFacultyAssignment(assign_faculty_id);
    res.status(200).send({ status : 1 , msg : 'successfull' , data : result});
    
  }catch(error){
    res.status(500).send({ status : 0 , msg : 'unsuccessfull' , data : error});
  }
  
});

export default {
    getLeaveBalance,
    getLeaveApplyLimit,
    leaveApply,
    getLeaveChart,
    getAssignedFacultiesByApplyId,
    getFacultyAssingment,
    acceptFacultyAssignment,
    rejectFacultyAssignment,
  };
  