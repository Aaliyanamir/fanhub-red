'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Info, ChevronLeft, ChevronRight, Pause, Volume2, VolumeX } from 'lucide-react';

const HERO_SLIDES = [
  {
    id: '71446',
    type: 'tv',
    title: 'Money Heist',
    subtitle: 'La Casa de Papel',
    description: 'To carry out the biggest heist in history, a mysterious man called The Professor recruits a band of eight robbers who have a single characteristic: none of them has anything to lose.',
    backdrop: 'https://static.tvmaze.com/uploads/images/original_untouched/209/523445.jpg',
    category: 'TV Shows',
    rating: '8.2',
  },
  {
    id: '85937',
    type: 'tv',
    title: 'Demon Slayer: Kimetsu no Yaiba',
    subtitle: 'Infinity Castle Arc',
    description: 'A family is attacked by demons and only two members survive — Tanjiro and his sister Nezuko. Tanjiro sets out to become a demon slayer to avenge his family and cure his sister.',
    backdrop: 'https://image.tmdb.org/t/p/original/nTvM421cEIs2vWkn6g88iuSuYFi.jpg',
    category: 'Anime',
    rating: '8.7',
  },
  {
    id: '94997',
    type: 'tv',
    title: 'House of the Dragon',
    subtitle: 'Dance of the Dragons',
    description: 'An internal succession war within House Targaryen at the height of its power, 172 years before the birth of Daenerys Targaryen.',
    backdrop: 'https://image.tmdb.org/t/p/original/etj8E2o0VisualBackdrop.jpg',
    category: 'TV Shows',
    rating: '8.4',
  },
  {
    id: '1086747',
    type: 'movie',
    title: 'The Batman Part II',
    subtitle: 'Dark Knight Saga',
    description: 'Batman delves deeper into Gotham\'s underbelly to confront new corrupt forces threatening the city following the floods.',
    backdrop: 'https://image.tmdb.org/t/p/original/b0PlSFdDwbyK0cfLIQy0da2u8x0.jpg',
    category: 'Movies',
    rating: '8.5',
  },
];

export default function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Automatic slide timer (every 9 seconds for ultra smooth slow transition)
  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 9000);
    return () => clearInterval(interval);
  }, [isAutoplay]);

  const current = HERO_SLIDES[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div className="relative w-full h-[82vh] min-h-[620px] flex items-end pb-24 md:pb-32 px-6 md:px-16 overflow-hidden bg-black select-none">
      {/* Background Image Carousel Slide */}
      {HERO_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-0' : 'opacity-0 -z-10'
          }`}
        >
          <img
            src={slide.backdrop}
            alt={slide.title}
            className="w-full h-full object-cover object-center scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1920';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090C15] via-[#090C15]/80 to-transparent z-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090C15] via-[#090C15]/40 to-transparent z-0" />
        </div>
      ))}

      {/* Content Container */}
      <div className="relative z-10 max-w-2xl w-full space-y-5 animate-in fade-in slide-in-from-left-4 duration-1000">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-[#E50914] text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-red-900/40">
            {current.category}
          </span>
          <span className="text-amber-400 font-extrabold text-xs flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
            ★ {current.rating} IMDb
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-extrabold text-white tracking-tight drop-shadow-2xl leading-none">
          {current.title}
        </h1>

        <p className="text-gray-300 text-base md:text-lg font-medium max-w-xl leading-relaxed drop-shadow-md line-clamp-3">
          {current.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            href={`/stream/${current.id}?type=${current.type}`}
            className="flex items-center gap-2 bg-[#E50914] text-white px-8 py-3.5 rounded-full font-bold text-base hover:bg-red-700 transition-all hover:scale-105 shadow-xl shadow-red-900/50"
          >
            <Play fill="currentColor" size={20} />
            Watch Now
          </Link>

          <button
            onClick={() => setIsAutoplay(!isAutoplay)}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 py-3.5 rounded-full font-bold text-base hover:bg-white/20 transition-all"
          >
            {isAutoplay ? <Pause size={18} /> : <Play size={18} />}
            {isAutoplay ? 'Pause Auto' : 'Auto Play'}
          </button>
        </div>
      </div>

      {/* Manual Arrow Controls (Right Side) */}
      <div className="absolute right-6 md:right-16 bottom-28 z-20 flex items-center gap-3">
        <button
          onClick={handlePrev}
          className="p-3 rounded-full bg-black/50 hover:bg-[#E50914] text-white border border-white/20 transition-all hover:scale-110 active:scale-95 shadow-xl"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-black/50 hover:bg-[#E50914] text-white border border-white/20 transition-all hover:scale-110 active:scale-95 shadow-xl"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Slide Indicators (Dots / Progress Bars) */}
      <div className="absolute left-6 md:left-16 bottom-8 z-20 flex items-center gap-2">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-10 bg-[#E50914]' : 'w-3 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
