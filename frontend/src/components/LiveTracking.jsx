import React, { useState, useEffect, useRef } from 'react';
import Map, { Marker, Source, Layer, GeolocateControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const containerStyle = {
    width: '100%',
    height: '100%'
};

const LiveTracking = ({ ride }) => { // Accept ride prop
    const [viewState, setViewState] = useState({
        longitude: -122.4,
        latitude: 37.8,
        zoom: 15
    });
    
    const [currentLocation, setCurrentLocation] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);
    const [routeGeometry, setRouteGeometry] = useState(null);

    // Get current location
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    longitude: position.coords.longitude,
                    latitude: position.coords.latitude,
                };
                setCurrentLocation(coords);

                // If no ride active, center on user
                if (!ride) {
                    setViewState(prev => ({
                        ...prev,
                        ...coords
                    }));
                }
            },
            (error) => console.log(error), 
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setCurrentLocation({
                    longitude: position.coords.longitude,
                    latitude: position.coords.latitude,
                });
            },
            (error) => console.log(error),
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [ride]);

    // Handle Ride Data (Destination & Route)
    useEffect(() => {
        if (!ride?.destination) {
             setDestinationCoords(null);
             setRouteGeometry(null);
             return;
        }

        const getDestinationCoords = async () => {
            try {
                const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(ride.destination)}.json?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}&country=IN&types=poi,address,place,locality&limit=1`
                );
                const data = await response.json();
                
                if (data.features?.length > 0) {
                    const coords = data.features[0].geometry.coordinates;
                    setDestinationCoords({ longitude: coords[0], latitude: coords[1] });
                }
            } catch (error) {
                console.error('Error getting destination coordinates:', error);
            }
        };

        getDestinationCoords();
    }, [ride]);

    // Fetch Route
    useEffect(() => {
        if (!currentLocation || !destinationCoords) return;

        const fetchRoute = async () => {
             try {
                const response = await fetch(
                    `https://api.mapbox.com/directions/v5/mapbox/driving/${currentLocation.longitude},${currentLocation.latitude};${destinationCoords.longitude},${destinationCoords.latitude}?geometries=geojson&access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`
                );
                const data = await response.json();
                if (data.routes?.length > 0) {
                     setRouteGeometry(data.routes[0].geometry);
                }
             } catch (error) {
                 console.error('Error fetching route:', error);
             }
        };
        
        fetchRoute();
        const interval = setInterval(fetchRoute, 10000);
        return () => clearInterval(interval);
    }, [currentLocation, destinationCoords]);


    const routeLayer = {
        id: 'route',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#3b82f6', 'line-width': 5, 'line-opacity': 0.75 }
    };

    return (
        <div style={containerStyle}>
             <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
                mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
            >
                <GeolocateControl position="top-left" />
                {currentLocation && (
                     <Marker longitude={currentLocation.longitude} latitude={currentLocation.latitude} anchor="bottom">
                     </Marker>
                )}

                {destinationCoords && (
                    <Marker longitude={destinationCoords.longitude} latitude={destinationCoords.latitude} anchor="bottom">
                         <div className="bg-red-500 text-white p-2 rounded-full shadow-lg">
                            <i className="ri-map-pin-fill text-xl"></i>
                        </div>
                    </Marker>
                )}

                {routeGeometry && (
                    <Source id="route" type="geojson" data={routeGeometry}>
                        <Layer {...routeLayer} />
                    </Source>
                )}
            </Map>
        </div>
    );
};

export default LiveTracking;
