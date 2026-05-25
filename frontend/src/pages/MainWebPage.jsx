import { useState } from "react";
import { BookOpen, ShoppingCart, Search, Heart, Star, Menu, X, ChevronRight, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";


const books = [
  { id: 1, title: "The Midnight Library", author: "Matt Haig", price: 14.99, rating: 4.8, reviews: 2341, category: "Fiction", badge: "Bestseller", cover: "bg-gradient-to-br from-indigo-900 to-blue-700" },
  { id: 2, title: "Atomic Habits", author: "James Clear", price: 16.99, rating: 4.9, reviews: 5120, category: "Self-Help", badge: "Top Rated", cover: "bg-gradient-to-br from-orange-500 to-red-600" },
  { id: 3, title: "The Alchemist", author: "Paulo Coelho", price: 12.99, rating: 4.7, reviews: 8900, category: "Fiction", badge: null, cover: "bg-gradient-to-br from-yellow-600 to-amber-800" },
  { id: 4, title: "Sapiens", author: "Yuval Noah Harari", price: 18.99, rating: 4.6, reviews: 3200, category: "History", badge: "New", cover: "bg-gradient-to-br from-slate-700 to-gray-900" },
  { id: 5, title: "Dune", author: "Frank Herbert", price: 15.99, rating: 4.8, reviews: 4100, category: "Sci-Fi", badge: null, cover: "bg-gradient-to-br from-amber-700 to-yellow-900" },
  { id: 6, title: "The Psychology of Money", author: "Morgan Housel", price: 13.99, rating: 4.7, reviews: 2800, category: "Finance", badge: "Trending", cover: "bg-gradient-to-br from-emerald-600 to-teal-800" },
  { id: 7, title: "Project Hail Mary", author: "Andy Weir", price: 17.99, rating: 4.9, reviews: 1900, category: "Sci-Fi", badge: "New", cover: "bg-gradient-to-br from-cyan-600 to-blue-900" },
  { id: 8, title: "Educated", author: "Tara Westover", price: 14.49, rating: 4.7, reviews: 3500, category: "Memoir", badge: null, cover: "bg-gradient-to-br from-rose-700 to-pink-900" },
];

const categories = ["All", "Fiction", "Self-Help", "History", "Sci-Fi", "Finance", "Memoir"];

export default function MainWebPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);
  const [liked, setLiked] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [addedToCart, setAddedToCart] = useState({});

  const filtered = books.filter((b) => {
    const matchCat = activeCategory === "All" || b.category === activeCategory;
    const matchSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || b.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
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
            {books.slice(0, 3).map((b) => (
              <div key={b.id} className={`${b.cover} w-20 h-28 md:w-28 md:h-40 rounded-xl shadow-2xl flex items-end p-2 rotate-${b.id % 2 === 0 ? "3" : "-2"}`}>
                <span className="text-white text-[9px] font-bold leading-tight line-clamp-2">{b.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Categories */}
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

        {/* Mobile search */}
        <div className="flex md:hidden items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5 mb-6">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full ml-2"
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((book) => (
            <div key={book.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              {/* Cover */}
              <div className={`${book.cover} h-44 relative flex items-center justify-center`}>
                {book.badge && (
                  <span className="absolute top-3 left-3 bg-white/20 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/30">
                    {book.badge}
                  </span>
                )}
                <button
                  onClick={() => toggleLike(book.id)}
                  className="absolute top-3 right-3 p-1.5 bg-white/20 backdrop-blur rounded-full"
                >
                  <Heart className={`w-4 h-4 ${liked[book.id] ? "fill-red-400 text-red-400" : "text-white"}`} />
                </button>
                <BookOpen className="w-10 h-10 text-white/40" />
              </div>

              {/* Info */}
              <div className="p-4">
                <span className="text-[10px] font-bold text-[#F16323] uppercase tracking-wider">{book.category}</span>
                <h3 className="text-sm font-bold text-gray-900 mt-1 leading-tight line-clamp-2">{book.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>

                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-gray-700">{book.rating}</span>
                  <span className="text-xs text-gray-400">({book.reviews.toLocaleString()})</span>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-base font-extrabold text-gray-900">${book.price}</span>
                  <button
                    onClick={() => handleAddToCart(book.id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                      addedToCart[book.id]
                        ? "bg-green-500 text-white"
                        : "bg-[#F16323] text-white hover:bg-orange-600"
                    }`}
                  >
                    {addedToCart[book.id] ? "Added ✓" : "Add to Cart"}
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
      </div>
    </div>
  );
}
