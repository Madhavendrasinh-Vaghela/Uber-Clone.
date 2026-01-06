const express = require('express');
const router = express.Router();
const authMiddleware  =  require('../middlewares/auth.middleware');
const mapController = require('../controllers/map.Controller');
const {query} = require('express-validator');

/**
 * @swagger
 * /maps/get-coordinates:
 *   get:
 *     summary: Get coordinates for an address
 *     description: Geocodes an address to latitude and longitude coordinates. Searches are limited to India (IN) for accurate results.
 *     tags: [Maps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 3
 *           example: "Ahmedabad"
 *         description: Address or city name to geocode (searches within India)
 *     responses:
 *       200:
 *         description: Coordinates retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 lat:
 *                   type: number
 *                   example: 23.0225
 *                 lng:
 *                   type: number
 *                   example: 72.5714
 *       400:
 *         description: Invalid address
 *       401:
 *         description: Unauthorized
 */
router.get('/get-coordinates',
    query('address').isString().isLength({min: 3}),
    authMiddleware.authUser,
     mapController.getCoordinates);


/**
 * @swagger
 * /maps/get-distance-time:
 *   get:
 *     summary: Get distance and time between two locations
 *     description: Calculates driving distance and duration between origin and destination. Supports both address names and coordinate pairs (lat,lng). Geocoding is limited to India for accuracy.
 *     tags: [Maps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: origin
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 3
 *           example: "Ahmedabad"
 *         description: Origin address or coordinates (lat,lng)
 *       - in: query
 *         name: destination
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 3
 *           example: "Bhavnagar"
 *         description: Destination address or coordinates (lat,lng)
 *     responses:
 *       200:
 *         description: Distance and time calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 distance:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                       example: "178.1 km"
 *                     value:
 *                       type: number
 *                       example: 178104.203
 *                       description: Distance in meters
 *                 duration:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                       example: "0 days, 3 hours, 34 mins"
 *                     value:
 *                       type: number
 *                       example: 12862.157
 *                       description: Duration in seconds
 *                 status:
 *                   type: string
 *                   example: "OK"
 *       400:
 *         description: Invalid parameters
 *       401:
 *         description: Unauthorized
 */
     router.get('/get-distance-time',
        query('origin').isString().isLength({min: 3}),
        query('destination').isString().isLength({min: 3}),
        authMiddleware.authUser,
     mapController.getDistanceTime
     );

/**
 * @swagger
 * /maps/get-suggestions:
 *   get:
 *     summary: Get autocomplete suggestions for location input
 *     description: Returns location autocomplete suggestions based on user input. Results are prioritized for India and limited to 5 suggestions.
 *     tags: [Maps]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: input
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 3
 *           example: "Ahm"
 *         description: Search text for autocomplete (minimum 3 characters)
 *     responses:
 *       200:
 *         description: Suggestions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Ahmedabad, Gujarat, India"
 *                   lat:
 *                     type: number
 *                     example: 23.0225
 *                   lng:
 *                     type: number
 *                     example: 72.5714
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
     router.get('/get-suggestions',
      query('input').isString().isLength({min: 3}),
      authMiddleware.authUser,
     mapController.getAutoCompleteSuggestions
     );


module.exports=router;