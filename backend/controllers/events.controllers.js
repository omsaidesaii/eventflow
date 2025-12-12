import { Event } from "../models/events.models.js";
import { Attendee } from "../models/attendee.models.js";
import Papa from "papaparse";
import { uploadToCloudinary } from "../config/cloudinary.js";


const deleteEvent = async(req, res) => {
  try {
    const {eventId} = req.params
    const event = await Event.findById(eventId)
    if(!event){
      return res.status(400)
      .json({
        success: false,
        message: "No such event found"
      })
    }

    if (event.organizerId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to cancel this event"
      });
    }

    // Instead of deleting, mark as cancelled
    event.status = 'cancelled';
    await event.save();

    // Also cancel all tickets for this event
    const Ticket = (await import("../models/ticket.models.js")).default;
    await Ticket.updateMany(
      { eventId: eventId },
      { status: 'cancelled' }
    );

    return res.status(200).json({
      success: true,
      message: "Event cancelled successfully"
    })

  } catch (error) {
    console.log(error)
    return res.status(400)
    .json({
      success: false,
      message: error.message
    })
  }
}



const addEvent = async(req, res) => {
  try {
      const formData = req.body;
      formData.organizerId = req.userId;

      // Parse tickets and location
      if(formData.tickets) formData.tickets = JSON.parse(formData.tickets);
      if(formData.location) formData.location = JSON.parse(formData.location);

      // Parse socialLinks if present
      if(formData.socialLinks && typeof formData.socialLinks === "string") {
          try {
              formData.socialLinks = JSON.parse(formData.socialLinks);
          } catch(err) {
              console.error("Failed to parse socialLinks:", err);
          }
      }

      // Handle uploaded photos from multer
      let bannerUrl;
      let galleryUrls = [];

      if (req.files) {
          if (req.files.banner?.length > 0) {
              const bannerUpload = await uploadToCloudinary(req.files.banner[0].path, "events/banner");
              bannerUrl = bannerUpload.secure_url;
          }

          if (req.files.gallery?.length > 0) {
              const galleryUploads = await Promise.all(
                req.files.gallery.map((file) => uploadToCloudinary(file.path, "events/gallery"))
              );
              galleryUrls = galleryUploads.map((p) => p.secure_url);
          }
      }

      formData.media = { 
        bannerUrl, 
        gallery: galleryUrls, 
        streamingLink: formData.streamingLink || "" // <-- add this line
      };
      
      const newEvent = await Event.create(formData);

      return res.status(200).json({
          success: true,
          message: "Event created successfully",
          data: newEvent
      });

  } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, message: error.message });
  }
};


const editEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const eventToBeEdited = await Event.findById(eventId);

    if (!eventToBeEdited) {
      return res.status(400).json({ success: false, message: "No Event was found" });
    }

    if (eventToBeEdited.organizerId.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to edit this event"
      });
    }

    // Parse tickets and location if they are strings
    if (req.body.tickets && typeof req.body.tickets === "string") {
      try {
        req.body.tickets = JSON.parse(req.body.tickets);
      } catch (err) {
        console.error("Failed to parse tickets:", err);
        req.body.tickets = [];
      }
    }
    if (req.body["media.streamingLink"]) {
      eventToBeEdited.media.streamingLink = req.body["media.streamingLink"];
    }

    if (req.body.socialLinks && typeof req.body.socialLinks === "string") {
        try {
            req.body.socialLinks = JSON.parse(req.body.socialLinks);
        } catch(err) {
            console.error("Failed to parse socialLinks:", err);
        }
    }


    if (req.body.location && typeof req.body.location === "string") {
      try {
        req.body.location = JSON.parse(req.body.location);
      } catch (err) {
        console.error("Failed to parse location:", err);
      }
    }

    // Handle uploaded files
    if (req.files) {
      if (req.files.banner && req.files.banner.length > 0) {
        const bannerUpload = await uploadToCloudinary(req.files.banner[0].path, {folder: "events/banner"});
        req.body["media.bannerUrl"] = bannerUpload.secure_url;
      }

      if (req.files.gallery && req.files.gallery.length > 0) {
        const galleryUploads = await Promise.all(
          req.files.gallery.map((file) => uploadToCloudinary(file.path, "events/gallery"))
        );

        const newGalleryUrls = galleryUploads.map((p) => p.secure_url);
        req.body["media.gallery"] = [...(eventToBeEdited.media.gallery || []), ...newGalleryUrls];
      }
    }

    const editedEvent = await Event.findByIdAndUpdate(
      eventToBeEdited._id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!editedEvent) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong in editing the event",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event edited successfully",
      data: editedEvent,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({  
      success: false,
      message: error.message,
    });
  }
};


