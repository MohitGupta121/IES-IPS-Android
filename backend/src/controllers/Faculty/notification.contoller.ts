import httpStatus from 'http-status';
import pick from '../../utils/pick';
import ApiError from '../../utils/ApiError';
import catchAsync from '../../utils/catchAsync';
import batchService from '../../services/faculty/batch.service';
import { commonService, notificationService } from '../../services';
import admin from '../../config/firebase';
import { any } from 'joi';
import prisma from '../../client';
import { userType } from '../../utils/constants';
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
  const { title , description , message , sender_computer_code , send_to } = req.body;
  if (! send_to?.length ) res.status(400).send("At least one computer code is Required")
  
  const notification = await prisma.notifications.create({
    data:{
      title,
      description,
      message ,
      sender_computer_code,
    }
  })

  let sender = await commonService.getNameByComputerCode(sender_computer_code , userType.staff)

  if ( !notification) res.status(500).send("Notification failed")
  
  var notification_message = {
    notification:{
      title : title,
      body : description,
    },
    data:{
      message,
      sender : sender.name,
      timestamp : notification.timestamp.toISOString(),
    }
  }

  for ( let i = 0 ; i< send_to.length ; i++){
    const reciever = send_to[i]
    const deviceToken = await prisma.notification_device_token.findFirst({where:{computer_code:reciever}});

    if(!deviceToken || deviceToken?.device_token == "token") continue;

    let reciever_message = { ...notification_message , token : deviceToken.device_token}

    const notified = await admin.messaging().send( reciever_message);

    if ( ! notified) res.status(500).send("Invalid devices found");

  }


  // const data= await prisma.notification_msg.create({
  //   data:{
  //     sender_computer_code:computer_code,
  //     msg:`{msg_title:${msg_title},msg_body:${msg_body}}`
  //   }
  // })
  // if (!data) {
  //   res.status(500).send('Notifications not sent');
  // }
  // var message:any = {
  //   notification: {
  //     title: msg_title,
  //     body: msg_body,
  //   },
  //   data:{
  //     icon:"https://api.dicebear.com/9.x/adventurer/svg?seed=Mimi"
  //   },
  //   android:{
  //     notification:{
        
  //     }
  //   }
    
  // };

  // const options = notification_options;

  // for (let index = 0; index < sendto.length; index++) {
  //   const element = sendto[index];
  //   const token= await prisma.notification_device_token.findFirst({
  //     where:{
  //       computer_code:Number(element)
  //     },
  //     select:{
  //       device_token:true
  //     }
  //   })
  //   message = {...message , token:token?.device_token}
  //   const msg=await admin.messaging().send( message);
  //   if (!msg) {
  //     res.status(500).send('Notifications not sent');
  //   }
  // }
  res.status(200).send('Notifications sent successfully');
});





export default {
  getNotificationPrincipal,
  getNotificationYearCoordinator,
  getNotificationHod,
  getNotificationBatchCoordinator,
  sendNotification
};
