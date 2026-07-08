import { useState, useEffect, useRef } from "react";
import { 
  BookOpen, ShoppingCart, Search, Heart, Star, Menu, X, 
  ChevronRight, LogOut, Loader2, User, Clock, Flame, 
  ChevronLeft, ArrowRight, ShieldCheck, Mail, Phone, MapPin, Check, Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import BookDetailPage from "./BookDetailPage"; // Import component BookDetailPage

// Mock data cho thanh tìm kiếm thông minh
const recentSearches = ["Atomic Habits", "The Alchemist", "Sapiens"];
const trendingSearches = ["Fiction", "History", "Business & Finance", "Self-Help"];

// Dữ liệu nội dung slide phần đầu trang (Cập nhật hệ màu Gradient Đa Tầng Cao Cấp)
const heroSlides = [
  {
    title: "Find Your Next Favorite Book",
    subtitle: "Welcome Back !",
    desc: "Explore thousands of titles across every genre. From thrilling fiction to life-changing business insights. Owned by readers, curated by experts.",
    bg: "from-void via-nebula to-[#6B5A1A]", // Thêm dải màu huyền bí huyền ảo pha cam rực rỡ
    badge: "New Release",
    badgeBg: "bg-gold/15 text-gold border-gold/20"
  },
  {
    title: "Upgrade Your Skillset Today",
    subtitle: "Special Promotion",
    desc: "Get up to 30% off on all Business, Finance & Self-Help books during this exclusive summer collection. Knowledge is your best investment.",
    bg: "from-void via-[#2E1F47] to-[#B5651D]", // Gradient hổ phách đậm chất tri thức sang trọng
    badge: "Flash Sale",
    badgeBg: "bg-gold/15 text-gold border-gold/20"
  },
  {
    title: "Expand Your Knowledge Base",
    subtitle: "Editor's Choice",
    desc: "Dive deep into our handpicked masterpieces and best-selling non-fiction titles that are trending worldwide. Discover the untold stories.",
    bg: "from-void via-nebula to-[#B5651D]", // Deep Blue pha trộn rực lửa đầy chiều sâu
    badge: "Trending Now",
    badgeBg: "bg-gold/15 text-gold border-gold/20"
  }
];

export default function MainWebPage() {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // State quản lý dữ liệu từ Database
  const [books, setBooks] = useState([]);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [recommendationMeta, setRecommendationMeta] = useState({
    mode: "catalog",
    source: "fallback",
    reason: "Popular catalog picks while you are browsing as a guest."
  });
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State quản lý giao diện
  const [cartCount, setCartCount] = useState(0);
  const [liked, setLiked] = useState({});
  const [brokenImages, setBrokenImages] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [addedToCart, setAddedToCart] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  const fetchCartCount = async () => {
    try {
      const response = await fetch("/api/cart", { credentials: "include" });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const count = (result.data.items || []).reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(count);
        }
      }
    } catch (err) {
      console.error("Error fetching cart count:", err);
    }
  };
  
  // State quản lý tìm kiếm lai đa tầng
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");

  // State quản lý bộ lọc thể loại từ Database (phân trang)
  const [isCurtainOpening, setIsCurtainOpening] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCurtainOpening(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const [selectedGenre, setSelectedGenre] = useState("");
  const [genreBooks, setGenreBooks] = useState([]);
  const [genreBooksPage, setGenreBooksPage] = useState(1);
  const [genreBooksLoading, setGenreBooksLoading] = useState(false);
  const [genreBooksError, setGenreBooksError] = useState("");
  const [hasMoreGenreBooks, setHasMoreGenreBooks] = useState(true);

  const fetchGenreBooks = async (genreName, pageNum = 1, append = false) => {
    setGenreBooksLoading(true);
    setGenreBooksError("");
    try {
      const limit = 45;
      const response = await fetch(`/api/books?genre=${encodeURIComponent(genreName)}&limit=${limit}&page=${pageNum}`, {
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Failed to load books for this genre.");
      }
      const result = await response.json();
      const fetchedBooks = result.data || [];
      
      if (append) {
        setGenreBooks((prev) => [...prev, ...fetchedBooks]);
      } else {
        setGenreBooks(fetchedBooks);
      }
      
      if (fetchedBooks.length < limit) {
        setHasMoreGenreBooks(false);
      } else {
        setHasMoreGenreBooks(true);
      }
      setGenreBooksPage(pageNum);
    } catch (err) {
      console.error("[Fetch Genre Books] Error:", err.message);
      setGenreBooksError(err.message || "Something went wrong.");
    } finally {
      setGenreBooksLoading(false);
    }
  };

  const handleSelectGenre = (genreName) => {
    setSelectedGenre(genreName);
    setSearchQuery("");
    setSearchResults([]);
    setActiveSearchQuery("");
    setGenreBooks([]);
    setGenreBooksPage(1);
    setHasMoreGenreBooks(true);
    fetchGenreBooks(genreName, 1, false);
  };

  const handleClearGenre = () => {
    setSelectedGenre("");
    setGenreBooks([]);
    setGenreBooksPage(1);
    setHasMoreGenreBooks(true);
  };

  // Điều hướng hiển thị
  const [selectedBook, setSelectedBook] = useState(null); 
  const [detailedBookId, setDetailedBookId] = useState(null); 
  const [detailedBook, setDetailedBook] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
 
  // Điều khiển thanh danh mục thả xuống (Category Menu) & Trạng thái thanh Search bar
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Fetch dữ liệu gốc từ API
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        let url = "/api/books?limit=250"; 
        const response = await fetch(url, { credentials: "include" });
        if (!response.ok) {
          throw new Error("Không thể tải dữ liệu từ máy chủ");
        }
        const result = await response.json();
        setBooks(result.data || result);
      } catch (err) {
        console.error("Lỗi fetch books:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendations = async () => {
      setRecommendationLoading(true);
      try {
        const response = await fetch("/api/recommendations?pageType=Homepage", { credentials: "include" });
        if (response.ok) {
          const result = await response.json();
          setRecommendedBooks(result.data || []);
          setRecommendationMeta({
            mode: result.personalizationMode || "catalog",
            source: result.source || "ai_engine",
            reason: result.reason || "Personalized with your latest BookHaven signals."
          });
        } else {
          console.warn("Lỗi khi tải gợi ý từ máy chủ");
        }
      } catch (err) {
        console.error("Lỗi fetch recommendations:", err);
      } finally {
        setRecommendationLoading(false);
      }
    };

    const checkAuthAndLoad = async () => {
      await fetchBooks();
      try {
        const response = await fetch("/api/auth/check-auth", { credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            setUser(data.user);
            setIsAuthenticated(true);
            await fetchRecommendations();
            await fetchCartCount();
          }
        }
      } catch (err) {
        console.error("Lỗi kiểm tra đăng nhập:", err);
      }
    };

    checkAuthAndLoad();
  }, []);

  // Tự động chạy Slide Hero sau mỗi 4 giây
  useEffect(() => {
    if (detailedBookId) return; 
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [detailedBookId]);

  // Đóng hộp thoại tìm kiếm và dropdown danh mục khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search logic with request cancellation
  useEffect(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchError("");
      setActiveSearchQuery("");
      return;
    }

    // Clear active genre filter when a search is performed
    setSelectedGenre("");

    setIsSearching(true);
    setSearchError("");

    const controller = new AbortController();
    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`, {
          signal: controller.signal
        });
        if (!response.ok) {
          throw new Error("Failed to load search results.");
        }
        const result = await response.json();
        setSearchResults(result.data || []);
        setActiveSearchQuery(trimmedQuery);
      } catch (err) {
        if (err.name === "AbortError") {
          return; // Request was aborted, ignore
        }
        console.error("[Frontend Search] Error:", err.message);
        setSearchError(err.message || "Something went wrong.");
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(delayDebounceFn);
      controller.abort();
    };
  }, [searchQuery]);

  // Lọc ra danh sách thể loại (Genres) duy nhất từ database
  const dynamicGenres = books.reduce((acc, book) => {
    if (book.genres && Array.isArray(book.genres)) {
      book.genres.forEach(g => { if (!acc.includes(g)) acc.push(g); });
    }
    return acc;
  }, []);

  // Thêm sản phẩm vào giỏ hàng thực tế qua API
  const handleAddToCart = async (id) => {
    if (!isAuthenticated) {
      alert("Please login or sign up to add items to your cart!");
      navigate("/login");
      return;
    }
    try {
      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: id, quantity: 1 }),
        credentials: "include"
      });
      const result = await response.json();
      if (result.success) {
        setAddedToCart((prev) => ({ ...prev, [id]: true }));
        setTimeout(() => setAddedToCart((prev) => ({ ...prev, [id]: false })), 1500);
        fetchCartCount();
      } else {
        alert(result.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to connect to cart service");
    }
  };

  const toggleLike = (id) => {
    if (!isAuthenticated) {
      alert("Please login or sign up to save books to your wishlist!");
      navigate("/login");
      return;
    }
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectKeyword = (keyword) => {
    setSearchQuery(keyword);
    setIsSearchFocused(false);
  };

  // =========================================================
  // BỘ LỌC CHIA KHU VỰC SÁCH NĂNG ĐỘNG - KHÔNG TRÙNG LẶP
  // =========================================================
  const getRecommendedBooks = () => {
    if (recommendedBooks && recommendedBooks.length > 0) {
      return recommendedBooks.filter(b => !brokenImages.has(b._id)).slice(0, 10);
    }
    return books.filter(b => !brokenImages.has(b._id)).slice(0, 10);
  };
  const getRecommendationTitle = () => {
    if (!isAuthenticated) return "Popular Books For You";
    const firstName = user?.name?.split(" ")?.[0] || "";
    if (recommendationMeta.mode === "behavioral") return firstName ? `Recommended For ${firstName}` : "Recommended For You";
    if (recommendationMeta.mode === "onboarding") return "Picked From Your Onboarding";
    return "Recommended For You";
  };
  const getRecommendationBadge = () => {
    if (recommendationLoading) return "Personalizing...";
    if (!isAuthenticated) return "Trending";
    if (recommendationMeta.mode === "behavioral") return "From Your Activity";
    if (recommendationMeta.mode === "onboarding") return "From Your Preferences";
    return recommendationMeta.source === "cache" ? "Cached AI Slate" : "AI Personalized";
  };
  const getBooksOfMay = () => books.filter(b => !brokenImages.has(b._id)).filter(b => b.tags?.includes("may") || b.genres?.some(g => g.toLowerCase().includes("fiction"))).slice(0, 10);
  const getBooksOfJune = () => books.filter(b => !brokenImages.has(b._id)).filter(b => b.tags?.includes("june") || b.genres?.some(g => g.toLowerCase().includes("history"))).slice(0, 10);
  
  const getBusinessSelfHelpBooks = () => {
    const recommendedIds = getRecommendedBooks().map(b => b._id);
    const targetKeywords = ["business", "finance", "self-help", "psychology", "skills"];
    
    let filtered = books.filter(b => !brokenImages.has(b._id)).filter(book => {
      const hasMatchingGenre = book.genres?.some(g => targetKeywords.includes(g.toLowerCase()));
      const hasMatchingTag = book.tags?.some(t => targetKeywords.includes(t.toLowerCase()));
      return (hasMatchingGenre || hasMatchingTag) && !recommendedIds.includes(book._id);
    });

    if (filtered.length === 0) {
      filtered = books.filter(b => !brokenImages.has(b._id)).slice(10, 20);
    }

    return filtered.slice(0, 10);
  };

  // Click handler to route to book details and log click interactions
  const handleBookClick = async (book, rankPosition = 1) => {
    if (!book) return;
    setDetailedBookId(book._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      await fetch("/api/recommendations/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: book._id,
          position: rankPosition,
          pageType: "Homepage"
        }),
        credentials: "include"
      });
    } catch (err) {
      console.error("Error logging recommendation click:", err);
    }
  };

  // Dynamic fetch for detailedBook details (to support recommendations and deep clicks)
  useEffect(() => {
    if (!detailedBookId) {
      setDetailedBook(null);
      return;
    }
    const localBook = books.find(b => b._id === detailedBookId);
    if (localBook) {
      setDetailedBook(localBook);
    } else {
      const fetchDetail = async () => {
        setDetailLoading(true);
        try {
          const response = await fetch(`/api/books/${detailedBookId}`, { credentials: "include" });
          const result = await response.json();
          if (result.success && result.data) {
            setDetailedBook(result.data);
          } else {
            console.error("Failed to load book detail from API:", result.message);
          }
        } catch (err) {
          console.error("Error fetching book details:", err);
        } finally {
          setDetailLoading(false);
        }
      };
      fetchDetail();
    }
  }, [detailedBookId, books]);

  // Tìm các sách liên quan (Cùng thể loại)
  const getRelatedBooks = (currentBook) => {
    if (!currentBook) return [];
    return books
      .filter(b => b._id !== currentBook._id && !brokenImages.has(b._id) && b.genres?.some(g => currentBook.genres?.includes(g)))
      .slice(0, 10);
  };

  // Hàm render cấu trúc thẻ card hiển thị sách chuẩn hóa
  const renderBookCard = (book, index = 0) => {
    if (!book) return null;
    const primaryGenre = book.genres && book.genres.length > 0 ? book.genres[0] : "General";
    return (
      <div 
        key={book._id}
        className="group bg-white rounded-none border border-gray-100 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col overflow-hidden p-3.5 relative"
      >
        {/* Favorite button */}
        <button 
          onClick={(e) => { e.stopPropagation(); toggleLike(book._id); }}
          className="absolute top-5 right-5 z-10 w-8 h-8 rounded-none bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-sm text-gray-400 hover:text-red-500 hover:scale-105 active:scale-95 transition-all"
        >
          <Heart className={`w-4 h-4 ${liked[book._id] ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        {/* Cover image */}
        <div 
          onClick={() => handleBookClick(book, index + 1)}
          className="w-full aspect-[3/4] bg-gray-50 rounded-none overflow-hidden relative cursor-pointer mb-4 select-none"
        >
          <motion.img 
            layoutId={`book-cover-${book._id}`}
            src={book.images?.medium || book.images?.large || "https://placehold.co/300x400?text=No+Cover"} 
            alt={book.title}
            onError={() => {
              setBrokenImages(prev => {
                const updated = new Set(prev);
                updated.add(book._id);
                return updated;
              });
            }}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(255,255,255,0.08)_0%,_rgba(0,0,0,0.15)_3%,_rgba(255,255,255,0.1)_5%,_rgba(0,0,0,0)_12%)] pointer-events-none" />
        </div>

        {/* Centered text fields */}
        <div className="flex-grow flex flex-col text-center space-y-1.5 px-1">
          <div>
            <span className="text-[10px] font-cinzel-lbl text-gold bg-gold/5 border border-gold/20 px-2 py-0.5 rounded-none uppercase tracking-wider">
              {primaryGenre}
            </span>
          </div>
          
          <h3 
            onClick={() => handleBookClick(book, index + 1)}
            className="text-sm font-bold text-gray-900 line-clamp-2 hover:text-gold cursor-pointer transition-colors pt-1 min-h-[40px] leading-snug font-display"
          >
            {book.title}
          </h3>
          
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

        {/* Action Button: white background, thick orange border */}
        <motion.button
          onClick={() => handleAddToCart(book._id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`w-full h-9 rounded-sm font-bold text-xs uppercase tracking-wider transition-all mt-auto flex items-center justify-center border-2 ${
            addedToCart[book._id] 
              ? "bg-emerald-50 border-emerald-500 text-emerald-600 animate-pulse" 
              : "bg-white border-gold text-gold hover:bg-gold hover:text-white"
          }`}
        >
          <span>{addedToCart[book._id] ? "Added" : "Add to Cart"}</span>
        </motion.button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-parchment font-sans text-ink flex flex-col relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@300;400;500&family=Cinzel:wght@400;700&display=swap');

        .font-display {
          font-family: 'Cormorant Garamond', serif;
          font-style: normal;
        }
        .font-mono-lbl {
          font-family: 'IBM Plex Mono', monospace;
        }
        .font-sans-pref {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* Enforce fonts and no italics rules */
        body, .font-sans, p, div, button, input {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          font-style: normal !important;
        }
        h1, h2, h3, h4, .font-serif, .font-display {
          font-family: 'Cormorant Garamond', serif !important;
          font-style: normal !important;
        }
        .font-cinzel-lbl {
          font-family: 'Cinzel', serif !important;
          font-style: normal !important;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
      `}</style>
      
      {isSearchFocused && (
        <div className="fixed inset-0 bg-black/25 backdrop-blur-xs z-40 transition-all duration-200" />
      )}

      {/* ================= HEADER / NAVIGATION ================= */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-6" ref={dropdownRef}>
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => { handleBackToHome(); }}>
              <BookOpen className="w-7 h-7 text-gold" strokeWidth={2.5} />
              <span className="text-lg font-black tracking-tight text-gray-900 uppercase font-cinzel-lbl">
                Book<span className="text-gold">Haven</span>
              </span>
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200/50 transition-all"
              >
                {isMenuOpen ? <X className="w-4 h-4 text-[#D49B00]" /> : <Menu className="w-4 h-4 text-gray-500" />}
                <span>Books</span>
              </button>

              {isMenuOpen && (
                <div className="absolute top-[120%] left-0 w-[540px] bg-white border border-gray-100 shadow-xl rounded-2xl p-5 z-50 grid grid-cols-12 gap-5 transition-all">
                  <div className="col-span-7 border-r border-gray-100 pr-4">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                      Explore Genuine Genres
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {dynamicGenres.length > 0 ? (
                        dynamicGenres.slice(0, 8).map((genre) => (
                          <button
                            key={genre}
                            onClick={() => {
                              setIsMenuOpen(false);
                              handleSelectGenre(genre);
                              setIsSearchFocused(false);
                            }}
                            className="text-left text-xs font-semibold text-gray-600 hover:text-[#D49B00] hover:bg-amber-50 px-2 py-1.5 rounded-lg transition-all truncate"
                          >
                            • {genre}
                          </button>
                        ))
                      ) : (
                        ["Fiction", "Science", "History", "Business"].map((item) => (
                          <span key={item} className="text-xs text-gray-400 italic px-2 py-1">Loading genres...</span>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="col-span-5 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Company Pages
                      </div>
                      <div className="space-y-1">
                        <button 
                          onClick={() => { setIsMenuOpen(false); alert("About Us: Welcome to BookHaven, established in 2026 as your trusted knowledge library."); }}
                          className="w-full text-left font-bold text-sm text-gray-800 hover:text-[#D49B00] py-1 transition-colors flex items-center justify-between"
                        >
                          <span>About Us</span>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                        <button 
                          onClick={() => { setIsMenuOpen(false); alert("Contact: Support team available 24/7 at support@bookhaven.com or via hotlines below."); }}
                          className="w-full text-left font-bold text-sm text-gray-800 hover:text-[#D49B00] py-1 transition-colors flex items-center justify-between"
                        >
                          <span>Contact</span>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 mt-4 border border-gray-100">
                      <p className="text-[11px] font-semibold text-gray-500 leading-normal">
                        Need bulk purchasing for institutions or libraries?
                      </p>
                      <span className="text-[11px] font-bold text-[#D49B00] mt-1 inline-flex items-center gap-0.5 cursor-pointer hover:underline">
                        Learn more <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Thanh Tìm Kiếm Thông Minh */}
          <div ref={searchRef} className="hidden md:block relative flex-1 max-w-md z-50">
            <div className={`flex items-center flex-1 max-w-md mx-6 border rounded-2xl bg-gray-50/50 px-3.5 py-1.8 transition-all duration-300 ${
              isSearchFocused ? "bg-white border-gold ring-4 ring-amber-500/5 shadow-sm" : "border-transparent"
            }`}>
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search books or authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full ml-2"
              />
              {searchQuery && (
                <X className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" onClick={() => setSearchQuery("")} />
              )}
            </div>

            {/* Khung Gợi Ý Lịch Sử / Xu Hướng */}
            {isSearchFocused && (
              <div className="absolute top-[115%] left-0 w-full bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden p-4 z-50">
                <div className="mb-4">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Clock className="w-3.5 h-3.5" /> Recent Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((keyword, idx) => (
                      <span 
                        key={idx}
                        onClick={() => handleSelectKeyword(keyword)}
                        className="text-xs font-medium text-gray-600 bg-gray-50 hover:bg-amber-50 hover:text-[#D49B00] px-3 py-1.5 rounded-lg cursor-pointer border border-gray-100 transition-colors"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Flame className="w-3.5 h-3.5 text-red-500" /> Trending Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((keyword, idx) => (
                      <span 
                        key={idx}
                        onClick={() => handleSelectKeyword(keyword)}
                        className="text-xs font-medium text-gray-600 bg-gray-50 hover:bg-amber-50 hover:text-[#D49B00] px-3 py-1.5 rounded-lg cursor-pointer border border-gray-100 transition-colors"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tiện Ích Người Dùng */}
          <div className="flex items-center gap-3">
            {/* Spotify Wrapped button */}
            <motion.button 
              onClick={() => {
                if (!isAuthenticated) {
                  alert("Please login or sign up to view your 2026 Reading Wrapped!");
                  navigate("/login");
                } else {
                  navigate("/lookback");
                }
              }} 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center gap-1.5 px-3 py-2 bg-cta-gradient text-white rounded-xl text-xs font-black shadow-md shadow-gold/15 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current text-white animate-pulse" />
              <span className="hidden sm:inline font-cinzel-lbl text-[10px]">2026 REWIND</span>
            </motion.button>

            <button 
              onClick={() => {
                if (!isAuthenticated) {
                  alert("Please login or sign up to view your profile!");
                  navigate("/login");
                } else {
                  alert("Profile feature coming soon");
                }
              }} 
              className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200/40 transition-colors"
            >
              <User className="w-5 h-5" />
            </button>

            <button 
              onClick={() => {
                if (!isAuthenticated) {
                  alert("Please login or sign up to view your shopping cart!");
                  navigate("/login");
                } else {
                  navigate("/cart");
                }
              }}
              className="relative p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200/40 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                  {cartCount}
                </span>
              )}
            </button>

            {isAuthenticated ? (
              <button onClick={() => navigate("/login")} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors">
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:block">Logout</span>
              </button>
            ) : (
              <motion.button 
                onClick={() => navigate("/login")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="flex items-center gap-1.5 px-4 py-2 bg-cta-gradient hover:bg-cta-gradient-hover text-white rounded-xl text-xs font-black transition-all"
              >
                Login
              </motion.button>
            )}
          </div>
        </div>
      </nav>

      {/* TẢI DỮ LIỆU CHỜ BAN ĐẦU */}
      {loading ? (
        <div className="flex-grow flex flex-col items-center justify-center py-32 text-gray-400">
          <Loader2 className="w-10 h-10 animate-spin text-[#D49B00] mb-4" />
          <p className="text-base font-semibold">Synchronizing with system database...</p>
        </div>
      ) : error ? (
        <div className="flex-grow flex flex-col items-center justify-center py-32 text-red-500">
          <p className="text-lg font-bold">System Connection Failed: {error}</p>
          <p className="text-sm text-gray-400 mt-1">Please ensure localhost API server is active.</p>
        </div>
      ) : (
        <LayoutGroup>
          {!detailedBookId ? (
        
        // =================================================================
        // KHÔNG GIAN 1: TRANG CHỦ HOẶC TRANG KẾT QUẢ TÌM KIẾM
        // =================================================================
        <div className="flex-grow">
          {selectedGenre !== "" ? (
            /* BỘ LỌC THEO THỂ LOẠI TỪ DATABASE (GENRE FILTER RESULTS) */
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8 min-h-[50vh]">
              <div className="flex items-center justify-between border-b border-gray-200/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-7 bg-[#D49B00] rounded-full" />
                  <h2 className="text-xl font-black tracking-tight text-gray-900 uppercase">
                    Genre: {selectedGenre}
                  </h2>
                  {genreBooksLoading && (
                    <span className="text-xs font-bold text-[#D49B00] bg-amber-50 px-2.5 py-1 rounded-md animate-pulse">
                      Loading...
                    </span>
                  )}
                </div>
                <button
                  onClick={handleClearGenre}
                  className="text-xs font-bold text-gray-500 hover:text-[#D49B00] bg-gray-100 hover:bg-amber-50 px-3.5 py-1.5 rounded-xl transition-all"
                >
                  Clear Filter
                </button>
              </div>

              {genreBooks.length === 0 && genreBooksLoading ? (
                <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                  <Loader2 className="w-10 h-10 animate-spin text-[#D49B00] mb-4" />
                  <p className="text-base font-semibold">Fetching books from database...</p>
                </div>
              ) : genreBooksError ? (
                <div className="flex flex-col items-center justify-center py-20 text-red-500">
                  <p className="text-base font-bold">Failed to load genre: {genreBooksError}</p>
                </div>
              ) : genreBooks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                  <BookOpen className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-base font-bold text-gray-600">No books found in this genre</p>
                  <button
                    onClick={handleClearGenre}
                    className="mt-4 bg-[#D49B00] text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-[#d9561c] transition-all"
                  >
                    Go Back Home
                  </button>
                </div>
              ) : (
                <div className="space-y-8 animate-fade-in">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Showing {genreBooks.length} books in {selectedGenre}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {genreBooks.filter(book => !brokenImages.has(book._id)).map((book) => renderBookCard(book))}
                  </div>

                  {hasMoreGenreBooks && (
                    <div className="flex justify-center pt-8">
                      <button
                        onClick={() => fetchGenreBooks(selectedGenre, genreBooksPage + 1, true)}
                        disabled={genreBooksLoading}
                        className="bg-white text-gray-900 border border-gray-200 hover:border-[#D49B00] hover:text-[#D49B00] font-bold px-8 py-3.5 rounded-2xl text-sm transition-all shadow-sm active:scale-95 disabled:opacity-50 flex items-center gap-2"
                      >
                        {genreBooksLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#D49B00]" />
                            Loading more...
                          </>
                        ) : (
                          "Load More Books"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : searchQuery.trim() !== "" ? (
            /* BỘ LỌC KẾT QUẢ TÌM KIẾM LAI ĐA TẦNG (HYBRID SEARCH RESULTS) */
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8 min-h-[50vh]">
              <div className="flex items-center gap-3 border-b border-gray-200/60 pb-4">
                <div className="w-1.5 h-7 bg-[#D49B00] rounded-full" />
                <h2 className="text-xl font-black tracking-tight text-gray-900 uppercase">
                  Search Results for "{searchQuery}"
                </h2>
                {isSearching && (
                  <span className="text-xs font-bold text-[#D49B00] bg-amber-50 px-2.5 py-1 rounded-md animate-pulse">
                    AI Ranking...
                  </span>
                )}
              </div>

              {isSearching && searchResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                  <Loader2 className="w-10 h-10 animate-spin text-[#D49B00] mb-4" />
                  <p className="text-base font-semibold">Performing Intent Parsing, BM25 & Semantic Search...</p>
                </div>
              ) : searchError ? (
                <div className="flex flex-col items-center justify-center py-20 text-red-500">
                  <p className="text-base font-bold">Search Service Failed: {searchError}</p>
                  <p className="text-xs text-gray-400 mt-1">Please ensure the AI Engine backend is running.</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                  <BookOpen className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-base font-bold text-gray-600">No books found</p>
                  <p className="text-xs text-gray-400 mt-1">Try typing another query or keyword (e.g. title, author, genre).</p>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                    Found {searchResults.length} relevance-ranked matches for "{activeSearchQuery}"
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {searchResults.filter(book => !brokenImages.has(book._id)).map((book) => renderBookCard(book))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* DIỆN MẠO TRANG LANDING PAGE TIÊU CHUẨN */
            <>
              {/* ================= HERO CAROUSEL SLIDER ĐÃ UPDATE GRADIENT ĐA TẦNG ================= */}
              <div className="relative overflow-hidden h-[520px] md:h-[600px] bg-slate-950">
                {heroSlides.map((slide, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 bg-gradient-to-br ${slide.bg} text-white px-8 py-16 flex items-center transition-all duration-1000 ease-in-out transform ${
                      idx === currentSlide ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-full scale-95"
                    }`}
                  >
                    {/* Lớp nền kết cấu Grid đè nhẹ tạo độ sâu khối nghệ thuật */}
                    <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
                    
                    {/* Đốm sáng Gradient hình tròn khuếch tán làm bừng sáng góc bìa sách */}
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="absolute bottom-10 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 items-center gap-12 relative z-10">
                      <div className="md:col-span-7 space-y-6">
                        <span className={`inline-block backdrop-blur-md text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest border shadow-xs ${slide.badgeBg}`}>
                          {slide.badge}
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tighter drop-shadow-md">
                          {slide.title}
                        </h1>
                        <p className="text-white/80 text-sm md:text-lg max-w-xl font-medium leading-relaxed opacity-90">
                          {slide.desc}
                        </p>
                        <div className="flex items-center gap-4 pt-4">
                          <button className="bg-white text-gray-900 font-black px-8 py-4 rounded-2xl text-sm hover:bg-amber-50 transition-all shadow-xl inline-flex items-center gap-2 active:scale-95 group">
                            <span>Explore Collection</span> 
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </button>
                          <div className="hidden sm:flex items-center gap-2 text-white/70 text-sm font-bold border-l border-white/20 pl-4">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            4.9/5 Rating
                          </div>
                        </div>
                      </div>
                      
                      {/* Cụm 3 Sách Xếp Chồng Floating Stack 3D */}
                      <div className="hidden md:col-span-5 md:flex justify-center items-center relative h-[400px]">
                        {books.slice(idx * 2, idx * 2 + 3).map((b, bIdx) => {
                          const positions = [
                            { width: '190px', height: '270px', transform: 'translateX(-90px) rotate(-12deg) translateY(20px)', zIndex: 10, opacity: 0.75 },
                            { width: '230px', height: '330px', transform: 'translateX(0px) rotate(0deg) translateY(-10px)', zIndex: 30, opacity: 1 },
                            { width: '190px', height: '270px', transform: 'translateX(90px) rotate(12deg) translateY(30px)', zIndex: 20, opacity: 0.8 }
                          ];
                          const currentPos = positions[bIdx] || positions[1];
                          
                          return (
                            <div 
                              key={b._id} 
                              onClick={() => setSelectedBook(b)} 
                              className="absolute rounded-2xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden border border-white/10 cursor-pointer hover:scale-105 hover:z-40 transition-all duration-500 bg-white"
                              style={{
                                width: currentPos.width,
                                height: currentPos.height,
                                transform: currentPos.transform,
                                zIndex: currentPos.zIndex,
                                opacity: currentPos.opacity
                              }}
                            >
                              <img 
                                src={b.images?.large || b.images?.medium || "https://placehold.co/300x400"} 
                                alt="" 
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://placehold.co/300x400/e2e8f0/64748b?text=No+Cover";
                                }}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Điều khiển Button điều hướng dạng tròn sang trọng */}
                <button 
                  onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 text-white transition-all shadow-lg z-30"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 text-white transition-all shadow-lg z-30"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Chỉ số trang Slide (Dots) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-30">
                  {heroSlides.map((_, i) => (
                    <div 
                      key={i} 
                      onClick={() => setCurrentSlide(i)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${i === currentSlide ? "w-10 bg-white" : "w-2.5 bg-white/40"}`}
                    />
                  ))}
                </div>
              </div>

              {/* MAIN GRID ROWS */}
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-14">
                
                {/* KHU VỰC 1: GỢI Ý CÁ NHÂN HÓA */}
                <section className="space-y-4">
                  <div className="flex items-end justify-between border-b border-gray-200/60 pb-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-6 bg-[#D49B00] rounded-full mt-0.5" />
                      <div>
                        <h2 className="text-lg font-black tracking-tight text-gray-900 uppercase">{getRecommendationTitle()}</h2>
                        <p className="text-xs font-semibold text-gray-400 mt-0.5">
                          {isAuthenticated ? recommendationMeta.reason : "Sign in to unlock onboarding and behavior-based recommendations."}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#D49B00] bg-amber-50 px-2.5 py-1 rounded-md">{getRecommendationBadge()}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {getRecommendedBooks().map((book, idx) => renderBookCard(book, idx))}
                  </div>
                </section>

                {/* KHU VỰC 2: SÁCH CỦA THÁNG 5 */}
                <section className="space-y-4">
                  <div className="flex items-end justify-between border-b border-gray-200/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                      <h2 className="text-lg font-black tracking-tight text-gray-900 uppercase">Featured: Books of May</h2>
                    </div>
                    <span className="text-xs font-medium text-gray-400">May Collection</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {getBooksOfMay().map((book, idx) => renderBookCard(book, idx))}
                  </div>
                </section>

                {/* KHU VỰC 3: SÁCH CỦA THÁNG 6 */}
                <section className="space-y-4">
                  <div className="flex items-end justify-between border-b border-gray-200/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                      <h2 className="text-lg font-black tracking-tight text-gray-900 uppercase">Upcoming: Books of June</h2>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">New Arrival</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {getBooksOfJune().map((book, idx) => renderBookCard(book, idx))}
                  </div>
                </section>

                {/* KHU VỰC 4: SÁCH KINH DOANH & PHÁT TRIỂN BẢN THÂN */}
                <section className="space-y-4">
                  <div className="flex items-end justify-between border-b border-gray-200/60 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                      <h2 className="text-lg font-black tracking-tight text-gray-900 uppercase">Top Business & Self-Help Books</h2>
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">Personal Growth</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {getBusinessSelfHelpBooks().map((book, idx) => renderBookCard(book, idx))}
                  </div>
                </section>

              </div>
            </>
          )}
        </div>
      ) : (
        /* DETAIL PAGE VIEW */
        detailLoading ? (
          <div className="flex-grow flex items-center justify-center py-20 bg-transparent">
            <div className="w-8 h-8 border-4 border-[#D49B00] border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <BookDetailPage 
            book={detailedBook}
            onBackToHome={() => { setDetailedBookId(null); setSearchQuery(""); }}
            onBackToGenre={(genre) => { setDetailedBookId(null); handleSelectGenre(genre); }}
            onAddToCart={handleAddToCart}
            onToggleLike={toggleLike}
            addedToCart={addedToCart}
            liked={liked}
            getRelatedBooks={getRelatedBooks}
            brokenImages={brokenImages}
            renderBookCard={(b) => (
              <div 
                key={b._id} 
                onClick={() => {
                  setDetailedBookId(b._id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group bg-white rounded-none border border-gray-100 p-3.5 flex flex-col relative text-center cursor-pointer hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300"
              >
                {/* Cover image in related books */}
                <div className="w-full aspect-[3/4] bg-gray-50 rounded-none overflow-hidden mb-3 relative select-none">
                  <img 
                    src={b.images?.medium || "https://placehold.co/300x400?text=No+Cover"} 
                    alt="" 
                    onError={() => {
                      setBrokenImages(prev => {
                        const updated = new Set(prev);
                        updated.add(b._id);
                        return updated;
                      });
                    }}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(255,255,255,0.08)_0%,_rgba(0,0,0,0.15)_3%,_rgba(255,255,255,0.1)_5%,_rgba(0,0,0,0)_12%)] pointer-events-none" />
                </div>
                <h4 className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-[#D49B00] transition-colors">{b.title}</h4>
                <span className="text-xs font-black text-gray-900 mt-1 mb-3">${b.price?.toFixed(2)}</span>
                
                {/* Nút bấm của sách liên quan: Nền trắng, viền cam dày (border-2), bo tròn nhẹ (rounded-sm) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); 
                    handleAddToCart(b._id);
                  }}
                  className={`w-full h-8 rounded-sm font-bold text-[10px] uppercase tracking-wider transition-all active:scale-[0.97] mt-auto flex items-center justify-center border-2 ${
                    addedToCart[b._id] 
                      ? "bg-emerald-50 border-emerald-500 text-emerald-600" 
                      : "bg-white border-[#D49B00] text-[#D49B00] hover:bg-[#D49B00] hover:text-white"
                  }`}
                >
                  <span>{addedToCart[b._id] ? "Added" : "Add to Cart"}</span>
                </button>
              </div>
            )}
          />
        )
      )}
        </LayoutGroup>
      )}

      {/* ==================== BOOK DETAILS POPUP MODAL NGUYÊN BẢN (2 CỘT) ==================== */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0" onClick={() => setSelectedBook(null)}></div>
          
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl border border-gray-100 flex flex-col md:flex-row p-6 gap-6 animate-scale-up">
            <button 
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cột Trái: Ảnh Sách */}
            <div className="w-full md:w-52 h-72 shrink-0 bg-gray-50 rounded-2xl overflow-hidden shadow-md flex items-center justify-center">
              <img 
                src={selectedBook.images?.medium || selectedBook.images?.large || "https://placehold.co/300x400/e2e8f0/64748b?text=No+Cover"} 
                alt={selectedBook.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/300x400/e2e8f0/64748b?text=No+Cover";
                }}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Cột Phải: Thông tin chi tiết */}
            <div className="flex flex-col flex-grow justify-between pt-4 md:pt-0">
              <div>
                <span className="text-xs font-bold text-[#D49B00] uppercase tracking-wider">
                  {selectedBook.genres?.join(", ") || "General"}
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900 mt-1 leading-tight">
                  {selectedBook.title}
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1">by <span className="text-gray-800 font-semibold">{selectedBook.author}</span></p>

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
                  <span className="text-2xl font-black text-gray-900">${selectedBook.price?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setDetailedBookId(selectedBook._id);
                      setSelectedBook(null); 
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 sm:flex-none px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
                  >
                    <span>Full Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => toggleLike(selectedBook._id)}
                    className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 text-gray-600 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${liked[selectedBook._id] ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                  <button
                    onClick={() => handleAddToCart(selectedBook._id)}
                    className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-xs shadow-md transition-all ${
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
      )}

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t border-gray-100 mt-20 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-b border-gray-50 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-full text-[#D49B00]"><ShieldCheck className="w-6 h-6" /></div>
            <div>
              <h5 className="text-xs font-black text-gray-900 uppercase">100% Genuine Books</h5>
              <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Directly sourced from licensed global publishers</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-full text-[#D49B00]"><Loader2 className="w-6 h-6" /></div>
            <div>
              <h5 className="text-xs font-black text-gray-900 uppercase">Express Dispatch</h5>
              <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Secure packaging and same-day delivery routing</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="p-3 bg-amber-50 rounded-full text-[#D49B00]"><Check className="w-6 h-6" /></div>
            <div>
              <h5 className="text-xs font-black text-gray-900 uppercase">24/7 Priority Support</h5>
              <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Direct live agent support via hotlines & mailboxes</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-12 gap-8 text-left">
          <div className="col-span-2 md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-[#D49B00]" strokeWidth={2.5} />
              <span className="text-lg font-black tracking-tight text-gray-900">BookHaven</span>
            </div>
            <p className="text-xs text-gray-500 font-medium leading-relaxed">
              Your elite ecosystem for digital and tangible knowledge infrastructure. Empowering readers globally since 2026.
            </p>
            <div className="text-xs font-semibold text-gray-600 space-y-2 pt-1">
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-gray-400" /> <span>(+84) 1900 6789</span></div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-gray-400" /> <span>support@bookhaven.com</span></div>
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-400" /> <span className="text-[11px]">District 1, Ho Chi Minh City, Vietnam</span></div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">Account Services</h4>
            <ul className="space-y-1.5 text-xs font-bold text-gray-500">
              <li><span className="hover:text-[#D49B00] cursor-pointer transition-colors">User Dashboard</span></li>
              <li><span className="hover:text-[#D49B00] cursor-pointer transition-colors">Order Tracking</span></li>
              <li><span className="hover:text-[#D49B00] cursor-pointer transition-colors">Wishlists Locker</span></li>
              <li><span className="hover:text-[#D49B00] cursor-pointer transition-colors">Purchase Invoices</span></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">Legal Terms</h4>
            <ul className="space-y-1.5 text-xs font-bold text-gray-500">
              <li><span className="hover:text-[#D49B00] cursor-pointer transition-colors">Privacy Charter</span></li>
              <li><span className="hover:text-[#D49B00] cursor-pointer transition-colors">Terms of Use</span></li>
              <li><span className="hover:text-[#D49B00] cursor-pointer transition-colors">Refund Policies</span></li>
              <li><span className="hover:text-[#D49B00] cursor-pointer transition-colors">Affiliate Nodes</span></li>
            </ul>
          </div>

          <div className="col-span-2 md:col-span-4 space-y-3">
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">Secure Payment Gateways</h4>
            <p className="text-xs text-gray-400 font-medium">We support secure cryptographic and international standard banking wire payments:</p>
            <div className="flex flex-wrap gap-2 pt-1.5">
              {["Visa", "Mastercard", "PayPal", "ApplePay", "Momo"].map((p) => (
                <span key={p} className="px-2.5 py-1 bg-gray-50 border border-gray-200/60 rounded text-[10px] font-black text-gray-600 tracking-wide">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border-t border-gray-100 py-4 text-center text-xs font-semibold text-gray-400">
          <p>© 2026 BookHaven Systems Inc. All Rights Reserved. Powered by Vite Framework.</p>
        </div>
      </footer>

      {/* Curtains Opening Transition Overlay */}
      <div className="fixed inset-0 z-50 flex pointer-events-none select-none overflow-hidden">
        {/* Left Curtain */}
        <div 
          className={`w-1/2 h-full bg-[#5C1E1A] border-r-4 border-[#D49B00] shadow-[10px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-1000 ease-in-out ${
            isCurtainOpening ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{
            backgroundImage: "url('/curtain_left.png')",
            backgroundSize: "cover",
            backgroundPosition: "right center"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
          <div className="absolute inset-y-0 right-4 w-[1px] bg-[#D49B00]/40" />
        </div>

        {/* Right Curtain */}
        <div 
          className={`w-1/2 h-full bg-[#5C1E1A] border-l-4 border-[#D49B00] shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-1000 ease-in-out relative overflow-hidden ${
            isCurtainOpening ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Mirrored background image layer */}
          <div 
            className="absolute inset-0 scale-x-[-1]"
            style={{
              backgroundImage: "url('/curtain_left.png')",
              backgroundSize: "cover",
              backgroundPosition: "right center"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-transparent to-black/30 pointer-events-none" />
          <div className="absolute inset-y-0 left-4 w-[1px] bg-[#D49B00]/40 pointer-events-none" />
        </div>
      </div>

    </div>
  );
}
