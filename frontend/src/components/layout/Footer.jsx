import { ShieldCheck, Loader2, Check, BookOpen, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    // Đã xóa mt-20 và border-t-8 để footer bám sát nội dung phía trên
    <footer className="bg-[#F7EFE1] text-[#2d1b14] font-serif">
      
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-6 py-8 border-t border-b border-[#3e2723]/20 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center md:text-left">
        {[
          { icon: ShieldCheck, title: "100% Genuine", desc: "Licensed global editions" },
          { icon: Loader2, title: "Swift Dispatch", desc: "Careful courier routing" },
          { icon: Check, title: "Scholar Support", desc: "24/7 expert assistance" },
        ].map((item, i) => (
          <div key={i} className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3">
            <div className="p-2 border border-[#3e2723] text-[#3e2723]">
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-[10px] font-black uppercase tracking-widest text-[#3e2723]">{item.title}</h5>
              <p className="text-[10px] text-[#5a4a42] mt-0.5 italic">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-12 gap-8 text-left">
        <div className="col-span-2 md:col-span-4 space-y-3">
          <div className="flex items-center gap-2 border-b border-[#3e2723]/20 pb-2">
            <BookOpen className="w-6 h-6 text-[#3e2723]" strokeWidth={2} />
            <span className="text-lg font-black italic tracking-tighter text-[#3e2723]">BookHaven</span>
          </div>
          <p className="text-[11px] text-[#5a4a42] leading-relaxed italic font-light">
            An elite ecosystem for preserving human knowledge infrastructure. Established MMXVI.
          </p>
          <div className="text-[11px] font-bold text-[#3e2723] space-y-1.5 pt-1">
            <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> <span>(+84) 1900 6789</span></div>
            <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> <span>support@bookhaven.com</span></div>
            <div className="flex items-center gap-2"><MapPin className="w-3 h-3" /> <span>District 1, Ho Chi Minh City</span></div>
          </div>
        </div>

        {[
          { title: "Vault Index", links: ["Dashboard", "Orders", "Wishlists", "Invoices"] },
          { title: "Legal Canon", links: ["Privacy", "Usage Terms", "Refunds", "Affiliates"] }
        ].map((col, i) => (
          <div key={i} className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3e2723] underline decoration-[#3e2723]/30 underline-offset-4">{col.title}</h4>
            <ul className="space-y-1.5 text-[11px] font-medium text-[#5a4a42]">
              {col.links.map(link => (
                <li key={link} className="hover:text-[#3e2723] hover:underline cursor-pointer transition-all uppercase tracking-wide">{link}</li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 md:col-span-4 space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3e2723] underline decoration-[#3e2723]/30 underline-offset-4">Exchange Mediums</h4>
          <p className="text-[11px] text-[#5a4a42] italic">We accept standard international banking protocols and secure wire transfers.</p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {["Visa", "Mastercard", "PayPal", "ApplePay", "Momo"].map((p) => (
              <span key={p} className="px-2 py-0.5 border border-[#3e2723]/30 text-[9px] font-bold text-[#3e2723] uppercase tracking-wide">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#e5dccf] py-4 text-center text-[9px] font-bold text-[#3e2723]/60 uppercase tracking-[0.2em]">
        <p>© 2026 BookHaven Systems. All rights reserved.</p>
      </div>
    </footer>
  );
}