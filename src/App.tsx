import React, { useState } from 'react';
import Hero from './components/Hero';
import Attractions from './components/Attractions';
import TravelTips from './components/TravelTips';
import ChatGuide from './components/ChatGuide';
import Directory from './components/Directory';
import News from './components/News';
import { Compass, MapPin, Newspaper } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [activeTab, setActiveTab] = useState<'places' | 'news'>('places');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white">
              <Compass size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-stone-900">Semera-Logia Guide</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#attractions" className="text-sm font-medium text-stone-600 hover:text-orange-600 transition-colors">መስህቦች</a>
            <a href="#directory" className="text-sm font-medium text-stone-600 hover:text-orange-600 transition-colors">ተቋማት</a>
            <a href="#" className="text-sm font-medium text-stone-600 hover:text-orange-600 transition-colors">መረጃ</a>
            <button className="bg-white text-stone-900 border border-stone-200 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-50 transition-colors shadow-sm">
              አሁኑኑ ይጎብኙ
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-20">
        <Hero />
        
        {/* Directory & News Section */}
        <section className="py-24 bg-white" id="directory">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-stone-900 mb-4">የከተማ መመሪያ (City Directory)</h2>
              <p className="text-stone-500 max-w-2xl mx-auto font-ethiopic">
                በሰመራ እና ሎግያ ከተሞች የሚገኙ ተቋማትን እና ወቅታዊ ዜናዎችን እዚህ ያገኛሉ።
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Tabs */}
              <div className="flex p-1 bg-stone-200 rounded-2xl mb-8 w-fit mx-auto">
                <button
                  onClick={() => setActiveTab('places')}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                    activeTab === 'places' ? "bg-white text-orange-600 shadow-sm" : "text-stone-500 hover:text-stone-700"
                  )}
                >
                  <MapPin size={18} />
                  <span>📍 ቦታዎች (Places)</span>
                </button>
                <button
                  onClick={() => setActiveTab('news')}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all",
                    activeTab === 'news' ? "bg-white text-orange-600 shadow-sm" : "text-stone-500 hover:text-stone-700"
                  )}
                >
                  <Newspaper size={18} />
                  <span>📰 ዜናዎች (News)</span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                {activeTab === 'places' ? <Directory /> : <News />}
              </div>
            </div>
          </div>
        </section>

        <Attractions />
        
        {/* Culture Section */}
        <section className="py-24 bg-orange-50 overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1523805081446-ed9a96a2b5d9?auto=format&fit=crop&q=80&w=1000" 
                    alt="Afar Culture" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-orange-600 rounded-3xl flex items-center justify-center p-8 text-white shadow-xl hidden md:flex">
                  <p className="text-center font-bold text-lg leading-tight">
                    የአፋር ኩራት እና እንግዳ ተቀባይነት
                  </p>
                </div>
              </div>
              
              <div>
                <span className="text-orange-600 font-bold tracking-widest uppercase text-sm mb-4 block">ባህል እና ወግ</span>
                <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6 leading-tight">
                  የአፋርን ህዝብ ድንቅ ባህል ይለማመዱ
                </h2>
                <p className="text-stone-600 mb-8 text-lg leading-relaxed font-ethiopic">
                  የአፋር ህዝብ በጠንካራነታቸው፣ በልዩ ባህላቸው እና በታላቅ እንግዳ ተቀባይነታቸው ይታወቃሉ። በሰመራ ቆይታዎ ወቅት የአፋርን ባህላዊ ምግቦች፣ ጭፈራዎች እና የአኗኗር ዘይቤዎችን የመመልከት እድል ያገኛሉ።
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-orange-100">
                    <h4 className="font-bold text-stone-900 mb-1">ባህላዊ ምግብ</h4>
                    <p className="text-stone-500 text-sm">ልዩ የአፋር ጣዕሞች</p>
                  </div>
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-orange-100">
                    <h4 className="font-bold text-stone-900 mb-1">ኪነ-ጥበብ</h4>
                    <p className="text-stone-500 text-sm">ባህላዊ አልባሳት እና ጌጣጌጦች</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TravelTips />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                <Compass size={18} />
              </div>
              <span className="text-lg font-bold tracking-tight text-stone-900">Semera Guide</span>
            </div>
            
            <div className="flex flex-col items-center md:items-start gap-2">
              <p className="text-stone-400 text-sm font-ethiopic">
                © 2026 የሰመራ ዲጂታል መመሪያ። ሁሉም መብቶች የተጠበቁ ናቸው።
              </p>
              <p className="text-stone-300 text-[10px] font-ethiopic italic max-w-xs text-center md:text-left">
                ማሳሰቢያ፡ ይህ መመሪያ ለመረጃ ብቻ የቀረበ ነው። ወሳኝ መረጃዎችን በአካል እንዲያረጋግጡ እንመክራለን። (Disclaimer: This is a guide only. Please verify critical information locally.)
              </p>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-stone-400 hover:text-orange-600 transition-colors">Facebook</a>
              <a href="#" className="text-stone-400 hover:text-orange-600 transition-colors">Instagram</a>
              <a href="#" className="text-stone-400 hover:text-orange-600 transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </footer>

      {/* AI Assistant */}
      <ChatGuide />
    </div>
  );
}
