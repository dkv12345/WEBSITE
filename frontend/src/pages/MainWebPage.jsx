import { useState, useEffect } from "react";
import { BookOpen, ShoppingCart, Search, Heart, Star, Menu, X, ChevronRight, LogOut, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Các danh mục gợi ý nhanh (Tương ứng với dữ liệu trong DB của bạn)
const categories = ["All", "Fiction", "History", "Poetry", "Cooking", "Biography", "Business"];

export default function MainWebPage() {
  const navigate = useNavigate();
  
  // State quản lý dữ liệu từ Database
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State quản lý giao diện
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);
  const [liked, setLiked] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [addedToCart, setAddedToCart] = useState({});

  // Fetch dữ liệu từ API khi Component Mount hoặc khi ActiveCategory thay đổi
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        // Xây dựng URL động dựa trên category
        let url = "http://localhost:5001/api/books?limit=24";
        if (activeCategory !== "All") {
          url += `&genre=${activeCategory}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu từ máy chủ");
        }
        
        const result = await response.json();
        setBooks(result.data);
      } catch (err) {
        console.error("Lỗi fetch books:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [activeCategory]);

  // Lọc dữ liệu theo Search Box (Lọc ở Frontend)
  const filtered = books.filter((b) => {
    const matchSearch = 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const handleAddToCart = (id) => {
    setCartCount((c) => c + 1);
    setAddedToCart((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setAddedToCart((prev) => ({ ...prev, [id]: false })), 1500);
  };

  const toggleLike = (id) => setLiked((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-screen bg-[#FAFAF8] font-sans">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-[#F16323]" strokeWidth={2.5} />
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">BookHaven</span>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-xl px-4 py-2.5 w-80">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search books or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full ml-2"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:block">Logout</span>
            </button>
            <button className="relative p-2">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#F16323] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="bg-gradient-to-br from-[#F16323] to-orange-400 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-orange-100 text-sm font-semibold tracking-widest uppercase mb-3">Welcome back 👋</p>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Find Your Next<br />Favorite Book
            </h1>
            <p className="text-orange-100 text-base max-w-md mb-6">
              Explore thousands of titles across every genre. From bestsellers to hidden gems.
            </p>
            <button className="bg-white text-[#F16323] font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition-all flex items-center gap-2 shadow-lg">
              Browse All Books <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-4">
            {!loading && books.slice(0, 3).map((b, index) => (
              <div 
                key={b._id} 
                className="w-20 h-28 md:w-28 md:h-40 rounded-xl shadow-2xl overflow-hidden"
                style={{ transform: `rotate(${index % 2 === 0 ? "3deg" : "-2deg"})` }}
              >
                {/* TỐI ƯU ẢNH HERO (Bắt lỗi onError) */}
                <img 
                  src={b.images?.medium || "https://placehold.co/150x200/e2e8f0/64748b?text=No+Cover"} 
                  alt={b.title}
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "https://placehold.co/150x200/e2e8f0/64748b?text=No+Cover";
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? "bg-[#F16323] text-white shadow-md shadow-orange-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin text-[#F16323] mb-4" />
            <p className="text-lg font-semibold">Đang tải sách từ thư viện...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            <p className="text-lg font-semibold">Lỗi: {error}</p>
            <p className="text-sm mt-1">Vui lòng kiểm tra lại kết nối Backend.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filtered.map((book) => (
                <div key={book._id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col h-full">
                  
                  <div className="h-48 relative bg-gray-100 flex items-center justify-center overflow-hidden">
                    {/* TỐI ƯU ẢNH LƯỚI (Bắt lỗi onError) */}
                    <img 
                      src={book.images?.medium || "https://placehold.co/300x400/e2e8f0/64748b?text=No+Cover"} 
                      alt={book.title} 
                      onError={(e) => {
                        e.target.onerror = null; // Chặn lặp vô hạn nếu ảnh thay thế cũng lỗi
                        e.target.src = "https://placehold.co/300x400/e2e8f0/64748b?text=No+Cover";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {book.tags && book.tags.includes("bestseller") && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm">
                        BESTSELLER
                      </span>
                    )}

                    <button
                      onClick={() => toggleLike(book._id)}
                      className="absolute top-2 right-2 p-1.5 bg-white/70 backdrop-blur rounded-full hover:bg-white"
                    >
                      <Heart className={`w-4 h-4 ${liked[book._id] ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
                    </button>
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <span className="text-[10px] font-bold text-[#F16323] uppercase tracking-wider line-clamp-1">
                      {book.genres && book.genres.length > 0 ? book.genres[0] : "General"}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 mt-1 leading-tight line-clamp-2" title={book.title}>
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{book.author}</p>

                    <div className="flex-grow"></div>

                    <div className="flex items-center gap-1 mt-3">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-gray-700">{book.metrics?.averageRating || 0}</span>
                      <span className="text-xs text-gray-400">({(book.metrics?.reviewCount || 0).toLocaleString()})</span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                      <span className="text-base font-extrabold text-gray-900">${book.price?.toFixed(2) || "0.00"}</span>
                      <button
                        onClick={() => handleAddToCart(book._id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                          addedToCart[book._id]
                            ? "bg-green-500 text-white"
                            : "bg-[#F16323] text-white hover:bg-orange-600"
                        }`}
                      >
                        {addedToCart[book._id] ? "Added ✓" : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-semibold">No books found</p>
                <p className="text-sm mt-1">Try a different search or category</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}