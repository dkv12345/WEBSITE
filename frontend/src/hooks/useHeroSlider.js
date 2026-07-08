import { useState, useEffect, useRef, useCallback } from "react";
import { heroSlides } from "../config/constants";

export default function useHeroSlider(isPaused = false, intervalTime = 20000) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const intervalRef = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  }, []);

  // Luôn khai báo useEffect ở đây, không nằm trong hàm hay điều kiện nào
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    if (!isPaused) {
      intervalRef.current = setInterval(nextSlide, intervalTime);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isPaused, intervalTime, nextSlide]);

  return {
    currentSlide,
    setCurrentSlide,
    nextSlide,
    prevSlide
  };
}