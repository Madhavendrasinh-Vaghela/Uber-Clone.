import React, { useContext , useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";
import UberLogo from "../images/uber-driver-logo.svg";

const CapatinLogin = () => {

     const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");

        const {Captain, setCaptain}= useContext(CaptainDataContext);
        const navigate = useNavigate();

        // Clear session on component mount (force logout)
        React.useEffect(() => {
            localStorage.removeItem('token');
            setCaptain(null);
        }, []);
    
        const sumbitHandler = async (e) => {
            e.preventDefault();
            const captain={
                email: email,
             password
            }

        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain);
        
        if(res.status === 200) {
            const data = res.data;
            setCaptain(data.captain);
            localStorage.setItem("token", data.token);
            navigate('/captain-home');
        }
    
            setEmail("");
            setPassword("");
    
        }
    return (
       <div className="p-7 h-screen flex flex-col  justify-between">
       <div>
         <img className="w-25 mb-10" src={UberLogo} alt="Uber-logo" />

            <form action="" onSubmit={(e)=>{
                sumbitHandler(e);
            }}>
            <h3 className="text-lg font-medium mb-2">What's your email</h3>

            <input 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            placeholder="example@gmail.com" 
            />

            <h3 className="text-lg font-medium mb-2">Enter Password</h3>
            <input 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base"
            type="password" 
            placeholder="password" 
            />

            <button
            className="bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2  w-full text-lg placeholder:text-base">
                Login</button>

            </form>
            <p className="text-center">New Captain? <Link to='/captain-signup' className='text-blue-400'>Register as a Captain</Link></p>
       </div>
       <div>
        <Link to="/login" className="bg-[#0c44059d] flex items-center justify-center text-white font-semibold mb-5 rounded px-4 py-2  w-full text-lg placeholder:text-base">
            Sign in as user</Link>
       </div>
        </div>
    );
}
export default CapatinLogin;