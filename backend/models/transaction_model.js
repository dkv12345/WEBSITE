import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  paymentProvider: { 
    type: String, 
    default: 'Stripe' 
  },
  providerSessionId: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'success', 'failed'], 
    default: 'pending' 
  }
}, { timestamps: true });

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema, 'transactions');
