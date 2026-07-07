import express from "express";
import { getYearlyLookback, getShareableLookback } from "../controllers/lookback_controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Private route (requires authentication)
router.get("/", verifyToken, getYearlyLookback);

// Public route (accessible via token share link)
router.get("/share/:token", getShareableLookback);

export default router;
