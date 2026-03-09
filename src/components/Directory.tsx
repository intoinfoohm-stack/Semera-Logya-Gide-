import React, { useState, useEffect } from 'react';
import { Search, Heart, Building2, Hospital, Map as MapIcon, Info, CheckCircle2, Plus, X, Image as ImageIcon, Upload, Navigation } from 'lucide-react';
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
            className="fixed bottom-8 left-1/2 z-[100] bg-white text-stone-900 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-stone-200 min-w-[300px] justify-center"
          >
            {toastIcon === 'heart' ? (
              <Heart size={18} className="text-red-500 shrink-0" fill="currentColor" />
            ) : (
              <CheckCircle2 size={18} className="text-orange-500 shrink-0" />
            )}
            <span className="text-sm font-bold tracking-tight text-center">{toastMessage}</span>
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
              className="absolute inset-0 bg-white/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-white">
                <h3 className="text-xl font-bold text-stone-900 font-ethiopic">አዲስ ቦታ ይጠቁሙ (Suggest a New Place)</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">
                    የቦታው ስም / Qari maysu / Place Name
                  </label>
                  <input
                    required
                    type="text"
                    value={newPlace.name}
                    onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-orange-600 transition-all text-sm"
                    placeholder="ለምሳሌ፡ ሰመራ ሞል / Semera Mall"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">
                    ምድብ / Giddu / Category
                  </label>
                  <div className="relative">
                    <select
                      required
                      value={newPlace.category}
                      onChange={(e) => setNewPlace({ ...newPlace, category: e.target.value })}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-orange-600 transition-all appearance-none text-sm"
                    >
                      <option value="">ምድብ ይምረጡ / Select Category</option>
                      <option value="Administration">አስተዳደር / Administration</option>
                      <option value="Health">ጤና / Health</option>
                      <option value="Tourism">ቱሪዝም / Tourism</option>
                      <option value="Education">ትምህርት / Education</option>
                      <option value="Commerce">ንግድ / Commerce</option>
                      <option value="Other">ሌላ / Other</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                      <Plus size={16} className="rotate-45" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">
                    መግለጫ / Maysu / Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newPlace.description}
                    onChange={(e) => setNewPlace({ ...newPlace, description: e.target.value })}
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-orange-600 transition-all resize-none text-sm"
                    placeholder="ስለ ቦታው ጥቂት ይንገሩን... / Tell us about the place..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1.5">
                    ምስል ይጨምሩ / Gira maysu / Add Image
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
                      "group relative w-full h-40 bg-white border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden",
                      isUploading ? "border-orange-200 bg-orange-50/20 cursor-wait" : "border-stone-200 hover:border-orange-400 hover:bg-orange-50/30"
                    )}
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                          <Upload className="text-orange-500" size={32} />
                        </motion.div>
                        <span className="text-xs font-bold text-orange-600 animate-pulse">በመጫን ላይ... / Uploading...</span>
                      </div>
                    ) : imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="text-white" size={24} />
                            <span className="text-white text-[10px] font-bold uppercase tracking-widest">ምስል ቀይር / Change Image</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-3 group-hover:bg-orange-100 transition-colors">
                          <ImageIcon className="text-stone-300 group-hover:text-orange-500 transition-colors" size={24} />
                        </div>
                        <span className="text-xs text-stone-400 group-hover:text-orange-600 font-bold tracking-tight">
                          ምስል ለመምረጥ እዚህ ይጫኑ
                        </span>
                        <span className="text-[10px] text-stone-300 mt-1 uppercase tracking-widest">
                          Click to upload image
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-white text-stone-900 border border-stone-200 font-bold py-4 rounded-2xl hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-lg shadow-stone-100 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  ጥያቄውን ይላኩ / Rubu / Submit Suggestion
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input
            type="text"
            placeholder="ተቋም ይፈልጉ... (Search for institutions...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-2xl pl-12 pr-4 py-4 text-stone-900 focus:ring-2 focus:ring-orange-600 outline-none shadow-sm transition-all"
          />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-stone-200 text-stone-900 font-bold rounded-2xl hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all shadow-lg shadow-stone-100 shrink-0"
        >
          <Plus size={20} />
          <span>ቦታ ይጠቁሙ (Suggest Place)</span>
        </button>
        <button
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          className={cn(
            "flex items-center justify-center gap-2 px-6 py-4 border font-bold rounded-2xl transition-all shadow-lg shadow-stone-100 shrink-0",
            showOnlyFavorites 
              ? "bg-red-50 border-red-200 text-red-600" 
              : "bg-white border-stone-200 text-stone-900 hover:bg-stone-50"
          )}
        >
          <div className="relative">
            <Heart size={20} fill={showOnlyFavorites ? "currentColor" : "none"} />
            {favorites.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {favorites.length}
              </span>
            )}
          </div>
          <span>{showOnlyFavorites ? "ሁሉንም አሳይ (Show All)" : "ተወዳጆች (Favorites)"}</span>
        </button>

        <button
          onClick={() => setIsMapOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-orange-600 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-100 hover:bg-orange-700 active:scale-95 shrink-0"
        >
          <Navigation size={20} />
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
        <h4 className="text-sm font-bold text-stone-400 uppercase tracking-widest">
          የተመዘገቡ ተቋማት (Registered Institutions)
        </h4>
        <span className="bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full">
          {filteredPlaces.length} ተቋማት (Places)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPlaces.map((place) => (
          <div key={place.id} className="bg-white border border-stone-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
                {getIcon(place.category)}
              </div>
              <button 
                onClick={() => toggleFavorite(place.id)}
                className={cn(
                  "p-2 rounded-full transition-colors",
                  favorites.includes(place.id) ? "text-red-500 bg-red-50" : "text-stone-300 hover:text-red-500 hover:bg-red-50"
                )}
              >
                <Heart size={20} fill={favorites.includes(place.id) ? "currentColor" : "none"} />
              </button>
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-1 font-ethiopic">{place.name}</h3>
            <p className="text-orange-600 text-xs font-semibold uppercase tracking-wider mb-3">{place.category}</p>
            <p className="text-stone-500 text-sm leading-relaxed">{place.description}</p>
          </div>
        ))}
        {filteredPlaces.length === 0 && (
          <div className="col-span-full py-12 text-center text-stone-400">
            ምንም ውጤት አልተገኘም። (No results found.)
          </div>
        )}
      </div>
    </div>
  );
}
