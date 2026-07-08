import { BookOpen, Search, X, Menu, Clock, Flame, Sparkles, User, ShoppingCart, LogOut, ChevronRight, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { recentSearchesList, trendingSearchesList } from "../../config/constants";

export default function Navbar({
  isAuthenticated,
  user,
  cartCount,
  searchQuery,
  setSearchQuery,
  isSearchFocused,
  setIsSearchFocused,
  isMenuOpen,
  setIsMenuOpen,
  genres = [],
  handleSelectGenre,
  handleBackToHome,
  navigate,
  searchRef,
  dropdownRef
}) {
  const handleSelectKeyword = (keyword) => {
    setSearchQuery(keyword);
    setIsSearchFocused(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        
        {/* Logo and Menu (Category) Dropdown */}
        <div className="flex items-center gap-6" ref={dropdownRef}>
          <div className="flex items-center gap-1.5 cursor-pointer select-none" onClick={handleBackToHome}>
            <BookOpen className="w-7 h-7 text-gold" strokeWidth={2.5} />
            <span className="text-lg font-black tracking-tight text-gray-900 uppercase font-cinzel-lbl">
              Book<span className="text-gold">Haven</span>
            </span>
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200/50 transition-all cursor-pointer"
            >
              {isMenuOpen ? <X className="w-4 h-4 text-[#D49B00]" /> : <Menu className="w-4 h-4 text-gray-500" />}
              <span>Category</span>
            </button>

            {isMenuOpen && (
              <div className="absolute top-[120%] left-0 w-[580px] bg-white border border-gray-100 shadow-xl rounded-2xl p-5 z-50 grid grid-cols-12 gap-5 transition-all">
                {/* Left pane: Genres List (Top 25) */}
                <div className="col-span-8 border-r border-gray-100 pr-4">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                    Explore Top Genres
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 max-h-[240px] overflow-y-auto pr-1">
                    {genres.length > 0 ? (
                      genres.map((genre) => (
                        <button
                          key={genre}
                          onClick={() => {
                            setIsMenuOpen(false);
                            handleSelectGenre(genre);
                            setIsSearchFocused(false);
                          }}
                          className="text-left text-[11px] font-semibold text-gray-600 hover:text-[#D49B00] hover:bg-amber-50 px-2 py-1.5 rounded-lg transition-all truncate cursor-pointer"
                          title={genre}
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

                {/* Right pane: Company info and promotions */}
                <div className="col-span-4 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Company Pages
                    </div>
                    <div className="space-y-1">
                      <button 
                        onClick={() => { setIsMenuOpen(false); alert("About Us: Welcome to BookHaven, established in 2026 as your trusted knowledge library."); }}
                        className="w-full text-left font-bold text-sm text-gray-800 hover:text-[#D49B00] py-1 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span>About Us</span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                      <button 
                        onClick={() => { setIsMenuOpen(false); alert("Contact: Support team available 24/7 at support@bookhaven.com or via hotlines below."); }}
                        className="w-full text-left font-bold text-sm text-gray-800 hover:text-[#D49B00] py-1 transition-colors flex items-center justify-between cursor-pointer"
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

        {/* Smart Search Bar */}
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

          {/* Search suggestions dropdown */}
          {isSearchFocused && (
            <div className="absolute top-[115%] left-0 w-full bg-white border border-gray-100 shadow-2xl rounded-2xl overflow-hidden p-4 z-50">
              <div className="mb-4">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Clock className="w-3.5 h-3.5" /> Recent Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {recentSearchesList.map((keyword, idx) => (
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
                  {trendingSearchesList.map((keyword, idx) => (
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

        {/* User Actions */}
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
            className="flex items-center gap-1.5 px-3 py-2 bg-cta-gradient text-white rounded-xl text-xs font-black shadow-md shadow-gold/15 transition-all cursor-pointer"
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
            className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200/40 transition-colors cursor-pointer"
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
            className="relative p-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl border border-gray-200/40 transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                {cartCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <button 
              onClick={() => navigate("/login")} 
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:block">Logout</span>
            </button>
          ) : (
            <motion.button 
              onClick={() => navigate("/login")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center gap-1.5 px-4 py-2 bg-cta-gradient hover:bg-cta-gradient-hover text-white rounded-xl text-xs font-black transition-all cursor-pointer"
            >
              Login
            </motion.button>
          )}
        </div>
      </div>
    </nav>
  );
}
