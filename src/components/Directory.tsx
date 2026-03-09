import React, { useState, useEffect } from 'react';
import { Search, Heart, Building2, Hospital, Map as MapIcon, Info, CheckCircle2, Plus, X, Image as ImageIcon, Upload, Navigation, MapPin } from 'lucide-react';
import { Place } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import MapView from './MapView';

const PLACES: Place[] = [
  { id: 1, name: "ሰመራ-ሎግያ አስተዳደር (Semera-Logia Administration)", category: "አስተዳደር (Administration)", description: "The administrative heart of the twin cities.", lat: 11.7917, lng: 41.0000 },
  { id: 2, name: "ሰመራ ሪፈራል ሆስፒታል (Semera Referral Hospital)", category: "ጤና (Health)", description: "The primary medical facility in the region.", lat: 11.7950, lng: 41.0050 },
  { id: 3, name: "አስቦ-ዳዓ (Asbo-Daa)", category: "ቱሪዝም (Tourism)", description: "A significant cultural and tourist site near the city.", lat: 11.8000, lng: 41.0100 },
  { id: 4, name: "ሰመራ ዩኒቨርሲቲ (Semera University)", category: "ትምህርት (Education)", description: "A major higher education institution in the Afar region.", lat: 11.7850, lng: 40.9950 },
  { id: 5, name: "ሎግያ ገበያ (Logia Market)", category: "ንግድ (Commerce)", description: "A bustling local market known for its vibrant trade.", lat: 11.7750, lng: 40.9850 }
];

