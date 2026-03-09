import React, { useState } from 'react';
import { Save, Plus, Trash2, Image as ImageIcon, Video, FileText, AlertCircle, CheckCircle2, Upload } from 'lucide-react';
import { NewsItem } from '../types';
import { cn } from '../lib/utils';

export default function Admin() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic size check (e.g., 2MB for images, 10MB for videos)
    const maxSize = type === 'image' ? 2 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setStatus({ 
        type: 'error', 
        message: `ፋይሉ በጣም ትልቅ ነው። እባክዎ ከ ${type === 'image' ? '2MB' : '10MB'} በታች የሆነ ፋይል ይምረጡ። (File too large. Max ${type === 'image' ? '2MB' : '10MB'})` 
      });
      return;
    }

    const reader = new FileReader();
    if (type === 'image') setIsUploadingImage(true);
    else setIsUploadingVideo(true);

    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (type === 'image') {
        setImageUrl(base64String);
        setIsUploadingImage(false);
      } else {
        setVideoUrl(base64String);
        setIsUploadingVideo(false);
      }
      setStatus({ type: 'success', message: 'ፋይሉ በተሳካ ሁኔታ ተጭኗል! (File uploaded successfully!)' });
      setTimeout(() => setStatus(null), 3000);
    };

    reader.onerror = () => {
      setStatus({ type: 'error', message: 'ፋይሉን መጫን አልተቻለም። (Failed to upload file.)' });
      if (type === 'image') setIsUploadingImage(false);
      else setIsUploadingVideo(false);
    };

    reader.readAsDataURL(file);
  };

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

  const handleConfirmClear = () => {
    localStorage.removeItem('custom_news');
    setStatus({ type: 'success', message: 'ሁሉም ዜናዎች ተሰርዘዋል። (All news deleted.)' });
    setShowClearConfirm(false);
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#00f2ff] flex items-center gap-3">
          <Plus className="text-[#00f2ff]" />
          አዲስ ዜና መፃፊያ (Create News)
        </h2>
        {showClearConfirm ? (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-2 duration-300">
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">እርግጠኛ ነዎት? (Sure?)</span>
            <button 
              onClick={handleConfirmClear}
              className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
            >
              አዎ (Yes)
            </button>
            <button 
              onClick={() => setShowClearConfirm(false)}
              className="bg-stone-700 text-stone-300 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg hover:bg-stone-600 transition-colors"
            >
              ተመለስ (No)
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowClearConfirm(true)}
            className="text-red-400 hover:text-red-300 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors"
          >
            <Trash2 size={14} />
            ሁሉንም አጥፋ (Clear All)
          </button>
        )}
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
            <label className="text-[10px] font-bold text-[#00f2ff]/50 uppercase tracking-widest flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ImageIcon size={14} />
                ምስል (Image)
              </span>
              <span className="text-[8px] opacity-50 italic">ሊንክ ወይም ከጋለሪ ይጫኑ</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl.startsWith('data:') ? 'የተጫነ ምስል (Uploaded Image)' : imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                disabled={imageUrl.startsWith('data:')}
                className="flex-1 bg-[#0a192f] border border-[#00f2ff]/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2ff] transition-colors placeholder:text-stone-600 text-sm"
              />
              <label className={cn(
                "cursor-pointer bg-[#00f2ff]/10 border border-[#00f2ff]/30 rounded-xl px-4 flex items-center justify-center hover:bg-[#00f2ff]/20 transition-all",
                isUploadingImage && "animate-pulse pointer-events-none"
              )}>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'image')}
                />
                <Upload size={18} className="text-[#00f2ff]" />
              </label>
              {imageUrl.startsWith('data:') && (
                <button 
                  onClick={() => setImageUrl('')}
                  className="bg-red-500/10 border border-red-500/30 rounded-xl px-3 text-red-400 hover:bg-red-500/20 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-[#00f2ff]/50 uppercase tracking-widest flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Video size={14} />
                ቪድዮ (Video)
              </span>
              <span className="text-[8px] opacity-50 italic">ሊንክ ወይም ከጋለሪ ይጫኑ</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={videoUrl.startsWith('data:') ? 'የተጫነ ቪድዮ (Uploaded Video)' : videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                disabled={videoUrl.startsWith('data:')}
                className="flex-1 bg-[#0a192f] border border-[#00f2ff]/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00f2ff] transition-colors placeholder:text-stone-600 text-sm"
              />
              <label className={cn(
                "cursor-pointer bg-[#00f2ff]/10 border border-[#00f2ff]/30 rounded-xl px-4 flex items-center justify-center hover:bg-[#00f2ff]/20 transition-all",
                isUploadingVideo && "animate-pulse pointer-events-none"
              )}>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'video')}
                />
                <Upload size={18} className="text-[#00f2ff]" />
              </label>
              {videoUrl.startsWith('data:') && (
                <button 
                  onClick={() => setVideoUrl('')}
                  className="bg-red-500/10 border border-red-500/30 rounded-xl px-3 text-red-400 hover:bg-red-500/20 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
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
          <li>• ምስሎችን ከ Unsplash ወይም ሌሎች የፎቶ ድረ-ገጾች መጠቀም ወይም ከጋለሪዎ መጫን ይችላሉ።</li>
          <li>• ቪድዮዎችን ከ YouTube/Vimeo ሊንኮችን በመጠቀም ወይም ከጋለሪዎ መጫን ይቻላል።</li>
          <li>• የተፃፉ ዜናዎች በ"ዜናዎች" (News) ክፍል ውስጥ ወዲያውኑ ይታያሉ።</li>
        </ul>
      </div>
    </div>
  );
}
