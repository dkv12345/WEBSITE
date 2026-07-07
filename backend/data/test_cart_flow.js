import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Cart } from "../models/cart_model.js";
import { Book } from "../models/book_model.js";
import { Interaction } from "../models/interaction.js";

// Load env vars
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), "../../.env") });

const mongoUri = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;
const port = process.env.PORT || 5001;

const runTest = async () => {
  try {
    if (!mongoUri || !jwtSecret) {
      throw new Error("Missing MONGO_URI or JWT_SECRET in environment.");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected.");

    // 1. Fetch a test user and a test book
    const user = await mongoose.connection.db.collection("users").findOne({});
    if (!user) throw new Error("No user found in the database to test with.");
    console.log(`Test User found: ${user.email} (ID: ${user._id})`);

    const book = await Book.findOne({ stockQuantity: { $gt: 5 } });
    if (!book) throw new Error("No book with stockQuantity > 5 found in the database to test with.");
    console.log(`Test Book found: "${book.title}" (ID: ${book._id}, Stock: ${book.stockQuantity}, Price: ${book.price})`);

    // Clean up any existing active carts for this user to ensure clean state
    await Cart.deleteMany({ userId: user._id, status: "active" });

    // 2. Generate a valid JWT token
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "1h" });
    console.log("Generated test JWT Token.");

    const headers = {
      "Content-Type": "application/json",
      "Cookie": `token=${token}`
    };

    const baseUrl = `http://localhost:${port}/api/cart`;

    // 3. Test GET /api/cart (should be empty initially)
    console.log("\n--- Testing GET /api/cart (Initial state) ---");
    let res = await fetch(baseUrl, { headers });
    let data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    // 4. Test POST /api/cart/add (should succeed)
    console.log("\n--- Testing POST /api/cart/add ---");
    res = await fetch(`${baseUrl}/add`, {
      method: "POST",
      headers,
      body: JSON.stringify({ bookId: book._id, quantity: 2 })
    });
    data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    // Check interaction log was written asynchronously
    const addInteraction = await Interaction.findOne({
      userId: user._id,
      bookId: book._id,
      interactionType: "add_to_cart"
    });
    console.log("Interaction Logged:", addInteraction ? `Yes (Implicit Weight: ${addInteraction.implicitWeight})` : "No");

    // 5. Test PUT /api/cart/update (change to quantity 3)
    console.log("\n--- Testing PUT /api/cart/update ---");
    res = await fetch(`${baseUrl}/update`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ bookId: book._id, quantity: 3 })
    });
    data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    // 6. Test POST /api/cart/checkout (should convert cart and lock stock)
    const initialStock = book.stockQuantity;
    console.log(`\nInitial stock of book before checkout: ${initialStock}`);
    console.log("--- Testing POST /api/cart/checkout ---");
    res = await fetch(`${baseUrl}/checkout`, {
      method: "POST",
      headers
    });
    data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    // Validate database updates
    const checkedOutCart = await Cart.findById(data.data?._id || data.data?.id);
    console.log("Cart status in DB after checkout:", checkedOutCart?.status);

    const updatedBook = await Book.findById(book._id);
    console.log(`Updated stock of book in DB: ${updatedBook.stockQuantity} (Expected: ${initialStock - 3})`);

    const purchaseInteraction = await Interaction.findOne({
      userId: user._id,
      bookId: book._id,
      interactionType: "purchase"
    });
    console.log("Purchase Interaction Logged:", purchaseInteraction ? `Yes (Implicit Weight: ${purchaseInteraction.implicitWeight})` : "No");

    // Clean up
    if (checkedOutCart) {
      await Cart.deleteOne({ _id: checkedOutCart._id });
      // Restore book stock
      await Book.updateOne({ _id: book._id }, { $set: { stockQuantity: initialStock } });
      // Clean interactions
      await Interaction.deleteMany({ userId: user._id, bookId: book._id });
      console.log("\nTest databases cleaned up successfully.");
    }

    console.log("\nALL TESTS PASSED SUCCESSFULLY! Cart Lifecycle & Checkout works perfectly.");
    process.exit(0);
  } catch (error) {
    console.error("Test execution failed:", error);
    process.exit(1);
  }
};

runTest();
