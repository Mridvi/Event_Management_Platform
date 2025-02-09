import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events");
        const userEvents = res.data.filter(event => event.host.email === userEmail);
        setEvents(userEvents);
      } catch (err) {
        console.error("Failed to fetch your events:", err);
      }
    };

    fetchMyEvents();
  }, [userEmail]);

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEvents(events.filter(event => event._id !== eventId));
      alert("Event deleted successfully!");
    } catch (err) {
      console.error("Failed to delete event:", err);
      alert("Error deleting event.");
    }
  };

  const handleEdit = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

  return (
    <div className="my-events-container">
      <h2>My Events</h2>
      {events.length === 0 ? (
        <p>You have not created any events.</p>
      ) : (
        <div className="event-card-container">
          {events.map(event => (
            <div className="event-card" key={event._id}>
              <h3>{event.name}</h3>
              <p><strong>Venue:</strong> {event.venue}</p>
              <p><strong>Date:</strong> {new Date(event.dateTime).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {new Date(event.dateTime).toLocaleTimeString()} onwards</p>
              <p><strong>Host:</strong> {event.host.name} ({event.host.email})</p>
              
              <div className="button-container">
                <button className="edit-btn" onClick={() => handleEdit(event._id)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(event._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
