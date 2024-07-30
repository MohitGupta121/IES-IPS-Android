import express from 'express';
import { lmsController } from '../../../controllers';

const router = express.Router();

/**
 * @swagger
 * /lms/getLeaveBalance:
 *   post:
 *     summary: get all faculty
 *     tags: [LMS]
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

router.post('/getLeaveBalance', lmsController.getLeaveBalance);
/**
 * @swagger
 * /lms/getLeaveApplyLimit:
 *   get:
 *     summary: get all faculty
 *     tags: [LMS]
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

router.get('/getLeaveApplyLimit', lmsController.getLeaveApplyLimit);
/**
 * @swagger
 * /lms/leaveApply:
 *   post:
 *     summary: Apply for leave
 *     tags: [LMS]
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
 *               - start_date
 *               - end_date
 *               - days
 *               - leave_type
 *               - reason
 *               - lectures_assigned
 *               - other_responsibility
 *               - academic_session
 *             properties:
 *               computer_code:
 *                 type: number
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               days:
 *                 type: number
 *               leave_type:
 *                 type: string
 *                 enum: [cl, el, dl, ol, hdcl, lwp, sdl]
 *               reason:
 *                 type: string
 *               lectures_assigned:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     faculty_computer_code:
 *                       type: number
 *                     faculty_date:
 *                       type: string
 *                     assigned_class:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           assigned_class_dept:
 *                             type: string
 *                           assigned_section:
 *                             type: string
 *                           lecture_type:
 *                             type: string
 *                           start_time:
 *                             type: string
 *                           end_time:
 *                             type: string
 *               other_responsibility:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     faculty_computer_code:
 *                       type: number
 *                     faculty_date:
 *                       type: string
 *                     responsibility:
 *                       type: string
 *               academic_session:
 *                 type: number
 *     responses:
 *       "201":
 *         description: Leave applied successfully
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

router.post('/leaveApply', lmsController.leaveApply);
/**
 * @swagger
 * /lms/getLeaveChart:
 *   post:
 *     summary: Leave Chart
 *     tags: [LMS]
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
 *     responses:
 *       "201":
 *         description: Leave applied successfully
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

router.post('/getLeaveChart', lmsController.getLeaveChart);
/**
 * @swagger
 * /lms/getAssignedFacultiesByApplyId:
 *   post:
 *     summary: Assinged Faculties by apply_id
 *     tags: [LMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - apply_id
 *             properties:
 *               apply_id:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Fetched successfully
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

router.post('/getAssignedFacultiesByApplyId', lmsController.getAssignedFacultiesByApplyId);
/**
 * @swagger
 * /lms/getFacultyAssingment:
 *   post:
 *     summary: Faculty Assignemnet by computer_code
 *     tags: [LMS]
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
 *     responses:
 *       "201":
 *         description: Fetched successfully
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

router.post('/getFacultyAssingment', lmsController.getFacultyAssingment);
/**
 * @swagger
 * /lms/acceptFacultyAssignment:
 *   post:
 *     summary: Accept Faculty Assignment by assign_faculty_id
 *     tags: [LMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assign_faculty_id
 *             properties:
 *               assign_faculty_id:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Assignment accepted successfully
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

router.post('/acceptFacultyAssignment', lmsController.acceptFacultyAssignment);
/**
 * @swagger
 * /lms/rejectFacultyAssignment:
 *   post:
 *     summary: Reject Faculty Assignment by assign_faculty_id
 *     tags: [LMS]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assign_faculty_id
 *             properties:
 *               assign_faculty_id:
 *                 type: string
 *     responses:
 *       "201":
 *         description: Assignment rejected successfully
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

router.post('/rejectFacultyAssignment', lmsController.rejectFacultyAssignment);

export default router;
