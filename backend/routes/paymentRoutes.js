import express from "express";
import {
  createOrder,
  verifyPayment,
} from "../controllers/paymentController.js";

import userAuth from "../middlewares/userAuth.js";

const router = express.Router();

router.post("/create-order", userAuth, createOrder);
router.post("/verify-payment", userAuth, verifyPayment);

export default router;

