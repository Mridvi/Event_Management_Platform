import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <h1>Welcome to EventSphere – Your Ultimate Event Hub!</h1>
      <h3>Discover. Connect. Experience.</h3>



      <h3>🚀 Get Started Now!</h3>
      <div className="button-container">
        <button onClick={() => navigate("/register")}>Register Now</button>
        <button onClick={() => navigate("/login")}>Login</button>
    </div>

    </div>
  );
};

export default LandingPage;
