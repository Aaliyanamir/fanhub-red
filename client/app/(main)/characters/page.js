'use client';

import { useState } from 'react';
import { CHARACTERS } from '@/data/characters';
import { FANDOM_CATEGORIES } from '@/utils/tmdb';
import Breadcrumbs from '@/components/Breadcrumbs';
import { X, Users } from 'lucide-react';

const ALL_CATS = ['All', ...FANDOM_CATEGORIES.map((c) => c.label)];

export default function CharactersPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedChar, setSelectedChar] = useState(null);

  const filtered =
    activeCategory === 'All'
      ? CHARACTERS
      : CHARACTERS.filter((c) => c.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#090C15] text-gray-50 transition-colors duration-500 pb-40">
      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="px-6 md:px-16 pt-8 pb-4">
        <Breadcrumbs />
        <div className="mt-6 mb-8">
          <div className="flex items-center gap-2 text-[#E50914] text-xs font-bold uppercase tracking-wider mb-1">
            <Users size={16} /> Fandom Index
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight mb-2">
            Character Profiles
          </h1>
          <p className="text-gray-400 text-lg">
            Meet the iconic characters from across all 8 fandom domains.
          </p>
        </div>

        {/* ── Category Filter Pills ────────────────────────────────────── */}
        <div className="flex gap-2 flex-wrap">
          {ALL_CATS.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase border transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-[#E50914] text-white border-[#E50914] shadow-lg shadow-red-900/40'
                  : 'bg-gray-900 border-gray-800 text-gray-300 hover:border-[#E50914] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Character Grid ───────────────────────────────────────────────── */}
      <div className="px-6 md:px-16 py-6">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
          {filtered.length} character{filtered.length !== 1 ? 's' : ''} found
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {filtered.map((char) => {
            const cat = FANDOM_CATEGORIES.find((c) => c.label === char.category);
            return (
              <button
                key={char.id}
                onClick={() => setSelectedChar(char)}
                className="group flex flex-col items-center text-center rounded-2xl overflow-hidden
                           border border-gray-800
                           bg-gray-900/70 shadow-lg
                           hover:shadow-red-900/30 hover:-translate-y-1 hover:border-[#E50914]
                           transition-all duration-300 cursor-pointer p-4 gap-3"
              >
                {/* Avatar */}
                <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-gray-800 group-hover:ring-[#E50914] transition-all duration-300 bg-gray-950">
                  <img
                    src={char.image}
                    alt={char.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(char.name)}&background=111827&color=E50914&size=128`;
                    }}
                  />
                </div>

                {/* Name & category */}
                <div>
                  <p className="text-sm font-bold text-gray-100 line-clamp-2 group-hover:text-[#E50914] transition-colors leading-tight">
                    {char.name}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5 font-medium truncate">
                    {char.series}
                  </p>
                </div>

                {/* Category badge */}
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-gradient-to-r ${cat?.gradient || 'from-red-600 to-black'} text-white uppercase`}>
                  {char.category}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Character Detail Modal ───────────────────────────────────────── */}
      {selectedChar && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          onClick={() => setSelectedChar(null)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl overflow-hidden
                        border border-gray-700
                        bg-gray-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedChar(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-red-600 transition-all"
            >
              <X size={18} />
            </button>

            {/* Top gradient */}
            {(() => {
              const cat = FANDOM_CATEGORIES.find((c) => c.label === selectedChar.category);
              return (
                <div className={`h-36 bg-gradient-to-br ${cat?.gradient || 'from-red-700 to-black'} relative`}>
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full overflow-hidden ring-4 ring-gray-900 shadow-xl bg-gray-950">
                    <img
                      src={selectedChar.image}
                      alt={selectedChar.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedChar.name)}&background=111827&color=E50914&size=128`;
                      }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Content */}
            <div className="pt-16 pb-8 px-8 text-center">
              <h2 className="text-2xl font-heading font-extrabold text-white mb-0.5">
                {selectedChar.name}
              </h2>
              <p className="text-sm text-[#E50914] font-semibold mb-1">{selectedChar.series}</p>
              <span className="inline-block text-xs font-extrabold px-3 py-1 rounded-full bg-[#E50914]/20 text-[#E50914] mb-4 uppercase">
                {selectedChar.category}
              </span>
              <p className="text-sm text-gray-300 leading-relaxed mb-5">
                {selectedChar.description}
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {selectedChar.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold px-3 py-1 rounded-full bg-gray-800 text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pb-32" />
    </main>
  );
}
