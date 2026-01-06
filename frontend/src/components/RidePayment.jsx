import axios from "axios";
import React, { useState } from 'react'

const RidePayment = (props) => {
  if (!props.ride || props.ride.status === 'completed') return <div></div>;

  const handlePayment = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/payment`, {
            rideId: props.ride._id
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("Payment response:", response.data);
         props.setShowPaymentPanel(false);
         props.setRideStarted(false);
         props.setRide(null);
         // Optionally show success message or navigate home
    } catch (error) {
        console.error("Payment error:", error);
    }
  }

  return (
    <div>
      <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
        props.setShowPaymentPanel(false)
      }}><i className="text-3xl text-gray-500 ri-arrow-down-wide-line"></i></h5>

      <h3 className='text-2xl text-center font-semibold mb-5'>Payment</h3>

      {/* Captain Details */}
      <div className='flex items-center justify-between mt-4 p-3 bg-gray-600 rounded-lg'>
        <div className='flex items-center gap-3'>
          <img 
            className='h-12 w-12 rounded-full object-cover' 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpjSo86kTIojXHeKt9NzD8g&s" 
            alt="Captain" 
          />
          <div>
            <h2 className='text-lg font-medium capitalize text-white'>{props.ride.captain.fullname.firstname} {props.ride.captain.fullname.lastname}</h2>
            <p className='text-sm text-gray-300'>{props.ride.captain.vehicle.plate}</p>
          </div>
        </div>
      </div>

      {/* Ride Details */}
      <div className='flex gap-2 justify-between flex-col items-center'>
        <div className='w-full mt-5'>
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>Pickup</h3>
              <p className='text-sm -mt-1 text-gray-600'>{props.ride.pickup}</p>
            </div>
          </div>
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="text-lg ri-map-pin-user-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>Destination</h3>
              <p className='text-sm -mt-1 text-gray-600'>{props.ride.destination}</p>
            </div>
          </div>
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="text-lg ri-timer-line"></i>
            <div>
              <h3 className='text-lg font-medium'>Distance</h3>
              <p className='text-sm -mt-1 text-gray-600'>{Math.ceil(props.ride.distance / 1000)} KM</p>
            </div>
          </div>
          <div className='flex items-center gap-5 p-3 bg-gray-100 rounded-lg'>
            <i className="text-lg ri-currency-line"></i>
            <div className='flex-1'>
              <h3 className='text-lg font-medium'>Total Fare</h3>
              <p className='text-sm -mt-1 text-gray-600'>Cash Payment</p>
            </div>
            <h2 className='text-2xl font-bold'>₹{props.ride.fare}</h2>
          </div>
        </div>

        {/* Payment Button */}
        <button 
          onClick={handlePayment}
          className='w-full mt-6 bg-black text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors'
        >
          Make Payment
        </button>
      </div>
    </div>
  )
}

export default RidePayment
