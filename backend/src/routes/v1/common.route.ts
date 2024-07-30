import express from 'express';
import commonContoller from '../../controllers/common.contoller';

const router = express.Router();

export default router;

/**
 * @swagger
 * tags:
 *   name: Common
 *   description: common route for faculty and student
 */

/**
 * @swagger
 * /common/academicSession:
 *   get:
 *     summary: get batch by faculty computercode
 *     tags: [Common]
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

router.get('/academicSession', commonContoller.getAcademicSession);
/**
 * @swagger
 * /common/academicCalender:
 *   get:
 *     summary: get batch by faculty computercode
 *     tags: [Common]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "201":
 *         description: ok
 */

router.get('/academicCalender', commonContoller.getAcademicCalender);
/**
 * @swagger
 * /common/getTimeSlot:
 *   get:
 *     summary: get batch by faculty computercode
 *     tags: [Common]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "201":
 *         description: ok
 */

router.get('/getTimeSlot', commonContoller.getTimeSlot);
/**
 * @swagger
 * /common/getLectureType:
 *   get:
 *     summary: get batch by faculty computercode
 *     tags: [Common]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "201":
 *         description: ok
 */

router.get('/getLectureType', commonContoller.getLectureType);
/**
 * @swagger
 * /common/academicCalender:
 *   post:
 *     summary: Create an academic calendar event
 *     tags: [Common]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Semester Start
 *               description:
 *                 type: string
 *                 example: First day of the semester
 *               category:
 *                 type: string
 *                 example: Academic Event
 *               date:
 *                 type: string
 *                 format : date-time
 *                 example: "2023-10-15T00:00:00Z"
 *               academic_session:
 *                 type: number
 *                 example: 24
 *     responses:
 *       '201':
 *         description: Successfully created an academic calendar event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Semester Start
 *                 description:
 *                   type: string
 *                   example: First day of the semester
 *                 category:
 *                   type: string
 *                   example: Academic Event
 *                 date:
 *                   type: string
 *                   example: 2023-10-15
 *                 academic_session:
 *                   type: string
 *                   example: Fall 2023
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
*/

router.post('/academicCalender', commonContoller.postAcademicCalender);

/**
 * @swagger
 * /common/getDepartments:
 *   get:
 *     summary: get departments
 *     tags: [Common]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "201":
 *         description: ok
 */

router.get('/getDepartments', commonContoller.getDepartments);