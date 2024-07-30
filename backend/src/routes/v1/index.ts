import express from 'express';
import authRoute from './auth.route';
// import userRoute from './user.route';
import studentRoute from './Student/student.route';
import facultyRoute from './Faculty/faculty.route'
import docsRoute from './docs.route';
import batchRoute from './Faculty/batch.route';
import commonRoute from './common.route';
import config from '../../config/config';
import notification from './Faculty/notification.route';
import attendance from './Faculty/Attendance.route';
import lms from './Faculty/lms.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/batch',
    route: batchRoute
  },
  {
    path: '/student',
    route: studentRoute
  },
  {
    path: '/faculty',
    route: facultyRoute
  },
  {
    path: '/common',
    route: commonRoute
  },
  {
    path: '/notification',
    route: notification
  },
  {
    path: '/attendance',
    route: attendance
  },
  {
    path: '/lms',
    route: lms
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;
