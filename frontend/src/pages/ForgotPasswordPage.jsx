import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, BookOpen, ArrowLeft, CheckCircle2, Loader } from "lucide-react";
import { motion } from "framer-motion";
import InputField from "../components/auth/InputField";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/api/auth/forgot-password", { email });
      setIsSubmitted(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="relative min-h-screen w-full overflow-hidden font-sans flex items-center justify-center p-4 md:p-6"
      style={{
        backgroundImage: "url('/background_auth.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Dark warm overlay */}
      <div className="absolute inset-0 bg-void/50 backdrop-blur-xs z-0 pointer-events-none" />
      
      {/* Ambient floating star particles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute w-2 h-2 rounded-full bg-gold/40 top-[15%] left-[25%] animate-float-slow" style={{ animationDelay: "0s" }} />
        <div className="absolute w-1 h-1 rounded-full bg-white/50 top-[35%] left-[75%] animate-float-medium" style={{ animationDelay: "2s" }} />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-nebula/30 top-[65%] left-[15%] animate-float-slow" style={{ animationDelay: "4s" }} />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-gold/30 top-[80%] left-[80%] animate-float-medium" style={{ animationDelay: "1s" }} />
        <div className="absolute w-2 h-2 rounded-full bg-indigo-300/30 top-[45%] left-[40%] animate-float-slow" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative z-10 w-full max-w-[1100px] bg-parchment/95 backdrop-blur-md rounded-3xl flex flex-col md:flex-row overflow-hidden min-h-[680px] border border-gold/15 shadow-2xl">
        
        {/* === CỘT TRÁI (FORM) === */}
        <div className="w-full md:w-[55%] p-8 md:p-12 lg:pl-14 flex flex-col relative text-ink">
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-8 left-8 p-2.5 bg-white/60 hover:bg-white rounded-full transition-colors border border-ink/5"
          >
            <ArrowLeft className="w-5 h-5 text-ink" />
          </button>

          <div className="mt-8 mb-6 flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-gold" strokeWidth={2.5} />
            <span className="text-xl font-extrabold text-ink tracking-tight font-sans">BookHaven</span>
          </div>

          {!isSubmitted ? (
            <div className="flex-1 flex flex-col justify-center max-w-[420px] w-full pb-10">
              <div className="mb-6">
                <h1 className="text-[32px] leading-tight font-extrabold text-ink mb-3 tracking-tight font-display">Forgot Password?</h1>
                <p className="text-ink/65 text-[15px] leading-relaxed">
                  Don't worry! It happens. Please enter the email address associated with your account and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 w-full">
                <InputField
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  icon={Mail}
                  className="bg-white/50 border-ink/10 focus:border-gold focus:ring-gold text-ink"
                />

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="w-full py-3.5 px-4 bg-cta-gradient hover:bg-cta-gradient-hover text-white font-bold rounded-[10px] transition-all mt-4 shadow-md shadow-gold/15 disabled:opacity-70 flex items-center justify-center"
                >
                  {isLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    "Send Reset Link"
                  )}
                </motion.button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center max-w-[420px] w-full pb-10 text-center">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 border border-green-200">
                <CheckCircle2 size={32} strokeWidth={2.5} />
              </div>
              <h1 className="text-[28px] leading-tight font-extrabold text-ink mb-3 tracking-tight font-display">Check your email</h1>
              <p className="text-ink/65 text-[15px] leading-relaxed mb-8">
                We have sent a password reset link to <br/>
                <span className="font-bold text-ink">{email}</span>
              </p>
              <motion.button
                onClick={() => navigate("/login")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="w-full py-3.5 px-4 bg-cta-gradient hover:bg-cta-gradient-hover text-white font-bold rounded-[10px] transition-all shadow-md shadow-gold/15"
              >
                Back to Login
              </motion.button>
            </div>
          )}

          <p className="text-left text-sm text-ink/75 mt-auto font-medium">
            Remember your password?{' '}
            <Link to="/login" className="font-bold text-gold hover:text-ember transition-colors">
              Log in
            </Link>
          </p>
        </div>

        {/* === CỘT PHẢI (ẢNH COVER) === */}
        <div className="hidden md:block w-[45%] p-2.5">
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            <img
              src="/bookshelf.jpg"
              alt="Library Bookshelf"
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/30 to-transparent"></div>

            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-[11px] font-bold tracking-wide text-white border border-white/10">
                    Security
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-[11px] font-bold tracking-wide text-white border border-white/10">
                    Support
                  </span>
                </div>
                
                <p className="text-white text-[16px] font-semibold leading-relaxed mb-6 font-display">
                  "Sometimes we lose our page, but the story always continues. Reset your password securely and get right back to your reading journey."
                </p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold text-sm">BookHaven Team</h4>
                    <p className="text-white/70 text-xs font-semibold mt-0.5">Always here to help</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
