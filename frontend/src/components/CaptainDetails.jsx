import React, { useContext } from "react";
import { CaptainDataContext } from "../context/CaptainContext";
import Driver from "../images/Driver-Uber.jpeg";

const CaptainDetails = () => {
  const { captain } = useContext(CaptainDataContext);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-start gap-3">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={Driver}
            alt=""
          />
          <h4 className="text-lg font-medium">
            {captain.fullname.firstname + " " + captain.fullname.lastname}
          </h4>
        </div>
        <div>
          <h4 className="text-xl font-semibold">₹{captain.earned || 0}</h4>
          <p className="text-sm bg-gray-200 rounded p-1 text-center">Earned</p>
        </div>
      </div>
      <div className="flex p-3 mt-6 bg-gray-100 rounded-xl justify-center gap-5 items-start">
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
          <h5 className="text-lg font-medium">
            {captain.onlineHours ? captain.onlineHours.toFixed(1) : 0}
          </h5>
          <p className="text-sm text-gray-600">Hours Online</p>
        </div>
        <div className="text-center">
          <i className="text-3xl mb-2 font-thin ri-speed-up-fill"></i>
          <h5 className="text-lg font-medium">
            {captain.totalDistance ? captain.totalDistance.toFixed(1) : 0}
          </h5>
          <p className="text-sm text-gray-600">Total KM</p>
        </div>
        <div className="text-center">
          <i className=" text-3xl mb-2 font-thin ri-booklet-line"></i>
          <h5 className="text-lg font-medium">{captain.totalRides || 0}</h5>
          <p className="text-sm text-gray-600">Total Jobs</p>
        </div>
      </div>
    </div>
  );
};

export default CaptainDetails