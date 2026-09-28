'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearch } from '@/context/SearchContext';
import { fetchSearch, fetchDiscover, fetchGenres } from '@/utils/tmdb';
import { BASE_IMG_URL } from '@/utils/tmdb';
import Link from 'next/link';
import { X, Search, SlidersHorizontal, ChevronDown } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Top Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' },
  { value: 'title.asc', label: 'A → Z' },
];

const YEARS = Array.from({ length: 35 }, (_, i) => String(new Date().getFullYear() - i));

export default function SearchModal() {
  const { isSearchOpen, closeSearch } = useSearch();
  const inputRef = useRef(null);

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [showFilters, setShowFilters] = useState(false);
  const [contentType, setContentType] = useState('movie');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSort, setSelectedSort] = useState('popularity.desc');
  const [genres, setGenres] = useState([]);
  const [discoverResults, setDiscoverResults] = useState([]);
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isSearchOpen) return;
    fetchGenres(contentType)
      .then((d) => setGenres(d.genres || []))
      .catch(() => {});
  }, [contentType, isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setSearchResults([]);
      setDiscoverResults([]);
      setShowFilters(false);
      setPage(1);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const data = await fetchSearch(query);
        setSearchResults((data.results || []).filter((r) => r.poster_path).slice(0, 12));
      } finally {
        setSearchLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const runDiscover = useCallback(async (p = 1) => {
    setDiscoverLoading(true);
    try {
      const data = await fetchDiscover({
        type: contentType,
        genre: selectedGenre,
        year: selectedYear,
        sort: selectedSort,
        page: p,
      });
      const results = (data.results || []).filter((r) => r.poster_path);
      setDiscoverResults(p === 1 ? results : (prev) => [...prev, ...results]);
      setTotalPages(data.total_pages || 1);
      setPage(p);
    } finally {
      setDiscoverLoading(false);
    }
  }, [contentType, selectedGenre, selectedYear, selectedSort]);

  useEffect(() => {
    if (showFilters && !query.trim()) {
      setPage(1);
      runDiscover(1);
    }
  }, [showFilters, contentType, selectedGenre, selectedYear, selectedSort]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeSearch(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeSearch]);

  if (!isSearchOpen) return null;

  const displayResults = query.trim() ? searchResults : discoverResults;
  const isLoading = query.trim() ? searchLoading : discoverLoading;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-gray-950/98 backdrop-blur-2xl transition-all duration-300"
      role="dialog"
      aria-modal="true"
    >
      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 md:px-10 py-4 border-b border-gray-800">
        <Search size={22} className="text-gray-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies, shows, characters..."
          className="flex-1 bg-transparent text-white text-lg font-medium placeholder-gray-500 outline-none"
        />
        <button
          onClick={() => { setShowFilters((s) => !s); setQuery(''); }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
            showFilters
              ? 'bg-[#E50914] text-white border-[#E50914]'
              : 'border-gray-700 text-gray-300 hover:border-[#E50914] hover:text-white'
          }`}
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>
        <button
          onClick={closeSearch}
          className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all"
        >
          <X size={22} />
        </button>
      </div>

      {/* ── Filter Row ──────────────────────────────────────────────────────── */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-3 px-4 md:px-10 py-3 border-b border-gray-800 bg-gray-900/60">
          <FilterSelect
            label="Type"
            value={contentType}
            onChange={(v) => { setContentType(v); setSelectedGenre(''); }}
            options={[{ value: 'movie', label: 'Movie' }, { value: 'tv', label: 'TV Show' }]}
          />
          <FilterSelect
            label="Genre"
            value={selectedGenre}
            onChange={setSelectedGenre}
            options={[{ value: '', label: 'All Genres' }, ...genres.map((g) => ({ value: String(g.id), label: g.name }))]}
          />
          <FilterSelect
            label="Year"
            value={selectedYear}
            onChange={setSelectedYear}
            options={[{ value: '', label: 'Any Year' }, ...YEARS.map((y) => ({ value: y, label: y }))]}
          />
          <FilterSelect
            label="Sort"
            value={selectedSort}
            onChange={setSelectedSort}
            options={SORT_OPTIONS}
          />
          <button
            onClick={() => { setSelectedGenre(''); setSelectedYear(''); setSelectedSort('popularity.desc'); setContentType('movie'); }}
            className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors ml-1"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* ── Results ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 md:px-10 py-6 scrollbar-hide">
        {!query.trim() && !showFilters && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 gap-3 pb-20">
            <Search size={48} strokeWidth={1.5} />
            <p className="text-xl font-semibold text-gray-300">Start typing to search</p>
            <p className="text-xs text-gray-500">or enable Filters to browse by genre, year, and popularity</p>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!isLoading && displayResults.length > 0 && (
          <>
            <p className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">
              {query.trim() ? `Results for "${query}"` : 'Browse Catalog'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {displayResults.map((item) => {
                const type = item.media_type || contentType;
                const title = item.title || item.name;
                const year =
                  item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || '';
                const rating = item.vote_average ? item.vote_average.toFixed(1) : '';
                return (
                  <Link
                    key={`${item.id}-${type}`}
                    href={`/stream/${item.id}?type=${type}`}
                    onClick={closeSearch}
                    className="group block rounded-xl overflow-hidden border border-gray-800
                               bg-gray-900/70 shadow-sm hover:shadow-lg hover:border-[#E50914]
                               hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <img
                        src={`${BASE_IMG_URL}${item.poster_path}`}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {rating && (
                        <div className="absolute top-1.5 right-1.5 bg-black/80 text-amber-400 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border border-amber-400/20">
                          ★ {rating}
                        </div>
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-gray-100 line-clamp-2 group-hover:text-[#E50914] transition-colors">
                        {title}
                      </p>
                      {year && <p className="text-[10px] text-gray-500 mt-0.5">{year}</p>}
                    </div>
                  </Link>
                );
              })}
            </div>

            {showFilters && !query.trim() && page < totalPages && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => runDiscover(page + 1)}
                  disabled={discoverLoading}
                  className="px-8 py-3 rounded-full bg-[#E50914] text-white font-bold hover:bg-red-700 transition-all disabled:opacity-60 shadow-lg shadow-red-950/40"
                >
                  {discoverLoading ? 'Loading...' : 'Load More Results'}
                </button>
              </div>
            )}
          </>
        )}

        {!isLoading && displayResults.length === 0 && (query.trim() || showFilters) && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 text-center gap-3">
            <p className="text-lg font-semibold text-gray-300">No results found</p>
            <p className="text-xs text-gray-500">Try adjusting your query or filter rules</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="relative flex items-center gap-1.5">
      <label className="text-xs font-bold text-gray-400 uppercase whitespace-nowrap">{label}:</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none pl-3 pr-7 py-1.5 rounded-full text-xs font-semibold
                     bg-gray-900 border border-gray-700
                     text-gray-100 cursor-pointer
                     focus:outline-none focus:ring-2 focus:ring-[#E50914] transition-all"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
