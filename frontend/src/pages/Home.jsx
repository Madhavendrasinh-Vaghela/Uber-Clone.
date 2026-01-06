import React, { useRef, useState, useCallback, useEffect, useContext } from "react"; // Added useContext
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import axios from "axios";
import { SocketContext } from "../context/SocketContext"; // Added import
import { UserDataContext } from "../context/UserContext"; // Added import
import UberLogo from "../images/uber-Logo-wine-black.png";

import 'remixicon/fonts/remixicon.css'
import VehiclePanel from "../components/VehiclePanel";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from '../components/WaitingForDriver';
import RidePayment from '../components/RidePayment';

import ConfirmedVehicle from "../components/ConfirmedVehicle";
import LocationSeearchPanel from "../components/LocationSerachPanel";
import LiveTracking from '../components/LiveTracking';
const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [PanelOpen, setPanelOpen] = useState(false);

  const { socket } = useContext(SocketContext); // Access socket
  const { user } = useContext(UserDataContext); // Access user

  useEffect(() => {
    if (user && user._id) {
        console.log("👤 User logged in, joining socket room");
        console.log("User ID:", user._id);
        console.log("Socket ID:", socket.id);
        
        socket.emit("join", { userType: "user", userId: user._id });
        console.log("📤 Emitted 'join' event to update user socketId in database");
        
        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        socket.emit('update-location-user', {
                            userId: user._id,
                            location: {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            }
                        });
                        console.log("📍 Location updated for user:", user._id);
                    },
                    error => console.error('Geolocation error:', error),
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
    }
  }, [user]);

  useEffect(() => {
    console.log("📍 Home component mounted");
    console.log("🔌 Socket object:", socket);
    console.log("🔗 Socket connected?", socket.connected);
    console.log("🆔 Current socket ID:", socket.id);
    console.log("⚙️ Setting up socket listeners");
    
    const handleRideConfirmed = (ride) => {
       console.log("🎉 Ride confirmed event received:", ride);
       console.log("👨‍✈️ Captain details:", ride.captain);
       console.log("🔐 OTP:", ride.otp);
       alert("Ride Confirmed! Driver found.");
       setVehicleFound(false);
       setWaitingForDriver(true);
       setRide(ride); 
       setVechilePanelOpen(false);
       setconfirmRidePanel(false);
       setPanelOpen(false);
       setShowPaymentPanel(false);
    };
    
    // const handleRideStarted = (ride) => {
    //    console.log("🚗 Ride started event received:", ride);
    //    console.log("💳 Showing payment panel");
    //    // Close all other panels first
    //    setVehicleFound(false);
    //    setWaitingForDriver(false);
    //    setVechilePanelOpen(false);
    //    setconfirmRidePanel(false);
    //    setPanelOpen(false);
    //    // Show payment panel
    //    setShowPaymentPanel(false);
    //    setRide(ride);
    // };
    
    socket.on('ride-confirmed', handleRideConfirmed);
    socket.on('ride-started', (ride) => {
        setVehicleFound(false);
        setWaitingForDriver(false);
        setVechilePanelOpen(false);
        setconfirmRidePanel(false);
        setPanelOpen(false);
        setShowPaymentPanel(true); 
        setRide(ride);
        setRideStarted(true);
    });
    
    socket.on('ride-ended', () => {
        setWaitingForDriver(false);
        setShowPaymentPanel(false); // Do not show panel again
        setRide(null); // Clear ride
        setRideStarted(false); // Reset to home
    });

    console.log("✅ Listeners registered for socket events");
    
    // Cleanup function to remove the listeners when component unmounts
    return () => {
      console.log("🧹 Cleaning up socket listeners");
      socket.off('ride-confirmed', handleRideConfirmed);
      socket.off('ride-started');
      socket.off('ride-ended');
    };
  }, [socket]);
  const [VehiclePanelOpen, setVechilePanelOpen]= useState(false);
  const [confirmRidePanel , setconfirmRidePanel] = useState(false);
  const [VehicleFound, setVehicleFound] = useState(false);
  const [ waitingForDriver, setWaitingForDriver ] = useState(false);
  const [ showPaymentPanel, setShowPaymentPanel ] = useState(false);
  const [ rideStarted, setRideStarted ] = useState(false);
  const [ride, setRide] = useState(null); // Add ride state
  const [suggestions, setSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);

  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null); 
  const VehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const paymentPanelRef = useRef(null);

  // Debounced API call for location suggestions
  const fetchSuggestions = useCallback(async (input) => {
    if (input.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error.response?.data || error.message);
      setSuggestions([]);
    }
  }, []);

  // Debounce effect for pickup and destination changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeField === 'pickup') {
        fetchSuggestions(pickup);
      } else if (activeField === 'destination') {
        fetchSuggestions(destination);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [pickup, destination, activeField, fetchSuggestions]);

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    if (activeField === 'pickup') {
      setPickup(suggestion.name);
    } else if (activeField === 'destination') {
      setDestination(suggestion.name);
    }
    setSuggestions([]);
    setActiveField(null);
  };

  const getFare = async () => {
    if (!pickup || !destination) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
        params: { pickup, destination },
        headers: {
            Authorization: `Bearer ${token}`
        }
      });
      setFare(response.data);
      setVechilePanelOpen(true);
      setPanelOpen(false);
    } catch (error) {
      console.error('Error fetching fare:', error);
    }
  };

  const createRide = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
        pickup,
        destination,
        vehicleType
      }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data);
      setVehicleFound(true);
      setconfirmRidePanel(false);
      
    } catch (error) {
      console.error('Error creating ride:', error);
    }
  };

  const SubmitHandler = (e) => {
    e.preventDefault();
  };

  useGSAP(function () {
    if(PanelOpen){
    gsap.to(panelRef.current, {
      height:'70%',
      padding: 24,
      opacity: 1,
    })
    gsap.to(panelCloseRef.current,{
      opacity: 1,
    })
  }
  else{
    gsap.to(panelRef.current, {
      height: '0%',
      padding:0,
      opacity:0
    })
    gsap.to(panelCloseRef.current,{
      opacity: 0,
    })
  }
  },[PanelOpen]);

  useGSAP(function(){
    if(VehiclePanelOpen){
      gsap.to(vehiclePanelRef.current,{
      transform:'translateY(0%)'
    })
    }
    else{
      gsap.to(vehiclePanelRef.current,{
      transform:'translateY(100%)'
    })
    }
  },[VehiclePanelOpen])

  useGSAP(function(){
    if(confirmRidePanel){
      gsap.to(confirmRidePanelRef.current,{
      transform:'translateY(0%)'
    })
    }
    else{
      gsap.to(confirmRidePanelRef.current,{
      transform:'translateY(100%)'
    })
    }
  },[confirmRidePanel])
  
  useGSAP(function(){
    if(VehicleFound){
      gsap.to(VehicleFoundRef.current,{
      transform:'translateY(0%)'
    })
    }
    else{
      gsap.to(VehicleFoundRef.current,{
      transform:'translateY(100%)'
    })
    }
  },[VehicleFound])
  
  useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ waitingForDriver ])
  
  useGSAP(function () {
        if (showPaymentPanel) {
            gsap.to(paymentPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(paymentPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ showPaymentPanel ])

  return (
    <div className="h-screen relative overflow-hidden">
      <img className="w-16 absolute left-5 top-5" src={UberLogo} alt="Uber-logo" />
      <div className="h-screen w-screen">
        <LiveTracking ride={ride} />
      </div>
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full pointer-events-none">
        {!rideStarted && (
            <div className="h-auto p-6 bg-white relative pointer-events-auto">
            <h5 ref={panelCloseRef} onClick={()=>{
            setPanelOpen(false);
            }} className="absolute opacity-0 top-6 right-6 text-2xl"> 
            <i className="ri-arrow-down-wide-line"></i>
            </h5>
            <h4 className="text-2xl font-semibold">Find a trip</h4>
            <form action="" onSubmit={
                (e) => {
                    SubmitHandler(e);
                }
            }>
                <div className="flex gap-5 justify-center flex-col overflow-hidden relative">
                <div className="line absolute h-16 w-1 top-[50%] -translate-y-[50%] left-5 bg-gray-700 rounded-full"></div>
                <div className="flex items-center gap-4">
                    <div className="h-3 w-3 rounded-full bg-gray-700"></div>
                    <input 
                        onClick={() => {
                        setPanelOpen(true);
                        setActiveField('pickup');
                        }}
                        value={ pickup }
                        onChange={(e) => setPickup(e.target.value)}
                        className="bg-[#eee] px-8 py-2 text-base rounded-lg w-full" 
                        type="text" 
                        placeholder="Add a pick-up location" />
                </div>
                <div className="flex items-center gap-4">
                    <div className="h-3 w-3 rounded-full bg-black"></div>
                    <input 
                    onClick={() => {
                        setPanelOpen(true);
                        setActiveField('destination');
                    }}
                    value={ destination }
                    onChange={(e) => setDestination(e.target.value)}
                    className="bg-[#eee] px-8 py-2 text-base rounded-lg w-full" 
                    type="text" 
                    placeholder="Enter your destination" />
                </div>
                </div>
            </form>
            </div>
        )}
        <div ref={panelRef} className="h-0 bg-white pointer-events-auto overflow-auto">
          <LocationSeearchPanel 
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
            setVechilePanel={setVechilePanelOpen}
            setPanelOpen={setPanelOpen}
            onFindTrip={getFare}
          />
        </div>
      </div>

<div ref={vehiclePanelRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12">
    <VehiclePanel 
    setConfirmRidePanel={setconfirmRidePanel} setVechilePanelOpen={setVechilePanelOpen} fare={fare} setVehicleType={setVehicleType} />
</div>
      <div ref={confirmRidePanelRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12">
        <ConfirmedVehicle 
            setConfirmRidePanel={setconfirmRidePanel} 
            setVehicleFound={setVehicleFound} 
            fare={fare}
            vehicleType={vehicleType}
            pickup={pickup}
            destination={destination}
            createRide={createRide}
         />
      </div>
      <div ref={VehicleFoundRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12">
          <LookingForDriver 
            pickup={pickup}
            destination={destination}
            fare={fare}
            vehicleType={vehicleType}
            setVehicleFound={setVehicleFound} />
      </div>
      <div ref={waitingForDriverRef} className={`fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12 ${showPaymentPanel ? 'hidden' : ''}`}>
          <WaitingForDriver 
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver} 
                    ride={ride} />
      </div>
      <div ref={paymentPanelRef} className={`fixed w-full z-50 bottom-0 translate-y-full bg-white px-3 py-6 pt-12 ${!showPaymentPanel ? 'hidden' : ''}`}>
          <RidePayment 
                    setShowPaymentPanel={setShowPaymentPanel}
                    setRideStarted={setRideStarted}
                    setRide={setRide}
                    ride={ride} />
      </div>
    </div> 
  );
}

export default Home;
