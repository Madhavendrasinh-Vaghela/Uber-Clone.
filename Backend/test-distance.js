// Quick test script to verify the distance calculation
const axios = require('axios');

async function testDistance() {
  try {
    const response = await axios.get('http://localhost:8080/maps/get-distance-time', {
      params: {
        origin: 'Ahmedabad',
        destination: 'Bhavnagar'
      }
    });
    
    console.log('\n=== Distance Test Results ===');
    console.log('Origin: Ahmedabad');
    console.log('Destination: Bhavnagar');
    console.log('Distance:', response.data.distance.text);
    console.log('Duration:', response.data.duration.text);
    console.log('Status:', response.data.status);
    console.log('\nExpected: ~200-250 km, ~3-4 hours');
    console.log('===========================\n');
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testDistance();
