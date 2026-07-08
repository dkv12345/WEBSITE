import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    const newCode = [...code];
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) newCode[i] = pastedCode[i] || "";
      setCode(newCode);
      inputRefs.current[5]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    try {
      const res = await axios.post("/api/auth/verify-email", { code: verificationCode });
      toast.success(res.data.message);
      navigate("/mainwebpage");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid verification code");
    }
  };

  return (
    <div className="min-h-screen bg-cosmic-linear flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute w-1.5 h-1.5 rounded-full bg-gold/40 top-[15%] left-[20%] animate-float-slow" />
        <div className="absolute w-1 h-1 rounded-full bg-white/40 top-[40%] left-[75%] animate-float-medium" />
        <div className="absolute w-2 h-2 rounded-full bg-nebula/30 top-[70%] left-[30%] animate-float-slow" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-gold/30 top-[85%] left-[80%] animate-float-medium" />
      </div>

      <div className="relative z-10 w-full max-w-md bg-parchment rounded-3xl p-8 shadow-2xl border border-gold/10">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-ink/60 hover:text-ink transition-colors font-medium">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </button>

        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-7 h-7 text-gold" strokeWidth={2.5} />
          <span className="text-xl font-extrabold text-ink tracking-tight font-sans">BookHaven</span>
        </div>

        <h2 className="text-2xl font-display font-bold text-ink mb-2">Verify your email</h2>
        <p className="text-ink/70 mb-6 text-sm">Enter the 6-digit code sent to your email address.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="6"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-ink/10 rounded-xl focus:border-gold focus:outline-none transition-all bg-white/50 text-ink"
              />
            ))}
          </div>

          <motion.button 
            type="submit" 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="w-full py-3 bg-cta-gradient hover:bg-cta-gradient-hover text-white font-bold rounded-xl transition-all shadow-md shadow-gold/20"
          >
            Verify Email
          </motion.button>
        </form>
      </div>
    </div>
  );
}