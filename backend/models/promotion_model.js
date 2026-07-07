import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    uppercase: true 
  },
  discountPercentage: { 
    type: Number, 
    required: true,
    min: 0,
    max: 100 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  expiryDate: { 
    type: Date 
  }
}, { timestamps: true });

export const Promotion = mongoose.models.Promotion || mongoose.model('Promotion', promotionSchema, 'promotions');
