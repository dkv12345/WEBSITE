import express from "express";
import { createCheckoutSession, stripeWebhook, mockWebhookSuccess } from "../controllers/checkout_controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Production webhook path - requires raw buffer parsing for signature verification
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// Protected checkouts paths
router.post("/create-session", verifyToken, createCheckoutSession);
router.post("/mock-success", verifyToken, mockWebhookSuccess);

export default router;
