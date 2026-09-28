import Link from 'next/link';
import { FANDOM_CATEGORIES } from '@/utils/tmdb';
import { Tv, Gamepad2, Film, MonitorPlay, Music, BookOpen, Book, Sparkles } from 'lucide-react';

const ICON_MAP = {
  Tv: Tv,
  Gamepad2: Gamepad2,
  Film: Film,
  MonitorPlay: MonitorPlay,
  Music: Music,
  BookOpen: BookOpen,
  Book: Book,
  Sparkles: Sparkles,
};

export default function FandomHubSection() {
  return (
    <section className="w-full px-6 md:px-16 py-12">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-white transition-colors duration-300">
          Explore Fandoms
        </h2>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">8 Categories</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {FANDOM_CATEGORIES.map((cat) => {
          const IconComponent = ICON_MAP[cat.iconName] || Sparkles;
          return (
            <Link
              key={cat.slug}
              href={`/fandom/${cat.slug}`}
              className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl p-5 
                         bg-gray-900/80 
                         border border-gray-800/80
                         backdrop-blur-md shadow-lg
                         hover:shadow-red-900/30 hover:-translate-y-1 hover:border-[#E50914]
                         transition-all duration-300 overflow-hidden text-center cursor-pointer"
            >
              {/* Gradient glow bg on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl`} />

              <div className="p-3 rounded-2xl bg-white/5 text-gray-300 group-hover:text-[#E50914] group-hover:bg-[#E50914]/10 transition-all duration-300">
                <IconComponent size={24} />
              </div>
              <span className="text-xs font-bold text-gray-200 tracking-wide group-hover:text-white transition-colors">
                {cat.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
