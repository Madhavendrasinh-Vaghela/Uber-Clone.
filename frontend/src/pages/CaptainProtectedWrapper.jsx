import React, { useContext, useState, useEffect } from "react";
import { CaptainDataContext } from "../context/CaptainContext";
import { SocketContext } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { captain, setCaptain } = useContext(CaptainDataContext);
  const { socket } = useContext(SocketContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (captain) {
        socket.emit("join", { userId: captain._id, userType: "captain" });
    }
  }, [captain, socket]);

  useEffect(() => {
    if (!token) {
      navigate("/captain-login");
      return;
    }

    const fetchCaptain = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          const data = res.data;
          setCaptain({ ...data.captain, ...data.stats });
          setIsLoading(false);
        }
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/captain-login");
      }
    };

    fetchCaptain();
  }, [token, navigate, setCaptain]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default CaptainProtectedWrapper;
 