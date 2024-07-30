import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { studentService } from '../services';
import CumullativeAttendance from '../services/Student/CumullativeAttendance';



const getAllStudent = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await studentService.queryUsers(filter, options);
  res.send(result);
});

const getCumulativeAttendance = catchAsync(async (req, res) => {
  const {computer_code,academic_session}=req.body
  const result=await CumullativeAttendance.getCumulativeAttendance(computer_code,academic_session)
  res.send(result);
});

export default {
  getAllStudent,
  getCumulativeAttendance
};
