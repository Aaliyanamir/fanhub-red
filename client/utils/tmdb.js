export const BASE_IMG_URL = "https://image.tmdb.org/t/p/w500";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// ── Generic Helper ──────────────────────────────────────────────────────────
const tmdbFetch = (path, opts = {}) =>
  fetch(`${BASE_URL}${path}${path.includes('?') ? '&' : '?'}api_key=${API_KEY}&language=en-US`, {
    next: { revalidate: 3600 },
    ...opts,
  });

// ── Home Rows ────────────────────────────────────────────────────────────────
export const fetchTrending = async () => {
  const res = await tmdbFetch('/trending/all/week');
  if (!res.ok) throw new Error('Failed to fetch trending');
  return res.json();
};

export const fetchNewReleases = async () => {
  const res = await tmdbFetch('/movie/now_playing?page=1');
  if (!res.ok) throw new Error('Failed to fetch new releases');
  return res.json();
};

export const fetchActionMovies = async () => {
  const res = await tmdbFetch('/discover/movie?with_genres=28');
  if (!res.ok) throw new Error('Failed to fetch action movies');
  return res.json();
};

export const fetchBollywood = async () => {
  const res = await tmdbFetch('/discover/movie?with_original_language=hi&sort_by=popularity.desc');
  return res.json();
};

export const fetchAnime = async () => {
  const res = await tmdbFetch('/discover/tv?with_original_language=ja&with_genres=16&sort_by=popularity.desc');
  return res.json();
};

export const fetchKDramas = async () => {
  const res = await tmdbFetch('/discover/tv?with_original_language=ko&sort_by=popularity.desc');
  return res.json();
};

// ── Fandom Category Fetchers ─────────────────────────────────────────────────
export const fetchAnimeCategory = async (page = 1) => {
  const res = await tmdbFetch(`/discover/tv?with_original_language=ja&with_genres=16&sort_by=popularity.desc&page=${page}`);
  return res.json();
};

export const fetchGamingCategory = async (page = 1) => {
  // Video game adaptations keyword IDs (285871, 193798, 209536) + popular game titles
  const res = await tmdbFetch(`/discover/tv?with_keywords=285871,193798,209536&sort_by=popularity.desc&page=${page}`);
  const data = await res.json();
  if (data.results && data.results.length > 5) return data;
  
  // Fallback: search for top video game series
  const fallbackRes = await tmdbFetch(`/search/multi?query=The%20Last%20of%20Us&page=${page}`);
  return fallbackRes.json();
};

export const fetchMoviesCategory = async (page = 1) => {
  const res = await tmdbFetch(`/movie/popular?page=${page}`);
  return res.json();
};

export const fetchTVShowsCategory = async (page = 1) => {
  const res = await tmdbFetch(`/tv/popular?page=${page}`);
  return res.json();
};

export const fetchKPopCategory = async (page = 1) => {
  const res = await tmdbFetch(`/search/multi?query=BTS&page=${page}`);
  return res.json();
};

export const fetchComicsCategory = async (page = 1) => {
  const res = await tmdbFetch(`/discover/movie?with_keywords=9715,180547&sort_by=popularity.desc&page=${page}`);
  return res.json();
};

export const fetchMangaCategory = async (page = 1) => {
  const res = await tmdbFetch(`/discover/tv?with_original_language=ja&sort_by=popularity.desc&page=${page}`);
  return res.json();
};

export const fetchCosplayCategory = async (page = 1) => {
  const res = await tmdbFetch(`/discover/movie?with_genres=878,14&sort_by=popularity.desc&page=${page}`);
  return res.json();
};

// ── Discover / Search with Filters ───────────────────────────────────────────
export const fetchDiscover = async ({ type = 'movie', genre = '', year = '', sort = 'popularity.desc', page = 1 } = {}) => {
  let path = `/discover/${type}?sort_by=${sort}&page=${page}`;
  if (genre) path += `&with_genres=${genre}`;
  if (year) path += type === 'movie' ? `&primary_release_year=${year}` : `&first_air_date_year=${year}`;
  const res = await tmdbFetch(path, { next: { revalidate: 600 } });
  return res.json();
};

