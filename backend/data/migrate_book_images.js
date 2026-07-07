import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), "../../.env") });

const mongoUri = process.env.MONGO_URI;

// Set of 10 high-quality, fast-loading Unsplash book cover placeholder images
const genericBookImages = [
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80", // Red cover
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80", // Library book
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80", // Opened book
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80", // Artistic cover
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80", // Stack of books
  "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80", // Minimalist book
  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80", // Bookshelves
  "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80", // Green/Gold book
  "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80", // Vintage books
  "https://images.unsplash.com/photo-1510172951991-859a69907ac4?auto=format&fit=crop&q=80"  // Notebook cover
];

const genreSpecificImages = {
  business: "https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&q=80",
  finance: "https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&q=80",
  economics: "https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&q=80",
  science: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80",
  technology: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80",
  history: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80",
  religion: "https://images.unsplash.com/photo-1438243444908-849785867f16?auto=format&fit=crop&q=80",
  psychology: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80",
  selfhelp: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80",
  biography: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80"
};

// Helper function to get hash of id
const getHashIndex = (str, modulo) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % modulo;
};

const migrateImages = async () => {
  try {
    if (!mongoUri) {
      throw new Error("MONGO_URI is missing.");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully.");

    const db = mongoose.connection.db;
    const booksCol = db.collection("books");

    console.log("Fetching all books from MongoDB...");
    const books = await booksCol.find({}, { projection: { _id: 1, genres: 1 } }).toArray();
    console.log(`Found ${books.length} books to migrate.`);

    console.log("Preparing bulk update operations...");
    const bulkOps = [];

    books.forEach((book, idx) => {
      const bookIdStr = book._id.toString();
      let selectedBaseUrl = null;

      // 1. Check if we can assign a genre-specific cover image
      const genres = book.genres || [];
      for (const genre of genres) {
        const cleanedGenre = genre.toLowerCase().replace(/[^a-z]/g, "");
        if (genreSpecificImages[cleanedGenre]) {
          selectedBaseUrl = genreSpecificImages[cleanedGenre];
          break;
        }
      }

      // 2. Fall back to deterministic generic cover image based on ID hash
      if (!selectedBaseUrl) {
        const imgIndex = getHashIndex(bookIdStr, genericBookImages.length);
        selectedBaseUrl = genericBookImages[imgIndex];
      }

      // 3. Create responsive dimensions using Unsplash width parameter (&w=)
      const imagesObj = {
        small: `${selectedBaseUrl}&w=200`,
        medium: `${selectedBaseUrl}&w=400`,
        large: `${selectedBaseUrl}&w=800`
      };

      bulkOps.push({
        updateOne: {
          filter: { _id: book._id },
          update: { $set: { images: imagesObj } }
        }
      });
    });

    console.log(`Executing bulk update of ${bulkOps.length} books...`);
    const result = await booksCol.bulkWrite(bulkOps);
    console.log(`Migration complete! Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);

    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

migrateImages();
