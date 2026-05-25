import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen bg-[#F16323] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </button>

        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-7 h-7 text-[#F16323]" />
          <span className="text-xl font-extrabold text-gray-900">BookHaven</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h2>
        <p className="text-gray-500 mb-6">Enter the 6-digit code sent to your email address.</p>

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
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-[#F16323] focus:outline-none transition-all"
              />
            ))}
          </div>

          <button type="submit" className="w-full py-3 bg-[#F16323] hover:bg-[#d9561c] text-white font-bold rounded-xl transition-all">
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
}