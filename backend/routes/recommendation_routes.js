import express from "express";
import { getRecommendations } from "../controllers/recommendation_controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// GET /api/recommendations
// Uses verifyToken middleware. For testing convenience, if no cookie token exists but userId query parameter is present, it will allow it.
router.get("/", (req, res, next) => {
  if (!req.cookies || !req.cookies.token) {
    if (req.query.userId) {
      return next();
    }
  }
  return verifyToken(req, res, next);
}, getRecommendations);

export default router;
