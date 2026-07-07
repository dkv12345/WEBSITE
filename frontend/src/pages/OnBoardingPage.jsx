import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Target, DollarSign, CheckCircle2, Sun, Moon, ArrowRight, ArrowLeft, Star, Sparkles, Coffee } from "lucide-react";

const CATEGORIES = ["Fiction", "History", "Poetry", "Cooking", "Biography", "Business", "Sci-Fi", "Romance"];

// Magical letters that float up from the open book
const MAGIC_LETTERS = ["A", "✨", "Genre", "Book", "B", "📖", "Read", "✎", "C", "Story"];

export default function OnboardingPage() {
  const navigate = useNavigate();
  
  // State
  const [step, setStep] = useState(1); // 3-step wizard
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [authorInput, setAuthorInput] = useState("");
  const [authors, setAuthors] = useState([]);
  const [budget, setBudget] = useState(25); // Default $25
  const [loading, setLoading] = useState(false);
  const [isLightOn, setIsLightOn] = useState(true); // Toggle lamp light state

  // Category Toggle
  const toggleCategory = (cat) => {
    setSelectedCategories((prev) => 
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Author Input Handler
  const handleAddAuthor = (e) => {
    if (e.key === 'Enter' && authorInput.trim() !== '') {
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

  // Submit to Backend
  const handleSubmit = async () => {
    if (selectedCategories.length === 0) {
      alert("Please select at least 1 favorite genre!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          favCategories: selectedCategories,
          favAuthors: authors,
          userBudget: budget
        })
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
    <div className={`min-h-screen flex flex-col lg:flex-row transition-all duration-700 ${
      isLightOn ? "bg-[#F3EFE3] text-gray-900" : "bg-[#080b11] text-gray-100"
    } font-sans relative overflow-hidden`}>
      
      {/* CSS Keyframes for Magical UI effects */}
      <style>{`
        @keyframes float-magic {
          0% { transform: translateY(40px) translateX(0) scale(0.6) rotate(0deg); opacity: 0; }
          20% { opacity: 0.9; }
          80% { opacity: 0.6; }
          100% { transform: translateY(-130px) translateX(30px) scale(1.3) rotate(360deg); opacity: 0; }
        }
        @keyframes sway-steam {
          0% { transform: translateY(0) scaleX(1); opacity: 0; }
          30% { opacity: 0.6; }
          80% { opacity: 0.3; }
          100% { transform: translateY(-50px) scaleX(1.3); opacity: 0; }
        }
        @keyframes glow-pulsate {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.45; }
        }
        .magic-particle {
          position: absolute;
          color: rgba(241, 99, 35, 0.8);
          font-weight: 900;
          font-family: 'Times New Roman', serif;
          pointer-events: none;
          text-shadow: 0 0 8px rgba(241, 99, 35, 0.4);
          animation: float-magic 4.5s infinite ease-out;
        }
        .steam-mote {
          position: absolute;
          background: ${isLightOn ? 'rgba(214, 204, 194, 0.5)' : 'rgba(255, 255, 255, 0.15)'};
          border-radius: 50%;
          filter: blur(2px);
          animation: sway-steam 3.5s infinite ease-in-out;
        }
        .glowing-beam {
          clip-path: polygon(145px 150px, 0px 340px, 290px 340px);
        }
        input[type="range"]::-webkit-slider-runnable-track {
          background: ${isLightOn ? '#e2e8f0' : '#1f2937'};
          height: 8px;
          border-radius: 9999px;
        }
        input[type="range"]::-webkit-slider-thumb {
          background: #F16323;
          border: 3px solid ${isLightOn ? '#fff' : '#111928'};
          width: 22px;
          height: 22px;
          border-radius: 50%;
          cursor: pointer;
          margin-top: -7px;
          box-shadow: 0 6px 12px -2px rgba(241, 99, 35, 0.5);
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.3);
        }
      `}</style>

      {/* LEFT COLUMN: Immersive Cozy Reading Room Scene (Dribbble/Vecteezy style) */}
      <div className={`w-full lg:w-[48%] flex flex-col items-center justify-between p-8 lg:p-12 transition-colors duration-700 relative ${
        isLightOn ? "bg-gradient-to-b from-[#E7E0D2] to-[#DBD2C1] border-b lg:border-b-0 lg:border-r border-gray-300/40" : "bg-gradient-to-b from-[#0a0f1d] to-[#04060b] border-b lg:border-b-0 lg:border-r border-slate-900"
      }`}>
        
        {/* Header decoration */}
        <div className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-60">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#F16323]" />
            <span>BookHaven Sanctuary</span>
          </div>
          <div className="flex items-center gap-1.5">
            {isLightOn ? <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            <span>{isLightOn ? "Light Room" : "Cozy Study"}</span>
          </div>
        </div>

        {/* The Cozy Room Scene SVG */}
        <div className="relative w-full max-w-[340px] h-[380px] flex items-center justify-center my-6">
          
          {/* Ambient light glow behind the lamp */}
          <div className={`absolute w-[400px] h-[400px] rounded-full filter blur-[120px] transition-all duration-700 pointer-events-none ${
            isLightOn ? "bg-amber-100/50 scale-100 opacity-100" : "bg-orange-500/5 scale-75 opacity-15"
          }`} style={{ top: '10%' }} />

          {/* Magical Floating Letters rising from open book (only when light is ON) */}
          {isLightOn && (
            <div className="absolute inset-0 z-30 pointer-events-none" style={{ clipPath: 'polygon(150px 160px, 30px 320px, 270px 320px)' }}>
              {MAGIC_LETTERS.map((letter, index) => (
                <div 
                  key={index} 
                  className="magic-particle"
                  style={{
                    left: `${80 + (index * 14) + Math.random() * 15}px`,
                    top: `${210 + Math.random() * 30}px`,
                    animationDelay: `${index * 0.75}s`,
                    fontSize: `${11 + (index % 3) * 3}px`
                  }}
                >
                  {letter}
                </div>
              ))}
            </div>
          )}

          {/* Steam particle motes from the warm coffee mug */}
          <div className="absolute z-30 pointer-events-none" style={{ left: '42px', top: '235px', width: '25px', height: '60px' }}>
            <div className="steam-mote" style={{ width: '4px', height: '4px', left: '6px', top: '40px', animation: 'sway-steam 3.2s infinite ease-in-out' }} />
            <div className="steam-mote" style={{ width: '6px', height: '6px', left: '12px', top: '30px', animation: 'sway-steam 4s infinite ease-in-out 0.8s' }} />
            <div className="steam-mote" style={{ width: '3px', height: '3px', left: '2px', top: '20px', animation: 'sway-steam 2.8s infinite ease-in-out 1.5s' }} />
          </div>

          {/* Highly Detailed Scene SVG */}
          <svg 
            viewBox="0 0 340 380" 
            className="w-full h-full select-none cursor-pointer"
            onClick={() => setIsLightOn(!isLightOn)}
          >
            <defs>
              <radialGradient id="lamp-light-cone" cx="50%" cy="0%" r="85%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.85" />
                <stop offset="45%" stopColor="#ffedd5" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ffedd5" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="solid-wood" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#92400e" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <linearGradient id="brass-stem" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ea580c" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
            </defs>

            {/* BACKGROUND BOOKSHELF (Gives depth to the study room) */}
            <g opacity={isLightOn ? "0.2" : "0.08"} className="transition-opacity duration-700">
              {/* Shelf outlines */}
              <rect x="20" y="30" width="80" height="240" rx="3" fill="none" stroke={isLightOn ? "#78350f" : "#475569"} strokeWidth="2" />
              <line x1="20" y1="110" x2="100" y2="110" stroke={isLightOn ? "#78350f" : "#475569"} strokeWidth="2" />
              <line x1="20" y1="190" x2="100" y2="190" stroke={isLightOn ? "#78350f" : "#475569"} strokeWidth="2" />
              
              {/* Stack of books on shelf */}
              <rect x="30" y="70" width="10" height="40" fill="#ef4444" rx="1" />
              <rect x="42" y="60" width="12" height="50" fill="#3b82f6" rx="1" />
              <rect x="56" y="75" width="8" height="35" fill="#10b981" rx="1" />
              <rect x="75" y="80" width="18" height="30" fill="#eab308" rx="1" transform="rotate(12 75 80)" />

              <rect x="25" y="160" width="10" height="30" fill="#6366f1" rx="1" />
              <rect x="37" y="150" width="11" height="40" fill="#a855f7" rx="1" />
              <rect x="52" y="155" width="12" height="35" fill="#ec4899" rx="1" />
            </g>

            {/* LIGHT CONE PROJECTING ON THE DESK (When ON) */}
            {isLightOn && (
              <polygon 
                points="145,150 10,330 330,330" 
                fill="url(#lamp-light-cone)" 
                opacity="0.35" 
                style={{ mixBlendMode: 'screen', pointerEvents: 'none' }} 
              />
            )}

            {/* Cozy Desk Platform */}
            <line x1="10" y1="330" x2="330" y2="330" stroke={isLightOn ? "#78350f" : "#1e293b"} strokeWidth="6" strokeLinecap="round" />
            <path d="M 25 330 Q 170 324 315 330 L 325 350 L 15 350 Z" fill={isLightOn ? "url(#solid-wood)" : "#0f172a"} opacity="0.35" />

            {/* Hot Coffee Cup on Left side */}
            <g transform="translate(10, 30)" opacity={isLightOn ? "1" : "0.6"} className="transition-opacity duration-500">
              {/* Mug Body */}
              <path d="M 30 265 L 50 265 L 48 290 C 48 294, 32 294, 32 290 Z" fill={isLightOn ? "#84a98c" : "#2e3a46"} />
              {/* Coffee Handle */}
              <path d="M 30 270 Q 20 277 30 285" fill="none" stroke={isLightOn ? "#84a98c" : "#2e3a46"} strokeWidth="2.5" />
              {/* Coffee liquid surface */}
              <ellipse cx="40" cy="265" rx="9" ry="2" fill="#582f0e" />
            </g>

            {/* Cozy Open Book lying directly in focus of spotlight */}
            <g transform="translate(15, 25)" opacity={isLightOn ? "1" : "0.4"} className="transition-all duration-500">
              {/* Book Base (Shadow/Cover) */}
              <path d="M 105 287 C 125 285, 140 293, 145 298 C 150 293, 165 285, 185 287 L 190 296 C 170 294, 155 301, 145 306 C 135 301, 120 294, 100 296 Z" fill={isLightOn ? "#7c2d12" : "#1e293b"} />
              {/* Left Page */}
              <path d="M 108 284 C 126 282, 140 289, 145 294 L 145 284 C 140 279, 126 272, 108 274 Z" fill={isLightOn ? "#e7e5e4" : "#334155"} />
              {/* Right Page */}
              <path d="M 182 284 C 164 282, 150 289, 145 294 L 145 284 C 150 279, 164 272, 182 274 Z" fill={isLightOn ? "#fafaf9" : "#475569"} />
              {/* Binding line */}
              <line x1="145" y1="284" x2="145" y2="294" stroke={isLightOn ? "#a8a29e" : "#1e293b"} strokeWidth="1.5" />
              {/* Script text indicators */}
              <line x1="114" y1="278" x2="134" y2="277" stroke={isLightOn ? "#78716c" : "#334155"} strokeWidth="1" />
              <line x1="114" y1="281" x2="130" y2="280" stroke={isLightOn ? "#78716c" : "#334155"} strokeWidth="1" />
              <line x1="156" y1="278" x2="176" y2="277" stroke={isLightOn ? "#a8a29e" : "#475569"} strokeWidth="1" />
              <line x1="156" y1="281" x2="172" y2="280" stroke={isLightOn ? "#a8a29e" : "#475569"} strokeWidth="1" />
            </g>

            {/* SCANDINAVIAN DESK LAMP */}
            {/* Lamp base block (Heavy iron look) */}
            <rect x="155" y="295" width="60" height="30" rx="7" fill="#1e293b" stroke={isLightOn ? "#ea580c" : "#334155"} strokeWidth="2" />
            <rect x="165" y="290" width="40" height="5" fill="url(#brass-stem)" />

            {/* Green glowing switch knob */}
            <circle 
              cx="185" 
              cy="310" 
              r="6" 
              fill={isLightOn ? "#22c55e" : "#64748b"} 
              style={{
                filter: isLightOn ? 'drop-shadow(0 0 5px #22c55e)' : 'none'
              }}
              className="transition-all duration-300"
            />

            {/* Curved double-jointed brass lamp frame/neck */}
            <path 
              d="M 185 290 Q 190 170, 130 140" 
              fill="none" 
              stroke="url(#brass-stem)" 
              strokeWidth="6" 
              strokeLinecap="round" 
            />
            {/* Joint detail */}
            <circle cx="130" cy="140" r="6" fill="#b45309" />
            <path 
              d="M 130 140 Q 120 135, 126 122" 
              fill="none" 
              stroke="url(#brass-stem)" 
              strokeWidth="4.5" 
              strokeLinecap="round" 
            />

            {/* Conical shade rotated towards the book */}
            <g transform="rotate(-20 126 122)">
              {/* Joint ring */}
              <circle cx="126" cy="122" r="5" fill="#f59e0b" />
              
              {/* Lamp Shade Dome */}
              <path 
                d="M 106 122 C 106 100, 146 100, 146 122 L 158 150 L 94 150 Z" 
                fill={isLightOn ? "#1e293b" : "#475569"} 
                stroke={isLightOn ? "#f16323" : "#334155"}
                strokeWidth="2"
                className="transition-colors duration-500" 
              />
              
              {/* Bulb glowing surface */}
              {isLightOn && (
                <ellipse cx="126" cy="150" rx="30" ry="7" fill="#fef08a" opacity="0.8" />
              )}
              <circle 
                cx="126" 
                cy="150" 
                r="11" 
                fill={isLightOn ? "#fef08a" : "#cbd5e1"} 
                style={{
                  filter: isLightOn ? 'drop-shadow(0 0 12px #fef08a) drop-shadow(0 0 20px #eab308)' : 'none'
                }}
                className="transition-all duration-500"
              />
            </g>

          </svg>
        </div>

        {/* Ambient Prompt Card */}
        <div className={`p-5 rounded-2xl w-full max-w-xs text-center border relative z-10 transition-all duration-500 ${
          isLightOn 
            ? "bg-white/85 border-gray-200/60 shadow-md shadow-gray-200/20 text-gray-700" 
            : "bg-slate-900/70 border-slate-800/80 shadow-lg shadow-black/30 text-slate-300"
        }`}>
          <div className="flex items-center justify-center gap-1.5 mb-1.5">
            <Sparkles className="w-4 h-4 text-[#F16323] animate-pulse" />
            <h4 className="text-xs font-black uppercase tracking-widest text-[#F16323]">Interactive Scene</h4>
          </div>
          <p className="text-[11px] opacity-80 leading-relaxed">
            Toggle the green button on the desk lamp to switch between Light Mode and Cozy Reading Dark Mode.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Frosted Glass Step-by-Step Questionnaire Wizard */}
      <div className="w-full lg:w-[52%] flex items-center justify-center p-6 md:p-12 lg:p-14 relative z-10">
        
        <div className={`max-w-xl w-full rounded-3xl p-8 md:p-10 transition-all duration-500 shadow-2xl border backdrop-blur-xl ${
          isLightOn 
            ? "bg-white/90 border-white/60 shadow-gray-200/40" 
            : "bg-[#111928]/85 border-slate-800/80 shadow-black/55"
        }`}>
          
          {/* Wizard Progress Nodes */}
          <div className="flex items-center justify-between mb-8 relative max-w-xs mx-auto">
            {/* Center connector line */}
            <div className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 transition-colors duration-500 ${
              isLightOn ? "bg-gray-100" : "bg-slate-800"
            }`} style={{ zIndex: 0 }}>
              <div 
                className="h-full bg-[#F16323] transition-all duration-500" 
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />
            </div>

            {/* Step Nodes */}
            {[
              { num: 1, icon: Target, label: "Genres" },
              { num: 2, icon: CheckCircle2, label: "Authors" },
              { num: 3, icon: DollarSign, label: "Budget" }
            ].map((node) => {
              const IconComp = node.icon;
              const isActive = step >= node.num;
              const isCurrent = step === node.num;
              return (
                <div key={node.num} className="flex flex-col items-center relative z-10" style={{ zIndex: 1 }}>
                  <button 
                    onClick={() => setStep(node.num)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 font-bold text-sm ${
                      isCurrent 
                        ? "bg-[#F16323] text-white scale-110 shadow-lg shadow-orange-500/20" 
                        : isActive
                          ? "bg-[#F16323]/80 text-white"
                          : isLightOn
                            ? "bg-gray-100 text-gray-400 hover:bg-gray-200"
                            : "bg-slate-800 text-slate-500 hover:bg-slate-700"
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </button>
                  <span className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 transition-colors ${
                    isCurrent 
                      ? "text-[#F16323]" 
                      : isLightOn ? "text-gray-400" : "text-slate-500"
                  }`}>
                    {node.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Title Header */}
          <div className="text-center mb-8 border-b border-gray-100 dark:border-slate-800/80 pb-6">
            <h1 className="text-2xl font-black tracking-tight mb-2 uppercase text-[#F16323]">
              {step === 1 && "Select Genres"}
              {step === 2 && "Favorite Authors"}
              {step === 3 && "Average Budget"}
            </h1>
            <p className={`text-xs ${isLightOn ? "text-gray-500" : "text-slate-400"} max-w-sm mx-auto`}>
              {step === 1 && "Select the main genres that draw your curiosity."}
              {step === 2 && "Tell us whose writing style you love. (Optional)"}
              {step === 3 && "Set your budget target. We prioritize matching your wallet."}
            </p>
          </div>

          {/* Wizard Steps Containers */}
          <div className="min-h-[220px]">
            
            {/* Step 1: Categories Genres */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex flex-wrap gap-2.5 justify-center py-2">
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`px-4 py-3 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-200 cursor-pointer active:scale-95 ${
                          isSelected
                            ? "bg-[#F16323] text-white shadow-lg shadow-orange-950/20 scale-105"
                            : isLightOn
                              ? "bg-gray-100 hover:bg-gray-200 text-gray-600"
                              : "bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
                {selectedCategories.length > 0 && (
                  <p className="text-[10px] text-center font-bold text-[#F16323] uppercase tracking-widest mt-2">
                    {selectedCategories.length} Genres selected
                  </p>
                )}
              </div>
            )}

            {/* Step 2: Authors */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <input
                  type="text"
                  placeholder="Enter name (e.g. Dale Carnegie) & press Enter..."
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  onKeyDown={handleAddAuthor}
                  className={`w-full text-sm rounded-xl px-4 py-3.5 outline-none border transition-all duration-300 ${
                    isLightOn 
                      ? "bg-gray-50 border-gray-200 text-gray-900 focus:border-[#F16323] focus:bg-white focus:ring-1 focus:ring-[#F16323]" 
                      : "bg-slate-900 border-slate-700 text-slate-100 focus:border-[#F16323] focus:bg-[#0c121c] focus:ring-1 focus:ring-[#F16323]"
                  }`}
                />
                <div className="flex flex-wrap gap-2 pt-2 justify-center max-h-[140px] overflow-y-auto pr-1">
                  {authors.length === 0 ? (
                    <p className={`text-xs italic text-center py-6 ${isLightOn ? "text-gray-400" : "text-slate-500"}`}>
                      No authors added yet. Type a name above and hit Enter.
                    </p>
                  ) : (
                    authors.map((author, idx) => (
                      <span 
                        key={idx} 
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 border transition-all animate-scale-up ${
                          isLightOn
                            ? "bg-orange-50 text-[#F16323] border-orange-100"
                            : "bg-orange-950/30 text-orange-400 border-orange-900/40"
                        }`}
                      >
                        {author}
                        <button 
                          onClick={() => removeAuthor(author)} 
                          className="hover:text-red-500 ml-1.5 transition-colors p-0.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Budget Range Slider */}
            {step === 3 && (
              <div className="space-y-6 py-4 animate-fade-in flex flex-col justify-center">
                <div className="flex flex-col gap-3 max-w-sm mx-auto w-full">
                  <input 
                    type="range" 
                    min="5" max="100" step="5" 
                    value={budget} 
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full cursor-pointer accent-[#F16323]"
                  />
                  <div className="flex justify-between text-xs font-black text-[#F16323] items-center px-1">
                    <span>$5</span>
                    <span className="text-xl bg-orange-100/70 dark:bg-orange-950/40 px-5 py-2 rounded-2xl font-black shadow-inner shadow-orange-500/5">
                      ${budget}
                    </span>
                    <span>$100+</span>
                  </div>
                </div>
                <p className={`text-[10px] italic text-center max-w-xs mx-auto ${isLightOn ? "text-gray-400" : "text-slate-500"}`}>
                  Matching your budget settings ensures our SVD filtering scores downweight pricey alternatives.
                </p>
              </div>
            )}

          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-slate-800/80">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className={`px-5 py-4.5 rounded-2xl font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-1.5 border cursor-pointer active:scale-95 ${
                  isLightOn
                    ? "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
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
                className="flex-grow bg-[#F16323] hover:bg-orange-600 text-white font-extrabold py-4.5 rounded-2xl transition-all shadow-xl shadow-orange-500/10 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-grow bg-[#F16323] hover:bg-orange-600 text-white font-extrabold py-4.5 rounded-2xl transition-all shadow-xl shadow-orange-500/10 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? "Processing..." : "Complete & Explore"}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}