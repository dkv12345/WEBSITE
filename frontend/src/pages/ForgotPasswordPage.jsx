import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, BookOpen, ArrowLeft, CheckCircle2, Loader } from "lucide-react";
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
      <div className="absolute inset-0 bg-[#0c0a10]/50 backdrop-blur-xs z-0 pointer-events-none" />
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@300;400;500&display=swap');

        .font-display {
          font-family: 'Cormorant Garamond', serif;
          font-style: normal;
        }
        .font-mono-lbl {
          font-family: 'IBM Plex Mono', monospace;
        }
        .font-sans-pref {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        /* Enforce fonts and no italics rules */
        body, input, span, p, div, button {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          font-style: normal !important;
        }
        h1, h2, h3, h4, .font-display {
          font-family: 'Cormorant Garamond', serif !important;
          font-style: normal !important;
        }
      `}} />

      <div className="relative z-10 w-full max-w-[1100px] bg-[#FAF8F5]/90 backdrop-blur-md rounded-3xl flex flex-col md:flex-row overflow-hidden min-h-[680px] border border-white/20 shadow-2xl">
        
        {/* === CỘT TRÁI (FORM) === */}
        <div className="w-full md:w-[55%] p-8 md:p-12 lg:pl-14 flex flex-col relative">
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-8 left-8 p-2.5 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="mt-8 mb-6 flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-[#D49B00]" strokeWidth={2.5} />
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">BookHaven</span>
          </div>

          {!isSubmitted ? (
            <div className="flex-1 flex flex-col justify-center max-w-[420px] w-full pb-10">
              <div className="mb-6">
                <h1 className="text-[32px] leading-tight font-extrabold text-gray-900 mb-3 tracking-tight">Forgot Password?</h1>
                <p className="text-gray-500 text-[15px] leading-relaxed">
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
                />

                 <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-[#D49B00] hover:bg-[#b88600] text-white font-bold rounded-[10px] transition-all active:scale-[0.98] mt-4 shadow-md shadow-amber-500/20 disabled:opacity-70 flex items-center justify-center"
                >
                  {isLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center max-w-[420px] w-full pb-10 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={32} strokeWidth={2.5} />
              </div>
              <h1 className="text-[28px] leading-tight font-extrabold text-gray-900 mb-3 tracking-tight">Check your email</h1>
              <p className="text-gray-500 text-[15px] leading-relaxed mb-8">
                We have sent a password reset link to <br/>
                <span className="font-bold text-gray-800">{email}</span>
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3.5 px-4 bg-[#D49B00] hover:bg-[#b88600] text-white font-bold rounded-[10px] transition-all active:scale-[0.98]"
              >
                Back to Login
              </button>
            </div>
          )}

          <p className="text-left text-sm text-gray-600 mt-auto font-medium">
            Remember your password?{' '}
            <Link to="/login" className="font-bold text-[#D49B00] hover:text-[#b88600]">
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
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>

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
                
                <p className="text-white text-[16px] font-semibold leading-relaxed mb-6">
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
