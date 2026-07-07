import mongoose from "mongoose";

const recommendationCacheSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  recommendations: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book' 
  }],
  expiresAt: { 
    type: Date, 
    required: true
  }
}, { timestamps: true });

// TTL index to automatically expire recommendations after a set time (e.g., 24 hours)
recommendationCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RecommendationCache = mongoose.model('RecommendationCache', recommendationCacheSchema, 'recommendation_caches');
