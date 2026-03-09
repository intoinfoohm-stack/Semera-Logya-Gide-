import React from 'react';
import { MapPin, Thermometer, Users, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import WeatherWidget from './WeatherWidget';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-24">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1523805081446-ed9a96a2b5d9?auto=format&fit=crop&q=80&w=2000" 
          alt="Ethiopian Landscape" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-5xl md:text-8xl font-bold text-white mb-6 tracking-tight leading-tight">
              የሰመራ <br />
              <span className="text-orange-500">መመሪያ</span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-10 font-ethiopic font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              እንኳን ወደ ሰመራ ዲጂታል መመሪያ በደህና መጡ - የአፋር ክልል መዲና እና ወደ ዳናኪል መግቢያ።
            </p>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6 text-white/90">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
                <MapPin size={20} className="text-orange-400" />
                <span className="text-sm font-semibold">Afar, Ethiopia</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
                <Users size={20} className="text-orange-400" />
                <span className="text-sm font-semibold">Afar Culture</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <WeatherWidget />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
