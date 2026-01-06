import React, { use, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import axios from "axios";
import  {UserDataContext}  from "../context/UserContext.jsx";
import UberLogo from "../images/uber-Logo-wine-black.png";
const UserSignup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [userData , setUserData] = useState({});

    const navigate = useNavigate();
    const {user , setUser} = React.useContext(UserDataContext);

    const sumbitHandler = async(e) => {  
        e.preventDefault(); 
        const newUser = {
            fullname: {
                firstname: firstName,
                lastname: lastName
            },
            email: email,
            password: password
        };

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);
        if(response.status===201){
            const data = response.data;
            setUser(data.user);
            localStorage.setItem("token", data.token);
            navigate("/home");
        }


        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");           
    }
    return (
        <div className="p-7 h-screen flex flex-col  justify-between">
       <div>
         <img className="w-25 mb-10" src={UberLogo} alt="Uber-logo" />

            <form action="" onSubmit={(e)=>{
                sumbitHandler(e);
                setUserData({
                    fullName: {
                    firstName: firstName,
                    lastName: lastName
                    },
                    email: email,
                    password: password
                });
                console.log(userData);
                setEmail("");
                setPassword("");
                setFirstName("");
                setLastName("");
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

            <button
            className="bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2  w-full text-base placeholder:text-sm">
                Create Account</button>

            </form>
            <p className="text-center">Already have a account?<Link to='/login' className='text-blue-400'>Login here</Link></p>
       </div>
       <div>
            <p className="text-center text-sm text-gray-500">By clicking Sign up, you agree to Uber's <span className="text-blue-400">Terms of Use</span> and acknowledge that you have read the <span className="text-blue-400">Privacy Policy</span>.</p>
            <p className="text-center text-sm text-gray-500">This site is protected by reCAPTCHA and the Google <span className="text-blue-400">Privacy Policy</span> and <span className="text-blue-400">Terms of Service</span> apply.</p>
       </div>
        </div>
    );
}
export default UserSignup;

//3:10:18