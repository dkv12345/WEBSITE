import Stripe from "stripe";
import { Order } from "../models/order_model.js";
import { Transaction } from "../models/transaction_model.js";
import { Promotion } from "../models/promotion_model.js";
import { Cart } from "../models/cart_model.js";
import { Book } from "../models/book_model.js";
import { Interaction } from "../models/interaction.js";
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_51placeholder");

// 1. Create Stripe Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.userId;
    const { promoCode } = req.body;

    // A. Fetch active cart
    const cart = await Cart.findOne({ userId, status: "active" }).populate("items.bookId");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Your shopping cart is empty." });
    }

    // Filter null book references
    cart.items = cart.items.filter(item => item.bookId != null);

    // B. Calculate financial details
    const subtotal = cart.items.reduce((sum, item) => sum + (item.bookId.price * item.quantity), 0);
    let discountAmount = 0;
    let discountPct = 0;

    // Validate promo code if provided
    if (promoCode) {
      const promotion = await Promotion.findOne({ code: promoCode.toUpperCase(), isActive: true });
      if (promotion) {
        // Verify expiry
        if (!promotion.expiryDate || new Date(promotion.expiryDate) > new Date()) {
          discountPct = promotion.discountPercentage;
          discountAmount = subtotal * (discountPct / 100);
        }
      }
    }

    const taxAmount = (subtotal - discountAmount) * 0.08; // 8% standard tax
    const finalTotal = subtotal - discountAmount + taxAmount;

    // C. Create pending Order record
    const order = new Order({
      userId,
      cartId: cart._id,
      items: cart.items.map(item => ({
        bookId: item.bookId._id,
        quantity: item.quantity,
        priceAtAdded: item.bookId.price
      })),
      subtotal,
      discountAmount,
      finalTotal,
      status: "pending"
    });
    await order.save();

    // D. Attempt to create Stripe Session
    try {
      const lineItems = cart.items.map(item => {
        // Apply discount proportionally to unit price if discount exists
        const discountedPrice = item.bookId.price * (1 - (discountPct / 100));
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.bookId.title,
              description: `by ${item.bookId.author}`
            },
            unit_amount: Math.round(discountedPrice * 100) // Stripe expects unit amount in cents
          },
          quantity: item.quantity
        };
      });

      // Add tax line item if tax amount is greater than 0
      if (taxAmount > 0) {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: "Sales Tax (8%)"
            },
            unit_amount: Math.round(taxAmount * 100)
          },
          quantity: 1
        });
      }

      // Idempotency Key dựa trên orderId: đảm bảo cùng 1 đơn không bao giờ bị charge 2 lần
      const idempotencyKey = `checkout_${order._id.toString()}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/cart?checkout_status=success&orderId=${order._id}`,
        cancel_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/cart?checkout_status=cancel&orderId=${order._id}`,
        metadata: {
          orderId: order._id.toString(),
          userId: userId.toString()
        }
      }, { idempotencyKey }); // <-- CHỐNG DOUBLE CHARGE: Stripe sẽ trả về session cũ thay vì tạo mới

      // E. Save Transaction record
      const transaction = new Transaction({
        orderId: order._id,
        userId,
        paymentProvider: "Stripe",
        providerSessionId: session.id,
        status: "pending"
      });
      await transaction.save();

      return res.status(200).json({
        success: true,
        paymentURL: session.url
      });

    } catch (stripeError) {
      console.warn("[CheckoutController] Stripe API call failed. Activating mock sandbox checkout fallback. Reason:", stripeError.message);
      
      // Sandbox mode: Create mock transaction session and return mock redirect URL
      const mockSessionId = "mock_session_" + Date.now();
      const transaction = new Transaction({
        orderId: order._id,
        userId,
        paymentProvider: "Stripe",
        providerSessionId: mockSessionId,
        status: "pending"
      });
      await transaction.save();

      const mockPaymentUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/checkout?mock_mode=true&orderId=${order._id}`;
      return res.status(200).json({
        success: true,
        paymentURL: mockPaymentUrl,
        message: "Stripe connection offline. Mock checkout redirect created."
      });
    }

  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ success: false, message: "Server error creating checkout session." });
  }
};

// 2. Stripe Webhook (Production verification)
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || "whsec_placeholder");
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle transaction states
  const session = event.data.object;
  const orderId = session.metadata?.orderId;

  if (event.type === "checkout.session.completed") {
    console.log(`[StripeWebhook] Payment Completed for Order: ${orderId}`);
    await handlePaymentSuccess(orderId, session.id);
  } else if (event.type === "checkout.session.expired" || event.type === "payment_intent.payment_failed") {
    console.log(`[StripeWebhook] Payment Failed for Order: ${orderId}`);
    await handlePaymentFailure(orderId, session.id);
  }

  res.json({ received: true });
};

// Helper: Handle successful payment state changes
const handlePaymentSuccess = async (orderId, sessionId) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // 1. Update Order status
    const order = await Order.findOneAndUpdate(
      { _id: orderId, status: "pending" },
      { status: "paid" },
      { session, returnDocument: 'after' }
    );
    if (!order) {
      console.warn(`Order ${orderId} already processed or missing.`);
      await session.abortTransaction();
      session.endSession();
      return;
    }

    // 2. Update Transaction status
    await Transaction.updateOne(
      { orderId },
      { status: "success" },
      { session }
    );

    // 3. Convert Cart status
    await Cart.updateOne(
      { _id: order.cartId },
      { status: "converted_to_order" },
      { session }
    );

    // 4. Soft Lock Inventory (reduce stockQuantity)
    for (const item of order.items) {
      await Book.updateOne(
        { _id: item.bookId },
        { $inc: { stockQuantity: -item.quantity } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    // 5. Asynchronous Recommendation logging
    for (const item of order.items) {
      Interaction.create({
        userId: order.userId,
        bookId: item.bookId,
        interactionType: "purchase",
        implicitWeight: 5.0,
        timestamp: new Date()
      }).catch(err => console.error("Error logging purchase interaction:", err));
    }

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error handling payment success:", error);
  }
};

// Helper: Handle failed payment states
const handlePaymentFailure = async (orderId, sessionId) => {
  try {
    await Order.updateOne({ _id: orderId }, { status: "failed" });
    await Transaction.updateOne({ orderId }, { status: "failed" });
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
};

// 3. Mock Payment Webhook Endpoint for instant local developer testing
export const mockWebhookSuccess = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: "Missing orderId" });
    }

    // Execute standard checkout completion logic
    await handlePaymentSuccess(orderId, "mock_session_" + Date.now());

    res.status(200).json({
      success: true,
      message: "Mock payment checkout complete. Inventory updated."
    });
  } catch (error) {
    console.error("Error running mock checkout completion:", error);
    res.status(500).json({ success: false, message: "Mock checkout failed." });
  }
};
