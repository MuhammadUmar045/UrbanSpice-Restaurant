import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/restaurantDB";

  try {
    const connection = await mongoose.connect(mongoUri);
    // Keep startup logs concise for easier debugging.
    console.log(`MongoDB connected: ${connection.connection.host}`);
    return true;
  } catch (error) {
    throw new Error(`MongoDB connection error: ${error.message}`);
  }
};
