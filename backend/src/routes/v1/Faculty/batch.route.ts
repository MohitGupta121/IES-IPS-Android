import express from 'express';
import { batchController } from '../../../controllers';

const router = express.Router();

router.post('/getBatch', batchController.getBatches);

export default router;

/**
 * @swagger
 * tags:
 *   name: Faculty
 *   description: get faculty
 */

/**
 * @swagger
 * /batch/getBatch:
 *   post:
 *     summary: get batch by faculty computercode
 *     tags: [Batch]
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


