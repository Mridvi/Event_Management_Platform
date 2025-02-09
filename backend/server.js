import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/event.js";

dotenv.config();

const app = express();
const server = createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());


// ✅ WebSocket Connection
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
  
    socket.on("joinEvent", async ({ eventId, userId }) => {
      try {
        const event = await Event.findById(eventId);
        if (!event.attendees.includes(userId)) {
          event.attendees.push(userId);
          await event.save();
          io.emit("updateAttendees", { eventId, attendees: event.attendees.length });
        }
      } catch (error) {
        console.error("Error joining event:", error);
      }
    });
  
    socket.on("leaveEvent", async ({ eventId, userId }) => {
      try {
        const event = await Event.findById(eventId);
        event.attendees = event.attendees.filter(id => id.toString() !== userId);
        await event.save();
        io.emit("updateAttendees", { eventId, attendees: event.attendees.length }); 
      } catch (error) {
        console.error("Error leaving event:", error);
      }
    });
  
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
  
  app.use("/api/events", eventRoutes);
  app.use("/api/auth", authRoutes);
  

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Sample Route
app.get("/", (req, res) => {
  res.send("Event Management Backend Running!");
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));