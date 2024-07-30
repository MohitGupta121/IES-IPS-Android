import httpStatus from 'http-status';
import pick from '../../utils/pick';
import ApiError from '../../utils/ApiError';
import catchAsync from '../../utils/catchAsync';
import { attendanceService } from '../../services';

const getAttendanceForStudent = catchAsync(async (req, res) => {
  const { computer_code, academic_session } = req.body;
  const result = await attendanceService.getAttendance(computer_code, academic_session);
  res.send(result);
});
const getStudentForAttendance = catchAsync(async (req, res) => {
  const { batch_id } = req.body;
  const result = await attendanceService.getStudentForAttendance(batch_id);
  res.send(result);
});
const getAttendanceToModify = catchAsync(async (req, res) => {
  const { batch_id } = req.body;
  const result = await attendanceService.getModifyAttendance(batch_id);
  res.send(result);
});
const getTopicForAttendance = catchAsync(async (req, res) => {
  const { batch_id } = req.body;
  const result = await attendanceService.getTopicForAttendance(batch_id);
  res.send(result);
});
const markStudentAttendance = catchAsync(async (req, res) => {
  const {
    students,
    faculty_computer_code,
    academic_session,
    date,
    lecture_type,
    group,
    time_slot,
    topic_id,
    topic_name,
    batch_id,
    remark
  } = req.body;
  try {
    const result = await attendanceService.markStudentAttendance(
      students,
      faculty_computer_code,
      academic_session,
      date,
      lecture_type,
      group,
      time_slot,
      topic_id,
      topic_name,
      batch_id,
      remark
    );

    res.status(201).send({ status: 1, msg: 'successfull', data: result });
  } catch (error) {
    console.log(error)
    res.status(500).send({ status: 0, msg: 'unsuccessfull', data: error });
  }
});

const getSubjectsForFaculty = catchAsync(async (req, res)=>{
  const { computer_code , session_id } = req.body;
  try {
    const result = await attendanceService.getSubjectsForFaculty(
      computer_code ,
      session_id,
    );

    res.status(200).send({ status : 1 , msg : 'successfull' , data : result});
  } catch (error){
    res.status(500).send({ status : 0 , msg : 'unsuccessfull' , data : error});
  }
});


const getViewAttendance = catchAsync(async (req, res)=>{
  const { batch_id, academic_session, from_date, to_date, lecture_type } = req.body;
  try {
    const result = await attendanceService.getViewAttendance(
      batch_id, academic_session, from_date, to_date, lecture_type
    );

    res.status(200).send({ status : 1 , msg : 'successfull' , data : result});
  } catch (error){    
    res.status(500).send({ status : 0 , msg : 'unsuccessfull' , data : error});
  }
});


const deleteAttendance = catchAsync(async (req, res)=>{
  const { attend_info } = req.body;
  try {
    await attendanceService.deleteAttendance(
      attend_info
    );
    res.status(200).send({ status : 1 , msg : 'successfull'});
  } catch (error){
    res.status(500).send({ status : 0 , msg : 'unsuccessfull' , data : error});
  }
});

const getStudentByAttendInfoToModify = catchAsync(async (req, res)=>{
  const { attend_info } = req.body;
  try {
    const result = await attendanceService.getStudentByAttendInfoToModify(
      attend_info
    );

    res.status(200).send({ status : 1 , msg : 'successfull' , data : result});
  } catch (error){    
    res.status(500).send({ status : 0 , msg : 'unsuccessfull' , data : error});
  }
  });
  
  const markAttendanceToModify = catchAsync( async(req , res )=>{
    const { attendance } = req.body
    try {
      const result = await attendanceService.markAttendanceToModify(
        attendance
      );
  
      res.status(200).send({ status : 1 , msg : 'successfull' , data : result});
    } catch (error){
      res.status(500).send({ status : 0 , msg : 'unsuccessfull' , data : error});
    }
    
})


export default {
  getAttendanceForStudent,
  getStudentForAttendance,
  getTopicForAttendance,
  markStudentAttendance,
  getAttendanceToModify,
  getSubjectsForFaculty,
  getViewAttendance,
  deleteAttendance,
  getStudentByAttendInfoToModify,
  markAttendanceToModify,
};
