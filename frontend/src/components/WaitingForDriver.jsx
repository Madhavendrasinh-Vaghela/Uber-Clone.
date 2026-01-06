import React from 'react'
import CarLogo from "../images/UberBlack-booking.webp"; 

const WaitingForDriver = (props) => {
  if (!props.ride) return <div></div>;

  return (
    <div>
      <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
        props.setWaitingForDriver(false)
      }}><i className="text-3xl text-gray-500 ri-arrow-down-wide-line"></i></h5>

      <h3 className='text-2xl text-center font-semibold mb-5'>Your Ride is Confirmed!</h3>

      {/* Driver Details Card */}
      <div className='flex items-center justify-between mt-4 p-3 bg-gray-600 rounded-lg'>
        <div className='flex items-center gap-3'>
          <img 
            className='h-12 w-12 rounded-full object-cover' 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpjSo86kTIojXHeKt9NzD8g&s" 
            alt="Driver" 
          />
          <div>
            <h2 className='text-lg font-medium capitalize'>{props.ride.captain.fullname.firstname} {props.ride.captain.fullname.lastname}</h2>
            <p className='text-sm text-gray-300'>{props.ride.captain.vehicle.plate}</p>
            <p className='text-sm text-gray-300 capitalize'>{props.ride.captain.vehicle.color} {props.ride.captain.vehicle.vehicleType}</p>
          </div>
        </div>
        <img className='h-16' src={CarLogo} alt="Car" />
      </div>

      {/* OTP Display */}
      <div className='mt-6 bg-[#eee] rounded-lg p-4'>
        <div className='text-center'>
          <p className='text-sm font-medium text-gray-700 mb-2'>Share this OTP with your driver</p>
          <h1 className='text-5xl font-bold tracking-widest text-black font-mono'>{props.ride.otp}</h1>
          <p className='text-xs text-gray-600 mt-2'>Do not share this OTP with anyone else</p>
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
          <div className='flex items-center gap-5 p-3'>
            <i className="text-lg ri-currency-line"></i>
            <div>
              <h3 className='text-lg font-medium'>₹{props.ride.fare}</h3>
              <p className='text-sm -mt-1 text-gray-600'>Cash Payment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaitingForDriver