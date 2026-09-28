'use client';

import React from 'react';
import Link from 'next/link';
import { useWatchlist } from '@/hooks/useWatchlist';
import { BASE_IMG_URL } from '@/utils/tmdb';
import Breadcrumbs from '@/components/Breadcrumbs';
import { X } from 'lucide-react';

export default function MyListPage() {
  const { watchlist, removeFromWatchlist } = useWatchlist();

  return (
    <main className="min-h-screen bg-[#090C15] text-gray-50 p-6 md:p-12 pb-32 font-body flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <Breadcrumbs />
        
        <header className="mb-12 w-full text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-2 tracking-tight drop-shadow-md">
            My Watchlist
          </h1>
          <p className="text-gray-400 font-medium">Your saved movies, shows, and fandom media</p>
        </header>

        {watchlist.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {watchlist.map((item) => (
              <div key={item.id} className="relative group">
                <Link
                  href={`/stream/${item.id}?type=${item.media_type || 'movie'}`}
                  className="block overflow-hidden rounded-2xl shadow-xl border border-gray-800 bg-gray-900 transition-all duration-300 hover:scale-105 hover:border-[#E50914]"
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img
                      src={`${BASE_IMG_URL}${item.poster_path}`}
                      alt={item.title || item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  </div>

                  <div className="p-3">
                    <p className="text-sm font-bold text-gray-200 truncate group-hover:text-[#E50914] transition-colors">
                      {item.title || item.name}
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase font-extrabold mt-1">
                      {item.media_type === 'tv' ? 'TV Series' : 'Movie'}
                    </p>
                  </div>
                </Link>

                {/* Hover Remove Cross Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    removeFromWatchlist(item.id);
                  }}
                  className="absolute top-2 right-2 z-20 p-2 rounded-full bg-red-600/90 text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-700 hover:scale-110"
                  title="Remove from Watchlist"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-16 bg-gray-900/60 p-12 rounded-3xl border border-gray-800 shadow-2xl max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-3">Your list is currently empty</h2>
            <p className="text-gray-400 text-sm mb-8">Explore movies and series across all 8 fandom categories to add them here.</p>
            <Link href="/" className="px-8 py-3.5 bg-[#E50914] text-white font-bold rounded-full hover:bg-red-700 transition-colors shadow-lg shadow-red-950/50">
              Explore Fandoms
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
