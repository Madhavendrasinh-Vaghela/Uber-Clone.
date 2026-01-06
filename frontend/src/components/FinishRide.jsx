import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { SocketContext } from "../context/SocketContext";

const FinishRide = (props) => {
    const [loading, setLoading] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const { socket } = useContext(SocketContext);
    const navigate = useNavigate();
    const { ride } = props;

    const handleCompleteRide = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
                { rideId: ride._id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("✅ Ride completed successfully:", response.data);
            navigate('/captain-home');
        } catch (error) {
            console.error("❌ Error completing ride:", error);
            alert(error.response?.data?.message || "Failed to complete ride");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (socket) {
             socket.on('payment-received', (data) => {
                 console.log("💰 Payment received:", data);
                 if (data.rideId === props.ride._id) {
                     setIsPaid(true);
                 }
             });
        }
        return () => {
            if (socket) {
                socket.off('payment-received');
            }
        }
    }, [socket, props.ride]);

    if (!ride) return <div></div>;

    return (
        <div className="h-screen">
            <h5 className="p-1 text-center w-[93%] absolute top-0" onClick={() => {
                props.setFinishRidePanel(false);
            }}><i className="text-3xl text-gray-500 ri-arrow-down-wide-line"></i></h5>
            <h3 className="text-2xl text-center font-semibold mb-5">Finish this Ride</h3>
            
            {/* User Info */}
            <div className="flex items-center w-full justify-between p-3 border-2 border-gray-300 rounded-lg mb-4">
                <div className="flex items-center gap-3">
                    <img 
                        className="h-12 w-12 rounded-full object-cover" 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpjSo86kTIojXHeKt9NzD8g&s" 
                        alt="User" 
                    />
                    <h2 className="text-lg font-medium">
                        {ride.user?.fullname?.firstname || 'User'} {ride.user?.fullname?.lastname || ''}
                    </h2>
                </div>
                <h5 className="text-lg font-semibold">
                    {(ride.distance / 1000).toFixed(1)} KM
                </h5>
            </div>

            {/* Ride Details */}
            <div className="flex justify-between gap-2 flex-col items-center">
                <div className="w-full mt-5">
                    {/* Pickup Location */}
                    <div className="flex items-center gap-5 p-3 border-b-2">
                        <i className="text-lg ri-map-pin-2-fill text-green-600"></i>
                        <div>
                            <h3 className="text-lg font-medium">Pickup</h3>
                            <p className="text-sm -mt-1 text-gray-600">{ride.pickup}</p>
                        </div>
                    </div>

                    {/* Fare */}
                    <div className="flex items-center gap-5 p-3 border-b-2">
                        <i className="text-lg ri-currency-line text-yellow-600"></i>
                        <div>
                            <h3 className="text-lg font-medium">₹{ride.fare}</h3>
                            <div className="flex items-center gap-2">
                                <p className="text-sm -mt-1 text-gray-600">Cash Payment</p>
                                {isPaid && (
                                     <i className="text-xl text-green-500 ri-checkbox-circle-fill"></i>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Destination */}
                    <div className="flex items-center gap-5 p-3">
                        <i className="text-lg ri-map-pin-user-fill text-red-600"></i>
                        <div>
                            <h3 className="text-lg font-medium">Destination</h3>
                            <p className="text-sm -mt-1 text-gray-600">{ride.destination}</p>
                        </div>
                    </div>
                </div>

                {/* Complete Ride Button */}
                <div className="mt-6 w-full">
                    <button 
                        onClick={handleCompleteRide}
                        disabled={loading || !isPaid}
                        className={`w-full mt-5 flex text-lg justify-center font-semibold text-white p-3 rounded-lg ${
                            (loading || !isPaid) ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {loading ? 'Completing...' : isPaid ? 'Complete Ride' : 'Waiting for Payment...'}
                    </button>
                    <p className="text-gray-600 text-center mt-4 text-xs">
                        {isPaid ? 'Payment Received. You can now complete the ride.' : 'Wait for payment to enable completion.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FinishRide;