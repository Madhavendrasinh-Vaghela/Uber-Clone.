import React, { useState } from "react";
import Driver2 from "../images/Driver-Uber2.jpeg";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const ConfirmRidePopUp = (props) => {

    const [Otp, setOtp] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const handleStartRide = async (e) => {
        e.preventDefault()
        
        if (!Otp || Otp.length !== 6) {
            setError("Please enter a valid 6-digit OTP");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
                {
                    rideId: props.ride._id,
                    otp: Otp
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // Success - navigate to captain-riding with ride data
            console.log("✅ Ride started successfully:", response.data);
            navigate('/captain-riding', { state: { ride: response.data } });

            
        } catch (err) {
            console.error("❌ Start ride error:", err);
            
            const errorMessage = err.response?.data?.message || err.message || "Failed to start ride";
            setError(errorMessage);
            
            // If ride was cancelled due to attempts, close the popup after showing error
            if (errorMessage.includes('cancelled') || errorMessage.includes('0 attempt')) {
                setTimeout(() => {
                    props.setConfirmRidePopUpPanel(false);
                    props.setRidePopUpPanel(false);
                }, 3000);
            }
        } finally {
            setLoading(false);
        }
    }
    
    if (!props.ride) return <div></div>;

    return (
        <div>
            <h5 className="p-1 text-center w-[93%] absolute top-0" onClick={() => {
                props.setRidePopUpPanel(false);
            }}><i className="text-3xl text-gray-500 ri-arrow-down-wide-line"></i></h5>
            <h3 className="text-2xl text-center font-semibold mb-5">Confirm This Ride to Start </h3>
            <div className="flex items-center justify-between mt-4 p-3 bg-gray-600  rounded-lg">
                <div className="flex items-center gap-3  ">
                    <img className="h-12 w-12 rounded-full object-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpjSo86kTIojXHeKt9NzD8g&s" alt="" />
                    <h2 className="text=lg font-medium">{props.ride.user.fullname.firstname}</h2>
                </div>
                <h5 className="text-lg font-semibold">{ Math.ceil(props.ride.distance / 1000) } KM</h5>
            </div>
            <div className="flex justify-between gap-2 flex-col items-center">
                {/* <img className="h-30" src={CarLogo} alt="Not found" /> */}
                <div className="w-full mt-5">
                    <div className="flex items-center gap-5 p-3 border-b-2">
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className="text-lg font-medium">Pickup</h3>
                            <p className="text-sm -mt-1 text-gray-600">{props.ride.pickup}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 p-3 border-b-2">
                        <i className="text-lg ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className="text-lg font-medium">Destination</h3>
                            <p className="text-sm -mt-1 text-gray-600">{props.ride.destination}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-5 p-3 ">
                        <i className="text-lg ri-currency-line"></i>
                        <div>
                            <h3 className="text-lg font-medium">₹{props.ride.fare}</h3>
                            <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 w-full">
                    <form onSubmit={handleStartRide}>
                        <input 
                            value={Otp} 
                            onChange={(e) => {
                                setOtp(e.target.value);
                                setError(""); // Clear error on input change
                            }}
                            type="number" 
                            className={`bg-[#eee] px-6 py-4 font-mono text-base rounded-lg w-full mt-5 ${error ? 'border-2 border-red-500' : ''}`}
                            placeholder="Enter OTP" 
                            maxLength="6"
                            disabled={loading}
                        />
                        
                        {error && (
                            <div className="mt-2 p-3 bg-red-100 border border-red-400 rounded-lg">
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        )}
                        
                        <button 
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-5 text-lg flex justify-center font-semibold text-black p-3 rounded-lg ${
                                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        >
                            {loading ? 'Verifying...' : 'Accept'}
                        </button>
                        
                        <button 
                            type="button"
                            onClick={() => {
                                props.setConfirmRidePopUpPanel(false)
                                props.setRidePopUpPanel(false)
                            }}
                            disabled={loading}
                            className="w-full mt-1 bg-red-400 text-lg font-semibold text-black p-3 rounded-lg disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ConfirmRidePopUp; 