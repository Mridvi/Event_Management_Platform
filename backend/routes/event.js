import express from "express";
import Event from "../models/Event.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();


// ✅ Middleware to check event ownership
const checkOwnership = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    
    if (event.host.email !== req.user.email) {
      return res.status(403).json({ error: "You are not authorized to modify this event" });
    }

    req.event = event; 
    next();
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


router.put("/:id", protect, checkOwnership, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Delete Event (Only the Creator Can Delete)
router.delete("/:id", protect, checkOwnership, async (req, res) => {
  try {
    await req.event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});



router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/my-events", protect, async (req, res) => {
    try {
      console.log("User from token:", req.user); 
      const email = req.user?.email; 
  
      if (!email) {
        return res.status(400).json({ error: "User email not found in token" });
      }
  
      const myEvents = await Event.find({ "host.email": email }); // ✅ Find events by host email
      res.json(myEvents);
    } catch (error) {
      console.error("Error fetching user's events:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  
  

// Protected Route: Create an Event
router.post("/create", protect, async (req, res) => {
  try {
    const { host, name, venue, description, dateTime, category } = req.body;

    if (!host || !host.name || !host.email || !host.phone || !name || !venue || !description || !dateTime || !category) {
      return res.status(400).json({ error: "All fields are required, including category." });
    }

    const newEvent = new Event({
      user: req.user.id,
      host,
      name,
      venue,
      description,
      dateTime,
      category,
      attendees: []
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/register", async (req, res) => {
    try {
      const { eventId, user } = req.body;
  
      if (!user || !user.name || !user.email || !user.phone) {
        return res.status(400).json({ error: "User details are required" });
      }
  
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ error: "Event not found" });
  
      // Prevent duplicate registration
      if (event.attendees.find((attendee) => attendee.email === user.email)) {
        return res.status(400).json({ error: "User already registered" });
      }
  
      
      event.attendees.push(user);
      await event.save();
  
      // Generate Ticket
      const ticket = {
        id: `TICKET-${Math.random().toString(36).substr(2, 9)}`,
        eventName: event.name,
        user,
      };
  
      res.json({ message: "Registration successful", ticket });
    } catch (error) {
      console.error("Error registering for event:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
  


router.get("/my-events", protect, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update an Event
router.put("/:id", protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this event" });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//  Delete an Event
router.delete("/:id", protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to delete this event" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
