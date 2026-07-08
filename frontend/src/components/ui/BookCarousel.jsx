import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import BookCard from "./BookCard"; // Đảm bảo đường dẫn đúng

export default function BookCarousel({ books, title, colorClass, label, ...props }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300; // Khoảng cách trượt mỗi lần click
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="space-y-4 py-8">
      {/* Header Section */}
      <div className="flex items-end justify-between px-4 sm:px-6">
        <div>
          <span className={`text-[10px] font-black uppercase tracking-widest text-white px-2 py-0.5 ${colorClass}`}>
            {label}
          </span>
          <h2 className="text-2xl font-serif font-bold text-gray-900 mt-2">{title}</h2>
        </div>
        
        {/* Nút điều hướng */}
        <div className="flex gap-2">
          <button onClick={() => scroll("left")} className="p-2 border border-gray-200 hover:bg-gray-50 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => scroll("right")} className="p-2 border border-gray-200 hover:bg-gray-50 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slider Container */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-6 pb-6 snap-x"
        style={{ scrollBehavior: 'smooth', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      >
        {books.slice(0, 10).map((book) => (
          <div key={book._id} className="min-w-[200px] snap-start">
            <BookCard book={book} {...props} />
          </div>
        ))}
      </div>
    </div>
  );
}