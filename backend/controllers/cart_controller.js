import { Cart } from "../models/cart_model.js";
import { Book } from "../models/book_model.js";
import { Interaction } from "../models/interaction.js";
import mongoose from "mongoose";

// 1. Get the active cart for the authenticated user
export const getCart = async (req, res) => {
  try {
    const userId = req.userId;
    let cart = await Cart.findOne({ userId, status: "active" })
      .populate({
        path: "items.bookId",
        select: "title price stockQuantity images inStock"
      })
      .lean();

    // If no active cart exists, return an empty cart template cleanly
    if (!cart) {
      return res.status(200).json({
        success: true,
        data: { items: [] }
      });
    }

    // Filter out any items where book reference became null (deleted from DB)
    cart.items = cart.items.filter(item => item.bookId != null);

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error("Error in getCart:", error);
    res.status(500).json({ success: false, message: "Server error retrieving cart" });
  }
};

// 2. Add an item to the cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookId, quantity } = req.body;
    const qty = parseInt(quantity, 10) || 1;

    if (!bookId) {
      return res.status(400).json({ success: false, message: "Missing bookId" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    if (book.stockQuantity < qty) {
      return res.status(400).json({ success: false, message: `Insufficient stock. Only ${book.stockQuantity} copies available.` });
    }

    let cart = await Cart.findOne({ userId, status: "active" });

    if (!cart) {
      cart = new Cart({
        userId,
        status: "active",
        items: [{ bookId, quantity: qty, priceAtAdded: book.price }]
      });
    } else {
      const itemIdx = cart.items.findIndex(item => item.bookId.toString() === bookId);
      if (itemIdx > -1) {
        const newQty = cart.items[itemIdx].quantity + qty;
        if (book.stockQuantity < newQty) {
          return res.status(400).json({ success: false, message: `Insufficient stock. Adding ${qty} would exceed available stock of ${book.stockQuantity}.` });
        }
        cart.items[itemIdx].quantity = newQty;
      } else {
        cart.items.push({ bookId, quantity: qty, priceAtAdded: book.price });
      }
    }

    await cart.save();

    // Asynchronous Side Effect: Log interaction for recommendations system
    Interaction.create({
      userId,
      bookId,
      interactionType: "add_to_cart",
      implicitWeight: 3.0,
      timestamp: new Date()
    }).catch(err => console.error("Error logging add_to_cart interaction:", err));

    res.status(200).json({ success: true, message: "Book added to cart successfully", data: cart });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ success: false, message: "Server error adding to cart" });
  }
};

// 3. Update quantity of an item in the cart
export const updateQuantity = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookId, quantity } = req.body;
    const targetQty = parseInt(quantity, 10);

    if (!bookId || isNaN(targetQty) || targetQty < 1) {
      return res.status(400).json({ success: false, message: "Invalid parameters. Quantity must be at least 1." });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: "Book not found" });
    }

    if (book.stockQuantity < targetQty) {
      return res.status(400).json({ success: false, message: `Insufficient stock. Only ${book.stockQuantity} copies available.` });
    }

    const cart = await Cart.findOne({ userId, status: "active" });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const itemIdx = cart.items.findIndex(item => item.bookId.toString() === bookId);
    if (itemIdx === -1) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    cart.items[itemIdx].quantity = targetQty;
    await cart.save();

    res.status(200).json({ success: true, message: "Cart updated successfully", data: cart });
  } catch (error) {
    console.error("Error in updateQuantity:", error);
    res.status(500).json({ success: false, message: "Server error updating quantity" });
  }
};

// 4. Remove an item from the cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const bookId = req.params.bookId || req.body.bookId;

    if (!bookId) {
      return res.status(400).json({ success: false, message: "Missing bookId" });
    }

    const cart = await Cart.findOne({ userId, status: "active" });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Active cart not found" });
    }

    cart.items = cart.items.filter(item => item.bookId.toString() !== bookId);
    await cart.save();

    res.status(200).json({ success: true, message: "Book removed from cart successfully", data: cart });
  } catch (error) {
    console.error("Error in removeFromCart:", error);
    res.status(500).json({ success: false, message: "Server error removing from cart" });
  }
};

// 5. Checkout Cart (Convert Cart to Order) using MongoDB Transactions
export const checkoutCart = async (req, res) => {
  const userId = req.userId;
  let session = null;

  try {
    // Find the active cart
    const cart = await Cart.findOne({ userId, status: "active" }).populate("items.bookId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Your cart is empty." });
    }

    // Try starting a session for transactions
    let isTransactional = true;
    try {
      session = await mongoose.startSession();
      session.startTransaction();
    } catch (txError) {
      console.warn("[CartCheckout] Standalone MongoDB detected. Running non-transactional fallback. Reason:", txError.message);
      isTransactional = false;
      if (session) {
        session.endSession();
        session = null;
      }
    }

    // A. Validate stock for all items first
    for (const item of cart.items) {
      const book = item.bookId;
      if (!book) {
        throw new Error("One or more books in your cart no longer exist in our catalog.");
      }
      if (book.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for "${book.title}". Available: ${book.stockQuantity}, Requested: ${item.quantity}.`);
      }
    }

    // B. Perform inventory locks and update status
    if (isTransactional) {
      for (const item of cart.items) {
        const updatedBook = await Book.findOneAndUpdate(
          { _id: item.bookId._id, stockQuantity: { $gte: item.quantity } },
          { $inc: { stockQuantity: -item.quantity } },
          { session, new: true }
        );
        if (!updatedBook) {
          throw new Error(`Concurrency lock failed: Insufficient stock for "${item.bookId.title}".`);
        }
      }

      cart.status = "converted_to_order";
      await cart.save({ session });

      await session.commitTransaction();
    } else {
      // Non-transactional fallback for developers running standalone local MongoDB
      for (const item of cart.items) {
        const updatedBook = await Book.findOneAndUpdate(
          { _id: item.bookId._id, stockQuantity: { $gte: item.quantity } },
          { $inc: { stockQuantity: -item.quantity } },
          { new: true }
        );
        if (!updatedBook) {
          throw new Error(`Concurrency lock failed: Insufficient stock for "${item.bookId.title}".`);
        }
      }
      cart.status = "converted_to_order";
      await cart.save();
    }

    // C. Asynchronous Side Effect: Log purchase interactions
    for (const item of cart.items) {
      Interaction.create({
        userId,
        bookId: item.bookId._id,
        interactionType: "purchase",
        implicitWeight: 5.0,
        timestamp: new Date()
      }).catch(err => console.error("Error logging purchase interaction:", err));
    }

    res.status(200).json({ 
      success: true, 
      message: "Order placed successfully! Checkout complete.",
      data: cart 
    });

  } catch (error) {
    if (session) {
      await session.abortTransaction();
    }
    console.error("Checkout Error:", error.message);
    res.status(400).json({ success: false, message: error.message || "Checkout failed." });
  } finally {
    if (session) {
      session.endSession();
    }
  }
};