export const fetchGenres = async (type = 'movie') => {
  const res = await tmdbFetch(`/genre/${type}/list`);
  return res.json();
};

export const fetchDetails = async (id, type = 'tv') => {
  const res = await fetch(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&language=en-US`);
  if (!res.ok) throw new Error(`Failed to fetch details for ${type} ${id}`);
  const data = await res.json();
  data.media_type = type;
  return data;
};

export const fetchExternalIds = async (id, type = 'tv') => {
  const res = await fetch(`${BASE_URL}/${type}/${id}/external_ids?api_key=${API_KEY}`);
  if (!res.ok) throw new Error(`Failed to fetch external IDs for ${type} ${id}`);
  return res.json();
};

export const fetchSearch = async (query) => {
  if (!query) return { results: [] };
  const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`);
  return res.json();
};

export const fetchCredits = async (id, type = 'tv') => {
  const res = await fetch(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}`);
  return res.json();
};

export const fetchVideos = async (id, type = 'tv') => {
  const res = await fetch(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`);
  return res.json();
};

export const fetchSimilar = async (id, type = 'tv') => {
  const res = await fetch(`${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}`);
  return res.json();
};

// ── Category Config (No Emojis, Sleek Dark Gradients & Icons) ───────────────
export const FANDOM_CATEGORIES = [
  {
    slug: 'anime',
    label: 'Anime',
    iconName: 'Tv',
    description: 'Explore Japanese animation — from legendary shonen sagas to slice-of-life masterpieces.',
    gradient: 'from-[#E50914] via-red-900 to-black',
    fetcher: fetchAnimeCategory,
    fallbackType: 'tv',
  },
  {
    slug: 'gaming',
    label: 'Gaming',
    iconName: 'Gamepad2',
    description: 'Immerse in films and series adapted from world-renowned video game franchises.',
    gradient: 'from-emerald-700 via-emerald-950 to-black',
    fetcher: fetchGamingCategory,
    fallbackType: 'movie',
  },
  {
    slug: 'movies',
    label: 'Movies',
    iconName: 'Film',
    description: 'Blockbusters, indie cinema, and critically acclaimed motion pictures.',
    gradient: 'from-blue-700 via-slate-900 to-black',
    fetcher: fetchMoviesCategory,
    fallbackType: 'movie',
  },
  {
    slug: 'tv-shows',
    label: 'TV Shows',
    iconName: 'MonitorPlay',
    description: 'Binge-worthy television series and episodic storytelling from around the world.',
    gradient: 'from-cyan-700 via-slate-900 to-black',
    fetcher: fetchTVShowsCategory,
    fallbackType: 'tv',
  },
  {
    slug: 'k-pop',
    label: 'K-Pop',
    iconName: 'Music',
    description: 'Korean music documentaries, idol concert films, and variety broadcasts.',
    gradient: 'from-rose-700 via-gray-900 to-black',
    fetcher: fetchKPopCategory,
    fallbackType: 'tv',
  },
  {
    slug: 'comics',
    label: 'Comics',
    iconName: 'BookOpen',
    description: 'Marvel, DC, and graphic novel adaptations brought to life.',
    gradient: 'from-amber-700 via-red-950 to-black',
    fetcher: fetchComicsCategory,
    fallbackType: 'movie',
  },
  {
    slug: 'manga',
    label: 'Manga',
    iconName: 'Book',
    description: 'Live-action series and anime titles rooted in iconic Japanese manga publications.',
    gradient: 'from-indigo-800 via-slate-950 to-black',
    fetcher: fetchMangaCategory,
    fallbackType: 'tv',
  },
  {
    slug: 'cosplay',
    label: 'Cosplay',
    iconName: 'Sparkles',
    description: 'Sci-fi, fantasy, and costume creations celebrated across global fandom conventions.',
    gradient: 'from-purple-800 via-gray-950 to-black',
    fetcher: fetchCosplayCategory,
    fallbackType: 'movie',
  },
];
