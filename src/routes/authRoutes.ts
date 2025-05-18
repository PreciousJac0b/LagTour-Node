import express from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration and login
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegister:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - firstname
 *         - lastname
 *         - role
 *       properties:
 *         username:
 *           type: string
 *           description: User's chosen username
 *           example: johndoe
 *         firstname:
 *           type: string
 *           description: User's first name
 *           example: john
 *         lastname:
 *           type: string
 *           description: User's last name
 *           example: Doe
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: john.doe@example.com
 *         profession:
 *           type: string
 *           description: User's Profession
 *           example: Quantity Surveyor
 *         role:
 *           type: string
 *           enum: [admin, student, lecturer, superadmin]
 *           description: User's role in the system
 *           example: student
 *         password:
 *           type: string
 *           format: password
 *           description: User's password (min 6 characters)
 *           example: password123
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: john.doe@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: User's password
 *           example: password123
 *     AuthResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *           example: 60d0fe4f5311236168a109ca
 *         username:
 *           type: string
 *           description: User's username
 *           example: johndoe
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: john.doe@example.com
 *         token:
 *           type: string
 *           description: JWT token for authentication
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     security: []
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid input data or user already exists
 *       500:
 *         description: Server error
 */
router.route("/register").post(registerUser)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and get token
 *     security: []
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid email or password
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.route("/login").post(loginUser)

export default router;