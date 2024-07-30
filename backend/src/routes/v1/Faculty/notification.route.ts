import express from 'express';
import { batchController, notificationController } from '../../../controllers';

const router = express.Router();


export default router;

/**
 * @swagger
 * tags:
 *   name: Faculty
 *   description: get faculty
 */

/**
 * @swagger
 * /notification/sendNotification:
 *   post:
 *     summary: send notification
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               computer_code:
 *                 type: number
 *               msg_title:
 *                 type: string
 *               msg_body:
 *                 type: string
 *               sendto:
 *                 type: array
 *                 items:
 *                    type: string
 *                 
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
router.post('/sendNotification', notificationController.sendNotification);
/**
 * @swagger
 * /notification/sendNotificationPrincipal:
 *   post:
 *     summary: send notification
 *     tags: [Notification]
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
 *                 
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
router.post('/sendNotificationPrincipal', notificationController.getNotificationPrincipal);


/**
 * @swagger
 * /notification/sendNotificationHod:
 *   post:
 *     summary: send notification
 *     tags: [Notification]
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
router.post('/sendNotificationHod', notificationController.getNotificationHod);


/**
 * @swagger
 * /notification/sendNotificationYearCoordinator:
 *   post:
 *     summary: send notification
 *     tags: [Notification]
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
router.post('/sendNotificationYearCoordinator', notificationController.getNotificationYearCoordinator);
/**
 * @swagger
 * /notification/sendNotificationBatchCoordinator:
 *   post:
 *     summary: send notification
 *     tags: [Notification]
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
router.post('/sendNotificationBatchCoordinator', notificationController.getNotificationBatchCoordinator);
