import mongoose from "mongoose";

const checkInLogSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
  },
  attendeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Attendee",
  },
  scannedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Organizer who scanned
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const CheckInLog = mongoose.model("CheckInLog", checkInLogSchema);
