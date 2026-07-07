import { Book } from "../models/book_model.js";
import { Interaction } from "../models/interaction.js";
import { RecommendationCache } from "../models/recommendation_cache.js";
import { SearchLog } from "../models/search_log_model.js";
import { User } from "../models/user_model.js";
import mongoose from "mongoose";

export const getRecommendations = async (req, res) => {
  try {
    // 1. Get userId. Support both authenticated req.userId and query parameter (for testing)
    const userId = req.userId || req.query.userId;
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing userId. Must be authenticated or provide userId query parameter." 
      });
    }

    // Capture Page Context
    const pageType = req.query.pageType || "Homepage";
    const itemId = req.query.itemId || "";
    
    // For Book Detail page context, we bypass the static homepage cache to generate dynamic item-to-item recommendations
    const forceRefresh = req.query.refresh === "true" || pageType === "Book Detail";
    const aiEngineUrl = process.env.AI_ENGINE_URL || "http://127.0.0.1:8000";

    const canUseObjectId = mongoose.isValidObjectId(userId);
    const [user, latestInteraction, interactionCount] = await Promise.all([
      canUseObjectId
        ? User.findById(userId).select("preferences onboardingCompleted").lean()
        : null,
      mongoose.isValidObjectId(userId)
        ? Interaction.findOne({ userId }).sort({ updatedAt: -1, timestamp: -1 }).select("updatedAt timestamp").lean()
        : null,
      canUseObjectId ? Interaction.countDocuments({ userId }) : 0
    ]);

    // 2. Check recommendation cache unless forced refresh
    let cachedData = null;
    if (!forceRefresh) {
      cachedData = await RecommendationCache.findOne({ userId }).lean();
    }

    let recommendedBookIds = [];
    let source = "cache";
    const latestInteractionAt = latestInteraction?.updatedAt || latestInteraction?.timestamp || null;
    const cacheBuiltAt = cachedData?.updatedAt || cachedData?.createdAt || null;
    const cacheIsStale = Boolean(
      cachedData &&
      latestInteractionAt &&
      cacheBuiltAt &&
      new Date(latestInteractionAt).getTime() > new Date(cacheBuiltAt).getTime()
    );
    const cachedRecommendations = cachedData?.recommendations || cachedData?.bookIds || [];

    if (!cacheIsStale && cachedRecommendations.length > 0) {
      recommendedBookIds = cachedRecommendations;
    } else {
      source = "ai_engine";
      console.log(`[RecommendationController] Cache miss/stale or refresh requested for user ${userId} (Page: ${pageType}). Fetching from AI Engine...`);
      
      // Call Python AI Engine for recommendations with dynamic context
      const aiEndpoint = `${aiEngineUrl}/api/v1/recommend?userId=${userId}&pageType=${encodeURIComponent(pageType)}` + 
                         (itemId ? `&itemId=${encodeURIComponent(itemId)}` : "");
      
      const aiResponse = await fetch(aiEndpoint);
      
      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        throw new Error(`AI Engine error (${aiResponse.status}): ${errorText}`);
      }

      recommendedBookIds = await aiResponse.json();

      if (!Array.isArray(recommendedBookIds)) {
        throw new Error("Invalid response format from AI Engine. Expected array of book IDs.");
      }

      // Save/Update the cache only if it's a Homepage recommendation (expires in 24 hours)
      if (pageType === "Homepage") {
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await RecommendationCache.findOneAndUpdate(
          { userId },
          { recommendations: recommendedBookIds, expiresAt },
          { upsert: true, new: true }
        );
      }
    }

    // 3. Fetch full book details, excluding heavy embedding vectors
    const books = await Book.find({ _id: { $in: recommendedBookIds } })
      .select("-embedding_vector")
      .lean();

    // Preserve the original order returned by the AI recommendation engine
    const bookMap = new Map();
    books.forEach(book => {
      bookMap.set(book._id.toString(), book);
    });

    const orderedBooks = recommendedBookIds
      .map(id => bookMap.get(id.toString()))
      .filter(Boolean); // Filter out any book that might not exist in database anymore

    // 4. Asynchronous Slate Impression Logging (Phase 4 Branch 2 - Non-blocking)
    const sessionId = req.headers["x-session-id"] || req.query.sessionId || req.cookies?.token || "session_" + Date.now();
    
    // Dispatch async log write without waiting for its completion
    SearchLog.create({
      sessionId,
      userId: mongoose.isValidObjectId(userId) ? new mongoose.Types.ObjectId(userId) : null,
      presentedItemIds: recommendedBookIds.filter(id => mongoose.isValidObjectId(id)).map(id => new mongoose.Types.ObjectId(id)),
      pageType,
      timestamp: new Date()
    }).catch(err => console.error("[RecommendationController] Asynchronous SearchLog error:", err));

    // Return the response immediately to the client (Phase 4 Branch 1)
    res.status(200).json({
      success: true,
      source,
      personalizationMode: interactionCount > 0 ? "behavioral" : "onboarding",
      reason: interactionCount > 0
        ? "Based on your browsing, cart, and purchase activity."
        : user?.preferences
          ? "Based on your onboarding genres, authors, and budget."
          : "Based on popular catalog signals.",
      count: orderedBooks.length,
      data: orderedBooks
    });

  } catch (error) {
    console.error("Error in Recommendation Controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving recommendations",
      error: error.message
    });
  }
};

export const logRecommendationClick = async (req, res) => {
  try {
    const userId = req.userId;
    const { bookId, position, pageType = "Homepage" } = req.body;

    if (!userId) {
      return res.status(204).send();
    }

    if (!mongoose.isValidObjectId(bookId)) {
      return res.status(400).json({ success: false, message: "Invalid bookId" });
    }

    await Interaction.create({
      userId,
      bookId,
      interactionType: "view_details",
      implicitWeight: 1.0,
      metadata: {
        session_id: req.headers["x-session-id"] || req.cookies?.token || "",
        rank_position: Number.isFinite(Number(position)) ? Number(position) : 0,
        page_type: pageType
      },
      timestamp: new Date()
    });

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("[RecommendationController] Click logging error:", error);
    res.status(500).json({ success: false, message: "Unable to log recommendation click" });
  }
};
