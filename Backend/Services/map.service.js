const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
  const apiKey = process.env.MAPBOX_API_KEY;
  // Add country parameter to limit results to India
  // Include multiple types: poi (businesses), address, place (cities), locality
  // Add proximity bias to central India (Bhopal: 77.4126,23.2599) to prioritize nearby results
  // This helps when searching for common names like "New Market" or unknown POIs
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${apiKey}&country=IN&types=poi,address,place,locality&proximity=77.4126,23.2599&limit=3&fuzzyMatch=true`;

  try {
    const response = await axios.get(url);

    if (response.data && response.data.features.length > 0) {
      const location = response.data.features[0].geometry.coordinates;
      const placeName = response.data.features[0].place_name;
      


      return {
        lng: location[0],
        lat: location[1]
      };    
    } else {
      console.log(`⚠️  No geocoding results found for: "${address}"`);
      throw new Error('No coordinates found');
    }
  } catch (error) {
    console.error('Mapbox Geocoding API Error:', error.response?.data || error.message);
    throw error;
  }
};


module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error('Origin and destination are required');
  }

  const apiKey = process.env.MAPBOX_API_KEY;
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?access_token=${apiKey}`;



  try {
    const response = await axios.get(url);

    if (response.data && response.data.routes && response.data.routes.length > 0) {
      const route = response.data.routes[0];
      const totalSeconds = route.duration;
      const distanceMeters = route.distance;

      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);

      const durationText = `${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} min${minutes !== 1 ? 's' : ''}`;

      return {
        distance: {
          text: `${(distanceMeters / 1000).toFixed(1)} km`,
          value: distanceMeters
        },
        duration: {
          text: durationText,
          value: totalSeconds
        },
        status: 'OK'
      };
    } else {
      throw new Error('No route found');
    }
  } catch (error) {
    console.error('Mapbox Directions API Error:', error.response?.data || error.message);
    throw new Error('Failed to fetch distance/time');
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error('Query is required');
  }

  const apiKey = process.env.MAPBOX_API_KEY;
  // Add country parameter to prioritize results from India
  // Include poi, address, place, and locality types
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json?access_token=${apiKey}&country=IN&types=poi,address,place,locality&autocomplete=true&limit=5&fuzzyMatch=true`;

  try {
    const response = await axios.get(url);
    
    if (response.data && response.data.features.length > 0) {
      // Format suggestions cleanly
      return response.data.features.map(feature => ({
        name: feature.place_name,
        lng: feature.geometry.coordinates[0],
        lat: feature.geometry.coordinates[1]
      }));
    } else {
      throw new Error('No suggestions found');
    }

  } catch (error) {
    console.error('Mapbox Suggestion API Error:', error.response?.data || error.message);
    throw new Error('Unable to fetch suggestions');
  }
};

// function to calculate distance between two points in km
    const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);  // deg2rad below
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    }

    const deg2rad = (deg) => {
        return deg * (Math.PI / 180)
    }

module.exports.getCaptainInTheRadius = async (ltd, lng, radius) => {

    // radius in km
    const captains = await captainModel.find({
        status: 'active' // Only find active captains
    });

    console.log(`🔍 Total active captains in DB: ${captains.length}`);
    
    const captainsWithLocation = captains.filter(captain => {
        const hasLocation = captain.location && captain.location.lat && captain.location.lng;
        if (!hasLocation) {
            console.log(`⚠️  Captain ${captain._id} has no location set`);
        }
        return hasLocation;
    });
    
    console.log(`📍 Captains with valid location: ${captainsWithLocation.length}`);

    const captainsInRadius = captainsWithLocation.filter(captain => {
        const distance = getDistanceInKm(ltd, lng, captain.location.lat, captain.location.lng);
        console.log(`📏 Captain ${captain._id} is ${distance.toFixed(2)} km away (radius: ${radius} km)`);
        return distance <= radius;
    });
    
    console.log(`✅ Captains within radius: ${captainsInRadius.length}`);

    return captainsInRadius;
}
