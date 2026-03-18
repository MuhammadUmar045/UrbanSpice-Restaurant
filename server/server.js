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

app.post("/api/auth/signup", async (request, response) => {
  if (mongoose.connection.readyState !== 1) {
    return response.status(503).json({
      message: "Database is not connected. Please try again shortly.",
    });
  }

  const { fullName, email, password } = request.body;

  if (!fullName || !email || !password) {
    return response.status(400).json({
      message: "fullName, email and password are required.",
    });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return response.status(409).json({
        message: "Email already exists. Please use another email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    return response.status(201).json({
      message: "User signed up successfully.",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    return response.status(500).json({
      message: "Failed to create user.",
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);

  connectDB().catch((error) => {
    console.error(error.message);
  });
});
