import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { User } from "../models/user_model.js";
import { Book } from "../models/book_model.js";
import { Interaction } from "../models/interaction.js";

// Load environment variables
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), "../../.env") });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedInteractions = async () => {
  try {
    console.log("--------------------------------------------------");
    console.log("Starting Interaction & Mock User Seeding Process...");
    console.log("--------------------------------------------------");

    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI not found in environment variables.");
    }

    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("Successfully connected to the database.");

    // 1. Clean existing mock users (keep the original 3 real users)
    console.log("Cleaning old mock users...");
    const userDeleteResult = await User.deleteMany({ email: { $regex: /^mock_user_/ } });
    console.log(`Deleted ${userDeleteResult.deletedCount} old mock users.`);

    // 2. Clean ALL existing interactions
    console.log("Cleaning all existing interactions...");
    await Interaction.deleteMany({});
    console.log("Interactions collection cleared.");

    // 3. Retrieve all books to build interactions against
    console.log("Fetching books from database...");
    const books = await Book.find({}, { _id: 1, title: 1, author: 1, genres: 1 }).lean();
    if (books.length === 0) {
      throw new Error("No books found in the database. Please run book seeding first.");
    }
    console.log(`Found ${books.length} books.`);

    // 4. Generate 50 new Mock Users
    console.log("Generating 50 new mock users...");
    const mockUsers = [];
    const locations = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Hải Phòng"];
    const genresList = ["Fiction", "Nonfiction", "Biography", "Science", "History", "Self-help", "Religion", "Psychology", "Business", "Technology"];

    for (let i = 1; i <= 50; i++) {
      mockUsers.push({
        email: `mock_user_${i}@example.com`,
        password: "$2a$10$xyzplaceholderhashforsecuritypurposeonly", // Fake bcrypt hash
        name: `Mock User ${i}`,
        role: "customer",
        yearOfBirth: 1980 + Math.floor(Math.random() * 25), // 1980 to 2005
        location: locations[Math.floor(Math.random() * locations.length)],
        onboardingCompleted: true,
        preferences: {
          favCategories: [
            genresList[Math.floor(Math.random() * genresList.length)],
            genresList[Math.floor(Math.random() * genresList.length)]
          ],
          favAuthors: ["Tô Hoài", "J.K. Rowling", "Dale Carnegie"],
          userBudget: (100 + Math.floor(Math.random() * 15) * 50) * 1000 // 100k - 800k VND
        },
        shoppingHabits: {
          totalSpent: 0,
          orderCount: 0,
          averageOrderValue: 0,
          priceSensitivity: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)]
        },
        isVerified: true
      });
    }

    console.log("Inserting mock users into database...");
    const insertedUsers = await User.insertMany(mockUsers);
    console.log(`Successfully seeded ${insertedUsers.length} mock users.`);

    // Add existing real users to the user pool as well so they have interactions
    const realUsers = await User.find({ email: { $not: /^mock_user_/ } }).lean();
    const allUsers = [...insertedUsers, ...realUsers];
    console.log(`Total users for interaction pool: ${allUsers.length} (${insertedUsers.length} mock + ${realUsers.length} real).`);

    // 5. Define Hidden Clusters (Preferences) to make Collaborative Filtering (SVD) learn real patterns
    // We categorize books into 3 clusters
    // Cluster 0: Fiction / Literature / Novel / Classics
    // Cluster 1: Religion / Self-help / Psychology / Philosophy / Inspiration
    // Cluster 2: Business / Science / Technology / Biography / History
    const bookClusters = [[], [], []];
    books.forEach(b => {
      const genresStr = (b.genres || []).join(" ").toLowerCase();
      if (genresStr.includes("fiction") || genresStr.includes("novel") || genresStr.includes("classics") || genresStr.includes("literature")) {
        bookClusters[0].push(b);
      } else if (genresStr.includes("religion") || genresStr.includes("self") || genresStr.includes("psychology") || genresStr.includes("philosophy")) {
        bookClusters[1].push(b);
      } else {
        bookClusters[2].push(b);
      }
    });

    console.log(`Book cluster distribution: Cluster 0 (Fiction): ${bookClusters[0].length}, Cluster 1 (Self-Help/Religion): ${bookClusters[1].length}, Cluster 2 (Business/Science/Others): ${bookClusters[2].length}`);

    // Fallback if clusters are empty
    for (let c = 0; c < 3; c++) {
      if (bookClusters[c].length === 0) {
        bookClusters[c] = books; // Fallback to all books if genre filter is sparse
      }
    }

    // Assign each user to a hidden preference group (0, 1, or 2)
    const userGroups = new Map();
    allUsers.forEach(u => {
      userGroups.set(u._id.toString(), Math.floor(Math.random() * 3));
    });

    // 6. Generate Interactions
    console.log("Generating interaction sequence records...");
    const interactionsToInsert = [];
    const now = new Date();

    // Loop through each user to generate multiple sessions
    for (const user of allUsers) {
      const userIdStr = user._id.toString();
      const preferredCluster = userGroups.get(userIdStr);
      
      // Determine number of sessions for this user (e.g. 8 to 20 sessions)
      const numSessions = 8 + Math.floor(Math.random() * 13);
      
      for (let s = 0; s < numSessions; s++) {
        const sessionId = `sess_${userIdStr.substring(18)}_${s}`;
        
        // Random session timestamp within the last 30 days
        const daysAgo = Math.random() * 30;
        const sessionTime = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        
        // 2 to 6 books viewed in this session
        const numBooksInSession = 2 + Math.floor(Math.random() * 5);
        
        for (let bIndex = 0; bIndex < numBooksInSession; bIndex++) {
          // Select book: 70% chance from preferred cluster, 30% random
          let selectedBook;
          if (Math.random() < 0.7) {
            const cluster = bookClusters[preferredCluster];
            selectedBook = cluster[Math.floor(Math.random() * cluster.length)];
          } else {
            selectedBook = books[Math.floor(Math.random() * books.length)];
          }
          
          if (!selectedBook) continue;

          // Time offset for actions inside the session (a few minutes apart)
          const actionTime = new Date(sessionTime.getTime() + bIndex * 3 * 60 * 1000);
          
          // Action 1: view_details (always happens)
          const dwellTime = 10 + Math.floor(Math.random() * 170); // 10 to 180s
          interactionsToInsert.push({
            userId: user._id,
            bookId: selectedBook._id,
            interactionType: "view_details",
            implicitWeight: 1.0,
            metadata: {
              session_id: sessionId,
              dwell_time_seconds: dwellTime
            },
            timestamp: actionTime
          });

          // Action 2: add_to_wishlist (25% chance)
          if (Math.random() < 0.25) {
            interactionsToInsert.push({
              userId: user._id,
              bookId: selectedBook._id,
              interactionType: "add_to_wishlist",
              implicitWeight: 2.0,
              metadata: {
                session_id: sessionId,
                dwell_time_seconds: 0
              },
              timestamp: new Date(actionTime.getTime() + 15 * 1000)
            });
          }

          // Action 3: add_to_cart (20% chance)
          let addedToCart = false;
          if (Math.random() < 0.2) {
            addedToCart = true;
            interactionsToInsert.push({
              userId: user._id,
              bookId: selectedBook._id,
              interactionType: "add_to_cart",
              implicitWeight: 3.0,
              metadata: {
                session_id: sessionId,
                dwell_time_seconds: 0
              },
              timestamp: new Date(actionTime.getTime() + 30 * 1000)
            });
          }

          // Action 4: purchase (if added to cart, 50% chance of purchase)
          if (addedToCart && Math.random() < 0.5) {
            interactionsToInsert.push({
              userId: user._id,
              bookId: selectedBook._id,
              interactionType: "purchase",
              implicitWeight: 5.0,
              metadata: {
                session_id: sessionId,
                dwell_time_seconds: 0
              },
              timestamp: new Date(actionTime.getTime() + 90 * 1000)
            });
          }
        }
      }
    }

    console.log(`Generated ${interactionsToInsert.length} mock interaction records.`);

    // 7. Save to local JSON mockup file
    const jsonPath = path.join(__dirname, "mock_interactions.json");
    console.log(`Writing mock interactions JSON to: ${jsonPath}`);
    fs.writeFileSync(jsonPath, JSON.stringify(interactionsToInsert, null, 2), "utf-8");
    console.log("JSON file written successfully.");

    // 8. Seed interactions to MongoDB
    console.log("Inserting interactions into MongoDB...");
    const result = await Interaction.insertMany(interactionsToInsert);
    console.log(`Successfully seeded ${result.length} interactions into MongoDB.`);

    // Ensure Indexes are built
    console.log("Ensuring compound index on Interaction schema...");
    await Interaction.createIndexes();
    console.log("Indexes checked and verified.");

    console.log("--------------------------------------------------");
    console.log("SEEDING PROCESS COMPLETED SUCCESSFULLY");
    console.log("--------------------------------------------------");
    process.exit(0);

  } catch (error) {
    console.error("\nERROR DURING SEEDING:");
    console.error(error);
    process.exit(1);
  }
};

seedInteractions();
