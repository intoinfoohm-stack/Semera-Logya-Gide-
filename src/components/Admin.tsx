import React, { useState } from 'react';
import { Save, Plus, Trash2, Image as ImageIcon, Video, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { NewsItem } from '../types';
import { cn } from '../lib/utils';

export default function Admin() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleSave = () => {
    if (!title || !summary) {
      setStatus({ type: 'error', message: 'እባክዎ ርዕስ እና ዝርዝር መግለጫ ያስገቡ። (Please enter title and summary.)' });
      return;
    }

    const newNews: NewsItem = {
      id: Date.now(),
      title,
      summary,
      date: new Date().toISOString().split('T')[0],
      imageUrl: imageUrl || undefined,
      videoUrl: videoUrl || undefined,
    };

    try {
      const existingNews = JSON.parse(localStorage.getItem('custom_news') || '[]');
      localStorage.setItem('custom_news', JSON.stringify([newNews, ...existingNews]));
      
      setStatus({ type: 'success', message: 'ዜናው በተሳካ ሁኔታ ተቀምጧል! (News saved successfully!)' });
      setTitle('');
      setSummary('');
      setImageUrl('');
      setVideoUrl('');
      
      setTimeout(() => setStatus(null), 3000);
    } catch (err) {
      setStatus({ type: 'error', message: 'ዜናውን ማስቀመጥ አልተቻለም። (Failed to save news.)' });
    }
  };

  const clearAllNews = () => {
    if (window.confirm('ሁሉንም የተጨመሩ ዜናዎች ማጥፋት ይፈልጋሉ? (Do you want to delete all added news?)')) {
      localStorage.removeItem('custom_news');
      setStatus({ type: 'success', message: 'ሁሉም ዜናዎች ተሰርዘዋል። (All news deleted.)' });
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#00f2ff] flex items-center gap-3">
          <Plus className="text-[#00f2ff]" />
          አዲስ ዜና መፃፊያ (Create News)
        </h2>
        <button 
          onClick={clearAllNews}
          className="text-red-400 hover:text-red-300 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
        >
          <Trash2 size={14} />
          ሁሉንም አጥፋ (Clear All)
        </button>
      </div>

      <div className="bg-[#112240] border border-[#00f2ff]/20 rounded-2xl p-8 space-y-6 shadow-xl">
        {status && (
          <div className={cn(
            "p-4 rounded-xl flex items-center gap-3 animate-in zoom-in-95 duration-300",
            status.type === 'success' ? "bg-emerald-500/10 border border-emerald-500/50 text-emerald-400" : "bg-red-500/10 border border-red-500/50 text-red-400"
          )}>
            {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <p className="text-sm font-bold">{status.message}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#00f2ff]/50 uppercase tracking-widest flex items-center gap-2">
            <FileText size={14} />
            የዜናው ርዕስ (News Title)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ርዕስ እዚህ ይፃፉ..."
            className="w-full bg-[#0a192f] border border-[#00f2ff]/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2ff] transition-colors placeholder:text-stone-600 font-ethiopic"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#00f2ff]/50 uppercase tracking-widest flex items-center gap-2">
            <FileText size={14} />
            የዜናው ዝርዝር (News Summary)
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="ዝርዝር መግለጫ እዚህ ይፃፉ..."
            rows={4}
            className="w-full bg-[#0a192f] border border-[#00f2ff]/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2ff] transition-colors placeholder:text-stone-600 font-ethiopic resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#00f2ff]/50 uppercase tracking-widest flex items-center gap-2">
              <ImageIcon size={14} />
              የምስል ሊንክ (Image URL - Optional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-[#0a192f] border border-[#00f2ff]/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2ff] transition-colors placeholder:text-stone-600"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#00f2ff]/50 uppercase tracking-widest flex items-center gap-2">
              <Video size={14} />
              የቪድዮ ሊንክ (Video URL - Optional)
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full bg-[#0a192f] border border-[#00f2ff]/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2ff] transition-colors placeholder:text-stone-600"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-[#00f2ff] text-[#0a192f] font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-[#00f2ff]/90 transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)] active:scale-[0.98]"
        >
          <Save size={20} />
          ዜናውን አውጣ (Publish News)
        </button>
      </div>

      <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">ጠቃሚ መረጃ (Tips)</h4>
        <ul className="text-[11px] text-blue-300/70 space-y-1 font-ethiopic">
          <li>• ምስሎችን ከ Unsplash ወይም ሌሎች የፎቶ ድረ-ገጾች መጠቀም ይችላሉ።</li>
          <li>• ቪድዮዎችን ከ YouTube ወይም Vimeo ሊንኮችን በመጠቀም ማካተት ይቻላል።</li>
          <li>• የተፃፉ ዜናዎች በ"ዜናዎች" (News) ክፍል ውስጥ ወዲያውኑ ይታያሉ።</li>
        </ul>
      </div>
    </div>
  );
}
