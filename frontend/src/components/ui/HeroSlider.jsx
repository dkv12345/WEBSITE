import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { heroSlides } from "../../config/constants";

// Import các tài nguyên từ thư mục local
import libraryBg from "../../images/library.png"; // Ảnh thư viện chính
import woodTexture from "../../images/wood.jpg"; // Vân gỗ làm nền

export default function HeroSlider({
  currentSlide,
  setCurrentSlide,
  nextSlide,
  prevSlide,
  books = [],
  setSelectedBook
}) {
  return (
    // Áp dụng texture vân gỗ làm background chính cho toàn bộ slider
    <div 
      className="relative overflow-hidden h-[550px] border-b-[20px] border-[#3e2723]"
      style={{ backgroundImage: `url(${woodTexture})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      {/* Lớp phủ hình ảnh thư viện cổ với độ mờ 50% */}
      <img src={libraryBg} alt="Library Interior" className="absolute inset-0 w-full h-full object-cover opacity-50" />
      
      {/* Gradient để tạo chiều sâu và làm nổi bật nội dung */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#2d1b14] via-transparent to-black/40"></div>
      
      <AnimatePresence mode="wait">
        {heroSlides.map((slide, idx) => (
          idx === currentSlide && (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 z-10"
            >
              {/* Grid container chính */}
              <div className="max-w-7xl mx-auto w-full h-full grid grid-cols-1 md:grid-cols-2 items-center px-20">
                
                {/* Nội dung bên trái (Badge, Title, Description, Button) */}
                <div className="space-y-6 text-[#fdf6e3]">
                  <span className="inline-block px-3 py-1 border border-[#D49B00] text-[#D49B00] text-[10px] font-bold tracking-[0.2em] uppercase shadow-sm">
                    {slide.badge}
                  </span>
                  <h1 className="text-6xl font-serif font-bold italic drop-shadow-md" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    {slide.title}
                  </h1>
                  <p className="text-[#fdf6e3]/90 text-lg max-w-md italic font-light drop-shadow-sm">
                    {slide.desc}
                  </p>
                  <button className="group relative border border-[#D49B00] text-[#D49B00] px-8 py-3 uppercase text-sm font-bold tracking-widest overflow-hidden transition-all hover:text-[#2d1b14] shadow-md">
                    <span className="relative z-10">Discover More</span>
                    <div className="absolute inset-0 bg-[#D49B00] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                  </button>
                </div>
                
                {/* Khu vực hiển thị sách (3 cuốn) */}
                <div className="hidden md:flex flex-col items-center justify-end relative">
                  <div className="flex items-end gap-6 mb-2">
                    {books.slice(idx * 3, idx * 3 + 3).map((b) => (
                      <motion.div 
                        key={b._id} 
                        onClick={() => setSelectedBook(b)}
                        // Hiệu ứng khi di chuột: nhô lên, xoay 3D nhẹ, phóng to nhẹ
                        whileHover={{ y: -20, rotateY: 10, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-32 h-48 cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10"
                      >
                        <img src={b.images?.large || "https://placehold.co/300x400"} alt="Book Cover" className="w-full h-full object-cover" />
                      </motion.div>
                    ))}
                  </div>
                  {/* Bệ gỗ đỡ sách (màu nâu gỗ đậm) */}
                  <div className="w-[450px] h-8 bg-[#2d1b14] border-t-4 border-[#5d4037] shadow-[0_10px_20px_rgba(0,0,0,0.8)]"></div>
                </div>
                {/* Đóng thẻ div grid */}
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      {/* Các nút điều hướng (Mũi tên trái/phải) */}
      <button onClick={prevSlide} className="absolute left-10 top-1/2 p-4 bg-[#2d1b14]/50 border border-[#D49B00] text-[#D49B00] rounded-full hover:bg-[#D49B00] hover:text-[#2d1b14] z-30 transition-all shadow-md active:scale-95">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={nextSlide} className="absolute right-10 top-1/2 p-4 bg-[#2d1b14]/50 border border-[#D49B00] text-[#D49B00] rounded-full hover:bg-[#D49B00] hover:text-[#2d1b14] z-30 transition-all shadow-md active:scale-95">
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}