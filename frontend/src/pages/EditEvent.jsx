import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [updatedData, setUpdatedData] = useState({});

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`https://event-management-platform-0r3f.onrender.com/api/events/${id}`);
        setEvent(res.data);
        setUpdatedData(res.data); // Prefill form with existing data
      } catch (err) {
        console.error("Failed to fetch event details:", err);
      }
    };

    fetchEvent();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://event-management-platform-0r3f.onrender.com/api/events/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Event updated successfully!");
      navigate("/my-events");
    } catch (err) {
      console.error("Failed to update event:", err);
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Event</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={updatedData.name}
          onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
          required
        />
        <input
          type="text"
          value={updatedData.venue}
          onChange={(e) => setUpdatedData({ ...updatedData, venue: e.target.value })}
          required
        />
        <textarea
          value={updatedData.description}
          onChange={(e) => setUpdatedData({ ...updatedData, description: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          value={updatedData.dateTime}
          onChange={(e) => setUpdatedData({ ...updatedData, dateTime: e.target.value })}
          required
        />
        <button type="submit">Update Event</button>
      </form>
    </div>
  );
};

export default EditEvent;
