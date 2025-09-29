
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuth } from "./contexts/AuthContext";
import "./App.css";


const App: React.FC = () => {
  const {isLoggedIn} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn]);

  return (
    <>
      <div className="max-h-screen">
        <Navbar />
        <Outlet />
      </div>
    </>
  )
}

export default App
