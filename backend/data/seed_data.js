import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { Book } from "../models/book_model.js"; 

// Load environment variables from the parent directory
dotenv.config({ path: '../.env' }); 

// Cấu hình đường dẫn tuyệt đối cho môi trường ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importData = async () => {
  try {
    console.log("-----------------------------------------");
    console.log("Starting book data import process...");
    console.log("-----------------------------------------");

    if (!process.env.MONGO_URI) {
      throw new Error("Missing MONGO_URI environment variable.");
    }

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to the database.");

    console.log("Reading data from final_books_to_mongo.json...");
    
    // Sử dụng đường dẫn tuyệt đối để đọc file JSON
    const jsonPath = path.join(__dirname, "final_books_to_mongo.json");
    const rawData = fs.readFileSync(jsonPath, "utf-8");
    
    const books = JSON.parse(rawData);
    console.log(`Successfully parsed ${books.length} records.`);

    // Optional: Clear existing collection data before seeding
    // console.log("Clearing existing book data...");
    // await Book.deleteMany();
    // console.log("Database cleared.");

    console.log("Importing data to MongoDB. Please wait...");
    await Book.insertMany(books);
    
    console.log("-----------------------------------------");
    console.log("IMPORT COMPLETED SUCCESSFULLY");
    console.log("-----------------------------------------");
    
    process.exit(0);

  } catch (error) {
    console.error("\nERROR DURING IMPORT PROCESS:");
    console.error(error.message);
    process.exit(1);
  }
};

importData();