import express from 'express';
import { attendanceController } from '../../../controllers';

const router = express.Router();

/**
 * @swagger
 * /attendance/getAttendanceToModify:
 *   post:
 *     summary: get batch by faculty computercode
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - batch_id
 *             properties:
 *               batch_id:
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
router.post('/getAttendanceToModify', attendanceController.getAttendanceToModify);
/**
 * @swagger
 * /attendance/getStudentForAttendance:
 *   post:
 *     summary: get batch by faculty computercode
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - batch_id
 *             properties:
 *               batch_id:
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
router.post('/getStudentForAttendance', attendanceController.getStudentForAttendance);
/**
 * @swagger
 * /attendance/getTopicForAttendance:
 *   post:
 *     summary: get batch by faculty computercode
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - batch_id
 *             properties:
 *               batch_id:
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
router.post('/getTopicForAttendance', attendanceController.getTopicForAttendance);
/**
 * @swagger
 *  /attendance/markAttendance:
 *   post:
 *     summary: Mark Attendance
 *     tags: [Attendance]
 *     description: Mark attendance for students.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               students:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     computer_code:
 *                       type: integer
 *                     attend:
 *                       type: boolean
 *                 description: List of students with attendance status.
 *               faculty_computer_code:
 *                 type: integer
 *                 description: Faculty computer code.
 *               academic_session:
 *                 type: integer
 *                 description: Academic session.
 *               date:
 *                 type: string
 *                 description: Date of the lecture.
 *               lecture_type:
 *                 type: integer
 *                 description: Type of lecture.
 *               group:
 *                 type: string
 *                 description: Lecture group.
 *               time_slots:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: List of time slots.
 *               topic_id:
 *                 type: integer
 *                 description: Lecture topic id .
 *               topic_name:
 *                 type: string
 *                 description: topic name.
 *               batch_id:
 *                 type: integer
 *                 description: Batch ID.
 *               remark:
 *                 type: string
 *                 description: Remarks for the lecture.
*
*     responses:
*       '200':
*         description: Attendance marked successfully.
 *       '400':
 *         description: Bad request. Invalid input data.
 *       '500':
 *         description: Internal server error.
*
*/
router.post('/markAttendance', attendanceController.markStudentAttendance);
/**
 * @swagger
 * /attendance/getSubjectsForFaculty:
 *   post:
 *     summary: get subject of faculty by computercode
 *     tags: [Attendance]
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
 *             properties:
 *               computer_code:
 *                 type: number
 *               session_id:
 *                 type: number
 *     responses:
 *       "201":
 *         description: fetched successfully
 *         
 *       "400":
 *         description: invalid computer_code or session_id
 *         
 */

router.post('/getSubjectsForFaculty' , attendanceController.getSubjectsForFaculty);
/**
 * @swagger
 * /attendance/getViewAttendance:
 *   post:
 *     summary: get subject of faculty by computercode
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - batch_id
 *               - academic_session
 *               - from_date
 *               - to_date
 *             properties:
 *               batch_id :
 *                 type: number
 *               academic_session:
 *                 type: number
 *               lecture_type:
 *                 type: number
 *               from_date :
 *                 type: string
 *               to_date:
 *                 type: string
 * 
 *     responses:
 *       "201":
 *         description: fetched successfully
 *         
 *       "400":
 *         description: invalid computer_code or session_id
 *         
 */

router.post('/getViewAttendance' , attendanceController.getViewAttendance);
/**
 * @swagger
 * /attendance/deleteAttendance:
 *   delete:
 *     summary: delete attendance of a class
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attend_info
 *             properties:
 *               attend_info :
 *                 type: string
 * 
 *     responses:
 *       "200":
 *         description: deleted successfully
 *         
 *       "400":
 *         description: invalid attend_info
 *         
*/

router.delete('/deleteAttendance' , attendanceController.deleteAttendance);
/**
 * @swagger
 * /attendance/getStudentByAttendInfoToModify:
 *   post:
 *     summary: get students to modify by attend_info
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attend_info
 *             properties:
 *               attend_info :
 *                 type: string
 * 
 *     responses:
 *       "201":
 *         description: fetched successfully
 *         
 *       "400":
 *         description: invalid computer_code or session_id
 *         
 */

router.post('/getStudentByAttendInfoToModify' , attendanceController.getStudentByAttendInfoToModify);
/**
 * @swagger
 * /attendance/markAttendanceToModify:
 *   post:
 *     summary: Get students to modify by attend_info
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attendance
 *             properties:
 *               attendance:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     attend_record_id:
 *                       type: string
 *                       description: The ID of the attendance record
 *                     student_computer_code:
 *                       type: number
 *                       description: The computer code of the student
 *                     attend_info:
 *                       type: string
 *                       description: Information about the attendance
 *                     attend:
 *                       type: boolean
 *                       description: Attendance status
 *                     name:
 *                       type: string
 *                       description: The name of the student
 *                     enrollment:
 *                       type: string
 *                       description: The enrollment status
 *     responses:
 *       201:
 *         description: Update successfully
 *       400:
 *         description: Invalid record_id
 */


router.post('/markAttendanceToModify' , attendanceController.markAttendanceToModify);

export default router;
