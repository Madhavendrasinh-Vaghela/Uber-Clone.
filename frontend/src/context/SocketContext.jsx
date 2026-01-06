import React, { createContext, useEffect } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const socket = io(import.meta.env.VITE_BASE_URL); // Connect to the server

const SocketProvider = ({ children }) => {
  useEffect(() => {
    console.log("🔌 SocketProvider initialized");
    console.log("🌐 Connecting to:", import.meta.env.VITE_BASE_URL);
    
    socket.on("connect", () => {
      console.log("✅ Connected to server");
      console.log("🆔 Socket ID:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from server");
    });
    
    socket.on("connect_error", (error) => {
      console.error("❌ Connection error:", error);
    });
    
    // Listen for ALL events (debugging helper)
    socket.onAny((eventName, ...args) => {
      console.log("📨 Socket event received:", eventName, args);
    });

    return () => {
        console.log("🧹 SocketProvider cleanup");
        socket.offAny();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
