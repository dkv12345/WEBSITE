import { useState, useEffect, useRef } from "react";
import { heroSlides } from "../config/constants";

export default function useHeroSlider(isPaused = false, interval = 4000) {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Dùng ref để lưu interval ID giúp quản lý việc chạy/dừng slide mượt mà
  const intervalRef = useRef(null);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  useEffect(() => {
    // Luôn dọn dẹp interval cũ trước khi thiết lập cái mới
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Chỉ thiết lập interval mới nếu không bị pause
    if (!isPaused) {
      intervalRef.current = setInterval(nextSlide, interval);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // Dependency array ổn định giúp React không bị "rối"
  }, [isPaused, interval]); 

  return {
    currentSlide,
    setCurrentSlide,
    nextSlide,
    prevSlide
  };
}