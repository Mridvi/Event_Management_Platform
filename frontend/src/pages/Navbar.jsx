import React from "react";
import { Link } from "react-router-dom";
import "../App.css"; 



const Navbar = () => {
  const isGuest = localStorage.getItem("guest") === "true"; //  Checking guest status

  return (
    <nav className="navbar">
      <div className="navbar-title">EventSphere</div>
      <div className="navbar-links">
        <Link to="/dashboard" >Find Events</Link>
        <Link to="/my-events" >My Events</Link>
        
        
        {!isGuest && <Link to="/create-event" >Create Event</Link>}
        {!isGuest ? (
          <button onClick={() => { localStorage.clear(); window.location.href = "/login"; }} style={{ marginLeft: "10px" }}>Logout</button>
        ) : (
          <Link to="/login" >Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
