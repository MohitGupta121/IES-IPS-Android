import httpStatus from 'http-status';
import pick from '../../utils/pick';
import ApiError from '../../utils/ApiError';
import catchAsync from '../../utils/catchAsync';
import batchService from '../../services/faculty/batch.service';
import { notificationService } from '../../services';
import admin from '../../config/firebase';
import { any } from 'joi';
import prisma from '../../client';
const notification_options = {
  priority: 'high',
  timeToLive: 60 * 60 * 24
};

const getNotificationPrincipal = catchAsync(async (req, res) => {
  const { computer_code, academic_session } = req.body;
  const result = await notificationService.getNotificationPrincipal(
    computer_code,
    academic_session
  );
  res.send(result);
});
const getNotificationHod = catchAsync(async (req, res) => {
  const { computer_code, academic_session } = req.body;
  const result = await notificationService.getNotificationHod(computer_code, academic_session);
  res.send(result);
});
const getNotificationYearCoordinator = catchAsync(async (req, res) => {
  const { computer_code, academic_session } = req.body;
  const result = await notificationService.getNotificationYearCoordinator(
    computer_code,
    academic_session
  );
  res.send(result);
});
const getNotificationBatchCoordinator = catchAsync(async (req, res) => {
  const { computer_code, academic_session } = req.body;
  const result = await notificationService.getNotificationBatchCoordinator(
    computer_code,
    academic_session
  );
  res.send(result);
});
const sendNotification = catchAsync(async (req, res) => {
  const { msg_body, msg_title, sendto,computer_code } = req.body;
  const data= await prisma.notification_msg.create({
    data:{
      sender_computer_code:computer_code,
      msg:`{msg_title:${msg_title},msg_body:${msg_body}}`
    }
  })
  if (!data) {
    res.status(500).send('Notifications not sent');
  }
  const message = {
    notification: {
      title: msg_title,
      body: msg_body,
    },
  };

  const options = notification_options;

  for (let index = 0; index < sendto.length; index++) {
    const element = sendto[index];
    const token= await prisma.notification_device_token.findFirst({
      where:{
        computer_code:Number(element)
      },
      select:{
        device_token:true
      }
    })
    const msg=await admin.messaging().sendToDevice(token?.device_token, message, options);
    if (!msg) {
      res.status(500).send('Notifications not sent');
    }
  }
  res.status(200).send('Notifications sent successfully');
});


export default {
  getNotificationPrincipal,
  getNotificationYearCoordinator,
  getNotificationHod,
  getNotificationBatchCoordinator,
  sendNotification
};
