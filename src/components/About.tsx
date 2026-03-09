import React from 'react';
import { Info, Target, Users, Award } from 'lucide-react';
import { motion } from 'motion/react';

const About: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 py-8"
    >
      <section className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-[#00f2ff] font-ethiopic tracking-tight">ስለ እኛ (About Us)</h2>
        <p className="text-[#8892b0] max-w-2xl mx-auto leading-relaxed">
          ኢንቶ ኢንፎ (Into Info) በሰመራ እና ሎግያ ከተሞች የሚገኙ አገልግሎቶችን፣ የንግድ ተቋማትን እና የቱሪስት መስህቦችን በቀላሉ ለማግኘት የሚያስችል ዲጂታል መመሪያ ነው።
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#112240] p-8 border border-[#00f2ff]/20 rounded-2xl space-y-4">
          <div className="w-12 h-12 bg-[#00f2ff]/10 rounded-xl flex items-center justify-center text-[#00f2ff]">
            <Target size={24} />
          </div>
          <h3 className="text-xl font-bold text-white">ራዕያችን (Our Vision)</h3>
          <p className="text-[#8892b0] leading-relaxed">
            ሰመራ ለነዋሪዎቿም ሆነ ለጎብኚዎቿ ምቹ እና ዘመናዊ የመረጃ ተደራሽነት ያላት ከተማ ማድረግ።
          </p>
        </div>

        <div className="bg-[#112240] p-8 border border-[#00f2ff]/20 rounded-2xl space-y-4">
          <div className="w-12 h-12 bg-[#00f2ff]/10 rounded-xl flex items-center justify-center text-[#00f2ff]">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold text-white">ማህበረሰባችን (Our Community)</h3>
          <p className="text-[#8892b0] leading-relaxed">
            የአካባቢው ንግዶች እንዲያድጉ እና ደንበኞች የሚፈልጉትን አገልግሎት በፍጥነት እንዲያገኙ ድልድይ መሆን።
          </p>
        </div>
      </div>

      <section className="bg-[#112240] p-12 border border-[#00f2ff]/20 rounded-3xl text-center space-y-6">
        <Award className="mx-auto text-[#00f2ff]" size={48} />
        <h3 className="text-2xl font-bold text-white">ጥራታችን (Our Quality)</h3>
        <p className="text-[#8892b0] max-w-3xl mx-auto leading-relaxed">
          የምንሰጣቸው መረጃዎች ትክክለኛ እና ወቅታዊ መሆናቸውን ለማረጋገጥ ከከተማው አስተዳደር እና ከንግድ ማህበረሰቡ ጋር በቅርበት እንሰራለን።
        </p>
      </section>
    </motion.div>
  );
};

export default About;
