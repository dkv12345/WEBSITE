import { searchService } from "../services/search_service.js";
import jwt from "jsonwebtoken";

// Helper to extract userId optionally if user is authenticated, without blocking guest users
const getOptionalUserId = (req) => {
  try {
    const token = req.cookies?.token;
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded?.userId || null;
  } catch (error) {
    // If token is invalid or expired, just treat as guest search
    return null;
  }
};

export const searchBooks = async (req, res) => {
  try {
    const query = req.query.q;

    // 1. Validation: Ensure query is provided and not just empty spaces
    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query parameter 'q' is required and cannot be empty."
      });
    }

    const userId = getOptionalUserId(req);

    // 2. Perform Hybrid Search
    const results = await searchService.performHybridSearch(query.trim(), userId);

    // 3. Respond with results
    return res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error("[SearchController] Error in searchBooks:", error.message);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred while performing search.",
      error: error.message
    });
  }
};
