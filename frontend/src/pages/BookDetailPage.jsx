import React, { useState, useEffect } from "react";
import { Star, Heart, Minus, Plus, ChevronRight, Info, ShoppingBag, Check } from "lucide-react";
import { motion } from "framer-motion";
import BookCard from "../components/ui/BookCard"; 
import infoIcon from "../images/info.png"; 

export default function BookDetailPage({ 
  book, 
  activeGenre,
  onBackToHome,    
  onBackToGenre,   
  onAddToCart, 
  onToggleLike, 
  addedToCart, 
  liked, 
  getRelatedBooks, 
  renderBookCard, 
  setDetailedBookId, 
  brokenImages = new Set()
}) {
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [recBooks, setRecBooks] = useState([]);
  const [recLoading, setRecLoading] = useState(false);

  const currentGenre = activeGenre || (book?.genres && book.genres.length > 0 ? book.genres[0] : null);

  const safeRenderBookCard = (b) => {
    if (typeof renderBookCard === 'function') {
      return renderBookCard(b);
    }
    return <BookCard key={b._id} book={b} />;
  };

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

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const renderPublishedDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const cleanStr = String(dateStr).trim();
    if (/^\d{4}$/.test(cleanStr)) return cleanStr;
    try {
      const parsedDate = new Date(dateStr);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleDateString("en-GB", { day: 'numeric', month: 'long', year: 'numeric' });
      }
    } catch (e) { console.error(e); }
    return cleanStr;
  };

  return (
    <div className="w-full bg-[#F7EFE1]/80 py-6">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 space-y-10 text-[#211B2E] font-sans">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center flex-wrap gap-1.5 text-[11px] font-bold text-[#211B2E]/40 uppercase tracking-widest">
          <span className="hover:text-gold cursor-pointer transition-colors" onClick={(e) => { e.stopPropagation(); onBackToHome(); }}>Home</span>
          {currentGenre && (
            <>
              <ChevronRight className="w-3 h-3 text-[#C9A227]/30 stroke-[3]" />
              <span 
                className="hover:text-gold cursor-pointer transition-colors max-w-[140px] truncate"
                onClick={(e) => { e.stopPropagation(); onBackToGenre ? onBackToGenre(currentGenre) : onBackToHome(); }}
              >
                {currentGenre}
              </span>
            </>
          )}
          <ChevronRight className="w-3 h-3 text-[#C9A227]/30 stroke-[3]" />
          <span className="text-[#211B2E] font-black max-w-[200px] sm:max-w-[400px] truncate">{book.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5 flex justify-center sticky top-24">
            <div className="w-full max-w-[330px] aspect-[2/3] relative flex items-center justify-center bg-transparent group select-none py-4">
              <div 
                className="absolute top-4 bottom-4 left-4 right-1 rounded-r-[3px] pointer-events-none transform translate-x-[10px] translate-y-[2px]"
                style={{
                  backgroundColor: '#fcfaf6',
                  boxShadow: '3px 3px 8px rgba(0,0,0,0.06), 1px 1px 2px rgba(0,0,0,0.04)',
                  backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, transparent 92%, rgba(0,0,0,0.03) 92%, rgba(0,0,0,0.03) 100%)`,
                  backgroundSize: '3px 100%, 100% 3px'
                }}
              />
              <div className="relative w-full h-full border-l border-black/20 rounded-r-[2px] transition-transform duration-300 hover:rotate-[-0.5deg] shadow-[8px_14px_28px_rgba(0,0,0,0.14),_1px_2px_5px_rgba(0,0,0,0.08),_-1px_0px_1px_rgba(0,0,0,0.05)]">
                <img src={book.images?.large || book.images?.medium || "https://placehold.co/600x800?text=No+Cover"} alt={book.title} className="w-full h-full object-cover rounded-r-[2px]" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3.5">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {book.genres?.map((g, i) => <span key={i} className="text-[10px] font-cinzel-lbl text-[#C9A227] uppercase tracking-widest">{g}</span>)}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#211B2E] leading-tight font-display">{book.title}</h1>
              <p className="text-xs font-bold text-[#211B2E]/50 uppercase tracking-wide">Author: <span className="text-[#211B2E] font-black underline cursor-pointer">{book.author}</span></p>
            </div>

            <hr className="border-[#C9A227]/15" />

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#211B2E]/50 uppercase tracking-widest block">Price</span>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-black text-[#211B2E] tracking-tight">${book.price?.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 max-w-lg pt-2">
              {/* Premium Quantity Selector */}
              <div className="flex items-center border border-[#C9A227]/30 h-11 bg-white rounded-md overflow-hidden shadow-xs">
                <button 
                  onClick={handleDecrement} 
                  className="px-3.5 h-11 text-[#211B2E]/70 hover:text-[#211B2E] hover:bg-[#EDE6D6]/40 active:bg-[#EDE6D6]/60 transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-bold font-mono text-[#211B2E]">{quantity}</span>
                <button 
                  onClick={handleIncrement} 
                  className="px-3.5 h-11 text-[#211B2E]/70 hover:text-[#211B2E] hover:bg-[#EDE6D6]/40 active:bg-[#EDE6D6]/60 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Premium Add to Cart Button */}
              <motion.button 
                whileHover={{ scale: 1.02, translateY: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onAddToCart(book._id, quantity)}
                className={`flex-1 min-w-[180px] h-11 text-white font-extrabold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 rounded-md shadow-md hover:shadow-lg cursor-pointer ${
                  addedToCart[book._id] 
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-600/20" 
                    : "bg-cta-gradient hover:bg-cta-gradient-hover shadow-gold/20"
                }`}
              >
                {addedToCart[book._id] ? (
                  <>
                    <Check className="w-4 h-4 animate-scale-up" />
                    <span>Added ✓</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </motion.button>

              {/* Wishlist Toggle Heart Button */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onToggleLike(book._id)}
                className={`w-11 h-11 flex items-center justify-center rounded-md border border-[#C9A227]/30 transition-all duration-300 cursor-pointer shrink-0 ${
                  liked[book._id] 
                    ? "bg-red-500/10 text-red-500 border-red-500/30" 
                    : "bg-[#EDE6D6]/30 text-[#211B2E]/60 hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/20"
                }`}
                title={liked[book._id] ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <Heart className={`w-5 h-5 ${liked[book._id] ? "fill-red-500 text-red-500 animate-scale-up" : ""}`} />
              </motion.button>
            </div>

            <div id="book-details-tabs" className="pt-6">
              <div className="flex border-b border-[#C9A227]/25 gap-6">
                {["description", "details", "reviews"].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2.5 text-xs font-black uppercase transition-colors cursor-pointer ${activeTab === tab ? "border-b-2 border-[#211B2E] text-[#211B2E]" : "text-[#211B2E]/40 hover:text-[#211B2E]"}`}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="py-6 min-h-[140px]">
                {activeTab === "description" && <div className="text-xs text-[#211B2E]/70 leading-relaxed">{book.description}</div>}
                {activeTab === "details" && (
                  <div className="flex items-start gap-6">
                    <div className="flex items-center"><img src={infoIcon} alt="info" className="w-12 h-12 object-contain" /><div className="w-[1px] h-16 bg-[#C9A227]/30 ml-4" /></div>
                    <div className="space-y-3 text-xs flex flex-col justify-center h-16">
                      <div className="flex gap-2"><span className="font-black text-[#211B2E]">Publisher:</span><span className="text-[#211B2E]/70">{book.publisher || "N/A"}</span></div>
                      <div className="flex gap-2"><span className="font-black text-[#211B2E]">ISBN:</span><span className="text-[#211B2E]/70 font-mono">{book.isbn || "N/A"}</span></div>
                      <div className="flex gap-2"><span className="font-black text-[#211B2E]">Publish date:</span><span className="text-[#211B2E]/70">{renderPublishedDate(book.publishedDate)}</span></div>
                    </div>
                  </div>
                )}
                {activeTab === "reviews" && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
                    {/* Overall Score */}
                    <div className="md:col-span-4 space-y-4 bg-white/40 p-5 rounded-md border border-[#C9A227]/15">
                      <div className="text-center md:text-left">
                        <span className="text-[11px] font-bold text-[#211B2E]/50 uppercase tracking-widest block">Customer Reviews</span>
                        <div className="flex items-baseline justify-center md:justify-start gap-2 mt-2">
                          <span className="text-4xl font-black text-[#211B2E]">4.8</span>
                          <span className="text-sm font-semibold text-[#211B2E]/60">/ 5</span>
                        </div>
                        <div className="flex justify-center md:justify-start mt-1.5">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 text-[#C9A227] fill-[#C9A227]" />
                            ))}
                          </div>
                        </div>
                        <span className="text-[10px] text-[#211B2E]/50 mt-1 block">Based on 124 reviews</span>
                      </div>

                      <hr className="border-[#C9A227]/10" />

                      {/* Score breakdown progress bars */}
                      <div className="space-y-2 text-xs">
                        {[
                          { stars: 5, pct: 82, count: 102 },
                          { stars: 4, pct: 12, count: 15 },
                          { stars: 3, pct: 4, count: 5 },
                          { stars: 2, pct: 1, count: 1 },
                          { stars: 1, pct: 1, count: 1 }
                        ].map((row) => (
                          <div key={row.stars} className="flex items-center gap-3">
                            <span className="w-3 font-semibold text-[#211B2E]/70">{row.stars}</span>
                            <Star className="w-3 h-3 text-[#C9A227] fill-[#C9A227] shrink-0" />
                            <div className="flex-1 h-2 bg-[#EDE6D6]/50 rounded-full overflow-hidden">
                              <div className="h-full bg-[#C9A227] rounded-full" style={{ width: `${row.pct}%` }} />
                            </div>
                            <span className="w-7 text-right text-[10px] text-[#211B2E]/50">{row.pct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Review List */}
                    <div className="md:col-span-8 space-y-6">
                      <div className="flex justify-between items-center border-b border-[#C9A227]/15 pb-3">
                        <h4 className="text-xs font-black uppercase text-[#211B2E] tracking-wider">Showing 2 Featured Reviews</h4>
                        <button 
                          onClick={() => alert("Write review modal coming soon!")}
                          className="px-3 py-1.5 bg-transparent hover:bg-[#EDE6D6]/40 text-[#211B2E] border border-[#C9A227]/30 hover:border-[#C9A227] text-[10px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer"
                        >
                          Write a review
                        </button>
                      </div>

                      <div className="space-y-6 divide-y divide-[#C9A227]/10">
                        {[
                          {
                            name: "Elena Rostova",
                            rating: 5,
                            date: "June 18, 2026",
                            title: "Absolument magnifique",
                            comment: "This book is a masterclass in storytelling. The character development is profound, and the themes resonated deeply with me. The physical book quality from BookHaven is also exceptional with its heavy paper and clean binding.",
                            initials: "ER"
                          },
                          {
                            name: "Arthur Pendleton",
                            rating: 4,
                            date: "May 29, 2026",
                            title: "Thought-provoking and elegant",
                            comment: "A brilliant read that kept me thinking long after finishing the last page. The author's prose is gorgeous. Highly recommended for anyone looking to expand their worldview.",
                            initials: "AP"
                          }
                        ].map((review, idx) => (
                          <div key={idx} className="pt-5 first:pt-0 space-y-2.5">
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#EDE6D6] border border-[#C9A227]/20 flex items-center justify-center text-[11px] font-bold text-[#211B2E] shrink-0 font-mono">
                                  {review.initials}
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-[#211B2E] block">{review.name}</span>
                                  <span className="text-[10px] text-[#211B2E]/40 block">{review.date}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-3 h-3 ${
                                      i < review.rating 
                                        ? "text-[#C9A227] fill-[#C9A227]" 
                                        : "text-[#EDE6D6]/60 fill-transparent"
                                    }`} 
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <h5 className="text-xs font-bold text-[#211B2E]">{review.title}</h5>
                              <p className="text-xs text-[#211B2E]/70 leading-relaxed font-sans">{review.comment}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-8 border-t border-[#C9A227]/20">
          <h3 className="text-md font-black text-[#211B2E] uppercase">You may also like</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {recLoading ? <div>Loading...</div> : (recBooks.length > 0 ? recBooks : getRelatedBooks(book))
              .filter(b => !brokenImages.has(b._id))
              .slice(0, 10)
              .map(b => (
                <div 
                  key={b._id} 
                  className="relative cursor-pointer transition-transform hover:scale-[1.02] duration-200"
                  onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); if (setDetailedBookId) setDetailedBookId(b._id); }}
                >
                  <div className="absolute inset-0 z-10 cursor-pointer" />
                  <div className="relative z-0">{safeRenderBookCard(b)}</div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}