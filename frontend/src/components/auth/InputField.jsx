import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Reusable input field for auth forms.
 *
 * Fixes vs. previous version:
 * - Icon no longer overlaps placeholder text: input now has proper
 *   left padding (pl-11) that matches the icon's absolute position,
 *   and the icon has pointer-events-none so it never intercepts clicks.
 * - Password visibility toggle is a real, working button anchored
 *   inside the input (right-3.5, vertically centered), not floating
 *   off to the side.
 * - Fixed height (h-12) keeps every field the same size regardless
 *   of icon/label combination, so the form never looks "méo".
 */
export default function InputField({
  name,
  value,
  onChange,
  label,
  type = "text",
  placeholder,
  icon: Icon,
  required = false,
  error,
  className = "",
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-bold text-ink/80 mb-1.5 font-sans"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon
            className="w-4 h-4 text-ink/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            strokeWidth={2}
          />
        )}

        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={isPassword ? "current-password" : name}
          className={[
            "w-full h-12 rounded-xl border bg-white/60 text-ink text-sm font-medium",
            "placeholder:text-ink/35 placeholder:font-normal",
            "outline-none transition-all duration-200",
            "focus:ring-2 focus:ring-offset-0",
            Icon ? "pl-11" : "pl-4",
            isPassword ? "pr-11" : "pr-4",
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-ink/10 focus:border-gold focus:ring-gold/20",
            className,
          ].join(" ")}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" strokeWidth={2} />
            ) : (
              <Eye className="w-4 h-4" strokeWidth={2} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}