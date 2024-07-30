import express from 'express';
import validate from '../../../middlewares/validate';
import authValidation from '../../../validations/auth.validation';
import { facultyController, studentController, studentReportController, studentfeedbackController } from '../../../controllers';
import auth from '../../../middlewares/auth';
import attendanceController from '../../../controllers/Faculty/attendance.controller';

const router = express.Router();

// router.post('/register', validate(authValidation.register), authController.register);
// router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
// router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);

export default router;

/**
 * @swagger
 * tags:
 *   name: Student
 *   description: get student
 */

/**
 * @swagger
 * /student/getAllStudent:
 *   get:
 *     summary: get all student as per department
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "201":
 *         description: fetched 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

router.get('/getAllStudent',auth.auth(), studentController.getAllStudent);

/**
 * 
 * @swagger
 * /student/getAttendance:
 *   post:
 *     summary: get student attendance
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - computer_code
 *               - academic_session
 *             properties:
 *               computer_code:
 *                 type: number
 *               academic_session:
 *                 type: number
 *     responses:
 *       "201":
 *         description: fetched 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */

router.post('/getAttendance', attendanceController.getAttendanceForStudent);
/**
 * @swagger
 * /student/getReport:
 *   post:
 *     summary: get student attendance
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - computer_code
 *               - academic_session
 *               - event_category
 *             properties:
 *               computer_code:
 *                 type: number
 *               academic_session:
 *                 type: number
 *               event_category:
 *                 type: number
 *     responses:
 *       "201":
 *         description: fetched 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */
router.post('/getReport',studentReportController.getResult);
/**
 * @swagger
 * /student/getNbaFeedback:
 *   post:
 *     summary: get nba feedback
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - computer_code
 *               - academic_session
 *             properties:
 *               computer_code:
 *                 type: number
 *               academic_session:
 *                 type: number
 *     responses:
 *       "200":
 *         description: ok 
 */
router.post('/getNbaFeedback',studentfeedbackController.getNbaFeedback);
/**
 * @swagger
 * /student/insertNbaFeedback:
 *   post:
 *     summary: Get NBA feedback
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - academic_session
 *               - computer_code
 *               - feedback_id
 *               - data
 *             properties:
 *               academic_session:
 *                 type: number
 *               feedback_id:
 *                 type: number
 *               computer_code:
 *                 type: number
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     co_id:
 *                       type: integer
 *                     value:
 *                       type: integer
 *     responses:
 *       "200":
 *         description: OK
 */
router.post('/insertNbaFeedback',studentfeedbackController.InsertNbaFeedback);
/**
 * @swagger
 * /student/getFacilityFeedback:
 *   post:
 *     summary: get nba feedback
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - computer_code
 *               - academic_session
 *             properties:
 *               computer_code:
 *                 type: number
 *               academic_session:
 *                 type: number
 *     responses:
 *       "200":
 *         description: ok 
 */
router.post('/getFacilityFeedback',studentfeedbackController.getFacilityFeedback);
/**
 * @swagger
 * /student/InsertfacilityFeedback:
 *   post:
 *     summary: Get NBA feedback
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - computer_code
 *               - feedback_id
 *               - data
 *               - comment
 *             properties:
 *               computer_code:
 *                 type: number
 *               feedback_id:
 *                 type: number
 *               comment:
 *                 type: string
 *               data:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       "200":
 *         description: OK
 */
router.post('/InsertfacilityFeedback',studentfeedbackController.InsertfacilityFeedback);
/**
 * @swagger
 * /student/getCumulativeAttendance:
 *   post:
 *     summary: get student CumulativAttendance
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - computer_code
 *               - academic_session
 *             properties:
 *               computer_code:
 *                 type: number
 *               academic_session:
 *                 type: number
 *     responses:
 *       "201":
 *         description: fetched 
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 tokens:
 *                   $ref: '#/components/schemas/AuthTokens'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 */
router.post('/getCumulativeAttendance',studentController.getCumulativeAttendance);

/**
 * @swagger
 * /student/getFacultyfeedback:
 *   post:
 *     summary: get nba feedback
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - computer_code
 *               - academic_session
 *             properties:
 *               computer_code:
 *                 type: number
 *               academic_session:
 *                 type: number
 *     responses:
 *       "200":
 *         description: ok 
 */
router.post('/getFacultyfeedback',studentfeedbackController.getfacultyfeedback);
/**
 * @swagger
 * /student/InsertFacultyFeedback:
 *   post:
 *     summary: Insert faculty feedback
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - computer_code
 *               - feedback_id
 *               - data
 *               - comment
 *             properties:
 *               computer_code:
 *                 type: number
 *               feedback_id:
 *                 type: number
 *               comment:
 *                 type: string
 *               data:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:  # Corrected "propertes" to "properties"
 *                      faculty_computer_code:
 *                          type: number
 *                      clg_sub_code:
 *                          type: string
 *                      batch_id:
 *                          type: number
 *                      a:
 *                          type: number
 *                      b:
 *                          type: number
 *                      c:
 *                          type: number
 *                      d:
 *                          type: number
 *                      e:
 *                          type: number
 *                      f:
 *                          type: number
 *                      g:
 *                          type: number
 *                      h:
 *                          type: number
 *                      i:
 *                          type: number
 *                      j:
 *                          type: number
 *                      k:
 *                          type: number
 *                      l:
 *                          type: number
 *                      m:
 *                          type: number
 *                      n:
 *                          type: number
 *     responses:
 *       "200":
 *         description: OK
 */

router.post('/InsertFacultyFeedback',studentfeedbackController.InsertfacultyFeedback);