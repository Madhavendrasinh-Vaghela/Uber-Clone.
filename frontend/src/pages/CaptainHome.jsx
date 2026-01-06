import React,{useRef, useState, useContext, useEffect} from "react"; // Added useContext, useEffect
import axios from 'axios';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SocketContext } from "../context/SocketContext"; // Added import
import { CaptainDataContext } from "../context/CaptainContext"; // Added import

import UberLogo from "../images/uber-Logo-wine-black.png";
import Driver from "../images/Driver-Uber.jpeg";
import CaptainDetails from "../components/CaptainDetails";


import {Link} from "react-router-dom"
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import LiveTracking from '../components/LiveTracking';

const CaptainHome = (props) => {

    const [RidePopUpPanel , setRidePopUpPanel] = useState(false);
    const [ConfirmRidePopUpPanel , setConfirmRidePopUpPanel] = useState(false);
    const [ride, setRide] = useState(null);

    const { socket } = useContext(SocketContext);
    const { captain } = useContext(CaptainDataContext);

    useEffect(() => {
        socket.on('new-ride', (data) => {
            console.log(data);
            setConfirmRidePopUpPanel(false);
            setRidePopUpPanel(true);
            setRide(data);
        });
    }, [socket]); // Added useEffect for socket listener

    useEffect(() => {
        if (!captain || !captain._id) return;

        socket.emit("join", {
            userId: captain._id,
            userType: "captain"
        });
        
        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        socket.emit('update-location-captain', {
                            userId: captain._id,
                            location: {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            }
                        });
                    },
                    error => console.log(''), // console.error(error),
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );
            }
        };

        const locationInterval = setInterval(updateLocation, 10000);
        updateLocation();

        // return () => clearInterval(locationInterval); 
    }, [captain, socket]); // Added socket to dependencies

    // Removed the standalone socket.on block

    async function confirmRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {

            rideId: ride._id,
            captainId: captain._id,

        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        setRidePopUpPanel(false);
        setConfirmRidePopUpPanel(true);
    }

    const RidePopUpPanelRef = useRef(null);
    const ConfirmRidePopUpPanelRef = useRef(null);


    useGSAP(function () {
        if (RidePopUpPanel) {
            gsap.to(RidePopUpPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(RidePopUpPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ RidePopUpPanel ])
    
    useGSAP(function () {
        if (ConfirmRidePopUpPanel) {
            gsap.to(ConfirmRidePopUpPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(ConfirmRidePopUpPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ ConfirmRidePopUpPanel ])

    return(
        <div className="h-screen">
            <div className="fixed p-4 top-0 flex items-center justify-between w-full">  
            <img className="w-16" src={UberLogo} alt="Uber-logo" />
            
            <Link to='/captain-home' className="right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full">
                <i className="text-lg font-medium ri-logout-circle-line"></i>
            </Link>
            </div>
            <div className="h-3/5">
                    <LiveTracking />
            </div>
            <div className="h-2/5 p-4">
            <CaptainDetails />
            </div>
            <div ref={RidePopUpPanelRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12">
          <RidePopUp setRidePopUpPanel={setRidePopUpPanel}  setConfirmRidePopUpPanel={setConfirmRidePopUpPanel} ride={ride} confirmRide={confirmRide} />
      </div>
            <div ref={ConfirmRidePopUpPanelRef} className="fixed w-full z-10 bottom-0 h-screen translate-y-full bg-white px-3 py-6 pt-12">
          <ConfirmRidePopUp setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}  setRidePopUpPanel={setRidePopUpPanel} ride={ride} />
      </div>
        </div>
    )
}

export default CaptainHome;