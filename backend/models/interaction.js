import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  bookId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book', 
    required: true 
  },
  interactionType: { 
    type: String, 
    enum: ['view_details', 'add_to_wishlist', 'add_to_cart', 'purchase'], 
    required: true 
  },
  implicitWeight: { 
    type: Number, 
    required: true 
  },
  metadata: {
    session_id: { type: String, default: "" },
    dwell_time_seconds: { type: Number, default: 0 }
  },
  timestamp: { 
    type: Date, 
    required: true,
    default: Date.now 
  }
}, { timestamps: true });

// Compound Index to support fast time-decay behavior scanning
interactionSchema.index({ userId: 1, bookId: 1, timestamp: -1 });
interactionSchema.index({ interactionType: 1 });

export const Interaction = mongoose.model('Interaction', interactionSchema, 'interactions');