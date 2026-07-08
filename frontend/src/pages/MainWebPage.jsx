import { useMemo } from "react";
import { LayoutGroup } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroSlider from "../components/ui/HeroSlider";
import BookDetailPage from "./BookDetailPage";
import BookPreviewModal from "../components/ui/BookPreviewModal";
import BookCarousel from "../components/ui/BookCarousel"; 
import { useMainPageLogic } from "../hooks/useMainPageLogic";
import { Loader2 } from "lucide-react";

import GenreBooksView from "../components/views/GenreBooksView";
import SearchResultsView from "../components/views/SearchResultsView";

// Import file nền gỗ
import woodTexture from "../images/vintage2.jpg";

export default function MainWebPage() {
  const logic = useMainPageLogic();

  // Xác định trạng thái hiển thị để tránh xung đột render
  const isViewingDetail = !!logic.detailedBookId;
  const isViewingGenre = !isViewingDetail && logic.selectedGenre !== "";
  const isSearching = !isViewingDetail && !isViewingGenre && logic.searchQuery.trim() !== "";

  // Sử dụng useMemo để tính toán danh sách không trùng lặp, đảm bảo tính ổn định khi render
  const sections = useMemo(() => {
    const recommended = logic.getRecommendedBooks();
    const recIds = recommended.map(b => b._id);

    const mayBooks = logic.getBooksOfMay(recIds);
    const mayIds = [...recIds, ...mayBooks.map(b => b._id)];

    const juneBooks = logic.getBooksOfJune(mayIds);
    const juneIds = [...mayIds, ...juneBooks.map(b => b._id)];

    const bizBooks = logic.getBusinessSelfHelpBooks(juneIds);

    return { recommended, mayBooks, juneBooks, bizBooks };
  }, [logic.books, logic.recommendedBooks, logic.brokenImages]);

  return (
    <div 
      className="min-h-screen font-sans text-ink flex flex-col relative"
      style={{ 
        backgroundImage: `url(${woodTexture})`, 
        backgroundSize: 'cover', 
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center' 
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@300;400;500&family=Cinzel:wght@400;700&display=swap');
        body, .font-sans { font-family: 'Plus Jakarta Sans', sans-serif !important; }
        h1, h2, h3, h4, .font-serif { font-family: 'Cormorant Garamond', serif !important; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {logic.isSearchFocused && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 transition-all duration-200" />
      )}

      <Navbar {...logic} />

      {logic.loading ? (
        <div className="flex-grow flex flex-col items-center justify-center py-32 text-white/70">
          <Loader2 className="w-10 h-10 animate-spin text-[#D49B00] mb-4" />
          <p className="text-base font-semibold">Synchronizing with system database...</p>
        </div>
      ) : logic.error ? (
        <div className="flex-grow flex flex-col items-center justify-center py-32 text-red-300">
          <p className="text-lg font-bold">System Connection Failed: {logic.error}</p>
        </div>
      ) : (
        <LayoutGroup>
          <div className="flex-grow">
            {isViewingDetail ? (
              <BookDetailPage 
                book={logic.detailedBook}
                onBackToHome={logic.handleBackToHome}
                onBackToGenre={(genre) => { logic.setDetailedBookId(null); logic.handleSelectGenre(genre); }}
                {...logic}
              />
            ) : isViewingGenre ? (
              <GenreBooksView {...logic} />
            ) : isSearching ? (
              <SearchResultsView {...logic} />
            ) : (
              <>
                <HeroSlider {...logic} />
                {/* Loại bỏ màu nền, chỉ để lại hiệu ứng mờ nhẹ giúp chữ dễ đọc nhưng vẫn xuyên thấu nền gỗ */}
                <div className="max-w-7xl mx-auto py-12 space-y-12 backdrop-blur-[1px] bg-white/5 px-4">
                  <BookCarousel 
                    title={logic.getRecommendationTitle()} 
                    books={sections.recommended} 
                    colorClass="bg-[#D49B00]" 
                    label={logic.getRecommendationBadge()} 
                    {...logic} 
                  />
                  <BookCarousel 
                    title="Featured: Books of May" 
                    books={sections.mayBooks} 
                    colorClass="bg-emerald-500" 
                    label="May Collection" 
                    {...logic} 
                  />
                  <BookCarousel 
                    title="Upcoming: Books of June" 
                    books={sections.juneBooks} 
                    colorClass="bg-blue-500" 
                    label="New Arrival" 
                    {...logic} 
                  />
                  <BookCarousel 
                    title="Top Business & Self-Help" 
                    books={sections.bizBooks} 
                    colorClass="bg-amber-500" 
                    label="Personal Growth" 
                    {...logic} 
                  />
                </div>
              </>
            )}
          </div>
        </LayoutGroup>
      )}

      <BookPreviewModal {...logic} />
      <Footer />
    </div>
  );
}