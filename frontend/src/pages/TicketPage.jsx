import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ticketImage from "../assets/ticket-banner.jpg"; 

const TicketPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const ticket = location.state?.ticket;

  if (!ticket) {
    return <p>No ticket found. Please register for an event.</p>;
  }

  return (
    <div className="ticket-page">
     
      <img src={ticketImage} alt="Event Ticket" className="ticket-banner" />

      
      <div className="ticket-container">
        <h2>🎉 Registration Successful!</h2>
        <p>Thank you for registering. Here is your event ticket:</p>
        
        <div className="ticket-details">
          <p><strong> Ticket ID:</strong> {ticket.id}</p>
          <p><strong>Name:</strong> {ticket.user.name}</p>
          <p><strong>Email:</strong> {ticket.user.email}</p>
          <p><strong>Phone:</strong> {ticket.user.phone}</p>
          <p><strong> Event:</strong> {ticket.eventName}</p>
        </div>

        <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
      </div>
    </div>
  );
};

export default TicketPage;
