  import mongoose from 'mongoose';

  const ticketSchema = new mongoose.Schema({
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: 'Bookings', // We don't have a Booking model yet, but we store the ID
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ticketType: {
      type: String,
      enum: ['General', 'VIP', 'Student', 'Early Bird'],
      required: true,
    },
    // Store event snapshot so details are preserved even if event is deleted
    eventSnapshot: {
      title: String,
      startDateTime: Date,
      endDateTime: Date,
      venue: String,
      city: String,
      state: String,
    },
    qrCode: {
      type: String,
      required: true,
    },
    barcode: {
      type: String, 
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'checked-in'],
      default: 'active',
    },
    delivery: {
      sentToEmail: { type: Boolean, default: false },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    checkedInAt: {
      type: Date,
    },
    checkedInBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  });

  const Ticket = mongoose.model('Tickets', ticketSchema);

  export default Ticket;
