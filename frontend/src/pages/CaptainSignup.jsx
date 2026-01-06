import React, { use, useState } from "react";
import { Link } from "react-router-dom";
import { CaptainDataContext } from "../context/CaptainContext";
import UberLogo from "../images/uber-driver-logo.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const CaptainSignup = () => {

    const navigate = useNavigate();

        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [firstName, setFirstName] = useState("");
        const [lastName, setLastName] = useState("");
        const [vehicleColor, setVehicleColor] = useState("");
        const [vehiclePlate, setVehiclePlate] = useState("");
        const [vehicleCapacity, setVehicleCapacity] = useState("");
        const [vehicleType, setVehicleType] = useState("");

        const {captain, setCaptain} = React.useContext(CaptainDataContext);

        const sumbitHandler = async (e) => {  
            e.preventDefault(); 
            const captainData = {
                fullname: {
                    firstname: firstName,
                    lastname: lastName
                },
                email: email,
                password: password,
                vehicle: {
                    color: vehicleColor,
                    plate: vehiclePlate,
                    capacity: vehicleCapacity,
                    vehicleType: vehicleType
                }
            };

            try {
                const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData);

                if(res.status === 201) {
                    const data = res.data;
                    setCaptain(data.captain);
                    localStorage.setItem("token", data.token);
                    navigate("/captain-home");
                }
            } catch (error) {
                console.error("Registration error:", error.response?.data || error.message);
                alert(error.response?.data?.message || "Registration failed. Please try again.");
            }

            setEmail("");
            setPassword("");
            setFirstName("");
            setLastName("");
            setVehicleColor("");
            setVehiclePlate("");
            setVehicleCapacity("");
            setVehicleType("");
            
        }
    return (
      <div className="p-7 h-screen flex flex-col  justify-between">
       <div>
         <img className="w-25 mb-10" src={UberLogo} alt="Uber-logo" />

            <form action="" onSubmit={(e)=>{
                sumbitHandler(e);
            }}>
            <h3 className="text-base font-medium mb-2">What's your name</h3>
            <div className="flex gap-4 mb-7">
           <input 
            required 
            className="bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-base placeholder:text-base"
            type="text"
            placeholder="First name" 
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            />
           <input 
            required 
            className="bg-[#eeeeee] rounded px-4 py-2 border w-1/2 text-base placeholder:text-sm"
            type="text"
            placeholder="Last name" 
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            />
            </div>

                
            <h3 className="text-base font-medium mb-2">What's your email</h3>
            <input 
            required 
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-base placeholder:text-sm"
            type="email"
            placeholder="example@gmail.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />

            <h3 className="text-base font-medium mb-2">Enter Password</h3>
            <input 
            required 
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-base placeholder:text-sm"
            type="password" 
            placeholder="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}   
            />

             <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
          <div className='flex gap-4 mb-7'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='Vehicle Color'
              value={vehicleColor}
              onChange={(e) => {
                setVehicleColor(e.target.value)
              }}
            />
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='Vehicle Plate'
              value={vehiclePlate}
              onChange={(e) => {
                setVehiclePlate(e.target.value)
              }}
            />
          </div>
          <div className='flex gap-4 mb-7'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="number"
              placeholder='Vehicle Capacity'
              value={vehicleCapacity}
              onChange={(e) => {
                setVehicleCapacity(e.target.value)
              }}
            />
            <select
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              value={vehicleType}
              onChange={(e) => {
                setVehicleType(e.target.value)
              }}
            >
              <option value="" disabled>Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="moto">Moto</option>
            </select>
          </div>

            <button
            className="bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2  w-full text-base placeholder:text-sm">
                Create Captain Account</button>

            </form>
            <p className="text-center">Already have a account?<Link to='/captain-login' className='text-blue-400'>Login here</Link></p>
       </div>
       <div>
            <p className="text-center text-sm text-gray-500">By clicking Sign up, you agree to Uber's <span className="text-blue-400">Terms of Use</span> and acknowledge that you have read the <span className="text-blue-400">Privacy Policy</span>.</p>
            <p className="text-center text-sm text-gray-500">This site is protected by reCAPTCHA and the Google <span className="text-blue-400">Privacy Policy</span> and <span className="text-blue-400">Terms of Service</span> apply.</p>
       </div>
        </div>
    );
}
export default CaptainSignup;



