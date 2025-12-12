import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import connectDB from './db/index.js';
import { connectCloudinary } from './config/cloudinary.js';

import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import eventRouter from './routes/event.routes.js';
import paymentRoutes from './routes/paymentRoutes.js';
const app = express();
app.set("trust proxy", 1); // Trust first proxy (Render load balancer)
const port = process.env.PORT || 4000;

connectDB();
connectCloudinary();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// CORS
// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://eventflow-phi.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// API Endpoints
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/events', eventRouter);
app.use('/api/payment', paymentRoutes); // <-- Add payment endpoints

app.listen(port, () => console.log(`Server started on PORT: ${port}`));
