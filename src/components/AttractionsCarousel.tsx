import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Attraction } from '../types';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

const ATTRACTIONS: Attraction[] = [
  {
    id: '1',
    title: 'አስቦ-ዳዓ (Asbo-Daa)',
    description: 'ባህላዊ የድንጋይ ወፍጮ የሚሰራበት ታሪካዊ ተራራ። ሰመራ ከተማ ውስጥ የሚገኝ ታሪካዊ ቦታ።',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200',
    category: 'history'
  },
  {
    id: '2',
    title: 'የሎማ ድንቅ ሐይቆች (Loma Lakes)',
    description: 'ቀይ ሎማ እና አረንጓዴው ሎማ ሐይቅ - ልዩ የተፈጥሮ ውበት። ለአይን የሚማርኩ እና ለመዝናናት ተመራጭ የሆኑ ሐይቆች።',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200',
    category: 'nature'
  },
  {
    id: '3',
    title: 'አላሎ ባድ (Alallo Bad)',
    description: 'የሚንተከተኩ የፍል ውሃ ምንጮች እና አስደናቂው ተፈጥሮ። በዳናኪል ዝቅተኛ ቦታ የሚገኝ ድንቅ የተፈጥሮ ክስተት።',
    imageUrl: 'https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&q=80&w=1200',
    category: 'nature'
  },
  {
    id: '4',
    title: 'አፋንቦ አቢ ሐይቅ (Afambo Abi Lake)',
    description: 'የአዋሽ ወንዝ መስረጊያ እና የአእዋፋት መገኛ። ለወፍ ዝርያዎች ጥናት እና ለተፈጥሮ አፍቃሪዎች ተመራጭ ቦታ።',
    imageUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&q=80&w=1200',
    category: 'nature'
  },
  {
    id: '5',
    title: 'የሱልጣን አሊሚራህ ቤተ-መንግስት',
    description: 'አሳይታ - የታሪክና የባህል ማዕከል የሆነ ታሪካዊ ቤተ-መንግስት። የአፋር ህዝብ ታሪክ እና ባህል መገለጫ።',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200',
    category: 'culture'
  }
];

const AttractionsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % ATTRACTIONS.length);
  }, []);

  const slidePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + ATTRACTIONS.length) % ATTRACTIONS.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(slideNext, 8000);
    return () => clearInterval(timer);
  }, [slideNext]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const currentAttraction = ATTRACTIONS[currentIndex];

  return (
    <section className="py-20 bg-stone-50 overflow-hidden" id="attractions-carousel">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold text-stone-900 mb-4 font-ethiopic">የሰመራ እና አካባቢዋ መስህቦች</h2>
          <p className="text-stone-500 max-w-2xl mx-auto">
            በሰመራ እና በአካባቢዋ የሚገኙ አስደናቂ የተፈጥሮ፣ የታሪክ እና የባህል መስህቦችን ይጎብኙ።
          </p>
        </div>

        <div className="relative h-[500px] md:h-[600px] w-full max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-stone-900">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute inset-0 w-full h-full"
            >
              <div className="relative w-full h-full">
                <img
                  src={currentAttraction.imageUrl}
                  alt={currentAttraction.title}
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4 max-w-3xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                        {currentAttraction.category}
                      </span>
                      <div className="flex items-center gap-1 text-stone-300 text-sm">
                        <MapPin size={14} />
                        <span>ሰመራ፣ አፋር</span>
                      </div>
                    </div>
                    
                    <h3 className="text-3xl md:text-5xl font-bold font-ethiopic leading-tight">
                      {currentAttraction.title}
                    </h3>
                    
                    <p className="text-lg text-stone-200 font-light leading-relaxed">
                      {currentAttraction.description}
                    </p>
                    
                    <button className="mt-6 bg-white text-stone-900 px-8 py-3 rounded-full font-bold hover:bg-orange-600 hover:text-white transition-all transform hover:scale-105">
                      ተጨማሪ ይመልከቱ
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 z-10 pointer-events-none">
            <button
              onClick={slidePrev}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all pointer-events-auto"
              aria-label="Previous slide"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={slideNext}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all pointer-events-auto"
              aria-label="Next slide"
            >
              <ChevronRight size={32} />
            </button>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {ATTRACTIONS.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`h-1.5 transition-all rounded-full ${
                  index === currentIndex ? 'w-8 bg-orange-600' : 'w-2 bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AttractionsCarousel;
