import httpStatus from 'http-status';
import pick from '../../utils/pick';
import ApiError from '../../utils/ApiError';
import catchAsync from '../../utils/catchAsync';
import { facultyService } from '../../services';



const getAllFaculty = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await facultyService.queryUsers(filter, options);
  res.send(result);
});


export default {
  getAllFaculty,
};
