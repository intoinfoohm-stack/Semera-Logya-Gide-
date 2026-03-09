import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Loader2, Plus, AlertCircle, Link as LinkIcon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { NewsItem } from '../types';
import { cn } from '../lib/utils';

const FALLBACK_NEWS: NewsItem[] = [
  {
    id: 1,
    title: "የሰመራ-ሎግያ አዲስ የልማት ስራ (New Semera-Logia Development Project)",
    date: "2026-03-09",
    summary: "በከተማዋ ውስጥ አዳዲስ የመሰረተ ልማት ግንባታዎች እና የልማት ስራዎች በይፋ ተጀምረዋል። (New infrastructure and development works have officially launched in the city.)"
  },
  {
    id: 2,
    title: "የሰመራ ሪፈራል ሆስፒታል ለዜጎች ነጻ ህክምና ይጀምራል (Semera Referral Hospital Starts Free Treatment)",
    date: "2026-03-08",
    summary: "ሆስፒታሉ ለተወሰኑ ቀናት ለከተማው ነዋሪዎች ነጻ የህክምና አገልግሎት እንደሚሰጥ አስታውቋል። (The hospital announced free medical services for residents for a limited time.)"
  },
  {
    id: 3,
    title: "በሰመራ ዩኒቨርሲቲ የተካሄደው የባህል ሳምንት ተጠናቀቀ (Cultural Week at Semera University Concludes)",
    date: "2026-03-05",
    summary: "የአፋርን ባህል እና ወግ የሚያንፀባርቁ ልዩ ልዩ ዝግጅቶች በደመቀ ሁኔታ ተካሂደው ተጠናቀዋል። (Events celebrating Afar culture and tradition concluded successfully.)"
  },
  {
    id: 4,
    title: "አዲስ የቱሪስት መረጃ ማዕከል ተከፈተ (New Tourist Information Center Opened)",
    date: "2026-03-02",
    summary: "ጎብኚዎች ስለ ከተማዋ እና አካባቢዋ የተሟላ መረጃ የሚያገኙበት ማዕከል ስራ ጀምሯል። (A center providing comprehensive info for visitors has started operations.)"
  },
  {
    id: 5,
    title: "የሰመራ ከተማ የጽዳት ዘመቻ (Semera City Cleaning Campaign)",
    date: "2026-03-01",
    summary: "ነዋሪዎች በከተማዋ የጽዳት እና ውበት ስራ ላይ በንቃት ተሳትፈዋል። (Residents actively participated in city cleaning and beautification efforts.)"
  },
  {
    id: 6,
    title: "የአፋር ክልል የንግድ ትርኢት (Afar Region Trade Fair)",
    date: "2026-02-28",
    summary: "የአካባቢው አምራቾች ምርቶቻቸውን የሚያስተዋውቁበት ትልቅ የንግድ ትርኢት ተከፍቷል። (A large trade fair for local producers to promote their products has opened.)"
  },
  {
    id: 7,
    title: "የዲጂታል ቴክኖሎጂ ስልጠና ለወጣቶች (Digital Technology Training for Youth)",
    date: "2026-02-25",
    summary: "በመቶዎች የሚቆጠሩ ወጣቶች በኮምፒውተር እና በዲጂታል ክህሎቶች ላይ ስልጠና ወስደዋል። (Hundreds of youth received training in computer and digital skills.)"
  }
];

