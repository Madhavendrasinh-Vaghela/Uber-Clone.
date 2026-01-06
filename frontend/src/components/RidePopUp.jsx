import React from "react";
import Driver2 from "../images/Driver-Uber2.jpeg";


const RidePopUp = (props) =>{
    if (!props.ride) return <div></div>;

    return(
        <div>
             <h5 className="p-1 text-center w-[93%] absolute top-0" onClick={()=>{
                      props.setRidePopUpPanel(false);
                    }}><i className="text-3xl text-gray-500 ri-arrow-down-wide-line"></i></h5>
                            <h3 className="text-2xl text-center font-semibold mb-5">New Ride Available! </h3>
                            <div className="flex items-center justify-between mt-4 p-3 bg-gray-600  rounded-lg">
                                <div className="flex items-center gap-3  ">
                                    <img className="h-12 w-12 rounded-full object-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpjSo86kTIojXHeKt9NzD8g&s" alt="" />
                                    <h2 className="text=lg font-medium">{props.ride.user.fullname.firstname + " " + props.ride.user.fullname.lastname}</h2>
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
                         <div className="flex mt-5 w-full items-center justify-between">

                            <button onClick={()=>{
                         props.setRidePopUpPanel(false)
                         }} className=" mt-1 bg-red-400 font-semibold text-black p-3 px-8 rounded-lg">Ignore</button>
                         
                            <button onClick={()=>{ 
                          props.setConfirmRidePopUpPanel(true);
                          props.confirmRide();
                         }} className="  bg-gray-300 font-semibold text-black p-3 px-8 rounded-lg">Confirm</button>
                         
                         </div>
                     </div>
        </div>
    )
}
export default RidePopUp
//6:31:42