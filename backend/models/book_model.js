import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  // ==========================================
  // 1. METADATA
  // ==========================================
  title: { 
    type: String, 
    required: [true, 'Book title is required'],
    trim: true 
  },
  author: { 
    type: String, 
    required: [true, 'Author name is required'],
    trim: true 
  },
  isbn: { 
    type: String, 
    trim: true 
  },
  description: { 
    type: String,
    default: "Description is currently unavailable."
  },
  publisher: { 
    type: String,
    trim: true 
  },
  publishedDate: { 
    type: Date 
  },

  // ==========================================
  // 2. TAXONOMY & DISCOVERY
  // ==========================================
  genres: [{ 
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],

  // ==========================================
  // 3. INVENTORY & PRICING
  // ==========================================
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  stockQuantity: { 
    type: Number, 
    default: 0,
    min: [0, 'Stock quantity cannot be negative'] 
  },
  inStock: { 
    type: Boolean, 
    default: true 
  },

  // ==========================================
  // 4. MEDIA
  // ==========================================
  images: {
    small: { type: String, default: "" },
    medium: { type: String, default: "" },
    large: { type: String, default: "" }
  },

  // ==========================================
  // 5. METRICS (For AI & Ranking)
  // ==========================================
  metrics: {
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    purchaseCount: { type: Number, default: 0 }, 
    viewCount: { type: Number, default: 0 }      
  },

  // ==========================================
  // 6. AI EMBEDDINGS (Semantic Search)
  // ==========================================
  embedding_vector: [{ 
    type: Number 
  }]

}, { 
  timestamps: true 
});

// ==========================================
// INDEXING FOR OPTIMAL PERFORMANCE
// ==========================================
bookSchema.index({ inStock: 1, genres: 1 });
bookSchema.index({ price: 1 });
bookSchema.index({ 'metrics.purchaseCount': -1 });
bookSchema.index({ title: 'text', author: 'text' });

export const Book = mongoose.model('Book', bookSchema);