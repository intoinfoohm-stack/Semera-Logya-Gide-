import React, { useState } from 'react';
import { Calendar, ArrowRight, Loader2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NewsItem } from '../types';

const NEWS: NewsItem[] = [
  {
    id: 1,
    title: "የሰመራ-ሎግያ ከተማ ልማት ፕሮጀክት ተጀመረ (Semera-Logia Urban Development Project Launched)",
    date: "March 8, 2026",
    summary: "A new initiative to enhance infrastructure and public services in the twin cities has officially commenced."
  },
  {
    id: 2,
    title: "በሰመራ ዩኒቨርሲቲ የተካሄደው የባህል ሳምንት ተጠናቀቀ (Cultural Week at Semera University Concludes)",
    date: "March 5, 2026",
    summary: "Students and faculty celebrated the diverse heritage of the Afar region through music, art, and traditional cuisine."
  },
  {
    id: 3,
    title: "አዲስ የቱሪስት መረጃ ማዕከል በሰመራ ተከፈተ (New Tourist Information Center Opens in Semera)",
    date: "March 1, 2026",
    summary: "Visitors can now access comprehensive guides and booking services for Danakil Depression tours at the city center."
  },
  {
    id: 4,
    title: "የአፋር ክልል የንግድ ትርኢት በሎግያ ተከፈተ (Afar Regional Trade Fair Opens in Logia)",
    date: "February 25, 2026",
    summary: "Local entrepreneurs and artisans are showcasing their products at the annual trade fair, attracting visitors from across the region."
  },
  {
    id: 5,
    title: "የሰመራ አውሮፕላን ማረፊያ የማስፋፊያ ስራ ተጠናቀቀ (Semera Airport Expansion Completed)",
    date: "February 20, 2026",
    summary: "The newly expanded terminal and runway are now operational, allowing for increased flight frequency and larger aircraft."
  },
  {
    id: 6,
    title: "በዳሎል አካባቢ አዲስ የቱሪዝም መመሪያ ወጣ (New Tourism Guidelines Issued for Dallol Area)",
    date: "February 15, 2026",
    summary: "Regional authorities have released updated safety and environmental guidelines for visitors exploring the Dallol hydrothermal fields."
  }
];

export default function News() {
  const [visibleCount, setVisibleCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 3, NEWS.length));
      setIsLoading(false);
    }, 800);
  };

  const visibleNews = NEWS.slice(0, visibleCount);
  const hasMore = visibleCount < NEWS.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2 px-2">
        <h4 className="text-sm font-bold text-stone-400 uppercase tracking-widest">
          ወቅታዊ ዜናዎች (Current News)
        </h4>
        <div className="flex items-center gap-2">
          <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
            {NEWS.length} Total
          </span>
          <span className="text-[10px] text-stone-400 font-medium">
            Showing {visibleNews.length}
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {visibleNews.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index % 3) * 0.1 }}
              className="bg-white border border-stone-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 text-stone-400 text-xs mb-3">
                <Calendar size={14} />
                <span>{item.date}</span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3 font-ethiopic leading-tight">{item.title}</h3>
              <p className="text-stone-500 text-sm mb-4 leading-relaxed">{item.summary}</p>
              <button className="text-orange-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                ተጨማሪ ያንብቡ (Read More) <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <div className="pt-6 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLoadMore}
            disabled={isLoading}
            className="group relative flex items-center gap-3 px-10 py-4 bg-white border border-stone-200 text-stone-900 font-bold rounded-2xl shadow-lg shadow-stone-100 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span className="tracking-tight">በመጫን ላይ...</span>
              </>
            ) : (
              <>
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="tracking-tight">ተጨማሪ ዜናዎች</span>
              </>
            )}
            
            {/* Subtle shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
          </motion.button>
        </div>
      )}
    </div>
  );
}
