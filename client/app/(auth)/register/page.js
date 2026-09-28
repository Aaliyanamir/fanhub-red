'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#090C15] p-6 py-16 md:py-24 transition-colors duration-500 overflow-y-auto">
      <div className="relative w-full max-w-md my-auto z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-3xl font-heading font-extrabold text-[#E50914] tracking-tight hover:opacity-90">
            Fan Hub Plus
          </Link>
          <p className="text-gray-400 mt-1 text-sm">Join the fandom community</p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8 border border-gray-800 bg-gray-900/90 backdrop-blur-2xl shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-900/40 border border-red-800 text-red-300 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="John Doe"
                minLength={3}
                className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914] transition-all pr-12"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#E50914] transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#E50914] hover:bg-red-700 text-white font-extrabold text-sm uppercase tracking-wider transition-all active:scale-[0.98] shadow-xl shadow-red-950/50 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><UserPlus size={18} /> Create Account</>}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-[#E50914] font-extrabold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
