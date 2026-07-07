import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), "../../.env") });

const mongoUri = process.env.MONGO_URI;

const restoreImages = async () => {
  try {
    if (!mongoUri) {
      throw new Error("MONGO_URI is missing.");
    }

    console.log("Connecting to MongoDB to restore book cover links...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully.");

    const db = mongoose.connection.db;
    const booksCol = db.collection("books");

    console.log("Fetching all books from MongoDB...");
    const books = await booksCol.find({}, { projection: { _id: 1, isbn: 1 } }).toArray();
    console.log(`Found ${books.length} books to restore.`);

    console.log("Preparing bulk restore operations...");
    const bulkOps = [];

    books.forEach((book) => {
      const isbn = book.isbn;
      if (!isbn) return;

      const imagesObj = {
        small: `https://covers.openlibrary.org/b/isbn/${isbn}-S.jpg?default=false`,
        medium: `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg?default=false`,
        large: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`
      };

      bulkOps.push({
        updateOne: {
          filter: { _id: book._id },
          update: { $set: { images: imagesObj } }
        }
      });
    });

    if (bulkOps.length === 0) {
      console.log("No books with ISBN found to restore.");
      process.exit(0);
    }

    console.log(`Executing bulk restore of ${bulkOps.length} books...`);
    const result = await booksCol.bulkWrite(bulkOps);
    console.log(`Restoration complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);

    process.exit(0);
  } catch (error) {
    console.error("Restoration error:", error);
    process.exit(1);
  }
};

restoreImages();
