import { motion } from "framer-motion";
import BookCard from "../ui/BookCard";

export default function HomeCollectionsSection({ title, books, colorClass, label, props }) {
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between border-b border-[#D49B00]/20 pb-3">
        <div className="flex items-center gap-3">
          <div className={`w-1.5 h-6 ${colorClass} rounded-full`} />
          <h2 className="text-lg font-serif text-[#5C1E1A] uppercase tracking-wide">{title}</h2>
        </div>
        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{label}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {books.map((book, idx) => (
          <motion.div key={book._id} whileHover={{ y: -5 }}>
            <BookCard book={book} index={idx} {...props} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}