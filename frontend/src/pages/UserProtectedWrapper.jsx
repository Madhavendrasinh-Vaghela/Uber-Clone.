import  React, { useContext, useState,useEffect, use } from "react";
import { UserDataContext } from "../context/UserContext";
import { SocketContext } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const UserProtectedWrapper = ({children}) => {

    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const { user,setUser } = useContext(UserDataContext);
    const { socket } = useContext(SocketContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            socket.emit("join", { userId: user._id, userType: "user" });
        }
    }, [user, socket]);
    

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            if (res.status === 200) {
                setUser(res.data.user);
                setIsLoading(false);
            }
        }).catch((err) => {
            console.log(err);
            localStorage.removeItem("token");
            navigate('/login');
        });
    }, [token]);

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <>
        {children}
        </>
    )
}
export default UserProtectedWrapper;