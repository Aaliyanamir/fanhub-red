import React from 'react';
import Link from 'next/link';
import { BASE_IMG_URL } from '@/utils/tmdb';

const CATEGORY_MAP = {
  'Trending Now': '/fandom/movies',
  'New Releases': '/fandom/movies',
  'Action & Thrillers': '/fandom/movies',
  'Blockbuster Bollywood': '/fandom/movies',
  'Trending Anime': '/fandom/anime',
  'Top K-Dramas': '/fandom/k-pop',
};

const MovieRow = ({ title, movies, fallbackType = 'movie', seeAllHref = null }) => {
  if (!movies || movies.length === 0) return null;

  const linkTarget = seeAllHref || CATEGORY_MAP[title] || '/fandom/movies';

  return (
    <div className="w-full flex flex-col space-y-2 py-4">
      {/* Section heading */}
      <div className="flex items-baseline justify-between px-6 md:px-16">
        <h2 className="text-xl md:text-2xl font-heading font-bold text-white transition-colors duration-300">
          {title}
        </h2>
        <Link
          href={linkTarget}
          className="text-xs font-bold text-[#E50914] uppercase tracking-wider hover:opacity-80 transition-opacity"
        >
          See All →
        </Link>
      </div>

      <div className="flex overflow-x-auto scrollbar-hide space-x-4 py-4 px-6 md:px-16">
        {movies.map((movie) => {
          if (!movie.poster_path) return null;
          return (
            <Link
              href={`/stream/${movie.id}?type=${movie.media_type || fallbackType}`}
              key={movie.id}
              className="shrink-0 block group"
            >
              {/* Card with poster + gradient title overlay */}
              <div className="relative w-32 md:w-40 rounded-2xl overflow-hidden border border-gray-800/80 bg-gray-950 transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-1 group-hover:border-[#E50914] shadow-lg">
                <img
                  src={`${BASE_IMG_URL}${movie.poster_path}`}
                  alt={movie.title || movie.name}
                  className="w-full aspect-[2/3] object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-2.5">
                  <p className="text-white text-xs font-semibold leading-tight line-clamp-2 drop-shadow-sm group-hover:text-[#E50914] transition-colors">
                    {movie.title || movie.name}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MovieRow;
