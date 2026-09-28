'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      router.push('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
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
          <p className="text-gray-400 mt-1 text-sm">Welcome back to Fandom Universe</p>
        </div>

        {/* Card */}
        <div
          className="rounded-3xl p-8 border border-gray-800 bg-gray-900/90 backdrop-blur-2xl shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-900/40 border border-red-800 text-red-300 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-[#E50914] font-bold hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914] transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#E50914] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#E50914] hover:bg-red-700 text-white font-extrabold text-sm uppercase tracking-wider transition-all active:scale-[0.98] shadow-xl shadow-red-950/50 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><LogIn size={18} /> Sign In</>
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#E50914] font-extrabold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
