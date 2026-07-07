import mongoose from "mongoose";

const yearlyLookbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  year: {
    type: Number,
    required: true
  },
  metrics: {
    topGenres: { type: [String], default: [] },
    topAuthors: { type: [String], default: [] },
    readingMinutes: { type: Number, default: 0 },
    moneySaved: { type: Number, default: 0 },
    totalPagesRead: { type: Number, default: 0 }
  },
  persona: {
    type: String,
    required: true
  },
  shareableUrlToken: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to prevent duplicate user-year entries
yearlyLookbackSchema.index({ userId: 1, year: 1 }, { unique: true });

const YearlyLookback = mongoose.model("YearlyLookback", yearlyLookbackSchema);

export default YearlyLookback;
