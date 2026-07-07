import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { SearchLog } from "../models/search_log_model.js";

// Load environment variables
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), "../../.env") });

const mongoUri = process.env.MONGO_URI;

const checkLogs = async () => {
  try {
    if (!mongoUri) throw new Error("MONGO_URI is missing.");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    const logs = await SearchLog.find({}).sort({ timestamp: -1 }).limit(5).lean();
    console.log("Latest Search Logs:");
    console.log(JSON.stringify(logs, null, 2));

    process.exit(0);
  } catch (err) {
    console.error("Error checking logs:", err);
    process.exit(1);
  }
};

checkLogs();
