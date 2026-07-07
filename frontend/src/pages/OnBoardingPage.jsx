import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Target, CircleDollarSign, X, ArrowRight, ArrowLeft, Sun, Moon } from "lucide-react";

const CATEGORIES = ["Fiction", "History", "Poetry", "Cooking", "Biography", "Business", "Sci-Fi", "Romance"];

const STEP_META = [
  { num: 1, roman: "I", label: "Genres", icon: Target },
  { num: 2, roman: "II", label: "Authors", icon: BookOpen },
  { num: 3, roman: "III", label: "Budget", icon: CircleDollarSign },
];

export default function OnboardingPage() {
  const navigate = useNavigate();

  // State
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [authorInput, setAuthorInput] = useState("");
  const [authors, setAuthors] = useState([]);
  const [budget, setBudget] = useState(25);
  const [loading, setLoading] = useState(false);
  const [isDawn, setIsDawn] = useState(true);
  
  // Mouse position state for subtle parallax/interactive gradient
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
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

    setLoading(true);
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
        navigate("/mainwebpage");
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting onboarding:", error);
      alert("Network connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative min-h-screen w-full overflow-hidden font-[Work_Sans] transition-colors duration-1000 ${isDawn ? 'text-[#1a1510]' : 'text-[#f4efe8]'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400;1,600&family=Work+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@300;400&display=swap');

        .font-display { font-family: 'Cormorant Garamond', serif; }
        .font-mono-label { font-family: 'IBM Plex Mono', monospace; }

        /* Animated lively gradient background */
        .bg-gradient-animate {
          background-size: 200% 200%;
          animation: gradientMove 15s ease infinite;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Glass floating box like the "Renve'ssance" image */
        .glass-panel {
          background: ${isDawn ? 'rgba(255, 255, 255, 0.15)' : 'rgba(20, 20, 20, 0.4)'};
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid ${isDawn ? 'rgba(26, 21, 16, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
        }

        /* Brutalist corners for the floating box */
        .glass-panel::before, .glass-panel::after {
          content: ''; position: absolute; width: 10px; height: 10px; border-color: inherit; pointer-events: none;
        }
        .glass-panel::before { top: -1px; left: -1px; border-top: 1px solid; border-left: 1px solid; }
        .glass-panel::after { bottom: -1px; right: -1px; border-bottom: 1px solid; border-right: 1px solid; }

        /* Modern interactive slider */
        input[type="range"] {
          -webkit-appearance: none; width: 100%; background: transparent;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          height: 1px;
          background: ${isDawn ? 'rgba(26, 21, 16, 0.3)' : 'rgba(244, 239, 232, 0.3)'};
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 24px; width: 24px;
          border-radius: 50%;
          margin-top: -12px;
          background: ${isDawn ? '#1a1510' : '#f4efe8'};
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.3);
        }
      `}</style>

      {/* BACKGROUND: Classical Art + Interactive Gradient Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Placeholder Classical Painting (Can be replaced with your asset) */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ 
            backgroundImage: `url('https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fwww.magnoliabox.com%2Fproducts%2Fcherubs-in-the-clouds-aalq001420&ved=0CBYQjRxqFwoTCLiwj9mPwJUDFQAAAAAdAAAAABA4&opi=89978449')`,
            opacity: isDawn ? 0.7 : 0.4 
          }}
        />
        
        {/* Interactive Vivid Gradient Overlay */}
        <div 
          className="absolute inset-0 opacity-60 mix-blend-overlay transition-all duration-700"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, ${isDawn ? '#FF7A00, #FF007A' : '#4E00FF, #FF007A'}, transparent 60%)`
          }}
        />
        
        {/* Ambient base gradient for text readability */}
        <div 
          className={`absolute inset-0 bg-gradient-animate opacity-80 ${isDawn ? 'bg-gradient-to-br from-[#EAD6C6]/80 via-[#E3C3B7]/60 to-[#9D93A6]/80' : 'bg-gradient-to-br from-[#120F18]/90 via-[#2C2436]/80 to-[#0A080C]/90'}`}
        />
      </div>

      {/* MAIN CONTENT WRAPPER */}
      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        
        {/* LEFT/TOP: Massive Poster Typography (Image 1 Style) */}
        <div className="flex-1 p-8 lg:p-16 flex flex-col justify-between">
          <div className="flex items-center justify-between font-mono-label text-[10px] uppercase tracking-[0.2em] opacity-80">
            <span>Musée Magnin / BookHaven</span>
            <button
              onClick={() => setIsDawn(!isDawn)}
              className="flex items-center gap-2 hover:opacity-100 opacity-70 transition-all hover:scale-105"
            >
              {isDawn ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span>{isDawn ? "Enter Dusk" : "Enter Dawn"}</span>
            </button>
          </div>

          <div className="mt-20 lg:mt-0 pointer-events-none">
            <h1 className="font-display uppercase leading-[0.8] text-[4rem] md:text-[7rem] lg:text-[9rem] tracking-tighter mix-blend-color-burn dark:mix-blend-color-dodge opacity-90">
              Exquises<br/>
              <span className="italic font-light ml-8 lg:ml-24">Esquisses</span>
            </h1>
            <p className="font-mono-label uppercase tracking-[0.3em] text-xs mt-6 ml-2 lg:ml-8 opacity-60">
              Du projet à la réalisation — Reader's Atelier
            </p>
          </div>
          
          <div className="hidden lg:block font-mono-label text-[9px] uppercase tracking-[0.2em] opacity-50 max-w-xs">
            18 Novembre 2026<br/>
            A new world of commerce.<br/>
            8th grade, priscian.
          </div>
        </div>

        {/* RIGHT/BOTTOM: Floating Modern UI Box (Image 3 Style) */}
        <div className="w-full lg:w-[45%] p-4 lg:p-12 flex items-center justify-center">
          <div className="glass-panel relative w-full max-w-md p-8 lg:p-10 rounded-sm">
            
            {/* Step Indicator Header */}
            <div className="flex gap-6 border-b pb-6 mb-8 border-current border-opacity-10">
              {STEP_META.map((node) => {
                const isCurrent = step === node.num;
                const isPast = step > node.num;
                return (
                  <button 
                    key={node.num}
                    onClick={() => setStep(node.num)}
                    className={`flex flex-col gap-2 transition-all duration-300 ${isCurrent ? 'opacity-100' : isPast ? 'opacity-60' : 'opacity-20'}`}
                  >
                    <span className="font-display italic text-2xl leading-none">{node.roman}</span>
                    <span className="font-mono-label text-[8px] uppercase tracking-[0.2em]">{node.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Dynamic Content */}
            <div className="min-h-[260px] flex flex-col justify-center">
              
              {/* STEP 1: Genres */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="font-display text-3xl mb-6">Curate your shelves</h2>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => {
                      const isSelected = selectedCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          onClick={() => toggleCategory(cat)}
                          className={`px-4 py-2 text-xs font-mono-label tracking-widest uppercase transition-all duration-300 border backdrop-blur-sm ${
                            isSelected
                              ? (isDawn ? 'bg-[#1a1510] text-[#f4efe8] border-[#1a1510] shadow-[0_0_15px_rgba(255,0,122,0.3)]' : 'bg-[#f4efe8] text-[#1a1510] border-[#f4efe8] shadow-[0_0_15px_rgba(255,0,122,0.4)]')
                              : 'bg-transparent border-current border-opacity-20 hover:border-opacity-100 hover:-translate-y-0.5'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: Authors */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="font-display text-3xl mb-6">Signatures of note</h2>
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="e.g. Victor Hugo (Press Enter)"
                      value={authorInput}
                      onChange={(e) => setAuthorInput(e.target.value)}
                      onKeyDown={handleAddAuthor}
                      className="w-full bg-transparent border-b border-current border-opacity-30 py-3 text-sm font-mono-label focus:outline-none focus:border-opacity-100 transition-colors"
                    />
                    <div className="absolute right-0 bottom-3 opacity-0 group-hover:opacity-50 transition-opacity pointer-events-none">
                      <BookOpen className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-wrap gap-2">
                    {authors.length === 0 ? (
                      <p className="font-display italic text-lg opacity-40">The registry is empty.</p>
                    ) : (
                      authors.map((author, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono-label border border-current border-opacity-20 backdrop-blur-md animate-in zoom-in duration-200"
                        >
                          {author}
                          <button onClick={() => removeAuthor(author)} className="hover:text-red-500 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: Budget */}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="font-display text-3xl mb-8">Set your ceiling</h2>
                  <div className="text-center mb-10">
                    <span className="font-display text-7xl md:text-8xl tracking-tighter" style={{ textShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                      ${budget}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-4 font-mono-label text-[10px] uppercase opacity-50">
                    <span>$5</span>
                    <span>$100+</span>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Footer */}
            <div className="mt-10 flex gap-4">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="p-3 border border-current border-opacity-20 hover:border-opacity-100 transition-all hover:-translate-x-1 backdrop-blur-sm"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              
              {step < 3 ? (
                <button
                  onClick={() => {
                    if (step === 1 && selectedCategories.length === 0) {
                      alert("Please select at least 1 favorite genre!");
                      return;
                    }
                    setStep(step + 1);
                  }}
                  className={`flex-1 py-3 px-6 flex items-center justify-between font-mono-label text-xs uppercase tracking-[0.2em] transition-all hover:translate-x-1 ${isDawn ? 'bg-[#1a1510] text-[#f4efe8]' : 'bg-[#f4efe8] text-[#1a1510]'}`}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`flex-1 py-3 px-6 flex items-center justify-between font-mono-label text-xs uppercase tracking-[0.2em] transition-all hover:shadow-lg disabled:opacity-50 ${isDawn ? 'bg-[#1a1510] text-[#f4efe8]' : 'bg-[#f4efe8] text-[#1a1510]'}`}
                >
                  {loading ? "Archiving..." : "Complete"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}