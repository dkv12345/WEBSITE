import mongoose from "mongoose";

// Schema for individual items in the cart
const cartItemSchema = new mongoose.Schema({
  bookId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    default: 1,
    min: [1, 'Minimum quantity is 1']
  },
  priceAtAdded: { 
    type: Number, 
    required: true 
  }
}, { _id: false }); 

// Main schema for the shopping cart
const cartSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [cartItemSchema],
  status: { 
    type: String, 
    enum: ['active', 'converted_to_order', 'abandoned'], 
    default: 'active' 
  },
  sessionId: { 
    type: String 
  }
}, { timestamps: true });

// Ensure only ONE active cart per user at a time using a partial unique index
cartSchema.index({ userId: 1, status: 1 }, { 
  unique: true, 
  partialFilterExpression: { status: 'active' } 
});

// Create general indexes for fast queries
cartSchema.index({ userId: 1 });
cartSchema.index({ sessionId: 1 });

export const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema, 'carts');