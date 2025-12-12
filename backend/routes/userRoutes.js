import express from "express";
import { getUserData, getAllEvents, registerForEventController, getMyBookings, updateProfile } from "../controllers/userController.js";
import userAuth from "../middlewares/userAuth.js";
import multer from "multer";

const userRouter = express.Router();
const upload = multer({ dest: "uploads/" }); // temp storage for avatar

// Existing routes
userRouter.get("/data", userAuth, getUserData);
userRouter.get("/getAllEvents", getAllEvents);
userRouter.post("/register/:eventId", userAuth, registerForEventController);
userRouter.get("/myBookings", userAuth, getMyBookings);

// New route: update profile (only name and avatar)
userRouter.put("/update", userAuth, upload.single("avatar"), updateProfile);

export default userRouter;
