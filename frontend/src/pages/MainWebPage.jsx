import { useMemo, useState } from "react";
import { LayoutGroup, motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSlider from "../components/ui/HeroSlider";
import BookDetailPage from "./BookDetailPage";
import BookPreviewModal from "../components/ui/BookPreviewModal";
import BookCarousel from "../components/ui/BookCarousel"; 
import { useMainPageLogic } from "../hooks/useMainPageLogic";
import { Loader2, ChevronDown } from "lucide-react";
import CartDrawer from "../components/ui/CartDrawer";
import WishlistDrawer from "../components/ui/WishlistDrawer";

import GenreBooksView from "../components/views/GenreBooksView";
import SearchResultsView from "../components/views/SearchResultsView";

import woodTexture from "../images/bg5.jpg";
import vintageTexture from "../images/card3.jpg";

function SectionWrapper({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div 
      className="relative my-10 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
      style={{ 
        maskImage: `linear-gradient(to bottom, transparent 0%, black 15px, black calc(100% - 15px), transparent 100%)`,
        WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black 15px, black calc(100% - 15px), transparent 100%)`
      }}
    >
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${vintageTexture})` }} />
      <div className="absolute inset-0 bg-[#fdf6e3]/80" />
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-10 w-full p-8 flex justify-between items-center hover:bg-[#5a3e2b]/5 transition-colors"
      >
        <h2 className="text-3xl font-serif text-[#5a3e2b] italic">{title}</h2>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronDown className="text-[#5a3e2b]" size={28} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative z-10 px-8 pb-8"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function MainWebPage() {
  const logic = useMainPageLogic();

  // Hàm xử lý khi bấm vào genre trong breadcrumb ở trang chi tiết sách
  const handleBackToGenre = (genre) => {
    // 1. Thoát trang chi tiết bằng cách clear detailedBookId
    logic.setDetailedBookId(null);
    // 2. Đảm bảo selectedGenre khớp với genre đã chọn
    logic.setSelectedGenre(genre);
    // 3. Cuộn lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isViewingDetail = !!logic.detailedBookId;
  const isViewingGenre = !isViewingDetail && logic.selectedGenre !== "";
  const isSearching = !isViewingDetail && !isViewingGenre && logic.searchQuery.trim() !== "";

  const sections = useMemo(() => {
    const recommended = logic.getRecommendedBooks();
    const mayBooks = logic.getBooksOfMay();
    const juneBooks = logic.getBooksOfJune();
    const bizBooks = logic.getBusinessSelfHelpBooks();
    return { recommended, mayBooks, juneBooks, bizBooks };
  }, [logic.books, logic.recommendedBooks, logic.brokenImages]);

  return (
    <div 
      className="min-h-screen font-sans text-ink flex flex-col relative bg-cover bg-center bg-fixed"
      style={{ 
        backgroundColor: '#f5efe0',
        backgroundImage: isViewingDetail ? `url(${vintageTexture})` : `url(${woodTexture})`,
        backgroundRepeat: 'no-repeat'
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        body, .font-sans { font-family: 'Plus Jakarta Sans', sans-serif !important; }
        h1, h2, h3, h4, .font-serif { font-family: 'Cormorant Garamond', serif !important; }
      `}</style>

      <Navbar {...logic} />

      <main className="flex-grow w-full">
        {logic.loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-white/70">
            <Loader2 className="w-10 h-10 animate-spin text-[#D49B00] mb-4" />
          </div>
        ) : (
          <LayoutGroup>
            {isViewingDetail ? (
              <BookDetailPage 
                book={logic.detailedBook} 
                activeGenre={logic.selectedGenre} // Truyền thể loại đang chọn để ưu tiên hiển thị
                onBackToHome={logic.handleBackToHome} 
                onBackToGenre={handleBackToGenre} 
                {...logic} 
              />
            ) : isViewingGenre ? (
              <GenreBooksView {...logic} />
            ) : isSearching ? (
              <SearchResultsView {...logic} />
            ) : (
              <>
                <HeroSlider {...logic} />
                <div className="max-w-7xl mx-auto py-12 px-4">
                  <SectionWrapper title={logic.getRecommendationTitle()}>
                    <BookCarousel books={sections.recommended} colorClass="bg-[#D49B00]" label={logic.getRecommendationBadge()} {...logic} />
                  </SectionWrapper>
                  <SectionWrapper title="Featured: Books of May">
                    <BookCarousel books={sections.mayBooks} colorClass="bg-emerald-500" label="May Collection" {...logic} />
                  </SectionWrapper>
                  <SectionWrapper title="Upcoming: Books of June">
                    <BookCarousel books={sections.juneBooks} colorClass="bg-blue-500" label="New Arrival" {...logic} />
                  </SectionWrapper>
                  <SectionWrapper title="Top Business & Self-Help">
                    <BookCarousel books={sections.bizBooks} colorClass="bg-amber-500" label="Personal Growth" {...logic} />
                  </SectionWrapper>
                </div>
              </>
            )}
          </LayoutGroup>
        )}
      </main>

      <AnimatePresence>
        {logic.isCartDrawerOpen && <CartDrawer {...logic} />}
        {logic.isWishlistDrawerOpen && <WishlistDrawer {...logic} />}
      </AnimatePresence>
      <BookPreviewModal {...logic} />
      <Footer />
    </div>
  );
}