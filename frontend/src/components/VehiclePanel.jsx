import React from "react";
import CarLogo from "../images/UberBlack-booking.webp"; 
import BikeLogo from "../images/UberMoto.webp";
import AutoLogo from "../images/UberAuto.jpeg";

const VechilePanel = (props) => {
    return (
        <div>
            <h5 className="p-1 text-center w-[93%] absolute top-0" onClick={()=>{
          props.setVechilePanelOpen(false);
        }}><i className="text-3xl text-gray-500 ri-arrow-down-wide-line"></i></h5>
        <h3 className="text-2xl font-semibold mb-5">Choose a Vehicle</h3>
        <div onClick={()=>{
          props.setConfirmRidePanel(true);
          props.setVehicleType('car');
        }} className="flex border-2 active:border-black border-gray-300 bg-gray-100 mb-3 rounded-xl w-full p-3 items-center justify-between"> 
          <img className="h-15" src={CarLogo} alt="Not found" />
          <div className="ml-2 w-1/2 ">
            <h4 className="font-medium text-lg">UberGo <span><i className="ri-user-fill"></i>4</span></h4>
            <h5 className="font-medium text-xs">{Math.ceil(props.fare.duration / 60)} mins away</h5>
            <p className="font-normal text-gray-600">Affordable, compact rides</p>
          </div>
          <h2 className="text-lg font-semibold">₹{props.fare?.fare?.car}</h2>
        </div>
        <div onClick={()=>{
          props.setConfirmRidePanel(true);
          props.setVehicleType('moto');
        }} className="flex border-2 active:border-black border-gray-300  bg-gray-100  mb-2 rounded-xl w-full p-3 items-center justify-between"> 
          <img className="h-15" src={BikeLogo} alt="Not found" />
          <div className="ml-2 w-1/2 ">
            <h4 className="font-medium text-lg">Moto <span><i className="ri-user-fill"></i>1</span></h4>
            <h5 className="font-medium text-xs">{Math.ceil(props.fare.duration / 60)} mins away</h5>
            <p className="font-normal text-gray-600">Affordable, Bike rides</p>
          </div>
          <h2 className="text-xl lgnt-semibold">₹{props.fare?.fare?.moto}</h2>
        </div>
        <div onClick={()=>{
          props.setConfirmRidePanel(true);
          props.setVehicleType('auto');
        }} className="flex border-2 active:border-black border-gray-300  bg-gray-100  mb-2 rounded-xl w-full p-3 items-center justify-between"> 
          <img className="h-15" src={AutoLogo} alt="Not found" />
          <div className="ml-2 w-1/2 ">
            <h4 className="font-medium text-lg">UberAuto <span><i className="ri-user-fill"></i>3</span></h4>
            <h5 className="font-medium text-xs">{Math.ceil(props.fare.duration / 60)} mins away</h5>
            <p className="font-normal text-gray-600">Affordable, Auto rides</p>
          </div>
          <h2 className="text-xl lgnt-semibold">₹{props.fare?.fare?.auto}</h2>
        </div>
        </div>
    )
}

export default VechilePanel;