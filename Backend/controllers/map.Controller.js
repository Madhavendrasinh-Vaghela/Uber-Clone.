const mapService= require('../Services/map.service')
const { validationResult } = require('express-validator');

module.exports.getCoordinates = async(req,res,next)=>{
     const error = validationResult(req); 
    if(!error.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const { address } = req.query;

        try{
            const coordinates = await mapService.getAddressCoordinate(address);
            res.status(200).json(coordinates);
        }catch(error){
            res.status(404).json({ message: 'Coordinates not found'});
        }
} 

module.exports.getDistanceTime = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const originInput = req.query.origin;
    const destinationInput = req.query.destination;

    // Check if input is in coordinate format (lat,lng) or name
    const parseCoordinates = (input) => {
      const parts = input.split(',').map(s => s.trim());
      return parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])
        ? { lat: parseFloat(parts[0]), lng: parseFloat(parts[1]) }
        : null;
    };

    let origin = parseCoordinates(originInput);
    let destination = parseCoordinates(destinationInput);

    // If origin or destination are names, convert to coordinates
    const geocodeIfNeeded = async (input, current) => {
      if (current) return current; // Already in lat/lng format
      const coords = await mapService.getAddressCoordinate(input);
      if (!coords) throw new Error(`Could not geocode input: ${input}`);
      return coords;
    };

    origin = await geocodeIfNeeded(originInput, origin);
    destination = await geocodeIfNeeded(destinationInput, destination);

    const distanceTime = await mapService.getDistanceTime(origin, destination);
    res.status(200).json(distanceTime);

  } catch (error) {
    console.error('getDistanceTime error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};



module.exports.getAutoCompleteSuggestions = async (req,res,next) =>{
  try {

    const errors = validationResult(req);
    if(!errors.isEmpty()){  
      return res.status(400).json({errors: errors.array()});
    }
    const { input } = req.query;
    const suggestions = await mapService.getAutoCompleteSuggestions(input);
    res.status(200).json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Internal server error'});
  }
}
 
