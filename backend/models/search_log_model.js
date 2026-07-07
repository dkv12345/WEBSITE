import mongoose from "mongoose";

const searchLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  query: {
    type: String,
    trim: true
  },
  intent: {
    type: String,
    default: "general"
  },
  resultsCount: {
    type: Number,
    default: 0
  },
  sessionId: { 
    type: String 
  },
  presentedItemIds: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book' 
  }],
  pageType: { 
    type: String,
    enum: ["Homepage", "Book Detail"] 
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// Optimization for queries on users and sorting by timestamp
searchLogSchema.index({ userId: 1 });
searchLogSchema.index({ timestamp: -1 });

export const SearchLog = mongoose.model("SearchLog", searchLogSchema, "search_logs");
