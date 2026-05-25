import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, BookOpen, ArrowLeft, ArrowRight, Loader } from "lucide-react";
import InputField from "../components/auth/InputField";
import SocialButton from "../components/auth/SocialButton";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/login", form, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F16323] flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-[1100px] bg-white rounded-3xl flex flex-col md:flex-row overflow-hidden min-h-[680px]">

        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-8 left-8 p-2.5 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="mt-10 mb-8 flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-[#F16323]" strokeWidth={2.5} />
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">BookHaven</span>
          </div>

          <div className="mb-8">
            <h1 className="text-[32px] leading-tight font-extrabold text-gray-900 mb-2 tracking-tight">Welcome back</h1>
            <p className="text-gray-500 text-[15px]">Enter your details to access your personal library.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 flex-1 w-full max-w-[400px]">
            <InputField
              name="email"
              value={form.email}
              onChange={handleChange("email")}
              label="Email"
              type="email"
              placeholder="Enter your email"
              icon={Mail}
            />

            <InputField
              name="password"
              value={form.password}
              onChange={handleChange("password")}
              label="Password"
              type="password"
              placeholder="Enter your password"
              icon={Lock}
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#F16323] focus:ring-[#F16323]"
                />
                <span className="text-sm text-gray-600 font-medium group-hover:text-gray-900 transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-bold text-[#F16323] hover:text-orange-700 transition-colors">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#F16323] hover:bg-[#d9561c] text-white font-bold rounded-[10px] transition-all active:scale-[0.98] mt-2 disabled:opacity-70 flex items-center justify-center"
            >
              {isLoading ? (
                <Loader className="w-5 h-5 animate-spin mx-auto text-white" />
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="mt-8 max-w-[400px]">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-[11px] uppercase font-bold tracking-widest">
                <span className="bg-white px-4 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <SocialButton icon={<GoogleIcon />} />
              <SocialButton icon={<FacebookIcon />} />
              <SocialButton icon={<GithubIcon />} />
            </div>
          </div>

          <p className="text-left text-sm text-gray-600 mt-8 font-medium">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-[#F16323] hover:text-orange-700">
              Sign up
            </Link>
          </p>
        </div>

        <div className="hidden md:block w-1/2 p-2.5">
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
                    Community of readers
                  </span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-[11px] font-bold tracking-wide text-white border border-white/10">
                    Vast resources
                  </span>
                </div>

                <p className="text-white text-[17px] font-semibold leading-relaxed mb-6">
                  "I was able to find rare editions and connect with fellow book lovers, elevating my reading experience by 100% using this platform."
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold text-sm">Sarah Bright</h4>
                    <p className="text-white/70 text-xs font-semibold mt-0.5">Avid Reader</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full border border-white/30 text-white hover:bg-white/10 transition-colors">
                      <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
                    </button>
                    <button className="p-2 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-colors">
                      <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                    </button>
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

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.29-8.16 2.29-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 32 32">
      <path fill="#1877F2" d="M32 16C32 7.163 24.837 0 16 0S0 7.163 0 16c0 7.985 5.845 14.604 13.5 15.806V20.625H9.438V16H13.5v-3.562c0-4.01 2.389-6.228 6.043-6.228 1.751 0 3.582.312 3.582.312v3.938H21.11c-1.988 0-2.61 1.233-2.61 2.499V16h4.438l-.71 4.625H18.5v11.181C26.155 30.604 32 23.985 32 16z"/>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#111827">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}
