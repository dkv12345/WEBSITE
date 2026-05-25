import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function InputField({ label, icon: Icon, type, ...props }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  
  const inputType = isPassword && showPassword ? "text" : type;

  const RightIcon = showPassword ? Eye : EyeOff;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Label hiển thị ở trên (nếu có truyền prop label) */}
      {label && <label className="text-sm font-bold text-gray-700">{label}</label>}
      
      <div className="relative w-full">
        {/* === ICON TRÁI (User, Mail, Lock...) === */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          {Icon && <Icon className="w-5 h-5 text-gray-400" />}
        </div>

        {/* === Ô NHẬP LIỆU (INPUT) === */}
        <input
          type={inputType}
          // pl-11: chừa chỗ cho icon trái
          // pr-12: chừa chỗ lớn cho icon phải (chống đè icon mặc định của trình duyệt)
          // focus:border-[#F16323]: Đổi viền sang màu cam đặc trưng khi click
          className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-[10px] focus:outline-none focus:border-[#F16323] focus:ring-1 focus:ring-[#F16323] transition-all text-sm font-medium"
          
          // Tắt tự động điền mật khẩu mặc định (ngăn trình duyệt chèn icon chìa khóa)
          autoComplete={isPassword ? "new-password" : props.autoComplete}
          {...props}
        />

        {/* === ICON PHẢI (CHUYỂN ĐỔI ẨN/HIỆN MẬT KHẨU) === */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1" // Không focus vào nút này khi bấm phím Tab
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <RightIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}