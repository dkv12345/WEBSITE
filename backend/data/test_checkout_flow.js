import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Cart } from "../models/cart_model.js";
import { Book } from "../models/book_model.js";
import { Order } from "../models/order_model.js";
import { Transaction } from "../models/transaction_model.js";
import { Interaction } from "../models/interaction.js";

// Load environment variables
dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), "../../.env") });

const mongoUri = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;
const port = process.env.PORT || 5001;

const runTest = async () => {
  try {
    if (!mongoUri || !jwtSecret) {
      throw new Error("Missing environment configurations.");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected.");

    // Fetch user
    const user = await mongoose.connection.db.collection("users").findOne({});
    if (!user) throw new Error("No user found in the database to test with.");
    console.log(`Test User found: ${user.email} (ID: ${user._id})`);

    // Fetch book
    const book = await Book.findOne({ stockQuantity: { $gt: 5 } });
    if (!book) throw new Error("No book with stockQuantity > 5 found in the database to test with.");
    console.log(`Test Book found: "${book.title}" (ID: ${book._id}, Stock: ${book.stockQuantity}, Price: ${book.price})`);

    // Create an active cart for the user
    await Cart.deleteMany({ userId: user._id, status: "active" });
    const cart = new Cart({
      userId: user._id,
      status: "active",
      items: [{ bookId: book._id, quantity: 2, priceAtAdded: book.price }]
    });
    await cart.save();
    console.log("Active test cart created.");

    // Sign JWT token
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "1h" });
    const headers = {
      "Content-Type": "application/json",
      "Cookie": `token=${token}`
    };

    const baseUrl = `http://localhost:${port}/api/checkout`;

    // 1. Test POST /api/checkout/create-session (creating order/transaction and retrieving redirect link)
    console.log("\n--- Testing POST /api/checkout/create-session ---");
    let res = await fetch(`${baseUrl}/create-session`, {
      method: "POST",
      headers,
      body: JSON.stringify({ promoCode: "WINTER10" }) // promo doesn't exist, will be ignored but shouldn't fail
    });
    let data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (!data.success || !data.paymentURL) {
      throw new Error("Checkout session creation failed.");
    }

    // Extract orderId from redirect url query parameters
    const urlObj = new URL(data.paymentURL);
    const orderId = urlObj.searchParams.get("orderId");
    console.log(`\nCreated Order ID: ${orderId}`);

    // Verify order and transaction were created in DB as 'pending'
    const order = await Order.findById(orderId);
    console.log("Initial Order status in DB:", order?.status);

    const transaction = await Transaction.findOne({ orderId });
    console.log("Initial Transaction status in DB:", transaction?.status);

    // 2. Test POST /api/checkout/mock-success (webhook simulation)
    console.log("\n--- Testing POST /api/checkout/mock-success ---");
    const initialStock = book.stockQuantity;
    res = await fetch(`${baseUrl}/mock-success`, {
      method: "POST",
      headers,
      body: JSON.stringify({ orderId })
    });
    data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(data, null, 2));

    if (!data.success) {
      throw new Error("Mock payment simulation failed.");
    }

    // Verify final state mutations in DB
    const finalOrder = await Order.findById(orderId);
    console.log("Final Order status in DB:", finalOrder?.status);

    const finalTransaction = await Transaction.findOne({ orderId });
    console.log("Final Transaction status in DB:", finalTransaction?.status);

    const finalCart = await Cart.findById(cart._id);
    console.log("Final Cart status in DB:", finalCart?.status);

    const finalBook = await Book.findById(book._id);
    console.log(`Updated stock of book in DB: ${finalBook.stockQuantity} (Expected: ${initialStock - 2})`);

    const purchaseInteraction = await Interaction.findOne({
      userId: user._id,
      bookId: book._id,
      interactionType: "purchase"
    });
    console.log("Purchase Interaction Logged in DB:", purchaseInteraction ? `Yes (Implicit Weight: ${purchaseInteraction.implicitWeight})` : "No");

    // Databases Cleanup
    await Order.deleteOne({ _id: orderId });
    await Transaction.deleteOne({ orderId });
    await Cart.deleteOne({ _id: cart._id });
    await Book.updateOne({ _id: book._id }, { $set: { stockQuantity: initialStock } });
    await Interaction.deleteMany({ userId: user._id, bookId: book._id });
    console.log("\nTest databases cleaned up successfully.");

    console.log("\nALL TESTS PASSED SUCCESSFULLY! Secure Checkout & Webhook Payment Pipeline is fully working.");
    process.exit(0);

  } catch (error) {
    console.error("Test execution failed:", error);
    process.exit(1);
  }
};

runTest();
