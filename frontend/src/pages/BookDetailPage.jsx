import React, { useState, useEffect } from "react";
import { Star, Heart, Minus, Plus, ChevronRight, Info } from "lucide-react";

export default function BookDetailPage({ 
  book, 
  onBackToHome,    
  onBackToGenre,   
  onAddToCart, 
  onToggleLike, 
  addedToCart, 
  liked, 
  getRelatedBooks, 
  renderBookCard,
  brokenImages = new Set()
}) {
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [recBooks, setRecBooks] = useState([]);
  const [recLoading, setRecLoading] = useState(false);

  // Dynamic recommendations fetch
  useEffect(() => {
    if (!book?._id) return;
    const fetchDetailRecs = async () => {
      setRecLoading(true);
      try {
        const response = await fetch(`/api/recommendations?pageType=Book%20Detail&itemId=${book._id}`, {
          credentials: "include"
        });
        const data = await response.json();
        if (data.success && data.data) {
          setRecBooks(data.data.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching detail recs:", error);
      } finally {
        setRecLoading(false);
      }
    };
    fetchDetailRecs();
  }, [book?._id]);

  if (!book) return <div className="text-center py-12 text-gray-400 font-medium">Book metadata not found.</div>;

  const currentGenre = book.genres && book.genres.length > 0 ? book.genres[0] : null;

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const scrollToTabs = (tabName) => {
    setActiveTab(tabName);
    const element = document.getElementById("book-details-tabs");
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Helper function to render published date nicely
  const renderPublishedDate = (dateStr) => {
    if (!dateStr) return "N/A";
    
    const cleanStr = String(dateStr).trim();
    if (/^\d{4}$/.test(cleanStr)) {
      return cleanStr;
    }

    try {
      const parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleDateString("en-GB", { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
      }
    } catch (e) {
      console.error(e);
    }
    
    return cleanStr;
  };

  return (
    <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-10 text-gray-900 font-sans">
      
      {/* 1. Breadcrumb navigation */}
      <div className="flex items-center flex-wrap gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
        <span 
          className="hover:text-[#D49B00] cursor-pointer transition-colors" 
          onClick={onBackToHome}
        >
          Home
        </span>
        {currentGenre && (
          <>
            <ChevronRight className="w-3 h-3 text-gray-300 stroke-[3]" />
            <span 
              className="hover:text-[#D49B00] cursor-pointer transition-colors max-w-[140px] truncate"
              onClick={() => onBackToGenre ? onBackToGenre(currentGenre) : onBackToHome()}
            >
              {currentGenre}
            </span>
          </>
        )}
        <ChevronRight className="w-3 h-3 text-gray-300 stroke-[3]" />
        <span className="text-gray-800 font-black max-w-[200px] sm:max-w-[400px] truncate">
          {book.title}
        </span>
      </div>

      {/* 2. Main product structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left Column: Cover with book page stacks effect */}
        <div className="lg:col-span-5 flex justify-center sticky top-24">
          <div className="w-full max-w-[330px] aspect-[2/3] relative flex items-center justify-center bg-transparent group select-none py-4">
            
            {/* Pages Stack Effect */}
            <div 
              className="absolute top-4 bottom-4 left-4 right-1 rounded-r-[3px] pointer-events-none transform translate-x-[10px] translate-y-[2px]"
              style={{
                backgroundColor: '#fcfaf6',
                boxShadow: '3px 3px 8px rgba(0,0,0,0.06), 1px 1px 2px rgba(0,0,0,0.04)',
                backgroundImage: `
                  linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px),
                  linear-gradient(to bottom, transparent 92%, rgba(0,0,0,0.03) 92%, rgba(0,0,0,0.03) 100%)
                `,
                backgroundSize: '3px 100%, 100% 3px'
              }}
            />

            {/* Front Cover Frame */}
            <div className="relative w-full h-full border-l border-black/20 rounded-r-[2px] transition-transform duration-300 hover:rotate-[-0.5deg]
              shadow-[8px_14px_28px_rgba(0,0,0,0.14),_1px_2px_5px_rgba(0,0,0,0.08),_-1px_0px_1px_rgba(0,0,0,0.05)]"
            >
              <img 
                src={book.images?.large || book.images?.medium || "https://placehold.co/600x800?text=No+Cover"} 
                alt={book.title} 
                className="w-full h-full object-cover rounded-r-[2px]"
              />

              {/* spine curve lighting overlay */}
              <div className="absolute inset-0 pointer-events-none rounded-r-[2px]
                bg-[linear-gradient(to_right,_rgba(255,255,255,0.12)_0%,_rgba(0,0,0,0.22)_3%,_rgba(255,255,255,0.18)_5%,_rgba(0,0,0,0.04)_8%,_rgba(0,0,0,0)_12%)]" 
              />
              
              {/* reflecting cover boundary line */}
              <div className="absolute top-0 right-0 h-full w-[1.5px] bg-white/20 pointer-events-none rounded-r-[1px]" />
            </div>

          </div>
        </div>

        {/* Right Column: Info and Order buttons */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3.5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              {book.genres?.map((g, i) => (
                <span 
                  key={i} 
                  className="text-[10px] font-black text-[#D49B00] uppercase tracking-widest cursor-default select-none"
                >
                  {g}
                </span>
              ))}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight tracking-tight">
              {book.title}
            </h1>
            
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Author: <span className="text-gray-800 font-black underline underline-offset-2 hover:text-[#D49B00] cursor-pointer transition-colors">{book.author}</span>
            </p>
          </div>

          <hr className="border-gray-100" />

          {/* Pricing Row */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">Price</span>
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl font-black text-gray-900 tracking-tight">${book.price?.toFixed(2)}</span>
              {book.oldPrice && (
                <span className="text-sm font-bold text-gray-400 line-through">${book.oldPrice.toFixed(2)}</span>
              )}
            </div>
          </div>



          {/* Key highlights (trust indicators) */}
          <div className="grid grid-cols-2 gap-3 max-w-lg pt-1 pb-3 text-[11px] text-gray-500 font-bold border-b border-gray-50">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-50 text-[#D49B00] flex items-center justify-center text-[10px]">✓</span>
              <span>Publisher Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px]">✓</span>
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]">✓</span>
              <span>Secure Transactions</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center text-[10px]">★</span>
              <span>Top Rated Choice</span>
            </div>
          </div>

          {/* Quantity and Cart Controls */}
          <div className="flex flex-wrap items-center gap-3 max-w-lg pt-2">
            <div className="flex items-center border border-gray-200 h-11 bg-white">
              <button 
                onClick={handleDecrement}
                className="px-3 h-full text-gray-400 hover:text-gray-700 active:bg-gray-50 transition-colors"
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
              <span className="w-10 text-center text-xs font-black select-none text-gray-800">
                {quantity}
              </span>
              <button 
                onClick={handleIncrement}
                className="px-3 h-full text-gray-400 hover:text-gray-700 active:bg-gray-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>

            <button 
              onClick={() => {
                for(let i=0; i<quantity; i++) onAddToCart(book._id);
              }}
              className={`flex-1 min-w-[180px] h-11 rounded-none font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98] text-white ${
                addedToCart[book._id] ? "bg-emerald-600" : "bg-[#D49B00] hover:bg-[#b88600]"
              }`}
            >
              {addedToCart[book._id] ? "Added to Cart ✓" : "Add to Cart"}
            </button>

            <button 
              onClick={() => onToggleLike(book._id)}
              className="w-11 h-11 flex items-center justify-center bg-white border border-gray-200 rounded-none text-gray-400 hover:text-red-500 hover:border-gray-300 transition-all active:scale-95"
            >
              <Heart className={`w-4 h-4 ${liked[book._id] ? "fill-red-500 text-red-500 border-transparent" : ""}`} />
            </button>
          </div>

          {/* Tab Information Control */}
          <div id="book-details-tabs" className="pt-6 scroll-mt-28">
            <div className="flex border-b border-gray-200 gap-6">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-2.5 text-xs font-black uppercase tracking-widest -mb-[1px] transition-all ${
                  activeTab === "description"
                    ? "border-b-2 border-gray-900 text-gray-900"
                    : "border-b-2 border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`pb-2.5 text-xs font-black uppercase tracking-widest -mb-[1px] transition-all ${
                  activeTab === "details"
                    ? "border-b-2 border-gray-900 text-gray-900"
                    : "border-b-2 border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-2.5 text-xs font-black uppercase tracking-widest -mb-[1px] transition-all ${
                  activeTab === "reviews"
                    ? "border-b-2 border-gray-900 text-gray-900"
                    : "border-b-2 border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Reviews ({book.metrics?.reviewCount || 0})
              </button>
            </div>

            {/* Tab contents */}
            <div className="py-6 min-h-[140px]">
              {activeTab === "description" && (
                <div className="text-xs text-gray-500 font-medium leading-relaxed whitespace-pre-line max-w-2xl">
                  {book.description || "No full description available for this volume."}
                </div>
              )}

              {/* Tab Details */}
              {activeTab === "details" && (
                <div className="flex items-start gap-6 max-w-md text-left py-2">
                  <div className="shrink-0 pt-0.5">
                    <Info className="w-6 h-6 text-[#D49B00] opacity-95" />
                  </div>
                  
                  <div className="space-y-1.5 text-xs text-gray-900">
                    {book.pageCount ? (
                      <div>
                        <span className="font-black inline-block w-28">Pages:</span>
                        <span className="text-gray-600 font-medium">{book.pageCount}</span>
                      </div>
                    ) : null}

                    <div>
                      <span className="font-black inline-block w-28">Publisher:</span>
                      <span className="text-gray-600 font-medium">{book.publisher || "1517 Publishing"}</span>
                    </div>
                    <div>
                      <span className="font-black inline-block w-28">Imprint:</span>
                      <span className="text-gray-600 font-medium">{book.imprint || book.publisher || "1517 Publishing"}</span>
                    </div>
                    <div>
                      <span className="font-black inline-block w-28">Publication Date:</span>
                      <span className="text-gray-600 font-medium">
                        {renderPublishedDate(book.publishedDate)}
                      </span>
                    </div>
                    <div>
                      <span className="font-black inline-block w-28">ISBN:</span>
                      <span className="text-gray-600 font-medium break-all">{book.isbn || "9781964419275"}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6 max-w-xl">
                  <div className="flex gap-6 items-center bg-gray-50/70 p-5 border border-gray-100">
                    <div className="text-center pr-6 border-r border-gray-200 shrink-0">
                      <span className="text-3xl font-black text-gray-900 block leading-none">{book.metrics?.averageRating || 0}</span>
                      <div className="flex justify-center gap-0.5 my-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">Rating</span>
                    </div>
                    
                    <div className="flex-grow space-y-1.5 text-[10px] font-bold text-gray-400">
                      <div className="flex items-center gap-2">
                        <span className="w-10 font-extrabold text-gray-500">5 Stars</span>
                        <div className="flex-1 h-1.5 bg-gray-100 overflow-hidden"><div className="bg-amber-400 h-full w-[85%]" /></div>
                        <span className="w-6 text-right text-gray-600">85%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-10 font-extrabold text-gray-500">4 Stars</span>
                        <div className="flex-1 h-1.5 bg-gray-100 overflow-hidden"><div className="bg-amber-400 h-full w-[15%]" /></div>
                        <span className="w-6 text-right text-gray-600">15%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    No customer reviews yet.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. You may also like dynamic recommendations */}
      <div className="space-y-4 pt-8 border-t border-gray-200/80">
        <div className="flex items-center justify-between">
          <h3 className="text-md font-black text-gray-900 uppercase tracking-tight">You may also like</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {recLoading ? (
            <div className="col-span-full text-center text-gray-400 py-10 text-xs font-bold animate-pulse">Loading dynamic recommendations...</div>
          ) : recBooks.length > 0 ? (
            recBooks.filter(b => !brokenImages.has(b._id)).slice(0, 10).map(b => renderBookCard(b))
          ) : getRelatedBooks(book).length > 0 ? (
            getRelatedBooks(book).filter(b => !brokenImages.has(b._id)).slice(0, 10).map(b => renderBookCard(b))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-6 text-xs font-semibold">No similar items found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
