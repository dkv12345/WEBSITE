import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Target, CircleDollarSign, X, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = ["Fiction", "History", "Poetry", "Cooking", "Biography", "Business", "Sci-Fi", "Romance"];

const STEP_META = [
  { num: 1, roman: "I", label: "GENRES", icon: Target },
  { num: 2, roman: "II", label: "AUTHORS", icon: BookOpen },
  { num: 3, roman: "III", label: "BUDGET", icon: CircleDollarSign },
];

const BackgroundBeams = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path
          d="M -10 20 Q 30 50 110 30"
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="0.15"
          initial={{ pathLength: 0, opacity: 0.1 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M -10 60 Q 60 20 110 80"
          fill="none"
          stroke="var(--color-nebula)"
          strokeWidth="0.2"
          initial={{ pathLength: 0, opacity: 0.1 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        <motion.path
          d="M 20 -10 Q 50 50 80 110"
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="0.1"
          initial={{ pathLength: 0, opacity: 0.1 }}
          animate={{ pathLength: [0, 1, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 7 }}
        />
      </svg>
    </div>
  );
};

const Sparkles = () => {
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    scale: Math.random() * 1.5 + 0.5,
    duration: Math.random() * 5 + 3,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 bg-gold rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            scale: [0, p.scale, 0],
            opacity: [0, 0.8, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default function OnboardingPage() {
  const navigate = useNavigate();

  // State
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [authorInput, setAuthorInput] = useState("");
  const [authors, setAuthors] = useState([]);
  const [budget, setBudget] = useState(25);
  const [loading, setIsLoading] = useState(false);
  const [isDawn, setIsDawn] = useState(true);
  const [isCurtainClosing, setIsCurtainClosing] = useState(false);

  // Mouse offset state for 3D Stage parallax depth
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = ((e.clientX / window.innerWidth) - 0.5) * 45;
      const y = ((e.clientY / window.innerHeight) - 0.5) * 45;
      setMouseOffset({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleAddAuthor = (e) => {
    if (e.key === "Enter" && authorInput.trim() !== "") {
      e.preventDefault();
      if (!authors.includes(authorInput.trim())) {
        setAuthors([...authors, authorInput.trim()]);
      }
      setAuthorInput("");
    }
  };

  const removeAuthor = (authorToRemove) => {
    setAuthors(authors.filter((a) => a !== authorToRemove));
  };

  const handleSubmit = async () => {
    if (selectedCategories.length === 0) {
      alert("Please select at least 1 favorite genre!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          favCategories: selectedCategories,
          favAuthors: authors,
          userBudget: budget,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsCurtainClosing(true);
        setTimeout(() => {
          navigate("/");
        }, 1200);
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting onboarding:", error);
      alert("Network connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative min-h-screen w-full overflow-hidden font-sans transition-colors duration-1000 ${
      isDawn ? 'bg-parchment text-ink' : 'bg-void text-starlight'
    }`}>
      
      {/* Custom Styling and animations */}
      <style>{`
        /* Keyframes for hanging lamp swing interaction */
        @keyframes lamp-swing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(2.5deg); }
          75% { transform: rotate(-2.5deg); }
        }
        @keyframes pulse-beam {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.1); }
        }
        @keyframes twinkle-cosmic {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .animate-lamp-swing:hover {
          animation: lamp-swing 4s ease-in-out infinite;
        }
        .animate-pulse-beam { animation: pulse-beam 3s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle-cosmic 3s ease-in-out infinite; }

        /* Custom range range slider styling */
        input[type="range"] {
          -webkit-appearance: none; width: 100%; background: transparent;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          height: 1.5px;
          background: ${isDawn ? 'rgba(33, 27, 46, 0.2)' : 'rgba(237, 230, 214, 0.2)'};
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px; width: 20px;
          border-radius: 50%;
          margin-top: -9px;
          background: var(--color-gold);
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.25);
        }
      `}</style>

      {/* Main split viewport layout */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        
        {/* ================= LEFT VIEWPORT: COSMIC PERFORMING ARTS STAGE ================= */}
        <div className={`relative w-full lg:w-[52%] p-8 lg:p-12 flex flex-col justify-between overflow-hidden min-h-[50vh] lg:min-h-screen border-b lg:border-b-0 lg:border-r ${
          isDawn ? 'border-ink/10' : 'border-starlight/10'
        }`}>
          
          {/* Vintage stage background_onboard.jpg */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000"
            style={{ 
              backgroundImage: "url('/background_onboard.jpg')",
              filter: isDawn ? 'brightness(0.95) contrast(1.05)' : 'brightness(0.4) contrast(1.15) hue-rotate(240deg)'
            }}
          />

          {/* Aceternity UI Beams & Sparkles */}
          <BackgroundBeams />
          <Sparkles />

          {/* Deep celestial sky-glow overlay */}
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-[#06040a]/20 to-[#06040a]/50 mix-blend-multiply pointer-events-none" />

          {/* Top Row Header Label */}
          <div className="relative z-20 flex items-center justify-between font-mono-lbl text-[9px] uppercase tracking-[0.25em] bg-void/40 text-starlight px-4 py-2.5 rounded-xl backdrop-blur-xs max-w-max select-none">
            STAGE SCENOGRAPHY — ACTIVE ACT
          </div>

          {/* PARALLAX VINTAGE PERFORMANCE STAGE WRAPPER */}
          <div className="absolute inset-0 z-10 pointer-events-none select-none">
            
            {/* 1. Wire-suspended stage lamp switch */}
            <div 
              onClick={() => setIsDawn(!isDawn)}
              className="absolute top-0 right-[15%] z-30 cursor-pointer group flex flex-col items-center origin-top transition-transform duration-500 hover:rotate-3 active:scale-95 pointer-events-auto animate-lamp-swing"
              title="Click to Switch Ambient Light"
            >
              {/* Wire */}
              <div className={`w-[1px] h-20 bg-gradient-to-b from-[#2e1d0f] to-gold transition-opacity duration-1000 ${
                isDawn ? 'opacity-90' : 'opacity-30'
              }`} />
              
              {/* Lamp Lamp.png */}
              <img 
                src="/lamp.png" 
                alt="Stage Lamp Switch"
                className={`w-12 h-auto transition-all duration-700 select-none ${
                  isDawn 
                    ? 'filter drop-shadow-[0_0_22px_rgba(201,162,39,0.95)] drop-shadow-[0_0_8px_rgba(201,162,39,0.4)] brightness-110' 
                    : 'filter brightness-40 saturate-50 drop-shadow-none'
                }`}
              />
              
              {/* Light beam overlay */}
              {isDawn && (
                <div className="w-16 h-16 rounded-full bg-yellow-200/10 blur-xl absolute -bottom-8 animate-pulse-beam pointer-events-none" />
              )}
            </div>

            {/* 2. Floating Star asset - element_star.jpg (screen blended to remove black background) */}
            <div 
              className="absolute w-24 h-24 aspect-square top-[15%] left-[6%] z-15"
              style={{ 
                transform: `translate(${mouseOffset.x * 0.3}px, ${mouseOffset.y * 0.3}px)`
              }}
            >
              <img 
                src="/element_star.jpg" 
                alt="Star asset" 
                className="w-full h-full object-contain opacity-85 mix-blend-screen animate-float-slow transition-transform duration-500 ease-out select-none"
                style={{ 
                  filter: isDawn ? 'drop-shadow(0 0 10px rgba(255,200,100,0.3))' : 'drop-shadow(0 0 15px rgba(100,150,255,0.5))'
                }}
              />
            </div>

            {/* 3. Floating Cozy Element - element.png (PNG transparency) */}
            <div 
              className="absolute w-20 h-20 aspect-square top-[35%] right-[8%] z-15"
              style={{ 
                transform: `translate(${mouseOffset.x * 0.25}px, ${mouseOffset.y * 0.25}px)`
              }}
            >
              <img 
                src="/element.png" 
                alt="Cozy Element" 
                className="w-full h-full object-contain opacity-90 animate-float-medium transition-transform duration-500 ease-out select-none"
              />
            </div>

            {/* 4. Floating Ball - ball.png (PNG transparency) */}
            <div 
              className="absolute w-20 h-20 aspect-square bottom-[22%] left-[10%] z-15"
              style={{ 
                transform: `translate(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px)`
              }}
            >
              <img 
                src="/ball.png" 
                alt="Stage Ball" 
                className="w-full h-full object-contain animate-float-slow transition-transform duration-500 ease-out select-none"
              />
            </div>

            {/* 5. Floating Book - detailed gold book SVG floats above the stage */}
            <div 
              className="absolute bottom-[20%] right-[22%] w-24 h-20 animate-float-fast transition-transform duration-500 ease-out z-15"
              style={{ 
                transform: `translate(${mouseOffset.x * 0.35}px, ${mouseOffset.y * 0.35}px) rotate(${mouseOffset.x * 0.1}deg)`,
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.55)) drop-shadow(0 0 10px rgba(201,162,39,0.25))'
              }}
            >
              <svg viewBox="0 0 100 80" className="w-full h-full text-gold" fill="currentColor">
                {/* Book Spines / Pages */}
                <path d="M50 75 C30 70, 10 75, 5 70 L 5 15 C10 20, 30 15, 50 20 C70 15, 90 20, 95 15 L 95 70 C90 75, 70 70, 50 75 Z" fill="var(--color-parchment)" stroke="var(--color-gold)" strokeWidth="1.5" />
                <line x1="50" y1="20" x2="50" y2="75" stroke="var(--color-gold)" strokeWidth="2" />
                <polygon points="25,35 27,40 32,40 28,43 29,48 25,45 21,48 22,43 18,40 23,40" fill="var(--color-gold)" />
                <polygon points="75,35 77,40 82,40 78,43 79,48 75,45 71,48 72,43 68,40 73,40" fill="var(--color-gold)" />
              </svg>
            </div>

            {/* Twin cosmic twinkling stars */}
            <div className="absolute top-[35%] left-[32%] text-gold/70 text-xs animate-twinkle select-none">✦</div>
            <div className="absolute bottom-[40%] right-[32%] text-gold/60 text-sm animate-twinkle select-none" style={{ animationDelay: '1.5s' }}>✦</div>

          </div>

          {/* Centered Beige Catalog Card Overlay */}
          <div className="relative z-20 my-auto flex items-center justify-center py-6">
            <div className={`relative w-72 sm:w-80 md:w-96 p-8 rounded-2xl select-none transition-all duration-1000 backdrop-blur-md ${
              isDawn 
                ? 'bg-parchment/85 text-ink shadow-[0_24px_50px_rgba(0,0,0,0.18)] border border-white/20' 
                : 'bg-void/85 text-starlight shadow-[0_24px_50px_rgba(0,0,0,0.4)] border border-white/5'
            }`}>
              {/* Corner brackets */}
              <div className={`absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 ${isDawn ? 'border-ink/35' : 'border-starlight/35'}`} />
              <div className={`absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 ${isDawn ? 'border-ink/35' : 'border-starlight/35'}`} />
              <div className={`absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 ${isDawn ? 'border-ink/35' : 'border-starlight/35'}`} />
              <div className={`absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 ${isDawn ? 'border-ink/35' : 'border-starlight/35'}`} />

              <span className="block font-mono-lbl text-[8px] tracking-[0.3em] opacity-60 uppercase mb-2">
                VOL. I — CATALOG
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight mb-4">
                The Cosmic Stage
              </h2>
              <p className="font-sans-pref text-xs text-opacity-80 leading-relaxed mb-6 font-light">
                Discover your literary persona. Unveil the genres, authors, and budgets that shape your constellation.
              </p>
              <div className="flex items-center gap-1.5 font-mono-lbl text-[9px] uppercase tracking-widest text-gold font-bold">
                <span>SELECT A GENRE TO BEGIN</span>
              </div>
            </div>
          </div>

          {/* Bottom Left Panel Footer Hint */}
          <div className="relative z-20 text-center font-mono-lbl text-[8px] uppercase tracking-[0.25em] text-starlight/80 bg-void/40 px-4 py-2.5 rounded-xl backdrop-blur-xs max-w-max mx-auto mb-2 select-none">
            CLICK THE HANGING LAMP TO LIGHT OR DIM THE STAGE
          </div>

        </div>

        {/* ================= RIGHT VIEWPORT: Ivory Steps Questionnaire Form ================= */}
        <div className={`w-full lg:w-[48%] p-8 lg:p-16 flex flex-col justify-center transition-colors duration-1000 ${
          isDawn ? 'bg-parchment' : 'bg-void'
        }`}>
          
          <div className="w-full max-w-md mx-auto text-ink">
            
            {/* Step Indicators Connectors */}
            <div className="relative flex items-center justify-between w-full max-w-sm mx-auto mb-16 pt-2">
              
              {/* Connector horizontal line */}
              <div className={`absolute top-[40%] left-10 right-10 h-[1px] -translate-y-1/2 z-0 ${
                isDawn ? 'bg-ink/10' : 'bg-starlight/10'
              }`}></div>
              
              {STEP_META.map((node) => {
                const isCurrent = step === node.num;
                const isPast = step > node.num;
                return (
                  <button 
                    key={node.num}
                    onClick={() => {
                      if (node.num === 2 && selectedCategories.length === 0) {
                        alert("Please select at least 1 favorite genre!");
                        return;
                      }
                      setStep(node.num);
                    }}
                    className="relative z-10 flex flex-col items-center gap-1.5 focus:outline-none"
                  >
                    {/* Circle Node */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono-lbl tracking-normal transition-all duration-300 ${
                      isCurrent 
                        ? 'bg-gold text-white shadow-[0_0_10px_rgba(201,162,39,0.35)] font-bold' 
                        : isPast 
                          ? 'bg-gold/70 text-white' 
                          : isDawn ? 'bg-ink/5 text-ink/50 border border-ink/10' : 'bg-starlight/5 text-starlight/50 border border-starlight/10'
                    }`}>
                      {node.roman}
                    </div>
                    {/* Step Label */}
                    <span className={`text-[8px] uppercase tracking-[0.25em] font-mono-lbl font-semibold transition-colors duration-300 ${
                      isCurrent 
                        ? 'text-gold' 
                        : isPast 
                          ? (isDawn ? 'text-ink/80' : 'text-starlight/80') 
                          : 'text-ink/40'
                    }`}>
                      {node.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Dynamic Step Content Boxes */}
            <div className="min-h-[240px] flex flex-col justify-center">
              
              {/* STEP 1: Genres Selection */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in text-ink">
                  <div>
                    <span className="block font-mono-lbl text-[9px] uppercase tracking-[0.25em] text-gold font-bold mb-1">
                      ENTRY 1 OF 3
                    </span>
                    <h2 className="font-display text-3xl font-medium tracking-tight text-ink">
                      Choose your genres
                    </h2>
                    <p className="text-xs mt-1.5 font-sans-pref opacity-70">
                      Select the shelves that draw your curiosity — as many as fit.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                    {CATEGORIES.map((cat) => {
                      const isSelected = selectedCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className={`px-3 py-2.5 text-[10px] font-mono-lbl uppercase tracking-widest transition-all duration-300 border ${
                            isSelected
                              ? 'bg-gold text-white border-transparent shadow-[0_4px_12px_rgba(201,162,39,0.25)] font-bold'
                              : isDawn 
                                ? 'bg-white border-ink/10 text-ink hover:border-ink/30' 
                                : 'bg-white/5 border-starlight/10 text-starlight hover:border-starlight/30'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: Authors Entry */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in text-ink">
                  <div>
                    <span className="block font-mono-lbl text-[9px] uppercase tracking-[0.25em] text-gold font-bold mb-1">
                      ENTRY 2 OF 3
                    </span>
                    <h2 className="font-display text-3xl font-medium tracking-tight text-ink">
                      Signatures of note
                    </h2>
                    <p className="text-xs mt-1.5 font-sans-pref opacity-70">
                      Add authors that speak to your perspective.
                    </p>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Victor Hugo (Press Enter)"
                      value={authorInput}
                      onChange={(e) => setAuthorInput(e.target.value)}
                      onKeyDown={handleAddAuthor}
                      className={`w-full bg-transparent border-b py-2.5 text-xs font-mono-lbl placeholder-ink/40 outline-none transition-colors ${
                        isDawn ? 'border-ink/20 focus:border-ink text-ink' : 'border-starlight/20 focus:border-starlight text-starlight'
                      }`}
                    />
                    <div className="absolute right-0 bottom-2.5 opacity-60">
                      <BookOpen className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2 max-h-[140px] overflow-y-auto pr-1">
                    {authors.length === 0 ? (
                      <p className="font-display italic text-base text-ink/40 py-4 w-full text-center">
                        The registry is empty.
                      </p>
                    ) : (
                      authors.map((author, idx) => (
                        <span
                          key={idx}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono-lbl border rounded-sm animate-in zoom-in duration-200 ${
                            isDawn 
                              ? 'bg-white border-ink/10 text-ink' 
                              : 'bg-white/5 border-starlight/10 text-starlight'
                          }`}
                        >
                          {author}
                          <button 
                            onClick={() => removeAuthor(author)} 
                            className="hover:text-red-500 transition-colors ml-1"
                            aria-label={`Remove ${author}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: Budget Slider */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in text-ink">
                  <div>
                    <span className="block font-mono-lbl text-[9px] uppercase tracking-[0.25em] text-gold font-bold mb-1">
                      ENTRY 3 OF 3
                    </span>
                    <h2 className="font-display text-3xl font-medium tracking-tight text-ink">
                      Set your ceiling
                    </h2>
                    <p className="text-xs mt-1.5 font-sans-pref opacity-70">
                      Indicate a threshold for curated content.
                    </p>
                  </div>

                  <div className="text-center py-6 text-ink">
                    <span className="font-display text-7xl font-light tracking-tighter text-gold">
                      ${budget}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <input
                      type="range"
                      min="5"
                      max="100"
                      step="5"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between font-mono-lbl text-[9px] uppercase tracking-widest opacity-50">
                      <span>$5</span>
                      <span>$100+</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form actions */}
            <div className="mt-12 flex gap-4">
              {step > 1 && (
                <motion.button
                  onClick={() => setStep(step - 1)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`p-3.5 border transition-all rounded-sm flex items-center justify-center ${
                    isDawn 
                      ? 'border-ink/10 text-ink/75 hover:border-ink hover:text-ink bg-white' 
                      : 'border-starlight/10 text-starlight/75 hover:border-starlight hover:text-starlight bg-transparent'
                  }`}
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </motion.button>
              )}
              
              {step < 3 ? (
                <motion.button
                  onClick={() => {
                    if (step === 1 && selectedCategories.length === 0) {
                      alert("Please select at least 1 favorite genre!");
                      return;
                    }
                    setStep(step + 1);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="flex-1 py-3.5 px-6 flex items-center justify-center gap-2 font-bold font-mono-lbl text-[10px] uppercase tracking-[0.25em] bg-cta-gradient hover:bg-cta-gradient-hover text-white transition-all shadow-md shadow-gold/15"
                >
                  <span>CONTINUE</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button
                  onClick={handleSubmit}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="flex-1 py-3.5 px-6 flex items-center justify-center gap-2 font-bold font-mono-lbl text-[10px] uppercase tracking-[0.25em] bg-cta-gradient hover:bg-cta-gradient-hover text-white transition-all disabled:opacity-50 shadow-md shadow-gold/15"
                >
                  <span>{loading ? "ARCHIVING..." : "COMPLETE"}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </motion.button>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Curtains Closing Transition Overlay */}
      <div className="fixed inset-0 z-50 flex pointer-events-none select-none overflow-hidden">
        {/* Left Curtain */}
        <div 
          className={`w-1/2 h-full bg-[#5C1E1A] border-r-4 border-gold shadow-[10px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-1000 ease-in-out ${
            isCurtainClosing ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{
            backgroundImage: "url('/curtain_left.png')",
            backgroundSize: "cover",
            backgroundPosition: "right center"
          }}
        >
          {/* Fallback folds detailing */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
          <div className="absolute inset-y-0 right-4 w-[1px] bg-gold/40" />
        </div>

        {/* Right Curtain */}
        <div 
          className={`w-1/2 h-full bg-[#5C1E1A] border-l-4 border-gold shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-1000 ease-in-out relative overflow-hidden ${
            isCurtainClosing ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Mirrored background image layer */}
          <div 
            className="absolute inset-0 scale-x-[-1]"
            style={{
              backgroundImage: "url('/curtain_left.png')",
              backgroundSize: "cover",
              backgroundPosition: "right center"
            }}
          />
          {/* Fallback folds detailing */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/50 via-transparent to-black/30 pointer-events-none" />
          <div className="absolute inset-y-0 left-4 w-[1px] bg-gold/40 pointer-events-none" />
        </div>
      </div>

    </div>
  );
}