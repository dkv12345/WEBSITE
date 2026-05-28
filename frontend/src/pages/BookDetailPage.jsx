import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, ShoppingCart, Heart, Loader2 } from "lucide-react";

export default function BookDetailPage() {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetail = async () => {
      try {
        // Gọi API lấy 1 cuốn sách (Bạn đã viết API này ở book_controller.js rồi)
        const response = await fetch(`http://localhost:5001/api/books/${id}`);
        if (!response.ok) throw new Error("Không thể tải thông tin sách");
        
        const result = await response.json();
        setBook(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
        <Loader2 className="w-12 h-12 animate-spin text-[#F16323]" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAF8] text-gray-600">
        <p className="text-xl mb-4">{error || "Sách không tồn tại"}</p>
        <button onClick={() => navigate("/")} className="text-[#F16323] font-bold hover:underline">Quay lại trang chủ</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] font-sans pb-20">
      {/* Nút Quay Lại */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-5 h-5" /> <span>Trở về</span>
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Cột trái: Hình ảnh */}
        <div className="flex justify-center md:justify-end">
          <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={book.images?.large || book.images?.medium || "https://placehold.co/600x800/e2e8f0/64748b?text=No+Cover"} 
              alt={book.title}
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x800/e2e8f0/64748b?text=No+Cover"; }}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Cột phải: Thông tin */}
        <div className="flex flex-col justify-center">
          <span className="text-sm font-bold text-[#F16323] uppercase tracking-wider mb-2">
            {book.genres?.join(", ") || "General"}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-2">
            {book.title}
          </h1>
          <p className="text-lg text-gray-600 mb-6">Tác giả: <span className="font-semibold text-gray-900">{book.author}</span></p>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="text-lg font-bold text-gray-900">{book.metrics?.averageRating || 0}</span>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">{(book.metrics?.reviewCount || 0).toLocaleString()} đánh giá</span>
          </div>

          <div className="mb-8">
            <span className="text-4xl font-extrabold text-gray-900">${book.price?.toFixed(2) || "0.00"}</span>
            <span className="ml-3 text-sm text-green-600 font-semibold bg-green-50 px-2 py-1 rounded">
              {book.inStock ? "Còn hàng" : "Hết hàng"}
            </span>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-[#F16323] text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-orange-600 transition flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Thêm vào giỏ
            </button>
            <button className="p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
              <Heart className="w-6 h-6 text-gray-400 hover:text-red-500" />
            </button>
          </div>

          {/* Mô tả sách (Tạm thời hiển thị text giả định nếu DB chưa có trường description) */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Mô tả sách</h3>
            <p className="text-gray-600 leading-relaxed">
              {book.description || `Đắm chìm vào thế giới của "${book.title}" được chắp bút bởi tác giả ${book.author}. Một tác phẩm xuất sắc thuộc thể loại ${book.genres?.[0] || 'văn học'} sẽ mang đến cho bạn những góc nhìn hoàn toàn mới mẻ và những trải nghiệm đọc không thể nào quên.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}