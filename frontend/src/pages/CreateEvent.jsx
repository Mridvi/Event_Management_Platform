import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const navigate = useNavigate();

  
  const [hostName, setHostName] = useState("");
  const [hostEmail, setHostEmail] = useState("");
  const [hostPhone, setHostPhone] = useState("");

  const [eventName, setEventName] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  
  const [dateTime, setDateTime] = useState("");
  const [category, setCategory] = useState("Conference"); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token || token === "false") {
      alert("You must be logged in to create an event!");
      return;
    }

    
    const formattedDateTime = new Date(dateTime).toISOString();

    try {
      console.log("Sending request:", {
        host: { name: hostName, email: hostEmail, phone: hostPhone },
        name: eventName,
        venue,
        description,
        
        dateTime: formattedDateTime,
        category, 
      });

      const response = await axios.post(
        "http://localhost:5000/api/events/create",
        {
          host: { name: hostName, email: hostEmail, phone: hostPhone },
          name: eventName,
          venue,
          description,
        
          dateTime: formattedDateTime,
          category, 
        },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      alert("Event created successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to create event:", err.response?.data || err.message);
      alert("Error: " + (err.response?.data?.error || "Something went wrong. Try again."));
    }
  };

  return (
    <div className="create-event">
      <h2>Host Event</h2>
      <form onSubmit={handleSubmit}>
        {/* Host Details */}
        <h3>Host Details</h3>
        <input type="text" placeholder="Host Name" value={hostName} onChange={(e) => setHostName(e.target.value)} required />
        <input type="email" placeholder="Host Email" value={hostEmail} onChange={(e) => setHostEmail(e.target.value)} required />
        <input type="tel" placeholder="Host Phone Number" value={hostPhone} onChange={(e) => setHostPhone(e.target.value)} required />

        {/* Event Details */}
        <h3>Event Details</h3>
        <input type="text" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} required />

        {/* Category Dropdown */}
        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="Conference">Conference</option>
          <option value="Workshop">Workshop</option>
          <option value="Meetup">Meetup</option>
          <option value="Networking">Networking</option>
        </select>

        <input type="text" placeholder="Venue" value={venue} onChange={(e) => setVenue(e.target.value)} required />
        <textarea placeholder="Short Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        
        <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} required />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateEvent;
