import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, X } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion } from 'motion/react';
import { Message } from '../types';
import { cn } from '../lib/utils';

const SYSTEM_PROMPT = `You are a helpful and knowledgeable digital guide for Semera and Logia (the twin cities), the capital of the Afar Region in Ethiopia. 
Your goal is to provide accurate, friendly, and useful information to tourists and visitors.

Key facts about Semera-Logia:
- Semera is the capital of the Afar Region, a modern planned city.
- Logia is a bustling commercial hub located just a few kilometers from Semera.
- Together they form a vital urban center in the Danakil Depression area.
- The climate is extremely hot, especially from May to September.
- Transportation: Semera Airport (SMR) connects to Addis Ababa.
- Language: Afar is the primary local language, but Amharic and English are also spoken.

Key Institutions and Places:
1. Semera-Logia Administration: The administrative center for the twin cities.
2. Semera Referral Hospital: The main healthcare facility in the region.
3. Semera University: A major educational hub.
4. Logia Market: A vibrant center for local trade and commerce.
5. Asbo-Daa: A significant cultural and tourist site nearby.

Specific Local Attractions for Tourists:
1. Erta Ale Volcano: One of the few volcanoes in the world that has an almost persistent lava lake. A truly otherworldly experience.
2. Dallol Hydrothermal Field: A landscape of salt, sulfur, and mineral deposits creating vibrant neon colors. The hottest inhabited place on Earth.
3. Afar Cultural Heritage: Experience the rich traditions of the Afar people, their unique architecture, and world-renowned hospitality.
4. Lake Afdera: A hypersaline lake located in the Danakil Depression, used for salt extraction and offering stunning views.

Always be polite and encouraging. If you don't know something specific, suggest where the user might find that information locally. Respond in the language the user uses (Amharic or English).`;

export default function ChatGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'ሰላም! እኔ የሰመራ ዲጂታል ረዳት ነኝ። እንዴት ልረዳዎ እችላለሁ? (Hello! I am your Semera digital assistant. How can I help you?)' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: messages.concat({ role: 'user', text: userMessage }).map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        })),
        config: {
          systemInstruction: SYSTEM_PROMPT,
        }
      });

      const text = response.text || "ይቅርታ፣ ችግር አጋጥሞኛል። እባክዎ እንደገና ይሞክሩ።";
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "ይቅርታ፣ ምላሽ መስጠት አልቻልኩም። እባክዎ ኢንተርኔትዎን ያረጋግጡ።" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 p-4 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 transition-all z-50",
          isOpen && "scale-0"
        )}
      >
        <Bot size={24} />
      </button>

      {/* Chat Window */}
      <div className={cn(
        "fixed bottom-6 right-6 w-[90vw] sm:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all z-50 origin-bottom-right",
        !isOpen && "scale-0 opacity-0 pointer-events-none"
      )}>
        {/* Header */}
        <div className="p-4 bg-orange-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot size={20} />
            <span className="font-semibold font-ethiopic">የሰመራ ረዳት (Semera Assistant)</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-orange-700 p-1 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          {messages.map((m, i) => (
            <div key={i} className={cn(
              "flex flex-col max-w-[85%]",
              m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
            )}>
              <div className={cn(
                "p-3 rounded-2xl text-sm",
                m.role === 'user' 
                  ? "bg-orange-600 text-white rounded-tr-none" 
                  : "bg-white text-stone-800 border border-stone-200 rounded-tl-none shadow-sm"
              )}>
                <Markdown>{m.text}</Markdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-3 max-w-[85%] mr-auto items-start"
            >
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 shrink-0 border border-stone-200">
                <Bot size={16} />
              </div>
              <div className="bg-white text-stone-800 border border-stone-200 rounded-2xl rounded-tl-none shadow-sm p-4 flex gap-1.5 items-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                  className="w-1.5 h-1.5 bg-orange-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                  className="w-1.5 h-1.5 bg-orange-500 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                  className="w-1.5 h-1.5 bg-orange-500 rounded-full"
                />
                <span className="ml-2 text-[10px] text-stone-400 font-bold uppercase tracking-widest font-ethiopic">
                  ረዳቱ እያሰበ ነው... (Thinking...)
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-stone-100 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="ጥያቄዎን እዚህ ይጻፉ..."
              className="flex-1 bg-stone-100 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-orange-600 outline-none"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
