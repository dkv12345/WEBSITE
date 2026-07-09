import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import vintageBg from "../../images/card3.jpg"; 

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

  // SVG cho hiệu ứng giấy xé (Tear Effect)
  const tearMask = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cpath d='M0 0h200v200H0z' fill='%23000'/%3E%3Cpath d='M0 10c5 5 10 0 15 5s5 10 15 10 10-5 15 0 5 10 15 10 10-5 15 0 5 10 15 10 10-5 15 0 5 10 15 10 10-5 15 0 5 10 15 10 10-5 15 0' fill='%23fff'/%3E%3C/svg%3E")`;

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
      className="group transition-all duration-300 flex flex-col p-3.5 relative h-full bg-cover bg-center rounded-lg overflow-hidden border border-[#C9A227]/25 shadow-sm hover:shadow-lg hover:shadow-[#C9A227]/10 hover:-translate-y-1"
      style={{ 
        backgroundImage: `url(${vintageBg})`,
        // Áp dụng mặt nạ giấy xé
        WebkitMaskImage: `linear-gradient(to bottom, black 95%, transparent 100%), linear-gradient(to right, black 95%, transparent 100%)`,
        maskImage: `linear-gradient(to bottom, black 95%, transparent 100%), linear-gradient(to right, black 95%, transparent 100%)`,
      }}
    >
      {/* Favorite button */}
      <button 
        onClick={(e) => { e.stopPropagation(); toggleLike(book._id); }}
        className="absolute top-5 right-5 z-20 w-8 h-8 flex items-center justify-center shadow-sm text-[#211B2E]/60 hover:text-red-500 hover:scale-105 active:scale-95 transition-all cursor-pointer bg-[#EDE6D6]/80 hover:bg-[#EDE6D6] border border-[#C9A227]/20 rounded-full"
      >
        <Heart className={`w-4 h-4 ${liked[book._id] ? "fill-red-500 text-red-500" : ""}`} />
      </button>

      <div 
        onClick={handleCardClick}
        className="w-full aspect-[3/4] bg-[#EDE6D6]/40 overflow-hidden relative cursor-pointer mb-4 shadow-inner rounded-lg"
      >
        <motion.img 
          layoutId={`book-cover-${book._id}`}
          src={book.images?.medium || book.images?.large || "https://placehold.co/300x400?text=No+Cover"} 
          alt={book.title}
          onError={() => setBrokenImages(prev => new Set(prev).add(book._id))}
          className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 rounded-lg"
        />
      </div>

      {/* Info */}
      <div className="flex-grow flex flex-col text-center space-y-1.5 px-1">
        <span className="text-[9px] font-bold text-gold uppercase tracking-widest">
          {primaryGenre}
        </span>
        
        <button 
          onClick={handleCardClick}
          className="text-sm font-bold text-gray-900 line-clamp-2 hover:text-gold transition-colors font-display"
        >
          {book.title}
        </button>
        
        <p className="text-[10px] text-gray-500 italic">
          {book.author || "Unknown"}
        </p>

        <div className="pt-2">
          <span className="text-sm font-black text-gray-900">${book.price?.toFixed(2)}</span>
        </div>
      </div>

      <motion.button
        onClick={(e) => { e.stopPropagation(); handleAddToCart(book._id); }}
        whileHover={{ scale: 1.02 }}
        className={`w-full h-8 text-[10px] font-bold uppercase tracking-widest mt-4 border border-[#211B2E] transition-colors rounded-md ${
          addedToCart[book._id] ? "bg-[#211B2E] text-white" : "bg-transparent text-[#211B2E] hover:bg-[#211B2E] hover:text-white"
        }`}
      >
        {addedToCart[book._id] ? "Added ✓" : "Add to Cart"}
      </motion.button>
    </div>
  );
}