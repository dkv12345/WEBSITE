import { X, Star, Heart, ChevronRight } from "lucide-react";
import cardBackground from "../../images/card3.jpg";

export default function BookPreviewModal({
  selectedBook,
  setSelectedBook,
  liked = {},
  toggleLike,
  addedToCart = {},
  handleAddToCart,
  setDetailedBookId
}) {
  if (!selectedBook) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={() => setSelectedBook(null)}></div>
      
      {/* Chỉ thay đổi style ở đây, giữ nguyên toàn bộ class khác */}
      <div 
        className="rounded-[10px] max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl border border-gray-100 flex flex-col md:flex-row p-6 gap-6 animate-scale-up"
        style={{
          backgroundImage: `url(${cardBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <button 
          onClick={() => setSelectedBook(null)}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cột Trái: Ảnh Sách dạng 3D */}
        <div className="w-full md:w-52 h-72 shrink-0 flex items-center justify-center [perspective:1000px]">
          <div className="relative w-full h-full shadow-[10px_10px_20px_rgba(0,0,0,0.3)] transition-transform duration-500 hover:[transform:rotateY(-10deg)]">
            
            {/* Phần gáy sách (spine) */}
            <div className="absolute left-0 top-0 w-4 h-full bg-gradient-to-r from-[#d2b48c] to-[#a0522d] shadow-inner"></div>
            
            {/* Phần trang sách (pages) */}
            <div className="absolute right-0 top-0 w-2 h-full bg-[#fdfbf7] border-l border-gray-200">
              <div className="w-full h-full bg-[repeating-linear-gradient(to_bottom,transparent,transparent_2px,#e5e7eb_2px,#e5e7eb_4px)]"></div>
            </div>

            {/* Ảnh bìa sách */}
            <img 
              src={selectedBook.images?.medium || selectedBook.images?.large || "https://placehold.co/300x400/e2e8f0/64748b?text=No+Cover"} 
              alt={selectedBook.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/300x400/e2e8f0/64748b?text=No+Cover";
              }}
              className="w-full h-full object-cover relative z-10"
            />
          </div>
        </div>

        {/* Cột Phải: Thông tin chi tiết */}
        <div className="flex flex-col flex-grow justify-between pt-4 md:pt-0">
          <div>
            <span className="text-xs font-bold text-[#D49B00] uppercase tracking-wider">
              {selectedBook.genres?.join(", ") || "General"}
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 mt-1 leading-tight font-serif">
              {selectedBook.title}
            </h2>
            <p className="text-sm font-medium text-gray-500 mt-1">
              by <span className="text-gray-800 font-semibold">{selectedBook.author || "Unknown"}</span>
            </p>

            <div className="flex items-center gap-1.5 mt-3 bg-amber-50/60 border border-amber-100 w-max px-2.5 py-1 rounded-lg">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-bold text-gray-800">{selectedBook.metrics?.averageRating || 0}</span>
              <span className="text-xs text-gray-400">({(selectedBook.metrics?.reviewCount || 0).toLocaleString()} reviews)</span>
            </div>

            <div className="mt-5">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Book Description</h4>
              <p className="text-sm text-gray-600 mt-1.5 leading-relaxed max-h-36 overflow-y-auto pr-1">
                {selectedBook.description || "Cuốn sách tuyệt vời này mang lại những kiến thức sâu sắc và trải nghiệm đọc tuyệt vời về thể loại này. Hãy thêm vào giỏ hàng ngay để khám phá trọn vẹn nội dung."}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 pt-4 border-t border-gray-100 gap-3">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-gray-400">Price</span>
              <span className="text-2xl font-black text-gray-900 font-mono">${selectedBook.price?.toFixed(2) || "0.00"}</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  setDetailedBookId(selectedBook._id);
                  setSelectedBook(null); 
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 sm:flex-none px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1 whitespace-nowrap cursor-pointer"
              >
                <span>Full Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => toggleLike(selectedBook._id)}
                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${liked[selectedBook._id] ? "fill-red-500 text-red-500" : ""}`} />
              </button>
              <button
                onClick={() => handleAddToCart(selectedBook._id)}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                  addedToCart[selectedBook._id] ? "bg-green-500 text-white" : "bg-[#D49B00] text-white hover:bg-amber-600"
                }`}
              >
                {addedToCart[selectedBook._id] ? "Added ✓" : "Add To Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}