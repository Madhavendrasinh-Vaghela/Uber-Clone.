import React from "react";
import UberMap from "../images/uber-home.gif";
import CarLogo from "../images/UberBlack-booking.webp"; 
import {Link} from "react-router-dom"




const Riding = (props)=>{
    return(
        

        <div className="h-screen">
            <Link to='/home' className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full">
                <i className="text-lg font-medium ri-home-fill"></i>
            </Link>
            <div className="h-1/2">
                    <img className="h-full w-full object-cover" src={UberMap} alt="" />
            </div>
            <div className="h-1/2 p-4">
             <div className='flex items-center justify-between'>
        <img className='h-20' src={CarLogo} alt="" />
        <div className='text-right'>
          <h2 className='text-lg font-medium capitalize'>Sarthak</h2>
          <h4 className='text-xl font-semibold -mt-1 -mb-1'>GJ 04 0738</h4>
          <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
          <h1 className='text-lg font-semibold'>  {props.ride?.otp} </h1>
        </div>
      </div>

      <div className='flex gap-2 justify-between flex-col items-center'>
        <div className='w-full mt-5'>
          
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>562/11-A</h3>
              <p className='text-sm -mt-1 text-gray-600'> tilaknagar bhopal</p>
            </div>
          </div>
          <div className='flex items-center gap-5 p-3'>
            <i className="ri-currency-line"></i>
            <div>
              <h3 className='text-lg font-medium'>₹193.20 </h3>
              <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
            </div>
          </div>
        </div>
      </div>
            <button  className="w-full mt-5 bg-gray-200 font-semibold text-black p-2 rounded-lg">Make a Payment</button>
            </div>
        </div>
    )
}

export default Riding;  