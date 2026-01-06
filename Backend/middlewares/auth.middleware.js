const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');

module.exports.authUser = async (req, res, next) => {
    try {
        let token = null;

        // Safely get token from cookie
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        // Or from Authorization header
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // If token is still not found
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Verify token
        const isblackListed = await blacklistTokenModel.findOne({token: token});

        if(isblackListed){
            return res.status(401).json({message: 'Unauthorized: No token provided'});
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);


        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user;
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
};


module.exports.authCaptain = async(req,res,next)=>{
      try {
        let token = null;

        // Safely get token from cookie
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        // Or from Authorization header
        else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // If token is still not found
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Verify token
        const isblackListed = await blacklistTokenModel.findOne({token: token});

        if(isblackListed){
            return res.status(401).json({message: 'Unauthorized: No token provided'});
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id);


        if (!captain) {
            return res.status(401).json({ message: "Unauthorized: Captain not found" });
        }

        req.captain = captain;
        return next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
}