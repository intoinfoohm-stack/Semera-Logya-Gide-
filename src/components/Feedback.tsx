import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2, User, Mail, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

type FeedbackType = 'suggestion' | 'bug' | 'compliment' | 'other';

export default function Feedback() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'suggestion' as FeedbackType,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', type: 'suggestion', message: '' });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[#112240] border border-[#00f2ff]/20 rounded-3xl p-8 shadow-[0_0_30px_rgba(0,0,0,0.3)] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f2ff]/5 blur-3xl rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00f2ff]/5 blur-3xl rounded-full -ml-16 -mb-16" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#00f2ff]/10 rounded-2xl flex items-center justify-center text-[#00f2ff] border border-[#00f2ff]/30">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#00f2ff] leading-tight">ሐሳብ መስጫ (Feedback)</h3>
              <p className="text-[#00f2ff]/50 text-[10px] font-bold uppercase tracking-widest">የእርስዎ አስተያየት ለእኛ አስፈላጊ ነው</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-6 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 size={40} />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">እናመሰግናለን! (Thank You!)</h4>
                <p className="text-stone-400 font-ethiopic">አስተያየትዎ በተሳካ ሁኔታ ደርሶናል። (Your feedback has been received successfully.)</p>
              </motion.div>
            ) : (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#00f2ff]/70 uppercase tracking-widest flex items-center gap-2">
                      <User size={12} /> ስም (Name)
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="ሙሉ ስምዎን ያስገቡ..."
                      className="w-full bg-[#0a192f] border border-[#00f2ff]/20 rounded-xl px-4 py-3 text-white placeholder:text-stone-600 focus:border-[#00f2ff] focus:outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#00f2ff]/70 uppercase tracking-widest flex items-center gap-2">
                      <Mail size={12} /> ኢሜይል (Email)
                    </label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@mail.com"
                      className="w-full bg-[#0a192f] border border-[#00f2ff]/20 rounded-xl px-4 py-3 text-white placeholder:text-stone-600 focus:border-[#00f2ff] focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#00f2ff]/70 uppercase tracking-widest flex items-center gap-2">
                    <MessageCircle size={12} /> የአስተያየት አይነት (Feedback Type)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(['suggestion', 'bug', 'compliment', 'other'] as FeedbackType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, type })}
                        className={cn(
                          "py-2 px-3 rounded-lg border text-[10px] font-bold uppercase tracking-tighter transition-all",
                          formData.type === type
                            ? "bg-[#00f2ff] border-[#00f2ff] text-[#0a192f]"
                            : "bg-[#0a192f] border-[#00f2ff]/20 text-[#00f2ff]/70 hover:border-[#00f2ff]/50"
                        )}
                      >
                        {type === 'suggestion' && 'ሐሳብ (Idea)'}
                        {type === 'bug' && 'ችግር (Bug)'}
                        {type === 'compliment' && 'ምስጋና (Like)'}
                        {type === 'other' && 'ሌላ (Other)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#00f2ff]/70 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare size={12} /> መልዕክት (Message)
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="አስተያየትዎን እዚህ ይጻፉ..."
                    className="w-full bg-[#0a192f] border border-[#00f2ff]/20 rounded-xl px-4 py-3 text-white placeholder:text-stone-600 focus:border-[#00f2ff] focus:outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#00f2ff] text-[#0a192f] py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <Send size={18} />
                      </motion.div>
                      በመላክ ላይ... (Sending...)
                    </>
                  ) : (
                    <>
                      አስተያየት ላክ (Submit Feedback)
                      <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
