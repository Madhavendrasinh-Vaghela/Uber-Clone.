import React, { useState, useRef, useEffect, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import Map, { Marker, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import UberLogo from "../images/uber-Logo-wine-black.png";
import FinishRide from "../components/FinishRide";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainRiding = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { captain } = useContext(CaptainDataContext);
    
    // Get ride data from navigation state or localStorage
    const [ride, setRide] = useState(location.state?.ride || null);
    const [FinishRidePanel, setFinishRidePanel] = useState(false);
    
    // Map state
    const [viewState, setViewState] = useState({
        longitude: 72.58957,
        latitude: 23.024553,
        zoom: 14
    });
    
    const [currentLocation, setCurrentLocation] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);
    const [routeGeometry, setRouteGeometry] = useState(null);
    const [distanceToDestination, setDistanceToDestination] = useState(null);
    const [durationToDestination, setDurationToDestination] = useState(null);

    const FinishRidePanelRef = useRef(null);

    // Get current location and watch for updates
    useEffect(() => {
        const getCurrentPosition = () => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const coords = {
                        lng: position.coords.longitude,
                        lat: position.coords.latitude
                    };
                    setCurrentLocation(coords);
                    setViewState(prev => ({
                        ...prev,
                        longitude: coords.lng,
                        latitude: coords.lat
                    }));
                },
                (error) => {
                    console.error('Geolocation error:', error.message);
                    // Use default location if geolocation fails
                    setCurrentLocation({
                        lng: 72.58957,
                        lat: 23.024553
                    });
                },
                {
                    enableHighAccuracy: true,
                    timeout: 30000, // Increased to 30 seconds
                    maximumAge: 0
                }
            );
        };

        getCurrentPosition();

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const coords = {
                    lng: position.coords.longitude,
                    lat: position.coords.latitude
                };
                setCurrentLocation(coords);
            },
            (error) => {
                // Silent error logging for watch position to prevent console spam
                if (error.code !== 3) { // Don't log timeout errors
                    console.error('Geolocation watch error:', error.message);
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 30000, // Increased to 30 seconds
                maximumAge: 0
            }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    // Get destination coordinates from address using Mapbox Geocoding API
    useEffect(() => {
        if (!ride?.destination) return;

        const getDestinationCoords = async () => {
            try {
                const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(ride.destination)}.json?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}&country=IN&types=poi,address,place,locality&limit=1`
                );
                const data = await response.json();
                
                if (data.features && data.features.length > 0) {
                    const coords = data.features[0].geometry.coordinates;
                    setDestinationCoords({
                        lng: coords[0],
                        lat: coords[1]
                    });
                }
            } catch (error) {
                console.error('Error getting destination coordinates:', error);
            }
        };

        getDestinationCoords();
    }, [ride?.destination]);

    // Fetch route when both locations are available
    useEffect(() => {
        if (!currentLocation || !destinationCoords) return;

        const fetchRoute = async () => {
            try {
                // Fetch route geometry and details from Mapbox Directions API
                const response = await fetch(
                    `https://api.mapbox.com/directions/v5/mapbox/driving/${currentLocation.lng},${currentLocation.lat};${destinationCoords.lng},${destinationCoords.lat}?geometries=geojson&access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`
                );
                const data = await response.json();
                
                if (data.routes && data.routes.length > 0) {
                    const route = data.routes[0];
                    setRouteGeometry(route.geometry);
                    
                    // Set distance and duration
                    setDistanceToDestination({
                        text: `${(route.distance / 1000).toFixed(1)} km`,
                        value: route.distance
                    });
                    setDurationToDestination({
                        text: `${Math.ceil(route.duration / 60)} mins`,
                        value: route.duration
                    });
                }
            } catch (error) {
                console.error('Error fetching route:', error);
            }
        };

        fetchRoute();
        
        // Update route every 10 seconds
        const interval = setInterval(fetchRoute, 10000);
        return () => clearInterval(interval);
    }, [currentLocation, destinationCoords]);

    // GSAP animation for finish ride panel
    useGSAP(function () {
        if (FinishRidePanel) {
            gsap.to(FinishRidePanelRef.current, {
                transform: 'translateY(0)'
            });
        } else {
            gsap.to(FinishRidePanelRef.current, {
                transform: 'translateY(100%)'
            });
        }
    }, [FinishRidePanel]);

    // Redirect if no ride data
    if (!ride) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">No active ride</h2>
                    <Link to="/captain-home" className="text-blue-600 underline">
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    const routeLayer = {
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': '#3b82f6',
            'line-width': 5,
            'line-opacity': 0.75
        }
    };

    return (
        <div className="h-screen relative">
            {/* Header */}
            <div className="fixed p-4 top-0 flex items-center justify-between w-full z-10 bg-white shadow-md">
                <img className="w-16" src={UberLogo} alt="Uber-logo" />
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Riding to</p>
                        <p className="text-xs font-medium truncate max-w-[150px]">
                            {ride.destination?.substring(0, 30)}...
                        </p>
                    </div>
                    <Link 
                        to='/captain-home' 
                        className="h-10 w-10 bg-red-100 flex items-center justify-center rounded-full"
                    >
                        <i className="text-lg font-medium ri-logout-circle-line text-red-600"></i>
                    </Link>
                </div>
            </div>

            {/* Map */}
            <div className="h-4/5 pt-20">
                <Map
                    {...viewState}
                    onMove={evt => setViewState(evt.viewState)}
                    mapStyle="mapbox://styles/mapbox/navigation-night-v1"
                    mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
                    style={{ width: '100%', height: '100%' }}
                >
                    {/* Captain's current location marker */}
                    {currentLocation && (
                        <Marker 
                            longitude={currentLocation.lng} 
                            latitude={currentLocation.lat} 
                            anchor="bottom"
                        >
                            <div className="relative">
                                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                                <div className="absolute top-0 left-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                            </div>
                        </Marker>
                    )}

                    {/* Destination marker */}
                    {destinationCoords && (
                        <Marker 
                            longitude={destinationCoords.lng} 
                            latitude={destinationCoords.lat} 
                            anchor="bottom"
                        >
                            <div className="bg-red-500 text-white p-2 rounded-full shadow-lg">
                                <i className="ri-map-pin-fill text-xl"></i>
                            </div>
                        </Marker>
                    )}

                    {/* Route line */}
                    {routeGeometry && (
                        <Source id="route" type="geojson" data={routeGeometry}>
                            <Layer {...routeLayer} />
                        </Source>
                    )}
                </Map>
            </div>

            {/* Bottom info panel */}
            <div 
                className="h-1/5 p-6 flex items-center justify-between relative bg-white shadow-lg"
                onClick={() => setFinishRidePanel(true)}
            >
                <h5 
                    className="p-1 text-center w-[90%] absolute top-0 cursor-pointer"
                >
                    <i className="text-3xl text-gray-500 ri-arrow-up-wide-line"></i>
                </h5>
                
                <div>
                    <h4 className="text-xl font-semibold">
                        {distanceToDestination 
                            ? `${(distanceToDestination.value / 1000).toFixed(1)} km away`
                            : 'Calculating...'}
                    </h4>
                    {durationToDestination && (
                        <p className="text-sm text-gray-600">
                            ETA: {Math.ceil(durationToDestination.value / 60)} mins
                        </p>
                    )}
                </div>
                
                <button className="bg-green-500 hover:bg-green-600 font-semibold text-white p-3 px-8 rounded-lg">
                    Complete Ride
                </button>
            </div>

            {/* Finish Ride Panel */}
            <div 
                ref={FinishRidePanelRef} 
                className="fixed w-full z-10 bottom-0 h-4/5 translate-y-full bg-white px-3 py-6 pt-12"
            >
                <FinishRide 
                    setFinishRidePanel={setFinishRidePanel} 
                    ride={ride}
                />
            </div>
        </div>
    );
};

export default CaptainRiding;