import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Target, DollarSign, CheckCircle2 } from "lucide-react";

const CATEGORIES = ["Fiction", "History", "Poetry", "Cooking", "Biography", "Business", "Sci-Fi", "Romance"];

export default function OnboardingPage() {
  const navigate = useNavigate();
  
  // State lưu trữ dữ liệu người dùng chọn
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [authorInput, setAuthorInput] = useState("");
  const [authors, setAuthors] = useState([]);
  const [budget, setBudget] = useState(20); // Mặc định 20$
  const [loading, setLoading] = useState(false);

  // Xử lý chọn/bỏ chọn Category
  const toggleCategory = (cat) => {
    setSelectedCategories((prev) => 
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Xử lý thêm tác giả
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

  // Gửi dữ liệu xuống Backend
  const handleSubmit = async () => {
    if (selectedCategories.length === 0) {
      alert("Vui lòng chọn ít nhất 1 thể loại bạn yêu thích!");
      return;
    }

    setLoading(true);
    try {

      const response = await fetch("http://localhost:5001/api/auth/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // <--- THÊM DÒNG NÀY ĐỂ GỬI KÈM COOKIE CHỨA TOKEN
        body: JSON.stringify({
          favCategories: selectedCategories,
          favAuthors: authors,
          userBudget: budget
        })
      });

      const data = await response.json();
      if (data.success) {
        // ĐÃ SỬA LỖI ĐIỀU HƯỚNG TẠI ĐÂY: Chuyển thẳng vào trang chủ
        navigate("/mainwebpage");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 md:p-12">
        
        {/* Header */}
        <div className="text-center mb-10">
          <BookOpen className="w-12 h-12 text-[#F16323] mx-auto mb-4" strokeWidth={2} />
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Let's personalize your library!</h1>
          <p className="text-gray-500">Giúp BookHaven hiểu rõ gu đọc sách của bạn để đề xuất chính xác nhất.</p>
        </div>

        <div className="space-y-8">
          {/* Section 1: Categories */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-[#F16323]" /> 1. Chọn thể loại yêu thích
            </h2>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    selectedCategories.includes(cat)
                      ? "bg-[#F16323] text-white shadow-md shadow-orange-200"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Authors */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-[#F16323]" /> 2. Tác giả yêu thích (Tùy chọn)
            </h2>
            <input
              type="text"
              placeholder="Nhập tên tác giả và nhấn Enter..."
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
              onKeyDown={handleAddAuthor}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 outline-none focus:border-[#F16323] focus:ring-1 focus:ring-[#F16323] transition-all"
            />
            {authors.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {authors.map((author, idx) => (
                  <span key={idx} className="bg-orange-50 text-[#F16323] text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1 border border-orange-100">
                    {author}
                    <button onClick={() => removeAuthor(author)} className="hover:text-red-500 ml-1">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Budget */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-[#F16323]" /> 3. Ngân sách mua sách trung bình
            </h2>
            <div className="flex flex-col gap-2">
              <input 
                type="range" 
                min="5" max="100" step="5" 
                value={budget} 
                onChange={(e) => setBudget(e.target.value)}
                className="w-full accent-[#F16323]"
              />
              <div className="flex justify-between text-sm font-bold text-[#F16323]">
                <span>$5</span>
                <span className="text-xl">${budget}</span>
                <span>$100+</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">Chúng tôi sẽ ưu tiên gợi ý những cuốn sách phù hợp với túi tiền của bạn.</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-10">
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#F16323] text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Hoàn tất & Khám phá sách"}
          </button>
        </div>

      </div>
    </div>
  );
}