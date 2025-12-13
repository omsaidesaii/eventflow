import User from "../models/userModel.js";
import { Event } from "../models/events.models.js"; 
import { Attendee } from "../models/attendee.models.js";
import Ticket from "../models/ticket.models.js"; 
import mongoose from "mongoose";
import { createTicketsForBooking } from "../services/ticketService.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

 const getUserData = async (req, res) => {
    try {
        const userId = req.userId; 
        const user = await User.findById(userId).lean();
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            userData: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                isAccountVerified: user.isAccountVerified
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const getAllEvents = async(req, res) => {
    try {
        // Only show published events (exclude cancelled and draft)
        const events = await Event.find({ status: 'published' }).populate("organizerId", "name email"); 
        if(!events || events.length === 0){
            return res.status(200).json({
              success: true,
              data: [],
              message: "No Events found"
            })
        }
        res.status(200).json({
        success: true,
        count: events.length,
        data: events,
        message: "Events fetched successfully"
        });

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}


const registerForEvent = async (eventId, attendeesInput, userIdInput) => {
  try {
    const userId = userIdInput;
    const attendees = attendeesInput;

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    const createdAttendees = [];

    const booking = {
      _id: new mongoose.Types.ObjectId(),
      eventId,
      tickets: [],
      eventName: event.title,
      eventDate: event.startDateTime,
      venue: event.location?.venue || "",
    };

    for (const attendeeData of attendees) {
      const ticketInfo = event.tickets.find(
        (t) => t.type.toLowerCase() === attendeeData.ticketType.toLowerCase()
      );

      if (!ticketInfo) throw new Error(`Invalid ticket type "${attendeeData.ticketType}" for ${attendeeData.name}`);
      if (ticketInfo.soldCount >= ticketInfo.maxQuantity) throw new Error(`Ticket ${ticketInfo.type} sold out`);

      ticketInfo.soldCount += 1;
      booking.tickets.push({ type: ticketInfo.type });

      const attendee = await Attendee.create({
        eventId,
        name: attendeeData.name,
        email: attendeeData.email,
        ticket: {
          ticketId: ticketInfo._id,
          type: ticketInfo.type,
          price: ticketInfo.price,
          currency: ticketInfo.currency,
        },
        status: "booked",
      });

      createdAttendees.push(attendee);
    }

    await event.save();

    const createdTickets = await createTicketsForBooking(booking, createdAttendees, userId, event);

    return { message: "Registration successful", attendees: createdAttendees, tickets: createdTickets };
  } catch (err) {
    console.error("registerForEvent error:", err);
    throw err; // Throw error so it can be caught by Stripe controller
  }
};

const registerForEventController = async (req, res) => {
  try {
      const { eventId } = req.params;
      const { attendees } = req.body;
      const userId = req.userId;

      const result = await registerForEvent(eventId, attendees, userId);

      res.status(200).json({
          success: true,
          data: result
      });
  } catch (error) {
      console.error(error);
      res.status(400).json({ success: false, message: error.message });
  }
};


const getMyBookings = async (req, res) => {
  try {
    const userId = req.userId;

    // Verify user existence
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find all tickets for the user and populate event details
    // Sort by createdAt descending (most recent first)
    const myTickets = await Ticket.find({ userId })
      .populate("eventId")
      .sort({ createdAt: -1 });

    // Format response safely - show all tickets including cancelled ones
    const bookings = myTickets
      .map((ticket) => {
        const event = ticket.eventId;
        const snapshot = ticket.eventSnapshot;
        
        // Generate a user-friendly ticket ID with # prefix
        const ticketIdString = ticket._id.toString();
        const shortId = ticketIdString.slice(-8).toUpperCase();
        const formattedTicketId = `#${shortId}`;

        return {
          ticketId: formattedTicketId,
          ticketType: ticket.ticketType,
          qrCode: ticket.qrCode,
          barcode: ticket.barcode,
          status: ticket.status,
          delivery: ticket.delivery,
          createdAt: ticket.createdAt,
          event: event ? {
            id: event._id,
            title: event.title,
            date: event.date,
            startDateTime: event.startDateTime,
            endDateTime: event.endDateTime,
            venue: event.venue,
            location: event.location,
            image: event.image,
            category: event.category,
            status: event.status,
          } : snapshot ? {
            // Use snapshot if event was deleted
            id: null,
            title: snapshot.title,
            date: null,
            startDateTime: snapshot.startDateTime,
            endDateTime: snapshot.endDateTime,
            venue: snapshot.venue,
            location: {
              venue: snapshot.venue,
              city: snapshot.city,
              state: snapshot.state,
            },
            image: null,
            category: null,
            status: 'deleted',
          } : {
            // Fallback if no snapshot exists (old tickets)
            id: null,
            title: "Event Deleted",
            date: null,
            startDateTime: null,
            endDateTime: null,
            venue: null,
            location: null,
            image: null,
            category: null,
            status: 'deleted',
          },
        };
      });

    res.status(200).json({
      message: "My bookings fetched successfully",
      data: bookings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


 const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { name } = req.body;
    console.log("Update profile body:", req.body);
    console.log("Update profile file:", req.file);

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    const updateData = { name };

    // Handle avatar upload if present
    if (req.file) {
      // If using Cloudinary
      const uploadResult = await uploadToCloudinary(req.file.path, "avatars");
      updateData.avatar = uploadResult.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export {
  updateProfile,
  getUserData,
    getAllEvents,
    getMyBookings,
    registerForEvent,
    registerForEventController
}