const getAllEventsByEventManagerId = async(req, res) => {
  
  try {
    const managerId = req.userId; 
    const events = await Event.find({ organizerId: managerId });

    return res.status(200).json({
        success: true, data: events 
    });
  } catch (error) {
    console.log(error)
    return res.status(400).json({
        success: false, message: error.message 
    });
  }
}

const getEventById = async(req, res) => {
    try {
        const {eventId} = req.params
        const requestedEvent = await Event.findById(eventId)
        if(!requestedEvent){
            return res.status(400).json({
                success: false,
                message: "No such event found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Event fetched successfully",
            data: requestedEvent
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

const exportAsCSV = async (req, res) => {
  try {
    const { eventId } = req.params;

    const attendees = await Attendee.find({ eventId: eventId });

    if (!attendees.length) {
      return res.status(404).json({ message: "No attendees found" });
    }
    const csv = Papa.unparse(
      attendees.map((a) => ({
        Name: a.name,
        Email: a.email,
        TicketType: a.ticket.type,
        Price: a.ticket.price,
        Currency: a.ticket.currency,
        Status: a.status,
        RegisteredAt: a.createdAt,
      }))
    );

    res.header("Content-Type", "text/csv");
    res.attachment(`attendees-${eventId}.csv`);
    return res.send(csv);

  } catch (err) {
    console.error("Error exporting CSV:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAttendeesByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;

    const attendees = await Attendee.find({ eventId: eventId });

    if (!attendees.length) {
      return res.status(404).json({
        success: false,
        message: "No attendees found for this event",
      });
    }

    const attendeeDetails = attendees.map((a) => ({
      id: a._id,
      name: a.name,
      email: a.email,
      ticket: {
        type: a.ticket?.type || "N/A",
        price: a.ticket?.price || 0,
        currency: a.ticket?.currency || "N/A",
      },
      status: a.status,
      registeredAt: a.createdAt,
    }));

    return res.status(200).json({
      success: true,
      message: "Attendees fetched successfully",
      data: attendeeDetails,
    });

  } catch (error) {
    console.error("Error fetching attendees:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//CSV


// Check-in Attendee
const checkInAttendee = async (req, res) => {
    try {
        const { ticketId, attendeeId } = req.body;

        if (!ticketId || !attendeeId) {
            return res.status(400).json({ success: false, message: "Invalid QR Code Data" });
        }

        // 1. Find Ticket
        // We import Ticket here since it might not be imported at top level
        const Ticket = (await import("../models/ticket.models.js")).default;
        
        const ticket = await Ticket.findById(ticketId).populate('eventId');
        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        // 2. Verify Organizer Authorization
        // The requester (organizer) must own the event this ticket is for
        // ticket.eventId is populated, so ticket.eventId.organizerId must match req.userId
        if (ticket.eventId.organizerId.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: "Unauthorized: You do not organize this event" });
        }

        // 3. Check status
        if (ticket.status === 'checked-in') {
            return res.status(400).json({ success: false, message: "Ticket already checked in!" });
        }
        if (ticket.status === 'cancelled') {
            return res.status(400).json({ success: false, message: "Ticket is cancelled!" });
        }

        // 4. Update Ticket Status
        ticket.status = 'checked-in';
        ticket.checkedInAt = new Date();
        ticket.checkedInBy = req.userId;
        await ticket.save();

        // 5. Update Attendee Status
        const attendee = await Attendee.findById(attendeeId);
        if (attendee) {
            attendee.status = 'checked-in';
            await attendee.save();
        }

        // 6. Log Check-in
        const { CheckInLog } = await import("../models/checkInLog.models.js");
        await CheckInLog.create({
            eventId: ticket.eventId._id,
            ticketId: ticket._id,
            attendeeId: attendeeId,
            scannedBy: req.userId
        });

        return res.status(200).json({
            success: true,
            message: "Check-in successful!",
            data: {
                ticketStatus: ticket.status,
                attendeeName: attendee ? attendee.name : "Unknown",
                checkedInAt: ticket.checkedInAt
            }
        });

    } catch (error) {
        console.error("Check-in Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

export {
    deleteEvent,
    addEvent,
    editEvent,
    getAllEventsByEventManagerId,
    getEventById,
    exportAsCSV,
    getAttendeesByEventId,
    checkInAttendee
}