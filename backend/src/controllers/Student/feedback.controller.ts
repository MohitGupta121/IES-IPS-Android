import catchAsync from '../../utils/catchAsync';
import { studentFeedbackService } from '../../services';



const getNbaFeedback = catchAsync(async (req, res) => {
  const { computer_code, academic_session } = req.body
  const result = await studentFeedbackService.getFeedbackNba(computer_code, academic_session)
  res.send(result);
});
const getFacilityFeedback = catchAsync(async (req, res) => {
  const { computer_code, academic_session } = req.body
  const result = await studentFeedbackService.getfacilityfeedback(computer_code, academic_session)
  res.send(result);
});
const InsertNbaFeedback = catchAsync(async (req, res) => {
  const { data, academic_session, feedback_id,computer_code } = req.body
  const result = await studentFeedbackService.InsertNbaFeedbackCo(academic_session,computer_code, feedback_id, data,)
  res.send(result);
});
const InsertfacilityFeedback = catchAsync(async (req, res) => {
  const { data, computer_code, feedback_id, comment } = req.body
  const result = await studentFeedbackService.InsertfacilityFeedback(computer_code, feedback_id, data, comment)
  res.send(result);
});
const InsertfacultyFeedback = catchAsync(async (req, res) => {
  const { data, computer_code, feedback_id, comment } = req.body
  const result = await studentFeedbackService.InsertfacultyFeedback(computer_code, feedback_id, data, comment)
  res.send(result);
});
const getfacultyfeedback = catchAsync(async (req, res) => {
  const { computer_code, academic_session } = req.body
  const result = await studentFeedbackService.getfacultyfeedback(computer_code, academic_session)
  res.send(result);
});

export default {
  getNbaFeedback,
  InsertNbaFeedback,
  getFacilityFeedback,
  InsertfacilityFeedback,
  getfacultyfeedback,
  InsertfacultyFeedback,
}