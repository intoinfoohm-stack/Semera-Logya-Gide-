import React from 'react';
import { Mail, Phone, MapPin, Globe, Send, MessageCircle, Facebook, Twitter, Youtube } from 'lucide-react';
import { motion } from 'motion/react';

const Contact: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto py-8 space-y-12"
    >
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-[#00f2ff] font-ethiopic">ያግኙን (Contact Us)</h2>
        <p className="text-[#8892b0]">ለማንኛውም ጥያቄ ወይም አስተያየት በሚከተሉት አድራሻዎች ሊያገኙን ይችላሉ።</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#112240] p-6 border border-[#00f2ff]/20 rounded-2xl text-center space-y-3 hover:border-[#00f2ff]/50 transition-colors">
          <div className="w-12 h-12 bg-[#00f2ff]/10 rounded-full flex items-center justify-center text-[#00f2ff] mx-auto">
            <Phone size={24} />
          </div>
          <h4 className="font-bold text-white">ስልክ (Phone)</h4>
          <p className="text-[#8892b0]">+251 911 00 00 00</p>
        </div>

        <div className="bg-[#112240] p-6 border border-[#00f2ff]/20 rounded-2xl text-center space-y-3 hover:border-[#00f2ff]/50 transition-colors">
          <div className="w-12 h-12 bg-[#00f2ff]/10 rounded-full flex items-center justify-center text-[#00f2ff] mx-auto">
            <Mail size={24} />
          </div>
          <h4 className="font-bold text-white">ኢሜይል (Email)</h4>
          <p className="text-[#8892b0]">semeralogyacity@gmail.com</p>
        </div>

        <div className="bg-[#112240] p-6 border border-[#00f2ff]/20 rounded-2xl text-center space-y-3 hover:border-[#00f2ff]/50 transition-colors">
          <div className="w-12 h-12 bg-[#00f2ff]/10 rounded-full flex items-center justify-center text-[#00f2ff] mx-auto">
            <MapPin size={24} />
          </div>
          <h4 className="font-bold text-white">አድራሻ (Address)</h4>
          <p className="text-[#8892b0]">ሰመራ፣ አፋር፣ ኢትዮጵያ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#112240] p-8 border border-[#00f2ff]/20 rounded-3xl space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Send size={20} className="text-[#00f2ff]" />
            መልዕክት ይላኩ (Send Message)
          </h3>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#00f2ff]/70">ስም (Name)</label>
              <input 
                type="text" 
                className="w-full bg-[#0a192f] border border-[#00f2ff]/20 rounded-xl p-3 text-white focus:border-[#00f2ff] outline-none transition-colors"
                placeholder="ሙሉ ስምዎን ያስገቡ"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-[#00f2ff]/70">መልዕክት (Message)</label>
              <textarea 
                rows={4}
                className="w-full bg-[#0a192f] border border-[#00f2ff]/20 rounded-xl p-3 text-white focus:border-[#00f2ff] outline-none transition-colors"
                placeholder="መልዕክትዎን እዚህ ይፃፉ..."
              />
            </div>
            <button className="w-full bg-[#00f2ff] text-[#0a192f] font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all">
              ላክ (Send)
            </button>
          </form>
        </div>

        <div className="flex flex-col justify-center space-y-8">
          <h3 className="text-xl font-bold text-white">ማህበራዊ ሚዲያ (Social Media)</h3>
          <div className="grid grid-cols-2 gap-4">
            <a href="https://www.facebook.com/share/17bM66Pbmu/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-[#112240] border border-[#00f2ff]/20 rounded-2xl hover:bg-[#00f2ff]/10 transition-colors">
              <Facebook className="text-[#00f2ff]" />
              <span className="text-white font-medium">Facebook</span>
            </a>
            <a href="#" className="flex items-center gap-3 p-4 bg-[#112240] border border-[#00f2ff]/20 rounded-2xl hover:bg-[#00f2ff]/10 transition-colors">
              <Twitter className="text-[#00f2ff]" />
              <span className="text-white font-medium">Twitter</span>
            </a>
            <a href="#" className="flex items-center gap-3 p-4 bg-[#112240] border border-[#00f2ff]/20 rounded-2xl hover:bg-[#00f2ff]/10 transition-colors">
              <MessageCircle className="text-[#00f2ff]" />
              <span className="text-white font-medium">Telegram</span>
            </a>
            <a href="https://www.youtube.com/@communication227" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-[#112240] border border-[#00f2ff]/20 rounded-2xl hover:bg-[#00f2ff]/10 transition-colors">
              <Youtube className="text-[#00f2ff]" />
              <span className="text-white font-medium">YouTube</span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
