import httpStatus from 'http-status';
import pick from '../../utils/pick';
import ApiError from '../../utils/ApiError';
import catchAsync from '../../utils/catchAsync';
import {lmsService} from '../../services';



const getLeaveChart = catchAsync(async (req, res) => {
  const {computer_code,academic_session}=req.body
  const result=await lmsService.getLeaveChart(computer_code,academic_session)
  res.send(result);
});


export default {
    getLeaveChart,
};
