import { Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Dashboard from "./pages/Dashboard";
import EventDetails from "./pages/EventDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateEvent from "./pages/CreateEvent";
import FindEvents from "./pages/FindEvents";
import MyEvents from "./pages/MyEvents";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import EditEvent from "./pages/EditEvent";
import TicketPage from "./pages/TicketPage";



function App() {
  return (
    <>
      
      <Navbar />

      
      <div className="app-container">
        <Routes>
          
          <Route path="/" element={<LandingPage />} /> 
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/event-details" element={<EventDetails />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/find-events" element={<FindEvents />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/edit-event/:id" element={<EditEvent />} />
          <Route path="/ticket" element={<TicketPage />} /> 
        </Routes>
      </div>
    </>
  );
}

export default App;
