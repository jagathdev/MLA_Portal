import mongoose from "mongoose";
import { seedDefaultUsersMongo } from "../utils/storageHelper.js";

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    return;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn("⚠️ MONGO_URI is not set in environment variables. Falling back to local data storage for preview.");
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    await seedDefaultUsersMongo();
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${(error as Error).message}`);
    // Do not crash the process; let the application run with local storage if possible
  }
}

export function getIsConnected() {
  return isConnected;
}
