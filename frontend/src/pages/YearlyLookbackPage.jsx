import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, Sparkles, TrendingUp, DollarSign, Award, 
  Share2, ArrowLeft, ArrowRight, Play, RefreshCw, LogOut, Check, AlertCircle 
} from "lucide-react";

export default function YearlyLookbackPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [lookback, setLookback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fetch Lookback details
  useEffect(() => {
    const fetchLookback = async () => {
      setLoading(true);
      setError("");
      try {
        const url = token 
          ? `/api/lookback/share/${token}` 
          : `/api/lookback`;
        
        const response = await fetch(url, { credentials: "include" });
        const result = await response.json();
        
        if (result.success && result.data) {
          setLookback(result.data);
        } else {
          setError(result.message || "Failed to load lookback.");
        }
      } catch (err) {
        console.error("Error loading lookback:", err);
        setError("Error connecting to server.");
      } finally {
        setLoading(false);
      }
    };
    fetchLookback();
  }, [token]);

  // Handle share link copy
  const handleShareCopy = () => {
    if (!lookback?.shareableUrlToken) return;
    const shareUrl = `${window.location.origin}/lookback/share/${lookback.shareableUrlToken}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090D1A] text-white flex flex-col items-center justify-center space-y-4">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-[#F16323] border-t-transparent rounded-full"
        />
        <p className="text-xs font-black uppercase tracking-widest text-[#F16323] animate-pulse">Compiling Your Year...</p>
      </div>
    );
  }

  if (error || !lookback) {
    return (
      <div className="min-h-screen bg-[#090D1A] text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-16 h-16 bg-red-950/40 border border-red-500/30 rounded-full flex items-center justify-center text-red-500">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black">Lookback Unavailable</h2>
          <p className="text-sm text-gray-400 max-w-sm">
            {error || "We couldn't compile your reading profile. Please make sure you have purchase interactions in 2026."}
          </p>
        </div>
        <button
          onClick={() => navigate("/mainwebpage")}
          className="bg-gradient-to-r from-[#F16323] to-[#d9561c] text-white font-black text-xs px-6 py-3 rounded-xl transition cursor-pointer"
        >
          Return to Homepage
        </button>
      </div>
    );
  }

  const { metrics, persona, userId } = lookback;
  const { topGenres, topAuthors, readingMinutes, moneySaved, totalPagesRead } = metrics;
  const userName = userId?.name || "Avid Reader";

  // Slide content specifications
  const slides = [
    // Slide 0: Splash Enter
    {
      bg: "from-[#0F172A] via-[#1E1B4B] to-[#0F172A]",
      element: (
        <div className="text-center space-y-8 max-w-md px-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-32 h-32 rounded-full bg-gradient-to-tr from-[#F16323] to-[#FF8C3B] mx-auto flex items-center justify-center shadow-[0_20px_50px_rgba(241,99,35,0.3)] relative group cursor-pointer"
          >
            <BookOpen className="w-14 h-14 text-white animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>

          <div className="space-y-3">
            <span className="text-[10px] font-black text-[#F16323] uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              Annual Summary
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-white pt-2">
              Your 2026 <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F16323] to-amber-400">Reading Wrapped</span>
            </h1>
            <p className="text-xs text-gray-400 font-medium pt-1">
              {token ? `Exploring ${userName}'s custom reading profile` : `Hi ${userName}, let's view your reading journey.`}
            </p>
          </div>

          <button 
            onClick={() => setCurrentSlide(1)}
            className="bg-white text-gray-900 font-black text-xs px-8 py-4 rounded-full flex items-center gap-2 mx-auto hover:bg-[#F16323] hover:text-white transition-all shadow-lg hover:shadow-orange-500/35 cursor-pointer active:scale-95"
          >
            <span>START MY EXPERIENCE</span>
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      )
    },
    // Slide 1: Reading Minutes & Pages
    {
      bg: "from-[#111827] via-[#311042] to-[#111827]",
      element: (
        <div className="text-center space-y-6 max-w-lg px-6">
          <motion.span 
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-6xl md:text-7xl font-black block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-[#F16323] tracking-tight"
          >
            {readingMinutes.toLocaleString()}
          </motion.span>
          <div className="space-y-3">
            <h2 className="text-2xl font-black text-white">Minutes Spent Reading</h2>
            <p className="text-sm text-gray-400 leading-relaxed font-medium">
              This year, you spent <span className="text-white font-bold">{readingMinutes.toLocaleString()} minutes</span> reading. That equals flipping through about <span className="text-[#F16323] font-bold">{totalPagesRead.toLocaleString()} pages</span> of knowledge, stories, and growth!
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-28 text-center">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Pages</span>
              <span className="text-lg font-black text-white mt-1 block">{totalPagesRead}</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-28 text-center">
              <span className="text-[10px] text-gray-400 uppercase font-bold block">Avg/Day</span>
              <span className="text-lg font-black text-white mt-1 block">{Math.round(readingMinutes / 365)} min</span>
            </div>
          </div>
        </div>
      )
    },
    // Slide 2: Top Genres
    {
      bg: "from-[#0B1528] via-[#093530] to-[#0B1528]",
      element: (
        <div className="space-y-6 max-w-md w-full px-6">
          <div className="text-center">
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Preference Breakdown</span>
            <h2 className="text-2xl font-black text-white mt-1.5">Your Top Genres</h2>
            <p className="text-xs text-gray-400 mt-1">The categories that captured your mind this year.</p>
          </div>

          <div className="space-y-3 pt-3">
            {topGenres.length > 0 ? (
              topGenres.slice(0, 3).map((genre, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  key={genre}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-black text-sm">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-black text-white uppercase tracking-wide">{genre}</span>
                  </div>
                  <Sparkles className="w-4 h-4 text-emerald-400/80" />
                </motion.div>
              ))
            ) : (
              <p className="text-xs text-center text-gray-500">General subjects and miscellaneous catalogs.</p>
            )}
          </div>
        </div>
      )
    },
    // Slide 3: Top Authors
    {
      bg: "from-[#0F172A] via-[#1E1B4B] to-[#0F172A]",
      element: (
        <div className="space-y-6 max-w-md w-full px-6">
          <div className="text-center">
            <span className="text-[10px] font-black text-[#F16323] uppercase tracking-widest">Loyal Reader</span>
            <h2 className="text-2xl font-black text-white mt-1.5">Top Authors</h2>
            <p className="text-xs text-gray-400 mt-1">Whose voices guided you this year.</p>
          </div>

          <div className="space-y-3 pt-3">
            {topAuthors.length > 0 ? (
              topAuthors.map((author, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.12 }}
                  key={author}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-full bg-orange-500/10 text-[#F16323] border border-orange-500/20 flex items-center justify-center font-black text-xs">
                      #{idx + 1}
                    </span>
                    <span className="text-sm font-bold text-white truncate max-w-[200px]">{author}</span>
                  </div>
                  <Award className="w-4 h-4 text-orange-400" />
                </motion.div>
              ))
            ) : (
              <p className="text-xs text-center text-gray-500">A wide array of distinct writers.</p>
            )}
          </div>
        </div>
      )
    },
    // Slide 4: Money Saved
    {
      bg: "from-[#111827] via-[#052E16] to-[#111827]",
      element: (
        <div className="text-center space-y-6 max-w-md px-6">
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto"
          >
            <DollarSign className="w-9 h-9" />
          </motion.div>

          <div className="space-y-3">
            <h2 className="text-2xl font-black text-white">Smart Savings</h2>
            <p className="text-3xl font-black text-emerald-400">${moneySaved.toFixed(2)}</p>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs mx-auto">
              By taking advantage of promotion codes and bookstore discount campaigns, you saved a total of <span className="text-white font-bold">${moneySaved.toFixed(2)}</span>! Keep reading smart.
            </p>
          </div>
        </div>
      )
    },
    // Slide 5: Reading Persona & Sharing
    {
      bg: "from-[#0F172A] via-[#1B1230] to-[#0F172A]",
      element: (
        <div className="text-center space-y-6 max-w-md px-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Your Reading Persona</span>
            <h2 className="text-2xl font-black text-white mt-1">Meet Your Soul</h2>
          </div>

          {/* Persona Card (Tarot Style) */}
          <motion.div 
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 12, delay: 0.3 }}
            className="w-64 h-[320px] rounded-3xl bg-gradient-to-b from-[#2E1065] to-[#1E1B4B] border border-purple-500/30 shadow-[0_15px_40px_rgba(139,92,246,0.15)] mx-auto p-6 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Sparkles decorations */}
            <div className="absolute top-4 left-4 text-purple-400/40 font-serif text-lg">★</div>
            <div className="absolute bottom-4 right-4 text-purple-400/40 font-serif text-lg">★</div>

            <div className="pt-4">
              <span className="text-[9px] font-black text-purple-400 tracking-widest block uppercase">THE ARCHETYPE</span>
              <span className="text-2xl font-black text-white block mt-1 tracking-tight uppercase">{persona}</span>
            </div>

            <div className="w-16 h-16 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-400">
              <Sparkles className="w-7 h-7" />
            </div>

            <div className="space-y-1 pb-2">
              <p className="text-[10px] text-purple-300 font-bold tracking-wide leading-relaxed">
                {persona === "The Bookworm" && "Voracious consumer of pages, reading at a fast pace."}
                {persona === "The Dreamer" && "Drawn to fiction, worlds of fantasy and deep novels."}
                {persona === "The Hustler" && "Drawn to business strategies, economics and development."}
                {persona === "The Scholar" && "Dedicated student of science, technology and historical events."}
                {persona === "The Explorer" && "Constantly changing genres, testing new perspectives."}
              </p>
            </div>
          </motion.div>

          {/* Social Share & return buttons */}
          <div className="space-y-3 pt-3">
            {!token && (
              <button 
                onClick={handleShareCopy}
                className="w-full bg-[#F16323] hover:bg-orange-600 text-white font-black text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/10 cursor-pointer active:scale-95"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>COPIED SHAREABLE LINK</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>SHARE MY WRAPPED</span>
                  </>
                )}
              </button>
            )}

            <button 
              onClick={() => navigate("/mainwebpage")}
              className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4 rotate-180" />
              <span>Back to Bookstore</span>
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${slides[currentSlide].bg} text-white flex flex-col justify-between transition-all duration-1000 ease-in-out`}>
      
      {/* Top Slide indicator bar */}
      <div className="max-w-md w-full mx-auto px-6 pt-6 flex gap-1.5 z-50">
        {slides.map((_, idx) => (
          <div 
            key={idx} 
            className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden"
          >
            <div 
              className={`h-full bg-white transition-all duration-500 ${
                idx < currentSlide ? "w-full opacity-40" : idx === currentSlide ? "w-full" : "w-0"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Main Slide Content renderer */}
      <div className="flex-1 flex items-center justify-center py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="w-full flex justify-center"
          >
            {slides[currentSlide].element}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="max-w-md w-full mx-auto px-6 pb-8 flex items-center justify-between z-50">
        {currentSlide > 0 ? (
          <button 
            onClick={() => setCurrentSlide(prev => prev - 1)}
            className="flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>
        ) : <div />}

        {currentSlide < slides.length - 1 && currentSlide > 0 ? (
          <button 
            onClick={() => setCurrentSlide(prev => prev + 1)}
            className="flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : <div />}
      </div>
      
    </div>
  );
}
