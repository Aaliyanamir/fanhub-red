import HeroBanner from '@/components/HeroBanner';
import MovieRow from '@/components/MovieRow';
import FandomHubSection from '@/components/FandomHubSection';
import Link from 'next/link';
import {
  fetchTrending,
  fetchNewReleases,
  fetchActionMovies,
  fetchBollywood,
  fetchAnime,
  fetchKDramas,
} from '@/utils/tmdb';
import { BookOpen, Users, ShoppingBag, Compass } from 'lucide-react';

export default async function Home() {
  let trendingData = { results: [] };
  let newReleasesData = { results: [] };
  let actionData = { results: [] };
  let bollywoodData = { results: [] };
  let animeData = { results: [] };
  let kdramasData = { results: [] };

  try {
    const [trending, newReleases, action, bollywood, anime, kdramas] = await Promise.all([
      fetchTrending(),
      fetchNewReleases(),
      fetchActionMovies(),
      fetchBollywood(),
      fetchAnime(),
      fetchKDramas(),
    ]);

    trendingData = trending;
    newReleasesData = newReleases;
    actionData = action;
    bollywoodData = bollywood;
    animeData = anime;
    kdramasData = kdramas;
  } catch (error) {
    console.error('Failed to fetch TMDB data:', error);
  }

  return (
    <main className="w-full flex flex-col bg-[#090C15] text-gray-50 relative z-0 transition-colors duration-500">
      {/* Pro-Level Automatic Carousel */}
      <HeroBanner />

      {/* ── Content rows ── */}
      <div className="flex flex-col space-y-2 mt-[-100px] relative z-20">
        <MovieRow title="Trending Now" movies={trendingData.results} />
        <MovieRow title="New Releases" movies={newReleasesData.results} />
        <MovieRow title="Action & Thrillers" movies={actionData.results} />
        <MovieRow title="Blockbuster Bollywood" movies={bollywoodData.results} fallbackType="movie" />
        <MovieRow title="Trending Anime" movies={animeData.results} fallbackType="tv" />
        <MovieRow title="Top K-Dramas" movies={kdramasData.results} fallbackType="tv" />
      </div>

      {/* ── Fandom Hub ── */}
      <FandomHubSection />

      {/* ── Quick Explorer Cards ── */}
      <section className="w-full px-6 md:px-16 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Characters card */}
          <Link
            href="/characters"
            className="group relative flex items-center gap-4 rounded-3xl overflow-hidden p-5
                       border border-gray-800 bg-gray-900/60
                       hover:border-[#E50914] hover:bg-gray-900
                       shadow-lg hover:-translate-y-1
                       transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#E50914]/10 text-[#E50914] flex items-center justify-center flex-shrink-0 group-hover:bg-[#E50914] group-hover:text-white transition-all">
              <Users size={22} />
            </div>
            <div>
              <h3 className="text-base font-heading font-bold text-white group-hover:text-[#E50914] transition-colors">
                Character Index
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Profiles across 8 fandoms.
              </p>
            </div>
          </Link>

          {/* Articles card */}
          <Link
            href="/articles"
            className="group relative flex items-center gap-4 rounded-3xl overflow-hidden p-5
                       border border-gray-800 bg-gray-900/60
                       hover:border-[#E50914] hover:bg-gray-900
                       shadow-lg hover:-translate-y-1
                       transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <BookOpen size={22} />
            </div>
            <div>
              <h3 className="text-base font-heading font-bold text-white group-hover:text-blue-400 transition-colors">
                Featured Articles
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Deep dives & event timelines.
              </p>
            </div>
          </Link>

          {/* Merchandise card */}
          <Link
            href="/merchandise"
            className="group relative flex items-center gap-4 rounded-3xl overflow-hidden p-5
                       border border-gray-800 bg-gray-900/60
                       hover:border-[#E50914] hover:bg-gray-900
                       shadow-lg hover:-translate-y-1
                       transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-all">
              <ShoppingBag size={22} />
            </div>
            <div>
              <h3 className="text-base font-heading font-bold text-white group-hover:text-amber-400 transition-colors">
                Merch Showcase
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Pre-orders & collectibles.
              </p>
            </div>
          </Link>

          {/* Events card */}
          <Link
            href="/events"
            className="group relative flex items-center gap-4 rounded-3xl overflow-hidden p-5
                       border border-gray-800 bg-gray-900/60
                       hover:border-[#E50914] hover:bg-gray-900
                       shadow-lg hover:-translate-y-1
                       transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <Compass size={22} />
            </div>
            <div>
              <h3 className="text-base font-heading font-bold text-white group-hover:text-emerald-400 transition-colors">
                Event Calendar
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Global convention radar.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full text-center py-12 mt-8 border-t border-gray-800">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <Link href="/sitemap" className="text-gray-400 hover:text-[#E50914] transition-colors text-sm font-medium">
            Sitemap
          </Link>
          <Link href="/characters" className="text-gray-400 hover:text-[#E50914] transition-colors text-sm font-medium">
            Characters
          </Link>
          <Link href="/articles" className="text-gray-400 hover:text-[#E50914] transition-colors text-sm font-medium">
            Articles
          </Link>
          <Link href="/merchandise" className="text-gray-400 hover:text-[#E50914] transition-colors text-sm font-medium">
            Merchandise
          </Link>
        </div>
        <p className="text-xs text-gray-600 mt-4">
          © 2026 Fan Hub Plus. All rights reserved.
        </p>
      </footer>

      {/* Padding for floating nav */}
      <div className="pb-32" />
    </main>
  );
}
