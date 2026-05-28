import { Star, Heart, Book, Calendar, Layers, Hash, MessageSquare, ChevronRight } from "lucide-react";

export default function BookDetailPage({ 
  book, 
  onBack, 
  onAddToCart, 
  onToggleLike, 
  addedToCart, 
  liked, 
  getRelatedBooks, 
  renderBookCard 
}) {
  if (!book) return <div className="text-center py-10 text-gray-400">Book dataset missing.</div>;

  return (
    <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-12 animate-fade-in">
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
        <span className="hover:text-[#F16323] cursor-pointer" onClick={onBack}>Home</span>
        <ChevronRight className="w-3 h-3" />
        <span className="hover:text-[#F16323] cursor-pointer" onClick={onBack}>Shop Directory</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-gray-900 font-bold truncate max-w-[200px]">{book.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col items-center justify-center sticky top-28">
          <div className="w-full max-w-[360px] aspect-[3/4] rounded-2xl shadow-xl overflow-hidden bg-white border border-gray-100 relative group flex items-center justify-center">
            <img 
              src={book.images?.large || book.images?.medium || "https://placehold.co/600x800/e2e8f0/64748b?text=No+Cover"} 
              alt={book.title} 
              className="w-full h-full object-contain p-2 bg-gray-50 transition-transform duration-500 group-hover:scale-102"
            />
            {book.tags?.includes("bestseller") && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded shadow-md tracking-wider">
                POPULAR CHOICE
              </span>
            )}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {book.genres?.map((g, i) => (
                <span key={i} className="text-[10px] font-black text-[#F16323] bg-orange-50 border border-orange-100/70 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  {g}
                </span>
              ))}
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
              {book.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-gray-500">
              <p>By: <span className="text-[#F16323] font-bold hover:underline cursor-pointer">{book.author}</span></p>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-gray-900 font-bold">{book.metrics?.averageRating || 0}</span>
                <span>({(book.metrics?.reviewCount || 0).toLocaleString()} reviews)</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-0.5">Database Retail Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-gray-900">${book.price?.toFixed(2)}</span>
                {book.oldPrice && (
                  <span className="text-sm font-bold text-gray-400 line-through">${book.oldPrice.toFixed(2)}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => onToggleLike(book._id)}
                className="p-3.5 bg-gray-100 border border-gray-200/60 rounded-xl text-gray-500 hover:text-red-500 transition-colors shadow-2xs"
              >
                <Heart className={`w-5 h-5 ${liked[book._id] ? "fill-red-500 text-red-500" : ""}`} />
              </button>
              <button 
                onClick={() => onAddToCart(book._id)}
                className={`flex-1 sm:flex-none px-8 py-3.5 rounded-xl font-bold text-xs shadow-md transition-all active:scale-95 text-white ${
                  addedToCart[book._id] ? "bg-green-500" : "bg-[#F16323] hover:bg-orange-600"
                }`}
              >
                {addedToCart[book._id] ? "Added to Cart ✓" : "Purchase"}
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">Product Specifications</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                <Book className="w-4 h-4 text-[#F16323]" />
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block">Publisher</span>
                  <span className="text-xs font-bold text-gray-700">{book.publisher || "N/A"}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                <Calendar className="w-4 h-4 text-[#F16323]" />
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block">Published Date</span>
                  <span className="text-xs font-bold text-gray-700">
                    {book.publishedDate ? new Date(book.publishedDate).toLocaleDateString() : "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                <Layers className="w-4 h-4 text-[#F16323]" />
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block">Page Count</span>
                  <span className="text-xs font-bold text-gray-700">{book.pageCount || "N/A"} pages</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                <Hash className="w-4 h-4 text-[#F16323]" />
                <div>
                  <span className="text-[10px] text-gray-400 font-bold block">ISBN / Reference Key</span>
                  <span className="text-xs font-bold text-gray-700 truncate block max-w-[180px]">{book.isbn || book._id}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-2">Book Description</h3>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {book.description || "No full description available for this book dataset inside the repository."}
            </p>
          </div>
        </div>
      </div>

      {/* RATING GRID */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-6">
        <h3 className="text-base font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#F16323]" /> Customer Reviews & Ratings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-gray-50 p-5 rounded-2xl border border-gray-100">
          <div className="md:col-span-3 text-center md:border-r border-gray-200/70 py-2">
            <span className="text-4xl font-black text-gray-900 block">{book.metrics?.averageRating || 0}</span>
            <div className="flex justify-center gap-0.5 my-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs text-gray-400">Store Average Rating</span>
          </div>
          <div className="md:col-span-9 space-y-2 text-xs font-semibold text-gray-600 px-2">
            <div className="flex items-center gap-2">
              <span className="w-12">5 Stars</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="bg-amber-400 h-full w-[85%]" /></div>
              <span className="w-8 text-right">85%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12">4 Stars</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="bg-amber-400 h-full w-[10%]" /></div>
              <span className="w-8 text-right">10%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12">3 Stars</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="bg-amber-400 h-full w-[5%]" /></div>
              <span className="w-8 text-right">5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOOK ALSO LIKE SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-200/60 pb-3">
          <div className="w-1.5 h-5 bg-orange-500 rounded-full" />
          <h3 className="text-base font-black text-gray-900 uppercase tracking-tight">Books You May Also Like</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {getRelatedBooks(book).length > 0 ? (
            getRelatedBooks(book).map(b => renderBookCard(b))
          ) : (
            <div className="col-span-full text-center text-gray-400 py-4">No related books found.</div>
          )}
        </div>
      </div>
    </div>
  );
}