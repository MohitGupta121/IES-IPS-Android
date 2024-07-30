import express from 'express';
import { lmsController } from '../../../controllers';

const router = express.Router();

/**
 * @swagger
 * /lms/getLeaveChart:
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

router.post('/getLeaveChart', lmsController.getLeaveChart);

export default router;
