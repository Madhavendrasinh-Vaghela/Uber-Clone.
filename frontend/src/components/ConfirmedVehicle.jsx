import React from "react";
import CarLogo from "../images/UberBlack-booking.webp"; 
import BikeLogo from "../images/UberMoto.webp";
import AutoLogo from "../images/UberAuto.jpeg";

const ConfirmedVehicle = (props) => {
    return (
        <div>
            <h5 className="p-1 text-center w-[93%] absolute top-0" onClick={()=>{
          props.setConfirmRidePanel(false);
        }}><i className="text-3xl text-gray-500 ri-arrow-down-wide-line"></i></h5>
        <h3 className="text-2xl text-center font-semibold mb-5">Confirm your ride</h3>
         <div className="flex justify-between gap-2 flex-col items-center">
             <img className="h-30" src={
                props.vehicleType === 'car' ? CarLogo :
                props.vehicleType === 'moto' ? BikeLogo :
                AutoLogo
             } alt="Not found" />
             <div className="w-full mt-5">
                <div className="flex items-center gap-5 p-3 border-b-2">
                    <i className="text-lg ri-map-pin-2-fill"></i>
                    <div>
                        <h3 className="text-lg font-medium">Pickup</h3>
                        <p className="text-sm -mt-1 text-gray-600">{props.pickup}</p>
                    </div>
                </div>
                <div className="flex items-center gap-5 p-3 border-b-2">
                    <i className="text-lg ri-map-pin-user-fill"></i>
                    <div>
                        <h3 className="text-lg font-medium">Destination</h3>
                         <p className="text-sm -mt-1 text-gray-600">{props.destination}</p>
                    </div>
                </div>
                <div className="flex items-center gap-5 p-3 ">
                    <i className="text-lg ri-money-rupee-circle-line"></i>
                    <div>
                        <h3 className="text-lg font-medium">₹{props.fare.fare?.[props.vehicleType]}</h3>
                        <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
                    </div>
                </div>
             </div>
             <button onClick={()=>{
               props.setVehicleFound(true);
               props.setConfirmRidePanel(false);
                props.createRide();
              }} className="w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg">Confirm</button>
         </div>
        </div>
    )
}

export default ConfirmedVehicle;