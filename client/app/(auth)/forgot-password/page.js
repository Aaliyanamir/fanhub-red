'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FBFBFD] dark:bg-brand-bg p-4 transition-colors duration-500">
      {/* Glow orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-brand-accent/10 dark:bg-brand-accent/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-extrabold text-brand-primary tracking-tight">Fan Hub Plus</h1>
          <p className="text-[#86868b] dark:text-gray-400 mt-1 text-sm">Password Recovery</p>
        </div>

        <div
          className="rounded-3xl p-8 border border-black/[0.07] dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/70 backdrop-blur-2xl transition-colors duration-300"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.8) inset' }}
        >
          {success ? (
            <div className="flex flex-col items-center text-center py-4 gap-4">
              <CheckCircle size={48} className="text-green-500" />
              <h2 className="text-xl font-bold text-[#1d1d1f] dark:text-white">Check Your Email</h2>
              <p className="text-sm text-[#86868b] dark:text-gray-400 leading-relaxed">
                If <strong>{email}</strong> is registered, we've sent a password reset link to your inbox.
              </p>
              <Link
                href="/login"
                className="mt-2 flex items-center gap-2 text-brand-primary font-semibold text-sm hover:underline"
              >
                <ArrowLeft size={15} /> Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-[#1d1d1f] dark:text-white mb-2">Forgot Password</h2>
              <p className="text-sm text-[#86868b] dark:text-gray-400 mb-6">
                Enter your email and we'll send you a reset link.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#3c3c43] dark:text-gray-400 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/[0.04] dark:bg-white/5 border border-black/[0.08] dark:border-gray-700 text-[#1d1d1f] dark:text-white placeholder-[#86868b] dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-base transition-all active:scale-[0.98] shadow-lg shadow-brand-primary/30 flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>

              <p className="text-center mt-6 text-sm text-[#86868b] dark:text-gray-400">
                Remember your password?{' '}
                <Link href="/login" className="text-brand-primary font-semibold hover:underline">
                  Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
