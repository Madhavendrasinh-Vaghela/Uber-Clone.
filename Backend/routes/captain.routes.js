const captainController = require('../controllers/captain.Controller');
const express = require('express');
const router =  express.Router();
const {body} = require("express-validator");
const authMiddleware  =  require('../middlewares/auth.middleware');

/**
 * @swagger
 * /captains/register:
 *   post:
 *     summary: Register a new captain
 *     tags: [Captains]
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
 *               - vehicle
 *             properties:
 *               fullname:
 *                 type: object
 *                 properties:
 *                   firstname:
 *                     type: string
 *                     minLength: 3
 *                   lastname:
 *                     type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               vehicle:
 *                 type: object
 *                 properties:
 *                   color:
 *                     type: string
 *                     minLength: 3
 *                   plate:
 *                     type: string
 *                     minLength: 3
 *                   capacity:
 *                     type: integer
 *                     minimum: 1
 *                   vehicleType:
 *                     type: string
 *                     enum: [car, motorcycle, auto]
 *     responses:
 *       201:
 *         description: Captain registered successfully
 *       400:
 *         description: Validation error
 */
router.post('/register', [
  body('email').isEmail().withMessage('Invalid Email'),
  body('fullname.firstname').isString().isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
  body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('vehicle.color').isString().isLength({ min: 3 }).withMessage('Color name must be at least 3 characters long'),
  body('vehicle.plate').isString().isLength({ min: 3 }).withMessage('Plate name must be at least 3 characters long'),
  body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be a number >= 1'),
  body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Invalid Type'),
], captainController.registerCaptain);


/**
 * @swagger
 * /captains/login:
 *   post:
 *     summary: Login a captain
 *     tags: [Captains]
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
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 character')
],
    captainController.loginCaptain
);

/**
 * @swagger
 * /captains/profile:
 *   get:
 *     summary: Get captain profile
 *     tags: [Captains]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Captain profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/profile',authMiddleware.authCaptain,captainController.getCaptainProfile)


/**
 * @swagger
 * /captains/logout:
 *   get:
 *     summary: Logout captain
 *     tags: [Captains]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.get('/logout',authMiddleware.authCaptain,captainController.logoutCaptain);




module.exports=router;