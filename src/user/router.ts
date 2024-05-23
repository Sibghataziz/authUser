import { Router } from "express";
import bodyParser from "body-parser";
import UserController from './controller'
import UserMiddleware from './middleware'

const router = Router();

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     description: This endpoint registers a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               photo:
 *                 type: string
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               phone:
 *                 type: string
 *               isPrivate:
 *                 type: boolean
 *               isAdmin:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: User registered successfully
 *       500:
 *         description: Bad request
 */
router.post('/register', bodyParser.json(), UserController.registerUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     description: This endpoint allows a user to login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *          description: User logged in successfully
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          status:
 *                              type: number
 *                          data:
 *                              type: object
 *                              properties:
 *                                  user:
 *                                      type: object
 *                                  token:
 *                                      type: string
 *       500:
 *         description: Unauthorized
 */
router.post('/login', bodyParser.json(), UserController.loginUser);

/**
 * @swagger
 * /user/signOut:
 *   get:
 *     summary: User sign out
 *     description: This endpoint signs out the user.
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.get('/signOut', UserController.signOut);

router.use(UserMiddleware.checkCustomToken);

/**
 * @swagger
 * /user/:
 *   get:
 *     summary: Get all users
 *     description: This endpoint retrieves all users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: User list
 *       500:
 *         description: Bad request
 *       401:
 *         description: Unauthorized user
 */
router.get('', UserController.getUsers);

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     description: This endpoint retrieves the profile of the logged-in user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Current user Profile
 *       500:
 *         description: Bad request
 *       401:
 *         description: Unauthorized user
 */
router.get('/profile', UserController.getProfile);

/**
 * @swagger
 * /user/editProfile:
 *   put:
 *     summary: Edit user profile
 *     description: This endpoint allows the user to edit their profile.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: 
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *               photo:
 *                 type: string
 *               name:
 *                 type: string
 *               bio:
 *                 type: string
 *               phone:
 *                 type: string
 *               isPrivate:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Profile Updated
 *       500:
 *         description: Bad request
 *       401:
 *         description: Unauthorized user
 */
router.put('/editProfile', bodyParser.json(), UserController.editProfile);

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     summary: Get user profile by ID
 *     description: This endpoint retrieves a user's profile by their ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to retrieve
 *     responses:
 *       201:
 *         description: User Details
 *       500:
 *         description: Bad request
 *       401:
 *         description: Unauthorized user
 */
router.get('/:userId', UserController.getUserProfile);

/**
 * @swagger
 * /user/toggleAdminStatus:
 *   put:
 *     summary: Toggle admin status
 *     description: This endpoint toggles the admin status of a user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               isAdmin:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Toggle Admin Status
 *       500:
 *         description: Bad request
 *       401:
 *         description: Unauthorized user
 */
router.put('/toggleAdminStatus', bodyParser.json(), UserController.toggleAdminStatus);

export default router