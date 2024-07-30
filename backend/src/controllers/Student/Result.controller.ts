import httpStatus from 'http-status';
import pick from '../../utils/pick';
import ApiError from '../../utils/ApiError';
import catchAsync from '../../utils/catchAsync';
import { studentReportService } from '../../services';



const getResult = catchAsync(async (req, res) => {
  const {computer_code,academic_session,event_category}=req.body
  const result=await studentReportService.getResult(computer_code,academic_session,event_category)
  res.send(result);
});


export default {
    getResult,
};
