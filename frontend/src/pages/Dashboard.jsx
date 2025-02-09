import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import dashboardImage from "../assets/dashboard-banner.jpg"; 

const socket = io("https://event-management-platform-0r3f.onrender.com");

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const navigate = useNavigate();
  const isGuest = localStorage.getItem("guest") === "true";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("https://event-management-platform-0r3f.onrender.com/api/events");
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch events:", err.response?.data || err.message);
      }
    };

    fetchEvents();

    socket.on("updateAttendees", ({ eventId, attendees }) => {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId ? { ...event, attendees } : event
        )
      );
    });

    const interval = setInterval(fetchEvents, 5000);
    return () => {
      clearInterval(interval);
      socket.off("updateAttendees");
    };
  }, []);

  const handleEventClick = (event) => {
    localStorage.setItem("selectedEvent", JSON.stringify(event));
    navigate("/event-details");
  };

  const filteredEvents = events.filter((event) => {
    const eventData = event.event || event;
    const eventDate = new Date(eventData.dateTime);
    const today = new Date();

    if (filterCategory !== "all" && eventData.category !== filterCategory) {
      return false;
    }

    if (filterDate === "upcoming" && eventDate < today) return false;
    if (filterDate === "past" && eventDate >= today) return false;

    return eventData.name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="dashboard-container">
      
      <div className="dashboard-banner">
        <img src={dashboardImage} alt="Events Banner" className="dashboard-img" />
      </div>

      <h2 className="dashboard-heading"> Welcome to EventSphere!</h2>
      <p className="dashboard-text">
        Find events that match your interests, register in just a few clicks, and connect with like-minded people!
      </p>
     
      <p className="dashboard-highlight">
        Want to host an event? Click here to get started!
        </p>
        <div className="button-container">
        {!isGuest ? (
          <Link to="/create-event">
            <button>Host Event</button>
          </Link>
        ) : (
          <p style={{ color: "red" }}>⚠️ Login to create events.</p>
        )}
        </div>
      

      
      <input
        type="text"
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="search-filter-container">
        <select onChange={(e) => setFilterDate(e.target.value)} value={filterDate}>
          <option value="all">All Events</option>
          <option value="upcoming">Upcoming Events</option>
          <option value="past">Past Events</option>
        </select>
        <select onChange={(e) => setFilterCategory(e.target.value)} value={filterCategory}>
          <option value="all">All Categories</option>
          <option value="Conference">Conference</option>
          <option value="Workshop">Workshop</option>
          <option value="Meetup">Meetup</option>
          <option value="Networking">Networking</option>
        </select>
      </div>

      
      <div className="event-card-container">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const eventData = event.event || event;
            return (
              <div className="event-card" key={event._id}>
                <h3 onClick={() => handleEventClick(event)}>{eventData.name || "Unknown Event"}</h3>
                <p><strong>Venue:</strong> {eventData.venue || "No venue provided"}</p>
                <p><strong>Date & Time:</strong> {eventData.dateTime ? new Date(eventData.dateTime).toLocaleString() : "No date provided"}</p>
                <button onClick={() => handleEventClick(event)}>View Details</button>
              </div>
            );
          })
        ) : (
          <p>No events match your search/filter criteria.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
