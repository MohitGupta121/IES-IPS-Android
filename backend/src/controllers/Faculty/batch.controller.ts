import httpStatus from 'http-status';
import pick from '../../utils/pick';
import ApiError from '../../utils/ApiError';
import catchAsync from '../../utils/catchAsync';
import batchService from '../../services/faculty/batch.service';



const getBatches = catchAsync(async (req, res) => {
  const {computer_code,academic_session}=req.body
  const result=await batchService.getBatch(computer_code,academic_session)
  res.send(result);
});


export default {
  getBatches,
};
