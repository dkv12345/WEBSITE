import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { heroSlides } from "../../config/constants";
import libraryVideo from "../../videos/library.mp4"; 

export default function HeroSlider({
  currentSlide,
  nextSlide,
  prevSlide
}) {
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 10000); 
  }, [nextSlide]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const handleManualNav = (action) => {
    action();
    resetTimer();
  };

  return (
    <div 
      className="relative overflow-hidden h-[750px] bg-void"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    > 
      <AnimatePresence mode="wait">
        {heroSlides.map((slide, idx) => (
          idx === currentSlide && (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 z-0"
            >
              {slide.isVideo ? (
                <video
                  key="hero-video"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src={libraryVideo} type="video/mp4" />
                </video>
              ) : (
                <div 
                  className="absolute inset-0 w-full h-full"
                  style={{ 
                    backgroundImage: `url(${slide.image})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                  }}
                />
              )}
              
              {/* Gradient che phủ dùng màu void thay cho nâu */}
              <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-black/40 z-10"></div>
              
              {!slide.isVideo && (
                <div className="relative z-20 max-w-7xl mx-auto w-full h-full grid grid-cols-1 md:grid-cols-2 items-center px-20">
                  <div className="space-y-6 text-starlight">
                    <span className="inline-block px-3 py-1 border border-gold text-gold text-[10px] font-bold tracking-[0.2em] uppercase shadow-sm">
                      {slide.badge}
                    </span>
                    <h1 className="text-6xl font-display font-bold italic drop-shadow-md">{slide.title}</h1>
                    <p className="text-starlight/90 text-lg max-w-md italic font-light">{slide.desc}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )
        ))}
      </AnimatePresence>

      <motion.div 
        className="absolute inset-0 z-30 pointer-events-none flex items-center justify-between px-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <button 
          onClick={() => handleManualNav(prevSlide)} 
          className="pointer-events-auto p-4 bg-void/50 border border-gold text-gold rounded-full hover:bg-gold hover:text-void transition-all shadow-md active:scale-95"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={() => handleManualNav(nextSlide)} 
          className="pointer-events-auto p-4 bg-void/50 border border-gold text-gold rounded-full hover:bg-gold hover:text-void transition-all shadow-md active:scale-95"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </motion.div>
    </div>
  );
}