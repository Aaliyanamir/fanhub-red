'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { MessageSquare, Star, X, CheckCircle } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function FeedbackModal() {
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('suggestion');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API}/api/features/feedback`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ type, rating, message }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
        setMessage('');
      }, 2000);
    } catch (err) {
      alert(err.message || 'Feedback submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 p-3.5 rounded-full bg-gray-800 border border-gray-700 text-white shadow-2xl hover:scale-110 hover:border-[#E50914] active:scale-95 transition-all flex items-center gap-2 font-bold text-xs"
        title="Give Feedback"
      >
        <MessageSquare size={18} className="text-[#E50914]" />
        <span className="hidden md:inline">Feedback</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl p-6 border border-gray-800 bg-gray-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>

            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle size={48} className="text-green-500 mx-auto" />
                <h3 className="text-xl font-bold text-white">Thank You!</h3>
                <p className="text-xs text-gray-400">Your feedback helps improve Fan Hub Plus.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-2 text-[#E50914] font-bold text-xs uppercase tracking-wider">
                  <MessageSquare size={16} /> User Feedback & Ratings
                </div>
                <h3 className="text-xl font-bold text-white">Share Your Thoughts</h3>

                {/* Rating */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1 transition-transform ${rating >= star ? 'text-amber-400 scale-110' : 'text-gray-600'}`}
                      >
                        <Star size={24} fill={rating >= star ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Feedback Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['suggestion', 'bug', 'query'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`py-2 rounded-xl text-xs font-bold capitalize border transition-all ${
                          type === t
                            ? 'bg-[#E50914] text-white border-[#E50914]'
                            : 'bg-gray-950 border-gray-800 text-gray-400 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Your Message</label>
                  <textarea
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder="Tell us what you love or what we should fix..."
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#E50914] text-white font-bold text-sm shadow-lg shadow-red-950/40 hover:bg-red-700 transition-all"
                >
                  {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
