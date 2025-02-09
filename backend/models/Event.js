import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  
  host: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },

  name: { type: String, required: true },
  venue: { type: String, required: true },
  description: { type: String, required: true },
  
  category: { type: String, required: true },
  dateTime: { type: Date, required: true },

  attendees: [{ name: String, email: String, phone: String }] 
}, { timestamps: true });
export default mongoose.model("Event", EventSchema);
