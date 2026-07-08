import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import BookCard from "../ui/BookCard";

export default function GenreBooksView({ 
  genreBooks, selectedGenre, genreBooksLoading, genreBooksError, 
  genreBooksPage, genreBooksTotal, fetchGenreBooks, handleBackToHome,
  liked, toggleLike, addedToCart, handleAddToCart, handleBookClick, setBrokenImages
}) {
  const totalPages = Math.ceil(genreBooksTotal / 50);

  // Hàm hỗ trợ cuộn lên đầu trang
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Hàm xử lý chuyển trang
  const handlePageChange = (newPage) => {
    fetchGenreBooks(selectedGenre, newPage);
    scrollToTop();
  };

  // Hàm xử lý quay về trang chủ
  const handleHomeClick = () => {
    handleBackToHome();
    scrollToTop();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8 min-h-[50vh]"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-[#ffffff]/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 bg-[#D49B00] rounded-none" />
          <h2 className="text-2xl font-serif text-[#ffffff] uppercase tracking-wide">
            {selectedGenre}
          </h2>
        </div>
        <button
          onClick={handleHomeClick}
          className="text-xs font-bold text-gray-500 hover:text-[#5C1E1A] bg-stone-100 px-4 py-2 rounded-full transition-all"
        >
          Return Home
        </button>
      </div>

      {/* Grid Display */}
      {genreBooksLoading ? (
        <div className="flex flex-col items-center py-24 text-[#ffffff]">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="font-serif italic">Turning pages...</p>
        </div>
      ) : genreBooks.length > 0 ? ( 
        <div className="space-y-8">
          {/* Stats Bar */}
          <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest text-[#ffffff] ">
            <span>Showing {((genreBooksPage - 1) * 50) + 1} - {Math.min(genreBooksPage * 50, genreBooksTotal)} of {genreBooksTotal} books</span>
            <span>{genreBooksTotal} books in {selectedGenre}</span>
          </div>

          {/* Book Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {genreBooks.map((book, idx) => (
              <motion.div key={book._id} whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                <BookCard
                  book={book}
                  index={idx}
                  liked={liked}
                  toggleLike={toggleLike}
                  addedToCart={addedToCart}
                  handleAddToCart={handleAddToCart}
                  handleBookClick={handleBookClick}
                  setBrokenImages={setBrokenImages}
                />
              </motion.div>
            ))}
          </div>

          {/* Fairytale Pagination */}
          <div className="flex items-center justify-center gap-6 pt-12">
            <button
              onClick={() => handlePageChange(genreBooksPage - 1)}
              disabled={genreBooksPage === 1}
              className="p-3 rounded-full border border-[#ffffff] hover:border-[#ffffff] text-[#ffffff] disabled:opacity-30 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <span className="font-serif text-lg text-[#ffffff] min-w-[80px] text-center">
              {genreBooksPage} / {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(genreBooksPage + 1)}
              disabled={genreBooksPage === totalPages}
              className="p-3 rounded-full border border-stone-300 hover:border-[#ffffff] text-stone-600 disabled:opacity-30 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 font-serif text-stone-500 italic">No books found in this chapter.</div>
      )}
    </motion.div>
  );
}