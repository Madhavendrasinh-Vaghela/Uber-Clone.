const express = require('express');
const router = express.Router();
const {body} = require("express-validator");
const userController = require('../controllers/user.Controller')
const authMiddleware = require('../middlewares/auth.middleware')

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullname
 *               - email
 *               - password
 *             properties:
 *               fullname:
 *                 type: object
 *                 properties:
 *                   firstname:
 *                     type: string
 *                     minLength: 3
 *                   lastname:
 *                     type: string
 *                     minLength: 3
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
router.post('/register',[
    body('fullname.firstname')
    .isLength({min:3})
    .withMessage('First name must be at least 3 charater long'),

    body('fullname.lastname')
    .isLength({min:3})
    .withMessage('First name must be at least 3 charater long'),
    
    body('email')
    .isEmail()
    .withMessage('Invalid Email'),


    body('password')
    .isLength({min:6})
    .withMessage('Password must be at least 6 characters long')
    
],
userController.registerUser
);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login',[
    body('email')
    .isEmail()
    .withMessage('Invalid Email'),

    body('password')
    .isLength({min:6})
    .withMessage('Password must be at least 6 characters long')
],
userController.loginUser
);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/profile',authMiddleware.authUser,userController.getUserProfile);

/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.get('/logout',authMiddleware.authUser,userController.logoutUser)

module.exports = router;