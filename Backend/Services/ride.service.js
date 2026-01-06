const rideModel = require('../models/ride.model');
const mapService = require('./map.service');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

async function getFare(pickup, destination) {

    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    // Geocode pickup and destination to coordinates
    let pickupCoords, destinationCoords;

    // Check if pickup is already coordinates or needs geocoding
    if (typeof pickup === 'string') {
        pickupCoords = await mapService.getAddressCoordinate(pickup);
    } else {
        pickupCoords = pickup; // Already coordinates
    }

    // Check if destination is already coordinates or needs geocoding
    if (typeof destination === 'string') {
        destinationCoords = await mapService.getAddressCoordinate(destination);
    } else {
        destinationCoords = destination; // Already coordinates
    }

    const distanceTime = await mapService.getDistanceTime(pickupCoords, destinationCoords);

    // More realistic pricing for Indian market
    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20 
    };

    const perKmRate = {
        auto: 6,    // Reduced from 10
        car: 10,    // Reduced from 15
        moto: 5     // Reduced from 8
    };

    const perMinuteRate = {
        auto: 1,    // Reduced from 2
        car: 1.5,   // Reduced from 3
        moto: 0.75  // Reduced from 1.5
    };

    // Calculate distance in km and duration in minutes
    const distanceKm = distanceTime.distance.value / 1000;
    const durationMinutes = distanceTime.duration.value / 60;

    const fare = {
        auto: Math.round(baseFare.auto + (distanceKm * perKmRate.auto) + (durationMinutes * perMinuteRate.auto)),
        car: Math.round(baseFare.car + (distanceKm * perKmRate.car) + (durationMinutes * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + (distanceKm * perKmRate.moto) + (durationMinutes * perMinuteRate.moto))
    };

    return {
        fare,
        distance: distanceTime.distance.value, // in meters
        duration: distanceTime.duration.value  // in seconds
    };


}

module.exports.getFare = getFare;


function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num - 1), Math.pow(10, num)).toString();
        return otp;
    }
    return generateOtp(num);
}


module.exports.createRide = async ({
    user, pickup, destination, vehicleType
}) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    const fareData = await getFare(pickup, destination);



    const ride = rideModel.create({
        user,
        pickup,
        destination,
        otp: getOtp(6),
        fare: fareData.fare[vehicleType],
        distance: fareData.distance,
        duration: fareData.duration
    })

    return ride;
}

module.exports.confirmRide = async ({
    rideId, captain
}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captain._id
    })

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user', '+socketId').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }
    
    console.log("Ride confirmed - User socketId:", ride.user.socketId);

    return ride;

}

module.exports.startRide = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user', '+socketId').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.status === 'cancelled') {
        throw new Error('Ride has been cancelled');
    }

    if (ride.otp !== otp) {
        // Increment OTP attempts
        ride.otpAttempts = (ride.otpAttempts || 0) + 1;
        
        if (ride.otpAttempts >= 3) {
            // Auto-cancel ride after 3 failed attempts
            ride.status = 'cancelled';
            await ride.save();
            throw new Error('Ride cancelled due to multiple failed OTP attempts');
        }
        
        await ride.save();
        const attemptsRemaining = 3 - ride.otpAttempts;
        throw new Error(`Invalid OTP. ${attemptsRemaining} attempt${attemptsRemaining > 1 ? 's' : ''} remaining`);
    }

    // OTP is correct, start the ride
    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    })

    return ride;
}

module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user', '+socketId').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
}
