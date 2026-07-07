import crypto from "crypto";
import { User } from "../models/user_model.js";
import { Order } from "../models/order_model.js";
import { Interaction } from "../models/interaction.js";
import YearlyLookback from "../models/yearly_lookback_model.js";

export const generateYearlyLookbackForUser = async (userId, year) => {
  const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
  const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

  // 1. Calculate Money Saved
  const orderSummary = await Order.aggregate([
    {
      $match: {
        userId: userId,
        status: "paid",
        createdAt: { $gte: startOfYear, $lte: endOfYear }
      }
    },
    {
      $group: {
        _id: null,
        moneySaved: { $sum: "$discountAmount" }
      }
    }
  ]);
  const moneySaved = orderSummary[0]?.moneySaved || 0;

  // 2. Calculate Page count, Reading Minutes, and Purchased Authors list
  const purchaseDetails = await Order.aggregate([
    {
      $match: {
        userId: userId,
        status: "paid",
        createdAt: { $gte: startOfYear, $lte: endOfYear }
      }
    },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "books",
        localField: "items.bookId",
        foreignField: "_id",
        as: "bookDetails"
      }
    },
    { $unwind: { path: "$bookDetails", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: null,
        totalPagesRead: {
          $sum: {
            $multiply: [
              { $ifNull: ["$bookDetails.pageCount", 280] }, // default fallback 280 pages
              "$items.quantity"
            ]
          }
        },
        authors: { $push: "$bookDetails.author" }
      }
    }
  ]);

  const totalPagesRead = purchaseDetails[0]?.totalPagesRead || 0;
  const readingMinutes = Math.round(totalPagesRead * 1.5);

  // Compile top authors from purchases list
  const authorList = purchaseDetails[0]?.authors || [];
  const authorCounts = {};
  authorList.forEach((author) => {
    if (author) {
      authorCounts[author] = (authorCounts[author] || 0) + 1;
    }
  });
  const topAuthors = Object.entries(authorCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([author]) => author)
    .slice(0, 5);

  // 3. Compile top genres based on user interactions list
  const genreAggregation = await Interaction.aggregate([
    {
      $match: {
        userId: userId,
        timestamp: { $gte: startOfYear, $lte: endOfYear }
      }
    },
    {
      $lookup: {
        from: "books",
        localField: "bookId",
        foreignField: "_id",
        as: "bookDetails"
      }
    },
    { $unwind: { path: "$bookDetails", preserveNullAndEmptyArrays: true } },
    { $unwind: { path: "$bookDetails.genres", preserveNullAndEmptyArrays: true } },
    {
      $match: {
        "bookDetails.genres": { $ne: null }
      }
    },
    {
      $group: {
        _id: "$bookDetails.genres",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);
  const topGenres = genreAggregation.map((item) => item._id);

  // 4. Calculate Reading Persona
  let persona = "The Explorer";
  if (totalPagesRead > 5000) {
    persona = "The Bookworm";
  } else {
    const totalGenreInteractions = genreAggregation.reduce((acc, curr) => acc + curr.count, 0);
    if (totalGenreInteractions > 0) {
      const fictionCount = genreAggregation
        .filter((g) => ["fiction", "fantasy", "novel", "romance", "adventure"].includes(g._id.toLowerCase()))
        .reduce((acc, curr) => acc + curr.count, 0);
      const businessCount = genreAggregation
        .filter((g) => ["business", "finance", "economics", "self-help", "marketing"].includes(g._id.toLowerCase()))
        .reduce((acc, curr) => acc + curr.count, 0);

      if (fictionCount / totalGenreInteractions > 0.5) {
        persona = "The Dreamer";
      } else if (businessCount / totalGenreInteractions > 0.5) {
        persona = "The Hustler";
      }
    }
  }

  // Create unique URL token if not already existing
  const shareableUrlToken = crypto.randomBytes(16).toString("hex");

  return {
    metrics: {
      topGenres,
      topAuthors,
      readingMinutes,
      moneySaved,
      totalPagesRead
    },
    persona,
    shareableUrlToken
  };
};

export const runYearlyLookbackBatchPipeline = async () => {
  const currentYear = new Date().getFullYear();
  console.log(`[YearlyLookbackJob] Starting batch pipeline execution for year ${currentYear}...`);

  let processedCount = 0;
  let errorCount = 0;

  try {
    // Stream users cursor to avoid Out-Of-Memory (OOM) errors on large collections
    const userCursor = User.find({}, { _id: 1 }).cursor();

    for (let user = await userCursor.next(); user != null; user = await userCursor.next()) {
      try {
        const uId = user._id;

        // Generate analytics metrics
        const lookbackData = await generateYearlyLookbackForUser(uId, currentYear);

        // Perform atomic upsert (prevents duplicate runs for user/year combination)
        await YearlyLookback.findOneAndUpdate(
          { userId: uId, year: currentYear },
          {
            $set: {
              metrics: lookbackData.metrics,
              persona: lookbackData.persona
            },
            $setOnInsert: {
              shareableUrlToken: lookbackData.shareableUrlToken
            }
          },
          { upsert: true, new: true }
        );

        processedCount++;
      } catch (err) {
        console.error(`[YearlyLookbackJob] Failed to process lookback metrics for user ${user._id}:`, err);
        errorCount++;
      }
    }

    console.log(`[YearlyLookbackJob] Batch job completed. Successfully processed: ${processedCount}, Errors: ${errorCount}`);
  } catch (globalErr) {
    console.error("[YearlyLookbackJob] Fatal error during lookback cursor stream execution:", globalErr);
  }
};
