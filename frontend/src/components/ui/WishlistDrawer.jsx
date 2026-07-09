import React from "react";
import { motion } from "framer-motion";
import { X, Heart, Trash2, ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react";

export default function WishlistDrawer({
  isWishlistDrawerOpen,
  closeWishlistDrawer,
  wishlistItems = [],
  toggleLike,
  handleAddToCart,
  handleBookClick,
  setDetailedBookId
}) {
  const handleViewDetail = (book) => {
    closeWishlistDrawer();
    if (setDetailedBookId) {
      setDetailedBookId(book._id);
    } else if (handleBookClick) {
      handleBookClick(book);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeWishlistDrawer}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs cursor-pointer"
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        {/* Drawer container panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="w-screen max-w-md bg-[#F7EFE1] shadow-2xl flex flex-col border-l border-[#C9A227]/30 text-[#211B2E]"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#C9A227]/25 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <h2 className="text-xl font-bold tracking-tight uppercase font-cinzel-lbl">
                Your Wishlist
              </h2>
            </div>
            <button
              onClick={closeWishlistDrawer}
              className="p-1 rounded-full hover:bg-[#EDE6D6] text-[#211B2E]/60 hover:text-[#211B2E] transition-colors cursor-pointer"
              aria-label="Close wishlist drawer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Wishlist list content area */}
          <div className="flex-grow overflow-y-auto px-6 py-4 scrollbar-thin">
            {wishlistItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 gap-4">
                <div className="w-16 h-16 bg-[#EDE6D6] rounded-full flex items-center justify-center border border-[#C9A227]/20">
                  <Heart className="w-8 h-8 text-[#211B2E]/40" />
                </div>
                <div>
                  <h3 className="text-base font-bold uppercase tracking-wide">
                    Your wishlist is empty
                  </h3>
                  <p className="text-xs text-[#211B2E]/60 mt-1">
                    Save your favorite books to read them later.
                  </p>
                </div>
                <button
                  onClick={closeWishlistDrawer}
                  className="mt-2 px-5 py-2.5 bg-[#211B2E] hover:bg-[#211B2E]/90 text-[#F7EFE1] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer rounded-md"
                >
                  Explore Books
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlistItems.map((book) => {
                  const coverImage =
                    book.images?.medium ||
                    book.images?.small ||
                    book.images?.large ||
                    "https://placehold.co/100x150?text=No+Cover";

                  return (
                    <motion.div
                      layout
                      key={book._id}
                      className="flex gap-4 p-3 bg-white/50 border border-[#C9A227]/10 hover:border-[#C9A227]/25 transition-all shadow-2xs relative group rounded-md"
                    >
                      {/* Image cover */}
                      <div 
                        onClick={() => handleViewDetail(book)}
                        className="w-16 aspect-[2/3] shrink-0 border border-[#211B2E]/10 bg-[#EDE6D6]/40 flex items-center justify-center overflow-hidden shadow-2xs cursor-pointer rounded-sm"
                      >
                        <img
                          src={coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-grow flex flex-col justify-between pr-8">
                        <div 
                          onClick={() => handleViewDetail(book)}
                          className="cursor-pointer"
                        >
                          <h4 className="text-xs font-black line-clamp-1 text-[#211B2E] hover:text-[#C9A227] transition-colors">
                            {book.title}
                          </h4>
                          <p className="text-[10px] text-[#211B2E]/60 font-semibold mt-0.5">
                            {book.author}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-bold font-mono text-[#211B2E]">
                            ${book.price?.toFixed(2)}
                          </span>

                          {/* Quick Add to Cart button */}
                          <button
                            onClick={() => {
                              handleAddToCart(book._id, 1);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 bg-cta-gradient hover:bg-cta-gradient-hover text-white text-[9px] font-bold uppercase rounded-sm shadow-xs transition-all cursor-pointer"
                            title="Add to cart"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => toggleLike(book._id)}
                        className="absolute top-2 right-2 p-1 rounded-sm text-[#211B2E]/40 hover:text-red-600 hover:bg-red-50/50 transition-colors cursor-pointer"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Area */}
          {wishlistItems.length > 0 && (
            <div className="px-6 py-5 border-t border-[#C9A227]/25 bg-[#EDE6D6]/40 flex flex-col gap-4">
              <button
                onClick={closeWishlistDrawer}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#211B2E] hover:bg-[#211B2E]/90 text-[#F7EFE1] text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer rounded-md"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
