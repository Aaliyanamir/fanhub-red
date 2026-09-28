import { FANDOM_CATEGORIES } from '@/utils/tmdb';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return FANDOM_CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cat = FANDOM_CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return { title: 'Not Found' };
  return {
    title: `${cat.label} — Fan Hub Plus`,
    description: cat.description,
  };
}

export default async function FandomCategoryPage({ params }) {
  const { slug } = await params;
  const cat = FANDOM_CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return notFound();

  let data = { results: [] };
  try {
    data = await cat.fetcher(1);
  } catch {
    // silent fallback
  }

  const items = data.results || [];

  return (
    <main className="min-h-screen bg-[#090C15] text-gray-50 transition-colors duration-500 pb-40">
      {/* Hero Header */}
      <div className={`relative w-full px-6 md:px-16 py-16 bg-gradient-to-br ${cat.gradient} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="relative z-10 max-w-5xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/70 text-sm font-medium mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">{cat.label}</span>
          </nav>

          <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-4 tracking-tight drop-shadow-2xl">
            {cat.label} Fandom
          </h1>
          <p className="text-white/80 text-lg max-w-xl leading-relaxed">
            {cat.description}
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="px-6 md:px-16 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-gray-100">
            Popular in {cat.label}
          </h2>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{items.length} titles</span>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((item) => {
              if (!item.poster_path) return null;
              const type = item.media_type || cat.fallbackType;
              const title = item.title || item.name;
              const year =
                item.release_date?.split('-')[0] || item.first_air_date?.split('-')[0] || '';
              const rating = item.vote_average ? item.vote_average.toFixed(1) : '';

              return (
                <Link
                  key={item.id}
                  href={`/stream/${item.id}?type=${type}`}
                  className="group block rounded-2xl overflow-hidden border border-gray-800
                             bg-gray-900/70 shadow-md
                             hover:shadow-red-900/30 hover:-translate-y-1 hover:border-[#E50914]
                             transition-all duration-300"
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <img
                      src={`https://image.tmdb.org/t/p/w400${item.poster_path}`}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {rating && (
                      <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-amber-400 text-xs font-extrabold px-2 py-0.5 rounded-full border border-amber-400/20">
                        ★ {rating}
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-[#E50914] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      {type === 'tv' ? 'Series' : 'Movie'}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-100 line-clamp-2 group-hover:text-[#E50914] transition-colors">
                      {title}
                    </p>
                    {year && (
                      <p className="text-xs text-gray-500 mt-0.5">{year}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg font-medium">No content found for {cat.label} right now.</p>
          </div>
        )}
      </div>

      <div className="pb-32" />
    </main>
  );
}
