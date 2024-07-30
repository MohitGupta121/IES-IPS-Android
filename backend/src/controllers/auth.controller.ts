import httpStatus from 'http-status';
import { authService } from '../services';
import catchAsync from '../utils/catchAsync';
import Jwt from '../middlewares/auth';

const loginStudent = catchAsync(async (req, res) => {
  const { computer_code, password,deviceToken } = req.body;
  const user = await authService.loginStudent(computer_code, password,deviceToken);
  const token = await Jwt.generateAuthTokens({ uid: user.uid });
  res.send({ user, token });
});
const loginFaculty = catchAsync(async (req, res) => {
  const { computer_code, password,deviceToken } = req.body;
  const user = await authService.loginFaculty(computer_code, password,deviceToken);
  const token = await Jwt.generateAuthTokens({ uid: user.id.toString() });
  res.send({ user, token });
});

const forgotPassword = catchAsync(async (req, res) => {
  // const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  // await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  // await authService.resetPassword(req.query.token as string, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

export default {
  loginStudent,
  forgotPassword,
  resetPassword,
  loginFaculty
};
