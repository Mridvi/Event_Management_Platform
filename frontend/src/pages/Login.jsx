import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/login-image.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
  
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("email", email); 
        localStorage.setItem("guest", "false"); // Ensuring not a guest
        navigate("/dashboard");
      } else {
        alert("Login failed: No token received");
      }
    } catch (err) {
      console.error("Login failed", err);
      alert("Invalid credentials, please try again.");
    }
  };
  



  

  // Guest Login
  const handleGuestLogin = () => {
    localStorage.setItem("guest", "true"); 
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      
      <div className="login-image">
        <img src={loginImage} alt="Login" />
      </div>

          
          <div className="login-form">
        <h2 className="login-heading">Login</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <div className="button-container">
            <button type="submit">Login</button>
            <button onClick={handleGuestLogin}>Continue as Guest</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
