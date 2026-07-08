import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import vintageBg from "../../images/vintage4.jpg"; // Import ảnh vintage

export default function BookCard({
  book,
  index = 0,
  liked = {},
  toggleLike,
  addedToCart = {},
  handleAddToCart,
  handleBookClick,
  setSelectedBook,
  setBrokenImages
}) {
  if (!book) return null;
  const primaryGenre = book.genres?.[0] || "General";

  const handleCardClick = (e) => {
    e.stopPropagation();
    if (typeof setSelectedBook === 'function') {
      setSelectedBook(book);
    } else if (handleBookClick) {
      handleBookClick(book, index + 1);
    }
  };

  return (
    <div 
      className="group rounded-none border border-gray-100 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col overflow-hidden p-3.5 relative h-full"
      style={{ backgroundImage: `url(${vintageBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Favorite button */}
      <button 
        onClick={(e) => { e.stopPropagation(); toggleLike(book._id); }}
        className="absolute top-5 right-5 z-20 w-8 h-8 rounded-none bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-sm text-gray-400 hover:text-red-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        <Heart className={`w-4 h-4 ${liked[book._id] ? "fill-red-500 text-red-500" : ""}`} />
      </button>

      {/* Cover image */}
      <div 
        onClick={handleCardClick}
        className="w-full aspect-[3/4] bg-gray-50 rounded-none overflow-hidden relative cursor-pointer mb-4 select-none"
      >
        <motion.img 
          layoutId={`book-cover-${book._id}`}
          src={book.images?.medium || book.images?.large || "https://placehold.co/300x400?text=No+Cover"} 
          alt={book.title}
          onError={() => {
            setBrokenImages(prev => new Set(prev).add(book._id));
          }}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(255,255,255,0.08)_0%,_rgba(0,0,0,0.15)_3%,_rgba(255,255,255,0.1)_5%,_rgba(0,0,0,0)_12%)] pointer-events-none" />
      </div>

      {/* Info */}
      <div className="flex-grow flex flex-col text-center space-y-1.5 px-1">
        <div>
          <span className="text-[10px] font-cinzel-lbl text-gold bg-gold/5 border border-gold/20 px-2 py-0.5 rounded-none uppercase tracking-wider">
            {primaryGenre}
          </span>
        </div>
        
        <button 
          onClick={handleCardClick}
          className="text-sm font-bold text-gray-900 line-clamp-2 hover:text-gold cursor-pointer transition-colors pt-1 min-h-[40px] leading-snug font-display text-center w-full"
        >
          {book.title}
        </button>
        
        <p className="text-[11px] text-gray-400 font-medium truncate">
          by {book.author || "Unknown Author"}
        </p>

        <div className="flex items-center justify-center gap-2 pt-1.5 pb-2">
          <span className="text-base font-black text-gray-900 font-mono">${book.price?.toFixed(2)}</span>
          {book.oldPrice && (
            <span className="text-xs font-bold text-gray-300 line-through font-mono">${book.oldPrice?.toFixed(2)}</span>
          )}
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        onClick={(e) => { e.stopPropagation(); handleAddToCart(book._id); }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        className={`w-full h-9 rounded-sm font-bold text-xs uppercase tracking-wider transition-all mt-auto flex items-center justify-center border-2 cursor-pointer ${
          addedToCart[book._id] 
            ? "bg-emerald-50 border-emerald-500 text-emerald-600 animate-pulse" 
            : "bg-white border-gold text-gold hover:bg-gold hover:text-white"
        }`}
      >
        <span>{addedToCart[book._id] ? "Added" : "Add to Cart"}</span>
      </motion.button>
    </div>
  );
}