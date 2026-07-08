import { ShieldCheck, Loader2, Check, BookOpen, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-b border-gray-50 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="p-3 bg-amber-50 rounded-full text-[#D49B00]"><ShieldCheck className="w-6 h-6" /></div>
          <div>
            <h5 className="text-xs font-black text-gray-900 uppercase">100% Genuine Books</h5>
            <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Directly sourced from licensed global publishers</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="p-3 bg-amber-50 rounded-full text-[#D49B00]"><Loader2 className="w-6 h-6" /></div>
          <div>
            <h5 className="text-xs font-black text-gray-900 uppercase">Express Dispatch</h5>
            <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Secure packaging and same-day delivery routing</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="p-3 bg-amber-50 rounded-full text-[#D49B00]"><Check className="w-6 h-6" /></div>
          <div>
            <h5 className="text-xs font-black text-gray-900 uppercase">24/7 Priority Support</h5>
            <p className="text-[11px] text-gray-400 mt-0.5 font-medium">Direct live agent support via hotlines & mailboxes</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-12 gap-8 text-left">
        <div className="col-span-2 md:col-span-4 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#D49B00]" strokeWidth={2.5} />
            <span className="text-lg font-black tracking-tight text-gray-900">BookHaven</span>
          </div>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            Your elite ecosystem for digital and tangible knowledge infrastructure. Empowering readers globally since 2026.
          </p>
          <div className="text-xs font-semibold text-gray-600 space-y-2 pt-1">
            <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-gray-400" /> <span>(+84) 1900 6789</span></div>
            <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-gray-400" /> <span>support@bookhaven.com</span></div>
            <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-400" /> <span className="text-[11px]">District 1, Ho Chi Minh City, Vietnam</span></div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 space-y-3">
          <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">Account Services</h4>
          <ul className="space-y-1.5 text-xs font-bold text-gray-500">
            <li><span className="hover:text-[#D49B00] cursor-pointer transition-colors">User Dashboard</span></li>
            <li><span className="hover:text-[#D49B00] cursor-pointer transition-colors">Order Tracking</span></li>
            <li><span className="hover:text-[#D49B00] cursor-pointer transition-colors">Wishlists Locker</span></li>
            <li><span className="hover:text-[#D49B00] cursor-pointer transition-colors">Purchase Invoices</span></li>
          </ul>
        </div>

        <div className="col-span-1 md:col-span-2 space-y-3">
          <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">Legal Terms</h4>
          <ul className="space-y-1.5 text-xs font-bold text-gray-500">
            <li><span className="hover:text-[#D49B00] cursor-pointer transition-colors">Privacy Charter</span></li>
            <li><span className="hover:text-[#D49B00] cursor-pointer transition-colors">Terms of Use</span></li>
            <li><span className="hover:text-[#D49B00] cursor-pointer transition-colors">Refund Policies</span></li>
            <li><span className="hover:text-[#D49B00] cursor-pointer transition-colors">Affiliate Nodes</span></li>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-4 space-y-3">
          <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">Secure Payment Gateways</h4>
          <p className="text-xs text-gray-400 font-medium">We support secure cryptographic and international standard banking wire payments:</p>
          <div className="flex flex-wrap gap-2 pt-1.5">
            {["Visa", "Mastercard", "PayPal", "ApplePay", "Momo"].map((p) => (
              <span key={p} className="px-2.5 py-1 bg-gray-50 border border-gray-200/60 rounded text-[10px] font-black text-gray-600 tracking-wide">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border-t border-gray-100 py-4 text-center text-xs font-semibold text-gray-400">
        <p>© 2026 BookHaven Systems Inc. All Rights Reserved. Powered by Vite Framework.</p>
      </div>
    </footer>
  );
}
