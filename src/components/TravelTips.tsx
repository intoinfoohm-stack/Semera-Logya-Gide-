import React from 'react';
import { Plane, Car, Hotel, Info } from 'lucide-react';

const TIPS = [
  {
    icon: Plane,
    title: 'መድረሻ',
    desc: 'ሰመራ አውሮፕላን ማረፊያ (SMR) ከአዲስ አበባ በየቀኑ በረራዎች አሉት።'
  },
  {
    icon: ThermometerIcon,
    title: 'የአየር ሁኔታ',
    desc: 'በጣም ሞቃታማ ነው! ቀላል ልብሶችን ይልበሱ እና ብዙ ውሃ ይጠጡ።'
  },
  {
    icon: Hotel,
    title: 'መቆያ',
    desc: 'በከተማው ውስጥ የተለያዩ ሆቴሎች እና የእንግዳ ማረፊያዎች ይገኛሉ።'
  },
  {
    icon: Info,
    title: 'ምርጥ ጊዜ',
    desc: 'ከጥቅምት እስከ የካቲት ያለው ጊዜ ለጉብኝት በጣም አመቺ ነው።'
  }
];

function ThermometerIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    </svg>
  );
}

export default function TravelTips() {
  return (
    <section className="py-24 bg-white text-stone-900 border-y border-stone-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">ጠቃሚ የጉዞ መረጃዎች</h2>
          <p className="text-stone-500 max-w-2xl mx-auto font-ethiopic">
            ወደ ሰመራ ከመጓዝዎ በፊት ማወቅ የሚገቡዎት አንዳንድ መሰረታዊ ነገሮች።
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {TIPS.map((tip, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mb-6 rotate-3 hover:rotate-0 transition-transform text-white">
                <tip.icon size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">{tip.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed font-ethiopic">
                {tip.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
