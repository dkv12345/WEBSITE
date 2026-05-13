import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function InputField({ label, type, placeholder, icon: Icon, value, onChange, name }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-bold text-gray-700 tracking-wide">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
          <Icon size={18} strokeWidth={2} />
        </div>
        
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={isPassword && show ? "text" : type}
          placeholder={placeholder}
          className="w-full bg-white border border-gray-200 rounded-[10px] py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all shadow-sm"
          required
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}