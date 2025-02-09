import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import eventImage from "../assets/event-image.jpg";

const EventDetails = () => {
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const isGuest = localStorage.getItem("guest") === "true";
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const storedEvent = localStorage.getItem("selectedEvent");
    if (storedEvent) {
      setEvent(JSON.parse(storedEvent));
    } else {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/events/register`, {
        eventId: event._id,
        user: userDetails,
      });

      // Redirect to Ticket Page with ticket data
      navigate("/ticket", { state: { ticket: res.data.ticket } });
    } catch (err) {
      console.error("Error registering for event:", err);
    }
  };

  if (!event) return <p>Loading event details...</p>;

  return (
    <div className="event-details-wrapper">
      <div className="event-details-container">
        <h1>{event.name}</h1>
        <div className="event-info">
          <h2>Event On {event.dateTime ? new Date(event.dateTime).toLocaleDateString() : "No date provided"}</h2>
          <h2><strong>Timings:</strong> {event.dateTime ? new Date(event.dateTime).toLocaleTimeString() + " onwards" : "No time provided"}</h2>
          <p><strong>Venue:</strong> {event.venue || "No venue provided"}</p>
          <p><strong>Category:</strong> {event.category || "No category"}</p>
          <p><strong>Organiser:</strong> {event.host?.name || "Unknown Host"}</p>
          <p><strong>Contact:</strong> {event.host?.email || "No email"}</p>
          <p><strong>Attendees:</strong> {event.attendees?.length || 0}</p>
          <p><strong>Description:</strong> {event.description || "No description"}</p>
        </div>

        {isGuest ? (
          <p style={{ color: "red", textAlign: "center" }}>⚠️ Guest users cannot register for events. Please login.</p>
        ) : showForm ? (
          <form onSubmit={handleRegister}>
            <h3>Enter Your Details</h3>
            <input type="text" placeholder="Your Name" value={userDetails.name} onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })} required />
            <input type="email" placeholder="Your Email" value={userDetails.email} onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })} required />
            <input type="tel" placeholder="Your Phone Number" value={userDetails.phone} onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })} required />
            <button type="submit">Submit & Register</button>
          </form>
        ) : (
          <button onClick={() => setShowForm(true)}>Register for Event</button>
        )}
      </div>

      <div className="event-image-container">
        <img src={eventImage} alt="Event" className="event-image" />
      </div>
    </div>
  );
};

export default EventDetails;
