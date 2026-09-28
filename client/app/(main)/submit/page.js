'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import { UploadCloud, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

const CATEGORIES = ['Anime', 'Gaming', 'Movies', 'TV Shows', 'K-Pop', 'Comics', 'Manga', 'Cosplay'];
const TYPES = [
  { value: 'article', label: '📰 Fan Article / Review' },
  { value: 'fan_art', label: '🎨 Fan Art' },
  { value: 'cosplay_photo', label: '🎭 Cosplay Photo Showcase' },
];

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function FanSubmissionPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Anime');
  const [type, setType] = useState('article');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/features/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, category, type, content, media_url: mediaUrl }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setSuccess(true);
      setTitle('');
      setContent('');
      setMediaUrl('');
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FBFBFD] dark:bg-brand-bg text-[#1d1d1f] dark:text-gray-50 transition-colors duration-500 pb-40">
      <div className="px-6 md:px-16 pt-8">
        <Breadcrumbs />

        <div className="max-w-3xl mx-auto mt-6 mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-brand-primary/10 mb-2">
            <Sparkles size={14} /> Fan Community Submissions
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight">
            Submit Fan Content
          </h1>
          <p className="text-[#86868b] dark:text-gray-400 text-lg mt-2">
            Share your fan articles, reviews, artwork, or cosplay photos with the Fan Hub Plus community. All submissions are reviewed by our admin team before publication.
          </p>
        </div>

        {/* ── Submission Form ───────────────────────────────────────── */}
        <div className="max-w-2xl mx-auto rounded-3xl p-8 border border-black/[0.07] dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/70 backdrop-blur-2xl shadow-xl">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle size={56} className="text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white">Submission Received!</h2>
              <p className="text-sm text-[#86868b] dark:text-gray-300">
                Thank you for contributing! Your submission is now in our admin review queue.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-3 rounded-2xl bg-brand-primary text-white font-bold text-sm shadow-lg shadow-brand-primary/30"
              >
                Submit Another Story
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle size={18} /> {error}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-[#3c3c43] dark:text-gray-400 uppercase tracking-wider mb-2">
                  Title / Headline
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Why Demon Slayer's Infinity Castle Arc Will Blow Minds"
                  className="w-full px-4 py-3 rounded-xl bg-black/[0.04] dark:bg-white/5 border border-black/[0.08] dark:border-gray-700 text-[#1d1d1f] dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm"
                />
              </div>

              {/* Category & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#3c3c43] dark:text-gray-400 uppercase tracking-wider mb-2">
                    Fandom Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-black/[0.08] dark:border-gray-700 text-[#1d1d1f] dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3c3c43] dark:text-gray-400 uppercase tracking-wider mb-2">
                    Submission Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-black/[0.08] dark:border-gray-700 text-[#1d1d1f] dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm"
                  >
                    {TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Content body */}
              <div>
                <label className="block text-xs font-bold text-[#3c3c43] dark:text-gray-400 uppercase tracking-wider mb-2">
                  Article Body / Description
                </label>
                <textarea
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  placeholder="Write your article, review, or backstory here..."
                  className="w-full px-4 py-3 rounded-xl bg-black/[0.04] dark:bg-white/5 border border-black/[0.08] dark:border-gray-700 text-[#1d1d1f] dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm"
                />
              </div>

              {/* Media URL */}
              <div>
                <label className="block text-xs font-bold text-[#3c3c43] dark:text-gray-400 uppercase tracking-wider mb-2">
                  Featured Cover Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://images.example.com/my-fan-art.png"
                  className="w-full px-4 py-3 rounded-xl bg-black/[0.04] dark:bg-white/5 border border-black/[0.08] dark:border-gray-700 text-[#1d1d1f] dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-base shadow-lg shadow-brand-primary/30 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <><UploadCloud size={20} /> Submit for Review</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="pb-32" />
    </main>
  );
}
