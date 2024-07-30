import catchAsync from '../utils/catchAsync';
import { commonService } from '../services';
import prisma from '../client';

const getAcademicSession = catchAsync(async (req, res) => {
  const result = await commonService.getAcademicSession();
  res.send(result);
});
const getAcademicCalender = catchAsync(async (req, res) => {
  const result = await commonService.getAcademicCalender();
  res.send(result);
});
const getTimeSlot = catchAsync(async (req, res) => {
  const result = await commonService.getTimeSlot();
  res.send(result);
});
const getLectureType = catchAsync(async (req, res) => {
  const result = await commonService.getLectureType();
  res.send(result);
});

const postAcademicCalender = async (req: any, res: any) => {
  try {
    const { name, description, category, date, academic_session } = req.body;
    const createEvent = await prisma.academic_calender.create({
      data: {
        name,
        description,
        category,
        date,
        academic_session
      }
    });
    res.status(201).json(createEvent);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getDepartments = catchAsync(async (req, res) => {
  const result = await commonService.getDepartments();
  res.status(200).send(result);
});

const getFacultyByDepartment = catchAsync(async( req , res)=>{
  try{
    const {department_id} = req.query;
    const result = await commonService.getFacultyByDepartment(Number(department_id));
    res.status(200).send(result);
    
  }catch(error){
    res.status(500).json({ error: 'Internal Server Error' });
  }

})

const getNameByComputerCode = catchAsync(async( req , res)=>{
  try{
    const {computer_code , user_type} = req.body;
    const result = await commonService.getNameByComputerCode(computer_code , user_type);
    res.status(200).send(result);
    
  }catch(error){
    res.status(500).json({ error: 'Internal Server Error' });
  }

})



export default {
  getAcademicSession,
  getAcademicCalender,
  postAcademicCalender,
  getTimeSlot,
  getLectureType,
  getDepartments,
  getFacultyByDepartment,
  getNameByComputerCode,
};