export default function Directory() {
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastIcon, setToastIcon] = useState<'check' | 'heart'>('check');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [newPlace, setNewPlace] = useState({ name: '', category: '', description: '' });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const filteredPlaces = PLACES.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         p.category.toLowerCase().includes(search.toLowerCase());
    const matchesFavorite = showOnlyFavorites ? favorites.includes(p.id) : true;
    return matchesSearch && matchesFavorite;
  });

  const toggleFavorite = (id: number) => {
    const isFavorited = favorites.includes(id);
    setFavorites(prev => 
      isFavorited ? prev.filter(fid => fid !== id) : [...prev, id]
    );
    
    const message = isFavorited 
      ? 'ከምርጥ ቦታዎች ተወግዷል (Removed from favorites)' 
      : 'ወደ ምርጥ ቦታዎች ተጨምሯል (Added to favorites)';
    
    setToastIcon('heart');
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setToastIcon('check');
    setToastMessage('አመሰግናለሁ! ጥያቄዎ ለግምገማ ቀርቧል። (Thank you! Your submission is under review.)');
    setShowToast(true);
    setIsModalOpen(false);
    setNewPlace({ name: '', category: '', description: '' });
    setImagePreview(null);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        // Simulate a slight delay for "uploading" feedback
        setTimeout(() => {
          setImagePreview(reader.result as string);
          setIsUploading(false);
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  const getIcon = (category: string) => {
    if (category.includes('አስተዳደር')) return <Building2 size={20} />;
    if (category.includes('ጤና')) return <Hospital size={20} />;
    if (category.includes('ቱሪዝም')) return <MapIcon size={20} />;
    return <Info size={20} />;
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-[100] bg-[#112240] text-[#00f2ff] px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(0,242,255,0.2)] flex items-center gap-3 border border-[#00f2ff]/30 min-w-[300px] justify-center backdrop-blur-md"
          >
            {toastIcon === 'heart' ? (
              <Heart size={18} className="text-[#00f2ff] shrink-0" fill="currentColor" />
            ) : (
              <CheckCircle2 size={18} className="text-[#00f2ff] shrink-0" />
            )}
            <span className="text-xs font-bold uppercase tracking-widest text-center">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#0a192f]/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#112240] border border-[#00f2ff]/30 rounded-3xl shadow-[0_0_50px_rgba(0,242,255,0.1)] overflow-hidden"
            >
              <div className="p-6 border-b border-[#00f2ff]/10 flex items-center justify-between bg-[#112240]">
                <h3 className="text-xl font-bold text-[#00f2ff] font-ethiopic uppercase tracking-tight">አዲስ ቦታ ይጠቁሙ (Suggest Place)</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#00f2ff]/10 text-[#00f2ff] rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-[#00f2ff]/50 uppercase tracking-widest mb-1.5">
                    የቦታው ስም / Place Name
                  </label>
                  <input
                    required
                    type="text"
                    value={newPlace.name}
                    onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                    className="w-full bg-[#0a192f] border border-[#00f2ff]/20 rounded-xl px-4 py-3.5 outline-none focus:border-[#00f2ff] focus:ring-4 focus:ring-[#00f2ff]/10 transition-all text-[#00f2ff] placeholder:text-[#00f2ff]/20 text-sm font-bold"
                    placeholder="ለምሳሌ፡ ሰመራ ሞል / Semera Mall"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#00f2ff]/50 uppercase tracking-widest mb-1.5">
                    ምድብ / Category
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={newPlace.category}
                      onChange={(e) => setNewPlace({ ...newPlace, category: e.target.value })}
                      className="w-full bg-[#0a192f] border border-[#00f2ff]/20 rounded-xl px-4 py-3.5 outline-none focus:border-[#00f2ff] focus:ring-4 focus:ring-[#00f2ff]/10 transition-all appearance-none text-[#00f2ff] text-sm font-bold"
                    >
                      <option value="">ምድብ ይምረጡ / Select Category</option>
                      <option value="Administration">አስተዳደር / Administration</option>
                      <option value="Health">ጤና / Health</option>
                      <option value="Tourism">ቱሪዝም / Tourism</option>
                      <option value="Education">ትምህርት / Education</option>
                      <option value="Commerce">ንግድ / Commerce</option>
                      <option value="Other">ሌላ / Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#00f2ff]/50">
                      <Plus size={16} className="rotate-45" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#00f2ff]/50 uppercase tracking-widest mb-1.5">
                    መግለጫ / Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newPlace.description}
                    onChange={(e) => setNewPlace({ ...newPlace, description: e.target.value })}
                    className="w-full bg-[#0a192f] border border-[#00f2ff]/20 rounded-xl px-4 py-3.5 outline-none focus:border-[#00f2ff] focus:ring-4 focus:ring-[#00f2ff]/10 transition-all resize-none text-[#00f2ff] placeholder:text-[#00f2ff]/20 text-sm font-bold"
                    placeholder="ስለ ቦታው ጥቂት ይንገሩን... / Tell us about the place..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#00f2ff]/50 uppercase tracking-widest mb-1.5">
                    ምስል ይጨምሩ / Add Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <div 
                    onClick={() => !isUploading && fileInputRef.current?.click()}
                    className={cn(
                      "group relative w-full h-40 bg-[#0a192f] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden",
                      isUploading ? "border-[#00f2ff]/50 bg-[#00f2ff]/5 cursor-wait" : "border-[#00f2ff]/20 hover:border-[#00f2ff] hover:bg-[#00f2ff]/5"
                    )}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <Upload className="text-[#00f2ff]" size={32} />
                        </motion.div>
                        <span className="text-[10px] font-bold text-[#00f2ff] animate-pulse uppercase tracking-widest">በመጫን ላይ... / Uploading...</span>
                      </div>
                    ) : imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="text-[#00f2ff]" size={24} />
                            <span className="text-[#00f2ff] text-[10px] font-bold uppercase tracking-widest">ምስል ቀይር / Change Image</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-[#112240] border border-[#00f2ff]/20 flex items-center justify-center mb-3 group-hover:border-[#00f2ff] transition-colors">
                          <ImageIcon className="text-[#00f2ff]/30 group-hover:text-[#00f2ff] transition-colors" size={24} />
                        </div>
                        <span className="text-[10px] text-[#00f2ff]/50 group-hover:text-[#00f2ff] font-bold uppercase tracking-widest">
                          ምስል ለመምረጥ እዚህ ይጫኑ
                        </span>
                        <span className="text-[8px] text-[#00f2ff]/30 mt-1 uppercase tracking-widest">
                          Click to upload image
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full bg-[#00f2ff] text-[#0a192f] font-bold py-4 rounded-2xl hover:bg-white transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
                  >
                    ጥያቄውን ይላኩ / Submit Suggestion
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-full bg-transparent text-[#00f2ff]/40 font-bold py-2 rounded-2xl hover:text-[#00f2ff] transition-all uppercase tracking-widest text-[9px]"
                  >
                    ተመለስ / Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00f2ff]/50 group-focus-within:text-[#00f2ff] transition-colors" size={20} />
          <input
            type="text"
            placeholder="ተቋም ይፈልጉ... (Search for institutions...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#112240] border-2 border-[#00f2ff]/30 rounded-xl pl-12 pr-4 py-4 text-[#00f2ff] placeholder:text-[#00f2ff]/30 focus:border-[#00f2ff] focus:ring-4 focus:ring-[#00f2ff]/10 outline-none shadow-[0_0_15px_rgba(0,242,255,0.05)] transition-all font-bold text-sm"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-[#112240] border-2 border-[#00f2ff] text-[#00f2ff] font-bold rounded-xl hover:bg-[#00f2ff] hover:text-[#0a192f] transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)] hover:shadow-[0_0_30px_rgba(0,242,255,0.4)] shrink-0 uppercase tracking-wider text-xs group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>ቦታ ይጠቁሙ (Suggest Place)</span>
        </button>
        <button
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          className={cn(
            "flex items-center justify-center gap-2 px-6 py-4 border-2 font-bold rounded-xl transition-all shrink-0 uppercase tracking-wider text-xs",
            showOnlyFavorites 
              ? "bg-[#00f2ff] border-[#00f2ff] text-[#0a192f] shadow-[0_0_20px_rgba(0,242,255,0.3)]" 
              : "bg-[#112240] border-[#00f2ff] text-[#00f2ff] hover:bg-[#00f2ff]/10"
          )}
        >
          <Heart size={18} fill={showOnlyFavorites ? "currentColor" : "none"} />
          <span>{showOnlyFavorites ? "ሁሉንም አሳይ" : "ተወዳጆች"}</span>
          <AnimatePresence mode="popLayout">
            {favorites.length > 0 && (
              <motion.span
                key="fav-badge"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className={cn(
                  "ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors",
                  showOnlyFavorites 
                    ? "bg-[#0a192f] text-[#00f2ff] border-[#0a192f]" 
                    : "bg-[#00f2ff]/20 text-[#00f2ff] border-[#00f2ff]/30"
                )}
              >
                <motion.span
                  key={favorites.length}
                  initial={{ y: 5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="inline-block"
                >
                  {favorites.length}
                </motion.span>
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <button
          onClick={() => setIsMapOpen(true)}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-[#00f2ff] border-2 border-[#00f2ff] text-[#0a192f] font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:bg-white hover:border-white active:scale-95 shrink-0 uppercase tracking-widest text-xs"
        >
          <Navigation size={18} />
          <span>ካርታ (Map)</span>
        </button>
      </div>

      <AnimatePresence>
        {isMapOpen && (
          <MapView 
            places={filteredPlaces} 
            onClose={() => setIsMapOpen(false)} 
          />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-2 px-2">
        <h4 className="text-[10px] font-bold text-[#00f2ff]/50 uppercase tracking-widest border-l-2 border-[#00f2ff] pl-3">
          የተመዘገቡ ተቋማት (Registered Institutions)
        </h4>
        <span className="bg-[#00f2ff]/10 text-[#00f2ff] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-[#00f2ff]/30">
          {filteredPlaces.length} Total
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPlaces.map((place) => (
          <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={place.id} 
            className="bg-[#112240] border border-[#00f2ff]/20 p-5 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:border-[#00f2ff]/50 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#00f2ff]/5 blur-3xl -mr-12 -mt-12 group-hover:bg-[#00f2ff]/10 transition-colors" />
            
            {/* Image Placeholder */}
            <div className="w-full h-[140px] bg-[#1e3a8a] rounded-lg mb-[10px] border border-[#00f2ff]/30 relative overflow-hidden group-hover:border-[#00f2ff]/60 transition-all duration-500">
              <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-700">
                <div className="scale-[3]">
                  {getIcon(place.category)}
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/60 to-transparent" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00f2ff] animate-pulse" />
                <span className="text-[8px] font-bold text-[#00f2ff] uppercase tracking-[0.2em] opacity-80">Live Feed Active</span>
              </div>
            </div>

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-2.5 bg-[#00f2ff]/10 text-[#00f2ff] rounded-xl border border-[#00f2ff]/20 group-hover:bg-[#00f2ff] group-hover:text-[#0a192f] transition-all duration-300">
                {getIcon(place.category)}
              </div>
              <button 
                onClick={() => toggleFavorite(place.id)}
                className={cn(
                  "p-2 rounded-xl transition-all duration-300 border",
                  favorites.includes(place.id) 
                    ? "text-[#00f2ff] bg-[#00f2ff]/20 border-[#00f2ff]/50 shadow-[0_0_10px_rgba(0,242,255,0.2)]" 
                    : "text-[#00f2ff]/30 border-transparent hover:text-[#00f2ff] hover:bg-[#00f2ff]/10 hover:border-[#00f2ff]/30"
                )}
              >
                <Heart size={18} fill={favorites.includes(place.id) ? "currentColor" : "none"} />
              </button>
            </div>
            <div className="relative z-10">
              <h3 className="text-base font-bold text-white mb-1 font-ethiopic group-hover:text-[#00f2ff] transition-colors">{place.name}</h3>
              <p className="text-[#00f2ff] text-[9px] font-bold uppercase tracking-widest mb-3 opacity-70">{place.category}</p>
              <p className="text-[#00f2ff]/60 text-xs leading-relaxed font-ethiopic line-clamp-2 group-hover:text-[#00f2ff]/80 transition-colors mb-4">{place.description}</p>
              
              {/* Actions */}
              <div className="flex gap-2.5 mt-auto">
                <button className="flex-1 bg-[#00f2ff]/5 hover:bg-[#00f2ff] text-[#00f2ff] hover:text-[#0a192f] text-[9px] font-bold py-2.5 rounded-lg border border-[#00f2ff]/20 hover:border-[#00f2ff] transition-all uppercase tracking-widest">
                  ዝርዝር መረጃ (Details)
                </button>
                <button className="px-3 bg-[#00f2ff]/5 hover:bg-[#00f2ff] text-[#00f2ff] hover:text-[#0a192f] rounded-lg border border-[#00f2ff]/20 hover:border-[#00f2ff] transition-all">
                  <MapPin size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {filteredPlaces.length === 0 && (
          <div className="col-span-full py-12 text-center text-[#00f2ff]/30 font-bold uppercase tracking-widest text-xs">
            ምንም ውጤት አልተገኘም። (No results found.)
          </div>
        )}
      </div>
    </div>
  );
}
