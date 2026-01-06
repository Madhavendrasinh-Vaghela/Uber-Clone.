import React from "react";
import { Link } from "react-router-dom";
import UberLogo from "../images/uber-Logo-wine.png";
import BgTraffic from "../images/bg-traffic.jpeg";

const Start = () => {
  return (
    <div>
      <div
        className="h-screen pt-8 flex justify-between flex-col w-full bg-cover  bg-left"
        style={{ backgroundImage: `url(${BgTraffic})`,backgroundPosition: '20% top'}}
      >
        <img className="w-25 ml-8" src={UberLogo} alt="Uber-logo" />
        <div className="bg-white pb-7 py-4 px-4">
          <h2 className="text-3xl font-bold">Get started with Uber</h2>
          <Link to='/login'className="flex items-center justify-center w-full bg-black text-white py-3 px-4 rounded mt-5">
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Start;