const ITEMS_PER_PAGE = 3;

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  async function fetchNews() {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const customNews = JSON.parse(localStorage.getItem('custom_news') || '[]');
      setNews([...customNews, ...FALLBACK_NEWS]);
    } catch (err) {
      console.error("ዜናዎችን መጫን አልተቻለም፡", err);
      setError("ዜናዎችን መጫን አልተቻለም። እባክዎ ቆይተው እንደገና ይሞክሩ።");
      setNews(FALLBACK_NEWS);
    } finally {
      setIsLoading(false);
    }
  }

  const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const visibleNews = news.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  };

  const handleCopyLink = async (id: number) => {
    const shareUrl = `${window.location.origin}?news=${id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  if (isLoading && news.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-stone-400">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-bold tracking-widest uppercase text-xs">ዜናዎችን በመጫን ላይ...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2 px-2">
        <h4 className="text-[10px] font-bold text-[#00f2ff]/50 uppercase tracking-widest border-l-2 border-[#00f2ff] pl-3">
          ወቅታዊ ዜናዎች (Current News)
        </h4>
        <div className="flex items-center gap-2">
          {error && (
            <div className="flex items-center gap-1 text-orange-500 text-[10px] font-bold uppercase tracking-tighter">
              <AlertCircle size={12} />
              <span>Offline</span>
            </div>
          )}
          <span className="bg-[#00f2ff]/10 text-[#00f2ff] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-[#00f2ff]/30">
            {news.length} Total
          </span>
        </div>
      </div>
      
      <div className="space-y-4 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {visibleNews.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#112240] border border-[#00f2ff]/20 p-6 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:border-[#00f2ff]/50 transition-all group"
              >
                <div className="flex items-center gap-2 text-[#00f2ff]/50 text-[10px] font-bold uppercase tracking-widest mb-4">
                  <Calendar size={14} className="text-[#00f2ff]" />
                  <span>ቀን (Date): {item.date}</span>
                </div>

                {item.imageUrl && (
                  <div className="mb-6 rounded-xl overflow-hidden border border-[#00f2ff]/20">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {item.videoUrl && (
                  <div className="mb-6 rounded-xl overflow-hidden border border-[#00f2ff]/20 aspect-video bg-black flex items-center justify-center group/video">
                    {item.videoUrl.startsWith('data:video') ? (
                      <video 
                        src={item.videoUrl} 
                        controls 
                        className="w-full h-full"
                      />
                    ) : (
                      <a 
                        href={item.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-3 text-[#00f2ff]/50 group-hover/video:text-[#00f2ff] transition-colors"
                      >
                        <div className="w-16 h-16 rounded-full border-2 border-current flex items-center justify-center">
                          <ArrowRight size={32} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">ቪድዮውን ይመልከቱ (Watch Video)</span>
                      </a>
                    )}
                  </div>
                )}

                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-xl font-bold text-[#00f2ff] font-ethiopic leading-tight group-hover:text-white transition-colors flex-1">{item.title}</h3>
                  <button
                    onClick={() => handleCopyLink(item.id)}
                    className={cn(
                      "p-2 rounded-lg border transition-all flex items-center gap-2",
                      copiedId === item.id
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-500"
                        : "bg-[#112240] border-[#00f2ff]/20 text-[#00f2ff] hover:border-[#00f2ff]/50"
                    )}
                    title="Copy link"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Copied!</span>
                      </>
                    ) : (
                      <LinkIcon size={14} />
                    )}
                  </button>
                </div>
                <p className="text-[#00f2ff]/70 text-sm mb-6 leading-relaxed font-ethiopic">{item.summary}</p>
                <button className="text-[#00f2ff] text-xs font-bold flex items-center gap-2 hover:gap-3 transition-all uppercase tracking-widest border-b border-[#00f2ff]/30 pb-1 hover:border-[#00f2ff]">
                  ተጨማሪ ያንብቡ (Read More) <ArrowRight size={16} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="pt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="p-2 rounded-lg border border-[#00f2ff]/30 text-[#00f2ff] hover:bg-[#00f2ff]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ArrowRight size={20} className="rotate-180" />
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={isLoading}
                className={cn(
                  "w-10 h-10 rounded-lg text-[10px] font-bold transition-all border-2",
                  currentPage === page
                    ? "bg-[#00f2ff] border-[#00f2ff] text-[#0a192f] shadow-[0_0_15px_rgba(0,242,255,0.3)]"
                    : "bg-[#112240] border-[#00f2ff]/20 text-[#00f2ff] hover:border-[#00f2ff]/50"
                )}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="p-2 rounded-lg border border-[#00f2ff]/30 text-[#00f2ff] hover:bg-[#00f2ff]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
