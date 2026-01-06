const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const rideController = require('../controllers/ride.Controller');
const authMiddleware = require('../middlewares/auth.middleware');


/**
 * @swagger
 * /rides/get-fare:
 *   get:
 *     summary: Calculate fare for a ride
 *     description: Returns fare estimates for all vehicle types (auto, car, moto) along with distance and duration
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: pickup
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 3
 *           example: "Ahmedabad"
 *         description: Pickup location address
 *       - in: query
 *         name: destination
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 3
 *           example: "Bhavnagar"
 *         description: Destination address
 *     responses:
 *       200:
 *         description: Fare calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fare:
 *                   type: object
 *                   properties:
 *                     auto:
 *                       type: number
 *                       example: 450
 *                     car:
 *                       type: number
 *                       example: 750
 *                     moto:
 *                       type: number
 *                       example: 350
 *                 distance:
 *                   type: number
 *                   example: 178104.203
 *                   description: Distance in meters
 *                 duration:
 *                   type: number
 *                   example: 12862.157
 *                   description: Duration in seconds
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 */
router.get('/get-fare',
    authMiddleware.authUser,
    query('pickup').isString().isLength({min: 3}).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({min: 3}).withMessage('Invalid destination address'),
    rideController.getFare
);

/**
 * @swagger
 * /rides/create:
 *   post:
 *     summary: Create a new ride request
 *     tags: [Rides]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickup
 *               - destination
 *               - vehicleType
 *             properties:
 *               pickup:
 *                 type: string
 *                 minLength: 3
 *                 example: "Ahmedabad"
 *                 description: Pickup location address
 *               destination:
 *                 type: string
 *                 minLength: 3
 *                 example: "Bhavnagar"
 *                 description: Destination address
 *               vehicleType:
 *                 type: string
 *                 enum: [auto, car, moto]
 *                 example: "car"
 *                 description: Type of vehicle requested (auto, car, or moto)
 *     responses:
 *       201:
 *         description: Ride created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post('/create',
    authMiddleware.authUser,
    body('pickup').isString().isLength({min: 3}).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({min: 3}).withMessage('Invalid pickup address'),
    body('vehicleType').isString().isIn(['auto','car','moto']).withMessage('Invalid vehicle type'),
    rideController.createRide
)

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.confirmRide
)

router.post('/start-ride',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    body('otp').isString().isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    rideController.startRide
)

router.post('/end-ride',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.endRide
)


router.post('/payment',
    authMiddleware.authUser,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.makePayment
)

module.exports = router;