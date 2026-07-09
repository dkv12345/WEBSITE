import { motion } from "framer-motion";
import { Loader2, BookOpen } from "lucide-react";
import BookCard from "../ui/BookCard";

export default function SearchResultsView({ searchResults, isSearching, searchError, searchQuery, activeSearchQuery, liked, toggleLike, addedToCart, handleAddToCart, handleBookClick, setBrokenImages }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto px-4 sm:px-6 py-12 min-h-[50vh]">
      <div className="flex items-center gap-3 border-b border-[#FFFFFF]/30 pb-4 mb-8">
        <div className="w-1.5 h-7 bg-[#D49B00] rounded-full" />
        <h2 className="text-xl font-serif text-[#FFFFFF] uppercase tracking-wide">Search Results for "{searchQuery}"</h2>
      </div>

      {isSearching ? (
        <div className="flex flex-col items-center py-20 text-[#D49B00]"><Loader2 className="animate-spin mb-4" /> <p className="font-serif italic">Searching the archives...</p></div>
      ) : searchResults.length === 0 ? (
        <div className="text-center py-20 text-stone-500 font-serif italic"><BookOpen className="mx-auto mb-4 opacity-30" /> No tales found matching your query.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {searchResults.map((book, idx) => (
            <motion.div key={book._id} whileHover={{ y: -5 }}>
              <BookCard {...{ book, index: idx, liked, toggleLike, addedToCart, handleAddToCart, handleBookClick, setBrokenImages }} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}