import React from 'react';
import { motion } from 'motion/react';
import { Attraction } from '../types';
import { MapPin, ArrowRight } from 'lucide-react';

const ATTRACTIONS: Attraction[] = [
  {
    id: '1',
    title: 'Erta Ale Volcano',
    description: 'One of the few volcanoes in the world that has an almost persistent lava lake. A truly otherworldly experience.',
    imageUrl: 'https://images.unsplash.com/photo-1541845157-a6d2d100c931?auto=format&fit=crop&q=80&w=800',
    category: 'nature'
  },
  {
    id: '2',
    title: 'Dallol Hydrothermal Field',
    description: 'A landscape of salt, sulfur, and mineral deposits creating vibrant neon colors. The hottest inhabited place on Earth.',
    imageUrl: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&q=80&w=800',
    category: 'nature'
  },
  {
    id: '3',
    title: 'Afar Cultural Heritage',
    description: 'Experience the rich traditions of the Afar people, their unique architecture, and world-renowned hospitality.',
    imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=800',
    category: 'culture'
  },
  {
    id: '4',
    title: 'Lake Afdera',
    description: 'A hypersaline lake located in the Danakil Depression, used for salt extraction and offering stunning views.',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800',
    category: 'nature'
  }
];

export default function Attractions() {
  return (
    <section className="py-24 bg-white" id="attractions">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-stone-900 mb-4">ቁልፍ መስህቦች</h2>
            <p className="text-stone-500 max-w-xl font-ethiopic">
              ሰመራ ወደ አስደናቂው የዳናኪል ዝቅተኛ ቦታ መግቢያ ናት። እዚህ ሊጎበኟቸው የሚገቡ አንዳንድ ምርጥ ቦታዎች አሉ።
            </p>
          </div>
          <button className="text-orange-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
            ሁሉንም ይመልከቱ <ArrowRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {ATTRACTIONS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative h-64 mb-4 overflow-hidden rounded-2xl">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-stone-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-orange-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-stone-500 text-sm line-clamp-2 mb-4">
                {item.description}
              </p>
              <div className="flex items-center gap-1 text-stone-400 text-xs">
                <MapPin size={14} />
                <span>Afar Region</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
