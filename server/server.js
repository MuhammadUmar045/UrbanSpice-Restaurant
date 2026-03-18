import bcrypt from "bcryptjs";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    mongoState: mongoose.connection.readyState,
  });
});

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

app.post("/api/auth/signup", async (request, response) => {
  const { fullName, email, password } = request.body;

  if (!fullName || !email || !password) {
    return response.status(400).json({
      success: false,
      message: "Full name, email, and password are required.",
    });
  }

  if (fullName.trim().length < 2) {
    return response.status(400).json({
      success: false,
      message: "Full name must be at least 2 characters.",
    });
  }

  if (!validateEmail(email)) {
    return response.status(400).json({
      success: false,
      message: "Please enter a valid email address.",
    });
  }

  if (password.length < 6) {
    return response.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long.",
    });
  }

  if (mongoose.connection.readyState !== 1) {
    return response.status(503).json({
      success: false,
      message: "Service temporarily unavailable. Please try again.",
    });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (existingUser) {
      return response.status(409).json({
        success: false,
        message: "This email is already registered. Please use a different email or login.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    return response.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return response.status(500).json({
      success: false,
      message: "Could not create account. Please try again.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);

  connectDB().catch((error) => {
    console.error(error.message);
  });
});
