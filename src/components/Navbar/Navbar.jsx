import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ setSearchQuery, setIsConnected }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage and logout
    localStorage.removeItem("cin");
    localStorage.removeItem("password");
    setIsConnected(false);
    navigate("/"); // Redirect to login
  };

  return (
    <div className="Navbar">
      <input
        type="text"
        placeholder="Search notes..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Navbar;
