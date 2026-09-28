'use client';

import { ARTICLES } from '@/data/articles';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import { BookOpen } from 'lucide-react';

const TYPE_COLOURS = {
  Feature: 'bg-[#E50914] text-white',
  'Event Highlight': 'bg-emerald-600 text-white',
  Editorial: 'bg-blue-600 text-white',
  Event: 'bg-[#E50914] text-white',
  'Deep Dive': 'bg-amber-600 text-white',
  Analysis: 'bg-indigo-600 text-white',
  Review: 'bg-rose-600 text-white',
};

export default function ArticlesPage() {
  const [hero, ...rest] = ARTICLES;

  return (
    <main className="min-h-screen bg-[#090C15] text-gray-50 transition-colors duration-500 pb-40">
      <div className="px-6 md:px-16 pt-8">
        <Breadcrumbs />

        <div className="mt-6 mb-10">
          <div className="flex items-center gap-2 text-[#E50914] text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen size={16} /> Fandom Editorial Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight mb-2">
            Featured Articles
          </h1>
          <p className="text-gray-400 text-lg">
            Deep dives, reviews, and event highlights from across every fandom.
          </p>
        </div>
      </div>

      {/* ── Hero Article ─────────────────────────────────────────────────────── */}
      <div className="px-6 md:px-16 mb-12">
        <article
          className="relative w-full rounded-3xl overflow-hidden min-h-[420px] flex items-end
                     border border-gray-800 shadow-2xl bg-black"
        >
          <img
            src={hero.image}
            alt={hero.title}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${hero.gradient} opacity-40`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          <div className="relative z-10 p-8 md:p-12 max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${TYPE_COLOURS[hero.type] || 'bg-gray-600 text-white'}`}>
                {hero.type}
              </span>
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                {hero.category}
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-heading font-extrabold text-white mb-3 leading-tight drop-shadow-xl">
              {hero.title}
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-5 max-w-2xl line-clamp-3">
              {hero.excerpt}
            </p>
            <div className="flex items-center gap-4 flex-wrap text-xs text-gray-400">
              <span className="text-white font-semibold">{hero.author}</span>
              <span>•</span>
              <span>{new Date(hero.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              <span>•</span>
              <span>{hero.readTime}</span>
            </div>
          </div>
        </article>
      </div>

      {/* ── Articles List ─────────────────────────────────────────────────── */}
      <div className="px-6 md:px-16">
        <h2 className="text-xl font-heading font-bold text-white mb-6">
          More Stories
        </h2>

        <div className="space-y-6">
          {rest.map((article, idx) => (
            <article key={article.id} className="group">
              <div className="flex flex-col md:flex-row gap-5 rounded-3xl overflow-hidden
                              border border-gray-800 bg-gray-900/70 shadow-lg
                              hover:border-[#E50914] hover:shadow-red-900/20 transition-all duration-300">
                <div className="md:w-56 md:flex-shrink-0 relative overflow-hidden bg-black/40">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${article.gradient} opacity-20`} />
                </div>

                <div className="flex flex-col justify-center p-6 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${TYPE_COLOURS[article.type] || 'bg-gray-600 text-white'}`}>
                      {article.type}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      {article.category}
                    </span>
                  </div>

                  <h3 className="text-base md:text-lg font-heading font-bold text-white leading-snug mb-2 group-hover:text-[#E50914] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center flex-wrap gap-2 text-xs text-gray-500">
                    <span className="text-gray-300">{article.author}</span>
                    <span>•</span>
                    <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-800 text-gray-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="pb-32" />
    </main>
  );
}
