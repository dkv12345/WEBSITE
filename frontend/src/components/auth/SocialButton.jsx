export default function SocialButton({ icon }) {
  return (
    <button
      type="button"
      className="flex-1 flex items-center justify-center border border-gray-200 bg-white rounded-[10px] py-2.5 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-[0.98]"
    >
      {icon}
    </button>
  );
}