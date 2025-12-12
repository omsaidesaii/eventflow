import Razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import { registerForEvent } from "./userController.js";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const { attendees } = req.body;

    // Calculate total amount
    let totalAmount = 0;
    attendees.forEach((att) => {
      totalAmount += att.price * 100; // Amount in paise
    });

    const options = {
      amount: totalAmount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Verify Payment and Register
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      eventId,
      attendees,
    } = req.body;

    const userId = req.userId;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment is verified
      // Now register the user for the event
      await registerForEvent(eventId, attendees, userId);

      res.status(200).json({
        success: true,
        message: "Payment verified and registration successful",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid signature, payment verification failed",
      });
    }
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({
      success: false,
      message: "Server error during payment verification",
    });
  }
};


