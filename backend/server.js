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


const allowedOrigins = [
  "https://67a8e5de2d93a6197eb5c0fe--bright-brioche-0a47ad.netlify.app/", 
  "https://event-management-platform-0r3f.onrender.com"
];


const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});


app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());


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


mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Event Management Backend Running!");
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
