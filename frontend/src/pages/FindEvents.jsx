import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const FindEvents = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event) => {
    localStorage.setItem("selectedEvent", JSON.stringify(event));
    navigate("/event-details");
  };

  return (
    <div>
      <h2>Find Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <h3 style={{ cursor: "pointer", color: "blue" }} onClick={() => handleEventClick(event)}>
              {event.name}
            </h3>
            <p><strong>Host:</strong> {event.host?.name}</p>
            <p><strong>Venue:</strong> {event.venue}</p>
            <p><strong>Attendees:</strong> {event.attendees?.length || 0}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FindEvents;
