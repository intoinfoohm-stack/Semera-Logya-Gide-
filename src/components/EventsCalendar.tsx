import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  eachDayOfInterval,
  parseISO
} from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  ExternalLink,
  PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LocalEvent } from '../types';
import { cn } from '../lib/utils';

const EVENTS: LocalEvent[] = [
  {
    id: '1',
    title: 'የአፋር ባህል ፌስቲቫል (Afar Cultural Festival)',
    date: '2026-03-15',
    time: '09:00 AM',
    description: 'የአፋርን ባህል፣ ሙዚቃ እና ምግብ የሚያሳይ ታላቅ ፌስቲቫል። (A grand festival showcasing Afar culture, music, and food.)',
    location: 'ሰመራ ስታዲየም (Semera Stadium)',
    category: 'festival'
  },
  {
    id: '2',
    title: 'የሰመራ ንግድ ኤክስፖ (Semera Business Expo)',
    date: '2026-03-22',
    time: '10:00 AM',
    description: 'የአካባቢው ነጋዴዎች ምርቶቻቸውን የሚያስተዋውቁበት መድረክ። (A platform for local businesses to promote their products.)',
    location: 'ሰመራ ኮንቬንሽን ሴንተር (Semera Convention Center)',
    category: 'business'
  },
  {
    id: '3',
    title: 'የማህበረሰብ ጽዳት ቀን (Community Clean-up Day)',
    date: '2026-04-05',
    time: '08:00 AM',
    description: 'ከተማችንን በጋራ እናጽዳ። (Let\'s clean our city together.)',
    location: 'ከተማ መሃል (City Center)',
    category: 'community'
  },
  {
    id: '4',
    title: 'የቱሪዝም ወርክሾፕ (Tourism Workshop)',
    date: '2026-04-12',
    time: '02:00 PM',
    description: 'የሰመራን የቱሪስት መስህቦች ለማስተዋወቅ የተዘጋጀ ውይይት። (A discussion prepared to promote Semera\'s tourist attractions.)',
    location: 'ሰመራ ዩኒቨርሲቲ (Semera University)',
    category: 'tourism'
  }
];

export default function EventsCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const eventsOnSelectedDate = EVENTS.filter(event => 
    isSameDay(parseISO(event.date), selectedDate)
  );

  const addToGoogleCalendar = (event: LocalEvent) => {
    const startDateStr = event.date.replace(/-/g, '') + 'T090000Z';
    const endDateStr = event.date.replace(/-/g, '') + 'T170000Z';
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&dates=${startDateStr}/${endDateStr}`;
    window.open(url, '_blank');
  };

  return (
    <section id="calendar" className="py-20 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Calendar Grid */}
        <div className="flex-1 bg-[#112240] border border-[#00f2ff]/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#00f2ff] flex items-center gap-3">
              <CalendarIcon className="text-[#00f2ff]" />
              የክስተቶች ካላንደር (Events Calendar)
            </h2>
            <div className="flex items-center gap-4">
              <button 
                onClick={prevMonth}
                className="p-2 hover:bg-[#00f2ff]/10 rounded-full transition-colors text-[#00f2ff]"
              >
                <ChevronLeft size={24} />
              </button>
              <span className="text-lg font-bold text-white min-w-[140px] text-center">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <button 
                onClick={nextMonth}
                className="p-2 hover:bg-[#00f2ff]/10 rounded-full transition-colors text-[#00f2ff]"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-[#00f2ff]/50 uppercase tracking-widest py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => {
              const hasEvents = EVENTS.some(event => isSameDay(parseISO(event.date), day));
              const isSelected = isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, monthStart);

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-300 group",
                    !isCurrentMonth && "opacity-20",
                    isSelected ? "bg-[#00f2ff] text-[#0a192f]" : "hover:bg-[#00f2ff]/10 text-stone-400",
                    hasEvents && !isSelected && "text-[#00f2ff]"
                  )}
                >
                  <span className="text-sm font-bold">{format(day, 'd')}</span>
                  {hasEvents && (
                    <span className={cn(
                      "absolute bottom-2 w-1 h-1 rounded-full",
                      isSelected ? "bg-[#0a192f]" : "bg-[#00f2ff]"
                    )} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Event Details */}
        <div className="w-full md:w-[400px] space-y-6">
          <div className="bg-[#112240] border border-[#00f2ff]/20 rounded-3xl p-8 h-full shadow-2xl">
            <h3 className="text-xs font-bold text-[#00f2ff]/50 uppercase tracking-widest mb-6">
              {format(selectedDate, 'MMMM d, yyyy')} ክስተቶች (Events)
            </h3>

            <AnimatePresence mode="wait">
              {eventsOnSelectedDate.length > 0 ? (
                <motion.div
                  key={selectedDate.toISOString()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {eventsOnSelectedDate.map(event => (
                    <div key={event.id} className="space-y-4 p-4 rounded-2xl bg-[#0a192f] border border-[#00f2ff]/10">
                      <div>
                        <span className={cn(
                          "text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border",
                          event.category === 'festival' ? "text-orange-400 border-orange-400/30 bg-orange-400/10" :
                          event.category === 'business' ? "text-blue-400 border-blue-400/30 bg-blue-400/10" :
                          event.category === 'community' ? "text-emerald-400 border-emerald-400/30 bg-emerald-400/10" :
                          "text-purple-400 border-purple-400/30 bg-purple-400/10"
                        )}>
                          {event.category}
                        </span>
                        <h4 className="text-lg font-bold text-white mt-2 leading-tight font-ethiopic">
                          {event.title}
                        </h4>
                      </div>

                      <p className="text-sm text-stone-400 font-ethiopic leading-relaxed">
                        {event.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-stone-500">
                          <Clock size={14} className="text-[#00f2ff]" />
                          <span className="text-xs">{event.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-stone-500">
                          <MapPin size={14} className="text-[#00f2ff]" />
                          <span className="text-xs font-ethiopic">{event.location}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => addToGoogleCalendar(event)}
                        className="w-full mt-4 bg-[#00f2ff]/10 border border-[#00f2ff]/30 text-[#00f2ff] py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#00f2ff]/20 transition-all text-xs font-bold uppercase tracking-widest"
                      >
                        <PlusCircle size={16} />
                        ወደ ካላንደር ጨምር (Add to Calendar)
                      </button>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#0a192f] flex items-center justify-center mb-4 border border-[#00f2ff]/10">
                    <CalendarIcon className="text-stone-600" size={32} />
                  </div>
                  <p className="text-stone-500 text-sm font-ethiopic">
                    በዚህ ቀን ምንም ክስተት የለም።<br />
                    (No events on this day.)
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
