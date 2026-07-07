import YearlyLookback from "../models/yearly_lookback_model.js";
import { generateYearlyLookbackForUser } from "../services/yearly_lookback_service.js";

export const getYearlyLookback = async (req, res) => {
  try {
    const userId = req.userId;
    const year = 2026; // Current year

    // Check if lookback is already cached in database
    let lookback = await YearlyLookback.findOne({ userId, year }).populate("userId", "name email");

    // If not found, dynamically compile on-the-fly and save
    if (!lookback) {
      console.log(`[LookbackAPI] Lookback cache miss for user ${userId}. Generating on-the-fly...`);
      const compiled = await generateYearlyLookbackForUser(userId, year);
      lookback = await YearlyLookback.create({
        userId,
        year,
        metrics: compiled.metrics,
        persona: compiled.persona,
        shareableUrlToken: compiled.shareableUrlToken
      });
      lookback = await YearlyLookback.findById(lookback._id).populate("userId", "name email");
    }

    return res.status(200).json({
      success: true,
      data: lookback
    });
  } catch (err) {
    console.error("[LookbackAPI] Error retrieving yearly lookback:", err);
    return res.status(500).json({
      success: false,
      message: "Server error retrieving annual lookback.",
      error: err.message
    });
  }
};

export const getShareableLookback = async (req, res) => {
  try {
    const { token } = req.params;
    const lookback = await YearlyLookback.findOne({ shareableUrlToken: token }).populate("userId", "name");
    
    if (!lookback) {
      return res.status(404).json({
        success: false,
        message: "Shareable lookback link not found or expired."
      });
    }

    return res.status(200).json({
      success: true,
      data: lookback
    });
  } catch (err) {
    console.error("[LookbackAPI] Error loading public lookback:", err);
    return res.status(500).json({
      success: false,
      message: "Server error retrieving shared lookback."
    });
  }
};
