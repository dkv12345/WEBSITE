import React, { useState, useEffect } from "react";
import { Star, Heart, Minus, Plus, ChevronRight, Info } from "lucide-react";
import { motion } from "framer-motion";
import BookCard from "../components/ui/BookCard"; 
import infoIcon from "../images/info.png"; 

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
  setDetailedBookId, 
  brokenImages = new Set()
}) {
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [recBooks, setRecBooks] = useState([]);
  const [recLoading, setRecLoading] = useState(false);

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

  const currentGenre = book.genres && book.genres.length > 0 ? book.genres[0] : null;

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
    // Đã bỏ backgroundImage và bg-fixed để tránh xung đột với MainWebPage
    <div className="w-full bg-transparent py-6">
      
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 space-y-10 text-gray-900 font-sans">
        
        <div className="flex items-center flex-wrap gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          <span className="hover:text-gold cursor-pointer transition-colors" onClick={onBackToHome}>Home</span>
          {currentGenre && (
            <>
              <ChevronRight className="w-3 h-3 text-gray-300 stroke-[3]" />
              <span 
                className="hover:text-gold cursor-pointer transition-colors max-w-[140px] truncate"
                onClick={() => onBackToGenre ? onBackToGenre(currentGenre) : onBackToHome()}
              >
                {currentGenre}
              </span>
            </>
          )}
          <ChevronRight className="w-3 h-3 text-gray-300 stroke-[3]" />
          <span className="text-gray-800 font-black max-w-[200px] sm:max-w-[400px] truncate">{book.title}</span>
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
                <img 
                  src={book.images?.large || book.images?.medium || "https://placehold.co/600x800?text=No+Cover"} 
                  alt={book.title} 
                  className="w-full h-full object-cover rounded-r-[2px]"
                />
                <div className="absolute inset-0 pointer-events-none rounded-r-[2px] bg-[linear-gradient(to_right,_rgba(255,255,255,0.12)_0%,_rgba(0,0,0,0.22)_3%,_rgba(255,255,255,0.18)_5%,_rgba(0,0,0,0.04)_8%,_rgba(0,0,0,0)_15%)]" />
                <div className="absolute top-0 right-0 h-full w-[1.5px] bg-white/20 pointer-events-none rounded-r-[1px]" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3.5">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                {book.genres?.map((g, i) => (
                  <span key={i} className="text-[10px] font-cinzel-lbl text-gold uppercase tracking-widest">{g}</span>
                ))}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight font-display">{book.title}</h1>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                Author: <span className="text-gray-800 font-black underline cursor-pointer">{book.author}</span>
              </p>
            </div>

            <hr className="border-gray-100" />

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">Price</span>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-black text-gray-900 tracking-tight">${book.price?.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 max-w-lg pt-2">
              <div className="flex items-center border border-gray-200 h-11 bg-white">
                <button onClick={handleDecrement} className="px-3 h-11"><Minus className="w-3.5 h-3.5" /></button>
                <span className="w-10 text-center text-xs font-black">{quantity}</span>
                <button onClick={handleIncrement} className="px-3 h-11"><Plus className="w-3.5 h-3.5" /></button>
              </div>
              <motion.button 
                onClick={() => { for(let i=0; i<quantity; i++) onAddToCart(book._id); }}
                className={`flex-1 min-w-[180px] h-11 text-white font-black text-xs uppercase ${addedToCart[book._id] ? "bg-emerald-600" : "bg-black"}`}
              >
                {addedToCart[book._id] ? "Added ✓" : "Add to Cart"}
              </motion.button>
            </div>

            <div id="book-details-tabs" className="pt-6">
              <div className="flex border-b border-gray-200 gap-6">
                {["description", "details", "reviews"].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-2.5 text-xs font-black uppercase ${activeTab === tab ? "border-b-2 border-black" : "text-gray-400"}`}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="py-6 min-h-[140px]">
                {activeTab === "description" && <div className="text-xs text-gray-500 leading-relaxed">{book.description}</div>}
                
                {activeTab === "details" && (
                  <div className="flex items-start gap-6">
                    <div className="flex items-center">
                      <img src={infoIcon} alt="info" className="w-12 h-12 object-contain" />
                      <div className="w-[1px] h-16 bg-gray-300 ml-4" />
                    </div>
                    <div className="space-y-3 text-xs flex flex-col justify-center h-16">
                      <div className="flex gap-2">
                        <span className="font-black text-gray-900">Publisher:</span>
                        <span className="text-gray-600">{book.publisher || "N/A"}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-black text-gray-900">ISBN:</span>
                        <span className="text-gray-600 font-mono">{book.isbn || "N/A"}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="font-black text-gray-900">Publish date:</span>
                        <span className="text-gray-600">{renderPublishedDate(book.publishedDate)}</span>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "reviews" && <div className="text-xs">No reviews yet.</div>}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-8 border-t border-gray-200/80">
          <h3 className="text-md font-black text-gray-900 uppercase">You may also like</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {recLoading ? <div>Loading...</div> : (recBooks.length > 0 ? recBooks : getRelatedBooks(book))
              .filter(b => !brokenImages.has(b._id))
              .slice(0, 10)
              .map(b => (
                <div 
                  key={b._id} 
                  className="relative cursor-pointer transition-transform hover:scale-[1.02] duration-200"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    if (setDetailedBookId) setDetailedBookId(b._id);
                  }}
                >
                  <div className="absolute inset-0 z-10 cursor-pointer" />
                  <div className="relative z-0">
                    {safeRenderBookCard(b)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}