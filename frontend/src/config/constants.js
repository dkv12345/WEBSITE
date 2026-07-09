// Mock data cho thanh tìm kiếm thông minh
import slide1 from "../images/slide1.png";
import slide2 from "../images/slide2.png";

export const recentSearchesList = ["Atomic Habits", "The Alchemist", "Sapiens"];
export const trendingSearchesList = ["Fiction", "History", "Business & Finance", "Self-Help"];

// Dữ liệu nội dung slide phần đầu trang
export const heroSlides = [
  {
    isVideo: true // Slide video không cần image
  },
  {
    title: "Find Your Next Favorite Book",
    subtitle: "Welcome Back !",
    desc: "Explore thousands of titles across every genre. From thrilling fiction to life-changing business insights. Owned by readers, curated by experts.",
    image: slide2, // Thêm dòng này
    isVideo: false,
    badge: "New Release",
    badgeBg: "bg-gold/15 text-gold border-gold/20"
  },
  {
    title: "Upgrade Your Skillset Today",
    subtitle: "Special Promotion",
    desc: "Get up to 30% off on all Business, Finance & Self-Help books during this exclusive summer collection. Knowledge is your best investment.",
    image: slide1, // Thêm dòng này
    isVideo: false,
    badge: "Flash Sale",
    badgeBg: "bg-gold/15 text-gold border-gold/20"
  }
];