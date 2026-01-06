const captainModel = require('../models/captain.model');
const captainService = require('../Services/captain.service');
const {validationResult} = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');
const rideModel = require('../models/ride.model');



module.exports.registerCaptain  = async (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const { fullname,email,password,vehicle}=req.body;

    const  isCaptainAlreadyExist = await captainModel.findOne({email});
        if(isCaptainAlreadyExist){
           return res.status(400).json({message:'Captain alreay exist'});
        }

    const hashPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname:fullname.firstname,
        lastname:fullname.lastname,
        email,
        password:hashPassword,
        color:vehicle.color,
        plate:vehicle.plate,
        capacity:vehicle.capacity,
        vehicleType:vehicle.vehicleType
    });

    const token = captain.generateAuthToken();
    return res.status(201).json({token,captain});
}

module.exports.loginCaptain = async(req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {email , password} = req.body;

    const captain = await captainModel.findOne({email}).select('+password');

    if(!captain){
        return res.status(401).json({message:'Invalid email and password'}); 
    }

    const isMatch = await captain.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({message: 'Invalid email or password'});
    }

    const token = captain.generateAuthToken();

    res.cookie('token',token);
    res.status(200).json({token,captain});
}

module.exports.getCaptainProfile = async(req,res,next)=>{

    const captain = req.captain;
    
    // Fetch completed rides for this captain
    const rides = await rideModel.find({ captain: captain._id, status: 'completed' });

    // Calculate aggregated stats
    const achievedRides = rides.length;
    const earned = rides.reduce((acc, ride) => acc + ride.fare, 0);
    const duration = rides.reduce((acc, ride) => acc + (ride.duration || 0), 0) / 60; // duration in minutes
      
    // I need to confirm if duration is stored in minutes or hours. 
    // Assuming minutes based on typical ride apps. 
    // Converting to hours for "Hours Online" display.
    // Wait, if I change logic here I should be careful. 
    // Let's just stick to raw summation or safe conversion.
    // If I look at the previous `ride.model.js`, duration is Number. 
    // Let's assume the previous code is safer as sum, but adding distance.
    
    // Reworking the whole block for clarity and adding distance
    const totalDistance = rides.reduce((acc, ride) => acc + (ride.distance || 0), 0);

    const stats = {
        earned,
        totalRides: achievedRides,
        onlineHours: duration,
        totalDistance       
    };

    res.status(200).json({ captain, stats }); // Sending as separate object or merged
}  
module.exports.logoutCaptain = async(req,res,next)=>{

     try {
        res.clearCookie('token');

        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(400).json({ message: 'Token not found for logout' });
        }

        await blacklistTokenModel.create({ token });

        return res.status(200).json({ message: 'Logged out' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}  

