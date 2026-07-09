import { BookOpen, Search, X, Menu, Clock, Flame, Sparkles, User, ShoppingCart, LogOut, ChevronRight, ArrowRight, Heart } from "lucide-react";
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
  dropdownRef,
  openCartDrawer,
  openWishlistDrawer,
  wishlistCount
}) {
  const handleSelectKeyword = (keyword) => {
    setSearchQuery(keyword);
    setIsSearchFocused(false);
  };

  return (
    // Đã thêm /80 (opacity 80%) và backdrop-blur-md để làm mờ nhẹ không gian phía sau
    <nav className="sticky top-0 z-50 bg-[#F7EFE1]/80 backdrop-blur-md border-b border-[#C9A227]/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        
        {/* Logo and Menu (Category) Dropdown */}
        <div className="flex items-center gap-6" ref={dropdownRef}>
          <div className="flex items-center gap-1.5 cursor-pointer select-none" onClick={handleBackToHome}>
            <BookOpen className="w-7 h-7 text-[#C9A227]" strokeWidth={2.5} />
            <span className="text-lg font-black tracking-tight text-[#211B2E] uppercase font-cinzel-lbl">
              Book<span className="text-[#C9A227]">Haven</span>
            </span>
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-[#C9A227]/30 text-sm font-bold text-[#211B2E] bg-[#EDE6D6]/50 hover:bg-[#EDE6D6] transition-all cursor-pointer"
            >
              {isMenuOpen ? <X className="w-4 h-4 text-[#B5651D]" /> : <Menu className="w-4 h-4 text-[#211B2E]" />}
              <span>Category</span>
            </button>

            {isMenuOpen && (
              <div className="absolute top-[120%] left-0 w-[580px] bg-[#F7EFE1]/95 backdrop-blur-sm border border-[#C9A227]/30 shadow-xl shadow-ink/10 rounded-md p-5 z-50 grid grid-cols-12 gap-5 transition-all">
                {/* Left pane: Genres List (Top 25) */}
                <div className="col-span-8 border-r border-[#C9A227]/20 pr-4">
                  <div className="text-[11px] font-bold text-[#B5651D] uppercase tracking-wider mb-2.5">
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
                          className="text-left text-[11px] font-semibold text-[#211B2E] hover:text-[#C9A227] hover:bg-[#C9A227]/10 px-2 py-1.5 transition-all rounded-md truncate cursor-pointer"
                          title={genre}
                        >
                          • {genre}
                        </button>
                      ))
                    ) : (
                      ["Fiction", "Science", "History", "Business"].map((item) => (
                        <span key={item} className="text-xs text-[#211B2E]/40 italic px-2 py-1">Loading genres...</span>
                      ))
                    )}
                  </div>
                </div>

                {/* Right pane: Company info and promotions */}
                <div className="col-span-4 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-[#B5651D] uppercase tracking-wider mb-2">
                      Company Pages
                    </div>
                    <div className="space-y-1">
                      <button 
                        onClick={() => { setIsMenuOpen(false); alert("About Us: Welcome to BookHaven, established in 2026 as your trusted knowledge library."); }}
                        className="w-full text-left font-bold text-sm text-[#211B2E] hover:text-[#C9A227] py-1 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span>About Us</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#C9A227]" />
                      </button>
                      <button 
                        onClick={() => { setIsMenuOpen(false); alert("Contact: Support team available 24/7 at support@bookhaven.com or via hotlines below."); }}
                        className="w-full text-left font-bold text-sm text-[#211B2E] hover:text-[#C9A227] py-1 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span>Contact</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#C9A227]" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-[#EDE6D6]/50 rounded-md p-3 mt-4 border border-[#C9A227]/20">
                    <p className="text-[11px] font-semibold text-[#211B2E]/70 leading-normal">
                      Need bulk purchasing for institutions or libraries?
                    </p>
                    <span className="text-[11px] font-bold text-[#C9A227] mt-1 inline-flex items-center gap-0.5 cursor-pointer hover:underline">
                      Learn more <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Smart Search Bar - Đã tăng padding và làm rõ màu sắc */}
        <div ref={searchRef} className="hidden md:block relative flex-1 max-w-md z-50">
          <div className={`flex items-center flex-1 border border-[#C9A227]/30 rounded-md bg-[#EDE6D6]/40 px-5 py-2 transition-all duration-300 ${
            isSearchFocused ? "bg-white border-[#C9A227] shadow-md ring-1 ring-[#C9A227]/20" : "hover:bg-[#EDE6D6]/60 hover:border-[#C9A227]/50"
          }`}>
            <Search className="w-5 h-5 text-[#211B2E]/60 shrink-0" />
            <input
              type="text"
              placeholder="Search books or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="bg-transparent text-base text-[#211B2E] placeholder-[#211B2E]/60 font-medium outline-none w-full ml-3"
            />
            {searchQuery && (
              <X className="w-5 h-5 text-[#211B2E]/70 cursor-pointer hover:text-[#211B2E]" onClick={() => setSearchQuery("")} />
            )}
          </div>

          {/* Search suggestions dropdown */}
          {isSearchFocused && (
            <div className="absolute top-[115%] left-0 w-full bg-[#F7EFE1]/95 backdrop-blur-sm border border-[#C9A227]/30 shadow-xl shadow-ink/10 rounded-md p-4 z-50">
              <div className="mb-4">
                <h4 className="text-[11px] font-bold text-[#B5651D] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Clock className="w-3.5 h-3.5" /> Recent Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {recentSearchesList.map((keyword, idx) => (
                    <span 
                      key={idx}
                      onClick={() => handleSelectKeyword(keyword)}
                      className="text-xs font-medium text-[#211B2E] bg-[#EDE6D6]/50 hover:bg-[#C9A227]/10 hover:text-[#C9A227] px-3 py-1.5 cursor-pointer border border-[#C9A227]/10 rounded-md transition-colors"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold text-[#B5651D] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <Flame className="w-3.5 h-3.5 text-[#B5651D]" /> Trending Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {trendingSearchesList.map((keyword, idx) => (
                    <span 
                      key={idx}
                      onClick={() => handleSelectKeyword(keyword)}
                      className="text-xs font-medium text-[#211B2E] bg-[#EDE6D6]/50 hover:bg-[#C9A227]/10 hover:text-[#C9A227] px-3 py-1.5 cursor-pointer border border-[#C9A227]/10 rounded-md transition-colors"
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
            className="flex items-center gap-1.5 px-3 py-2 bg-cta-gradient text-white rounded-md text-xs font-black shadow-md transition-all cursor-pointer"
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
            className="p-2 bg-[#EDE6D6]/50 hover:bg-[#EDE6D6] text-[#211B2E] border border-[#C9A227]/20 rounded-md transition-colors cursor-pointer"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Wishlist Heart Icon Button */}
          <button 
            onClick={() => {
              if (!isAuthenticated) {
                alert("Please login or sign up to view your wishlist!");
                navigate("/login");
              } else {
                openWishlistDrawer();
              }
            }}
            className="relative p-2 bg-[#EDE6D6]/50 hover:bg-[#EDE6D6] text-[#211B2E] border border-[#C9A227]/20 rounded-md transition-colors cursor-pointer"
          >
            <Heart className={`w-5 h-5 ${wishlistCount > 0 ? "text-red-500 fill-red-500 animate-pulse" : ""}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#B5651D] text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center font-mono shadow-sm">
                {wishlistCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => {
              if (!isAuthenticated) {
                alert("Please login or sign up to view your shopping cart!");
                navigate("/login");
              } else {
                openCartDrawer();
              }
            }}
            className="relative p-2 bg-[#EDE6D6]/50 hover:bg-[#EDE6D6] text-[#211B2E] border border-[#C9A227]/20 rounded-md transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#B5651D] text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center font-mono shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <button 
              onClick={() => navigate("/login")} 
              className="flex items-center gap-1.5 px-3 py-2 text-[#211B2E] hover:text-[#B5651D] transition-colors cursor-pointer"
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
              className="flex items-center gap-1.5 px-4 py-2 bg-cta-gradient hover:bg-cta-gradient-hover text-white rounded-md text-xs font-black transition-all cursor-pointer"
            >
              Login
            </motion.button>
          )}
        </div>
      </div>
    </nav>
  );
}