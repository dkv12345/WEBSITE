import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Sparkles, ShoppingBag, DollarSign, Award,
  Share2, ArrowLeft, ArrowRight, Play, Loader2, LogOut,
  Check, AlertCircle, Calendar,
} from "lucide-react";

const EASE = [0.16, 1, 0.3, 1];

export default function YearlyLookbackPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [lookback, setLookback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

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

  const handleShareCopy = () => {
    if (!lookback?.shareableUrlToken) return;
    const shareUrl = `${window.location.origin}/lookback/share/${lookback.shareableUrlToken}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-void text-starlight flex flex-col items-center justify-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-9 h-9 text-gold" strokeWidth={2.5} />
        </motion.div>
        <p className="text-xs font-mono uppercase tracking-widest text-gold/80">
          Compiling your year...
        </p>
      </div>
    );
  }

  if (error || !lookback) {
    return (
      <div className="min-h-screen bg-void text-starlight flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="w-16 h-16 bg-red-950/40 border border-red-500/30 rounded-full flex items-center justify-center text-red-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h2 className="text-xl font-black font-display">Rewind unavailable</h2>
          <p className="text-sm text-starlight/60">
            {error || "We couldn't compile your shopping profile yet. Make sure you have purchases in 2026."}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={() => navigate("/mainwebpage")}
          className="bg-cta-gradient text-white font-bold text-xs px-6 py-3 rounded-md cursor-pointer"
        >
          Return to bookstore
        </motion.button>
      </div>
    );
  }

  const { metrics, persona, userId } = lookback;
  const {
    topGenres = [],
    topAuthors = [],
    moneySaved = 0,
    totalBooksPurchased = 0,
    totalOrders = 0,
    monthlySpending, // optional: [{ month: "Jan", amount: 42 }, ...] x12
  } = metrics;
  const userName = userId?.name || "Avid Reader";

  const maxGenreCount = Math.max(1, ...topGenres.map((g) => g.count || 0));

  const personaCopy = {
    "The Bookworm": "Never far from checkout — you shopped steadily all year round.",
    "The Dreamer": "Drawn to fiction, fantasy, and worlds beyond this one.",
    "The Hustler": "Investing in business, strategy, and personal growth.",
    "The Scholar": "Building a serious collection of science, tech, and history.",
    "The Explorer": "No single genre could hold you — always testing something new.",
  };

  const peakMonth = monthlySpending?.length
    ? monthlySpending.reduce((max, m) => (m.amount > max.amount ? m : max), monthlySpending[0])
    : null;
  const maxMonthAmount = monthlySpending?.length
    ? Math.max(...monthlySpending.map((m) => m.amount))
    : 0;

  // === Slide definitions ===
  const slides = [
    // 0. Splash
    {
      bg: "bg-void",
      decor: (
        <>
          <div className="absolute w-2 h-2 rounded-full bg-gold/40 top-[20%] left-[20%] animate-float-slow" />
          <div className="absolute w-1 h-1 rounded-full bg-white/50 top-[30%] right-[18%] animate-float-medium" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-nebula/60 bottom-[25%] left-[30%] animate-float-slow" />
        </>
      ),
      content: (
        <div className="text-center space-y-7 max-w-md px-4">
          <motion.div
            initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: EASE }}
            className="mx-auto w-[84px] h-[84px] flex items-center justify-center"
          >
            <BookOpen className="w-16 h-16 text-gold" strokeWidth={1.6} />
          </motion.div>

          <div className="space-y-3">
            <span className="font-mono text-[10px] font-bold text-gold uppercase tracking-[0.2em] bg-gold/10 px-3 py-1.5 rounded-full border border-gold/25">
              Annual Summary
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] text-starlight pt-2">
              Your 2026 <br />
              <span className="text-gold">BookHaven Rewind</span>
            </h1>
            <p className="text-sm text-starlight/55 font-medium pt-1">
              {token
                ? `Exploring ${userName}'s BookHaven year`
                : `Hi ${userName}, let's review your library acquisition journey.`}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={() => goTo(1)}
            className="bg-cta-gradient text-white font-bold text-xs px-8 py-4 rounded-md flex items-center gap-2 mx-auto shadow-lg shadow-gold/20 cursor-pointer"
          >
            <span className="font-mono tracking-widest">START MY EXPERIENCE</span>
            <Play className="w-3.5 h-3.5 fill-current" />
          </motion.button>
        </div>
      ),
    },

    // 1. Shopping overview
    {
      bg: "bg-gradient-to-br from-[#3A2410] via-void to-void",
      decor: (
        <div className="absolute top-[12%] right-[-40px] w-52 h-52 rounded-full border border-gold/20 border-dashed" />
      ),
      content: (
        <div className="max-w-lg w-full px-6 space-y-6">
          <div className="flex items-end gap-3">
            <span className="font-display text-7xl md:text-8xl font-bold text-gold leading-[0.8]">
              {totalBooksPurchased}
            </span>
            <span className="font-display text-3xl text-starlight pb-1">Books</span>
          </div>
          <div className="space-y-2">
            <span className="font-mono text-[10px] font-bold text-starlight/50 uppercase tracking-[0.2em]">
              Shopping Overview
            </span>
            <p className="text-sm text-starlight/70 leading-relaxed font-medium max-w-sm">
              This year, you welcomed{" "}
              <span className="text-gold font-bold">{totalBooksPurchased} new books</span>{" "}
              into your personal shelves across{" "}
              <span className="text-gold font-bold">{totalOrders} distinct orders</span>.
              What a magnificent literary constellation.
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <StatChip label="Books" value={totalBooksPurchased} />
            <StatChip label="Orders" value={totalOrders} />
          </div>
        </div>
      ),
    },

    // 2. Top genres
    {
      bg: "bg-gradient-to-br from-[#093530] via-void to-void",
      decor: null,
      content: (
        <div className="space-y-6 max-w-md w-full px-6">
          <div>
            <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]">
              What You Collected
            </span>
            <h2 className="font-display text-2xl font-bold text-starlight mt-1.5">Your Top Genres</h2>
            <p className="text-xs text-starlight/50 mt-1">The categories that captured your mind this year.</p>
          </div>

          <div className="space-y-3 pt-2">
            {topGenres.length > 0 ? (
              topGenres.slice(0, 5).map((g, idx) => (
                <motion.div
                  key={g.name || idx}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4, ease: EASE }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-starlight">
                      <span className="text-emerald-400 mr-2">{String(idx + 1).padStart(2, "0")}</span>
                      {g.name}
                    </span>
                    <span className="text-starlight/40">{g.count}</span>
                  </div>
                  <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(8, (g.count / maxGenreCount) * 100)}%` }}
                      transition={{ delay: 0.2 + idx * 0.08, duration: 0.6, ease: EASE }}
                      className="h-full bg-emerald-400/80 rounded-full"
                    />
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-xs text-center text-starlight/40">A wide array of distinct genres.</p>
            )}
          </div>
        </div>
      ),
    },

    // 3. Top authors
    {
      bg: "bg-gradient-to-br from-[#3A2410] via-void to-void",
      decor: null,
      content: (
        <div className="space-y-6 max-w-md w-full px-6">
          <div className="text-center">
            <span className="font-mono text-[10px] font-bold text-gold uppercase tracking-[0.2em]">
              Authors You Trusted
            </span>
            <h2 className="font-display text-2xl font-bold text-starlight mt-1.5">This Year's Circle</h2>
          </div>

          <div className="space-y-3 pt-2">
            {topAuthors.length > 0 ? (
              topAuthors.slice(0, 5).map((author, idx) => (
                <motion.div
                  key={author}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4, ease: EASE }}
                  className="bg-white/5 border border-white/10 rounded-md p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-8 h-8 rounded-full bg-gold/10 text-gold border border-gold/25 flex items-center justify-center font-bold text-xs">
                      #{idx + 1}
                    </span>
                    <span className="text-sm font-bold text-starlight truncate max-w-[200px]">{author}</span>
                  </div>
                  <Award className="w-4 h-4 text-gold/70" />
                </motion.div>
              ))
            ) : (
              <p className="text-xs text-center text-starlight/40">A wide array of distinct writers.</p>
            )}
          </div>
        </div>
      ),
    },

    // 4. Money saved
    {
      bg: "bg-gradient-to-br from-[#052E16] via-void to-void",
      decor: null,
      content: (
        <div className="text-center space-y-6 max-w-md px-6">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center mx-auto"
          >
            <DollarSign className="w-9 h-9" />
          </motion.div>

          <div className="space-y-3">
            <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em]">
              Smart Savings
            </span>
            <p className="font-display text-5xl font-bold text-emerald-400">${moneySaved.toFixed(2)}</p>
            <p className="text-xs text-starlight/55 leading-relaxed max-w-xs mx-auto">
              By taking advantage of promo codes and bookstore discounts, you saved a total of{" "}
              <span className="text-starlight font-bold">${moneySaved.toFixed(2)}</span>. Keep shopping smart.
            </p>
          </div>
        </div>
      ),
    },

    // 5. Peak spending month (only rendered if data provided)
    ...(peakMonth
      ? [
        {
          bg: "bg-gradient-to-br from-[#453576] via-void to-void",
          decor: null,
          content: (
            <div className="space-y-6 max-w-md w-full px-6">
              <div className="text-center">
                <span className="font-mono text-[10px] font-bold text-nebula uppercase tracking-[0.2em]" style={{ color: "#a78bfa" }}>
                  Big Spender Month
                </span>
                <h2 className="font-display text-2xl font-bold text-starlight mt-1.5">{peakMonth.month}</h2>
                <p className="text-xs text-starlight/50 mt-1">
                  You spent <span className="text-starlight font-bold">${peakMonth.amount.toFixed(2)}</span> this month — your biggest of the year.
                </p>
              </div>

              <div className="flex items-end justify-between gap-1.5 h-32 pt-4">
                {monthlySpending.map((m) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(6, (m.amount / maxMonthAmount) * 100)}%` }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className={`w-full rounded-t-md ${m.month === peakMonth.month ? "bg-purple-400" : "bg-white/10"
                        }`}
                      style={{ minHeight: 4 }}
                    />
                    <span className="text-[9px] text-starlight/40 font-mono">{m.month[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          ),
        },
      ]
      : []),

    // 6. Persona (tarot card)
    {
      bg: "bg-gradient-to-br from-[#1B1230] via-void to-void",
      decor: (
        <>
          <div className="absolute top-[8%] left-[8%] text-gold/25 text-xl">★</div>
          <div className="absolute bottom-[10%] right-[10%] text-gold/25 text-sm">★</div>
        </>
      ),
      content: (
        <div className="text-center space-y-6 max-w-md px-6">
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold text-purple-300 uppercase tracking-[0.2em]">
              Your Reading Persona
            </span>
            <h2 className="font-display text-2xl font-bold text-starlight mt-1">Meet Your Collector Soul</h2>
          </div>

          <motion.div
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ type: "spring", damping: 14, delay: 0.25 }}
            className="w-64 h-[320px] rounded-lg bg-gradient-to-b from-[#2E1065] to-[#1E1B4B] border border-purple-500/30 shadow-[0_15px_40px_rgba(139,92,246,0.15)] mx-auto p-6 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="pt-2">
              <span className="font-mono text-[9px] font-bold text-purple-300 tracking-[0.2em] block uppercase">
                The Archetype
              </span>
              <span className="font-display text-2xl font-bold text-starlight block mt-1 tracking-tight uppercase">
                {persona}
              </span>
            </div>

            <div className="w-16 h-16 rounded-full bg-purple-500/15 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-300">
              <Sparkles className="w-7 h-7" />
            </div>

            <p className="text-[11px] text-purple-200/80 font-semibold tracking-wide leading-relaxed pb-1">
              {personaCopy[persona] || "A truly singular collector, defying easy categories."}
            </p>
          </motion.div>
        </div>
      ),
    },

    // 7. Share & return
    {
      bg: "bg-void",
      decor: null,
      content: (
        <div className="text-center space-y-5 max-w-md w-full px-6">
          <div className="space-y-1">
            <ShoppingBag className="w-8 h-8 text-gold mx-auto mb-2" strokeWidth={1.6} />
            <h2 className="font-display text-2xl font-bold text-starlight">That's a wrap</h2>
            <p className="text-xs text-starlight/50">Your BookHaven Rewind, ready to share.</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <StatChip label="Books" value={totalBooksPurchased} small />
            <StatChip label="Orders" value={totalOrders} small />
            <StatChip label="Saved" value={`$${moneySaved.toFixed(0)}`} small />
            <StatChip label="Persona" value={persona?.replace("The ", "")} small />
          </div>

          <div className="space-y-3 pt-3">
            {!token && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={handleShareCopy}
                className="w-full bg-cta-gradient text-white font-bold text-xs py-3.5 rounded-md flex items-center justify-center gap-2 shadow-md shadow-gold/10 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="font-mono tracking-widest">COPIED SHAREABLE LINK</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span className="font-mono tracking-widest">SHARE MY REWIND</span>
                  </>
                )}
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => navigate("/mainwebpage")}
              className="w-full bg-white/5 border border-white/10 text-starlight font-bold text-xs py-3.5 rounded-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4 rotate-180" />
              <span className="font-mono tracking-widest">Back to Bookstore</span>
            </motion.button>
          </div>
        </div>
      ),
    },
  ];

  function goTo(index) {
    if (index < 0 || index >= slides.length) return;
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  }

  function handleDragEnd(_, info) {
    const swipe = info.offset.x;
    const velocity = info.velocity.x;
    if (swipe < -80 || velocity < -400) {
      goTo(currentSlide + 1);
    } else if (swipe > 80 || velocity > 400) {
      goTo(currentSlide - 1);
    }
  }

  return (
    <div className={`min-h-screen ${slides[currentSlide].bg} text-starlight flex flex-col justify-between transition-colors duration-700 relative overflow-hidden`}>

      {slides[currentSlide].decor}

      {/* Progress segments */}
      <div className="max-w-md w-full mx-auto px-6 pt-6 flex gap-1.5 z-50">
        {slides.map((_, idx) => (
          <div key={idx} className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gold transition-all duration-500 ${idx < currentSlide ? "w-full opacity-40" : idx === currentSlide ? "w-full" : "w-0"
                }`}
            />
          </div>
        ))}
      </div>

      {/* Slide content, drag-to-navigate */}
      <div className="flex-1 flex items-center justify-center py-10 relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.35}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="w-full flex justify-center cursor-grab active:cursor-grabbing"
          >
            {slides[currentSlide].content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="max-w-md w-full mx-auto px-6 pb-8 flex items-center justify-between z-50">
        {currentSlide > 0 ? (
          <button
            onClick={() => goTo(currentSlide - 1)}
            className="flex items-center gap-1.5 text-xs font-bold text-starlight/45 hover:text-starlight transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>
        ) : (
          <div />
        )}

        {currentSlide < slides.length - 1 && currentSlide > 0 ? (
          <button
            onClick={() => goTo(currentSlide + 1)}
            className="flex items-center gap-1.5 text-xs font-bold text-starlight/45 hover:text-starlight transition-colors cursor-pointer"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

function StatChip({ label, value, small = false }) {
  return (
    <div
      className={`bg-white/5 border border-white/10 rounded-md text-center ${small ? "p-3" : "p-4 w-28"
        }`}
    >
      <span className="font-mono text-[9px] text-starlight/45 uppercase font-bold block">{label}</span>
      <span className={`font-display font-bold text-starlight mt-1 block ${small ? "text-base" : "text-lg"}`}>
        {value}
      </span>
    </div>
  );
}