import express from 'express';
import validate from '../../../middlewares/validate';
import authValidation from '../../../validations/auth.validation';
import { facultyController } from '../../../controllers';
import auth from '../../../middlewares/auth';

const router = express.Router();

// router.post('/register', validate(authValidation.register), authController.register);
// router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
// router.post('/verify-email', validate(authValidation.verifyEmail), authController.verifyEmail);
router.get('/getAllFaculty', facultyController.getAllFaculty);

export default router;

/**
 * @swagger
 * tags:
 *   name: Faculty
 *   description: get faculty
 */

/**
 * @swagger
 * /faculty/getAllFaculty:
 *   get:
 *     summary: get all faculty
 *     tags: [Faculty]
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


