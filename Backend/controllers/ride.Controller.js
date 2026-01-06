// controllers/ride.Controller.js
const rideService = require('../Services/ride.service');
const { validationResult } = require('express-validator');

const mapService = require('../Services/map.service');
const { sendMessageToSocketId } = require('../socket');
const rideModel = require('../models/ride.model');

module.exports.createRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const authedUserId = req.user?.id || req.user?._id;
  if (!authedUserId) {
    return res.status(401).json({ error: 'Unauthorized: user missing from request context' });
  }

  const { pickup, destination, vehicleType } = req.body;

  try {
    const ride = await rideService.createRide({
      user: authedUserId,
      pickup,
      destination,
      vehicleType
    });

    const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

    res.status(201).json(rideWithUser);

    const pickupCoordinates = await mapService.getAddressCoordinate(pickup);

    const captainsInRadius = await mapService.getCaptainInTheRadius(pickupCoordinates.lat, pickupCoordinates.lng, 100.0);

    console.log("Pickup Coordinates:", pickupCoordinates);
    console.log("Captains found in radius:", captainsInRadius.length);
    console.log("Captains details:", captainsInRadius);

    rideWithUser.otp = ""

    captainsInRadius.map(captain => {

      sendMessageToSocketId(captain.socketID, {
        event: 'new-ride',
        data: rideWithUser
      })

    })

  } catch (err) {
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};

module.exports.getFare = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { pickup, destination } = req.query;

  if (!pickup || !destination) {
    return res.status(400).json({ error: 'Pickup and destination are required' });
  }

  try {
    const fareData = await rideService.getFare(pickup, destination);
    return res.status(200).json(fareData);
  } catch (err) {
    console.error('getFare error:', err.message);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};


module.exports.confirmRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.confirmRide({ rideId, captain: req.captain });

    console.log("✅ Ride confirmed successfully!");
    console.log("📦 Ride ID:", ride._id);
    console.log("👤 User:", ride.user?._id);
    console.log("🔌 User Socket ID:", ride.user?.socketId);
    console.log("🚗 Captain:", ride.captain?.fullname);
    console.log("🔐 OTP:", ride.otp);
    
    if (!ride.user) {
        console.error("❌ CRITICAL: User object is missing from ride!");
        return res.status(500).json({ error: 'User data missing from ride' });
    }
    
    if (!ride.user.socketId) {
        console.error("❌ CRITICAL: User has no socket ID! Socket event will fail.");
        console.error("User needs to refresh their page to reconnect socket.");
    } else {
        console.log("📤 Emitting 'ride-confirmed' event to socket:", ride.user.socketId);
    }

    sendMessageToSocketId(ride.user.socketId, {
      event: 'ride-confirmed',
      data: ride
    });

    return res.status(200).json(ride);
  } catch (err) {
    console.error('❌ confirmRide error:', err.message);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};

module.exports.startRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId, otp } = req.body;

  try {
    const ride = await rideService.startRide({ rideId, otp, captain: req.captain });
    
    console.log("✅ Ride started successfully!");
    console.log("📦 Ride ID:", ride._id);
    console.log("👤 User Socket ID:", ride.user?.socketId);
    
    // Emit 'ride-started' event to user for payment popup
    if (ride.user?.socketId) {
      console.log("📤 Emitting 'ride-started' event to user:", ride.user.socketId);
      sendMessageToSocketId(ride.user.socketId, {
        event: 'ride-started',
        data: ride
      });
    } else {
      console.error("⚠️ WARNING: User has no socket ID, cannot notify user");
    }
    
    return res.status(200).json(ride);
  } catch (err) {
    console.error('❌ startRide error:', err.message);
    return res.status(400).json({ message: err.message });
  }
};


module.exports.endRide = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { rideId } = req.body;

  try {
    const ride = await rideService.endRide({ rideId, captain: req.captain });
    
    console.log("✅ Ride ended successfully!");
    console.log("📦 Ride ID:", ride._id);
    console.log("👤 User Socket ID:", ride.user?.socketId);
    
    // Emit 'ride-ended' event to user for payment popup
    if (ride.user?.socketId) {
      console.log("📤 Emitting 'ride-ended' event to user:", ride.user.socketId);
      sendMessageToSocketId(ride.user.socketId, {
        event: 'ride-ended',
        data: ride
      });
    } else {
      console.error("⚠️ WARNING: User has no socket ID, cannot notify user");
    }
    
    return res.status(200).json(ride);
  } catch (err) {
    console.error('❌ endRide error:', err.message);
    return res.status(400).json({ message: err.message });
  }
};

module.exports.makePayment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId } = req.body;

    try {
        const ride = await rideModel.findOne({ _id: rideId }).populate('captain'); // Check if ride exists

        if (!ride) {
             return res.status(404).json({ message: 'Ride not found' });
        }
        
        // Ensure captain is populated
         if (!ride.captain) {
            console.error("❌ CRITICAL: Captain missing in ride object for payment");
             return res.status(500).json({ message: 'Captain info missing' });
        }


        console.log("💰 Payment logic started for Ride ID:", rideId);
        console.log("👨‍✈️ Captain Socket ID:", ride.captain.socketID);

        // Emit 'payment-received' event to captain
        if (ride.captain.socketID) {
            console.log("📤 Emitting 'payment-received' to captain:", ride.captain.socketID);
            sendMessageToSocketId(ride.captain.socketID, {
                event: 'payment-received',
                data: {
                    rideId: ride._id,
                    amount: ride.fare,
                    status: 'completed'
                }
            });
        } else {
             console.error("⚠️ WARNING: Captain has no socket ID, cannot notify captain");
        }

        return res.status(200).json({ message: 'Payment successful', ride });

    } catch (err) {
        console.error('❌ makePayment error:', err.message);
        return res.status(500).json({ message: err.message || 'Internal Server Error' });
    }
}
