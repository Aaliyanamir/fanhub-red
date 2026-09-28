'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import {
  LogOut, Mail, Camera, Save, Eye, EyeOff, Lock, CheckCircle, AlertCircle, Shield,
} from 'lucide-react';

const FANDOM_OPTIONS = ['Anime', 'Gaming', 'Movies', 'TV Shows', 'K-Pop', 'Comics', 'Manga', 'Cosplay'];

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/8.x/adventurer/svg?seed=anime&backgroundColor=E50914',
  'https://api.dicebear.com/8.x/adventurer/svg?seed=gaming&backgroundColor=0284C7',
  'https://api.dicebear.com/8.x/adventurer/svg?seed=manga&backgroundColor=4F46E5',
  'https://api.dicebear.com/8.x/adventurer/svg?seed=kpop&backgroundColor=D97706',
  'https://api.dicebear.com/8.x/adventurer/svg?seed=comics&backgroundColor=DC2626',
  'https://api.dicebear.com/8.x/adventurer/svg?seed=cosplay&backgroundColor=059669',
];

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function Card({ title, children }) {
  return (
    <div className="rounded-3xl p-6 border border-gray-800 bg-gray-900/70 backdrop-blur-2xl mb-4 transition-colors duration-300">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">{title}</h2>
      {children}
    </div>
  );
}

function Toast({ type, msg }) {
  if (!msg) return null;
  const isSuccess = type === 'success';
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-2 px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold ${isSuccess ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
      {isSuccess ? <CheckCircle size={17} /> : <AlertCircle size={17} />}
      {msg}
    </div>
  );
}

export default function ProfilePage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [selectedFandoms, setSelectedFandoms] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [toast, setToast] = useState({ type: '', msg: '' });

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    setName(user.name || '');
    setSelectedFandoms(user.favorite_fandoms || []);
    setSelectedAvatar(user.avatar || AVATAR_OPTIONS[0]);
  }, [user]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast({ type: '', msg: '' }), 3000);
  };

  const toggleFandom = (fandom) => {
    setSelectedFandoms((prev) =>
      prev.includes(fandom) ? prev.filter((f) => f !== fandom) : [...prev, fandom]
    );
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/auth/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, avatar: selectedAvatar, favorite_fandoms: selectedFandoms }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const updated = { ...user, name, avatar: selectedAvatar, favorite_fandoms: selectedFandoms };
      localStorage.setItem('fanhub_user', JSON.stringify(updated));
      window.dispatchEvent(new Event('fanhub_user_updated'));
      showToast('success', 'Profile updated successfully!');
    } catch (err) {
      showToast('error', err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPass || !newPass) return showToast('error', 'Both password fields are required.');
    if (newPass.length < 6) return showToast('error', 'New password must be at least 6 characters.');
    setChangingPass(true);
    try {
      const res = await fetch(`${API}/api/auth/change-password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setOldPass(''); setNewPass('');
      showToast('success', 'Password changed successfully!');
    } catch (err) {
      showToast('error', err.message || 'Failed to change password');
    } finally {
      setChangingPass(false);
    }
  };

  const handleLogout = () => { logout(); router.push('/'); };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#090C15] text-gray-50 p-6 md:p-12 pb-40 font-body flex flex-col items-center">
      <Toast {...toast} />
      <div className="w-full max-w-2xl">
        <Breadcrumbs />

        {/* ── Avatar Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center mt-8 mb-8">
          <div className="relative mb-4">
            <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-[#E50914]/40 shadow-2xl bg-gray-900">
              <img
                src={selectedAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=111827&color=E50914&size=112`}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => setShowAvatarPicker((s) => !s)}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg hover:bg-red-700 transition-all"
            >
              <Camera size={14} />
            </button>
          </div>
          <h1 className="text-2xl font-heading font-extrabold text-white">{user.name}</h1>
          <p className="text-gray-400 text-sm mt-1">{user.email}</p>
          <span className="mt-2 px-3 py-1 rounded-full bg-[#E50914]/20 text-[#E50914] text-xs font-extrabold uppercase tracking-wide">
            {user.role} Account
          </span>
        </div>

        {/* ── Avatar Picker ─────────────────────────────────────────────── */}
        {showAvatarPicker && (
          <Card title="Choose Avatar">
            <div className="grid grid-cols-6 gap-3">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av}
                  onClick={() => { setSelectedAvatar(av); setShowAvatarPicker(false); }}
                  className={`w-12 h-12 rounded-full overflow-hidden ring-2 ring-offset-2 transition-all ${
                    selectedAvatar === av
                      ? 'ring-[#E50914] ring-offset-gray-950'
                      : 'ring-transparent hover:ring-[#E50914]/50'
                  }`}
                >
                  <img src={av} alt="avatar option" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* ── Edit Profile ──────────────────────────────────────────────── */}
        <Card title="Edit Profile">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914] transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email Address</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-950/60 border border-gray-800">
                <Mail size={15} className="text-gray-500" />
                <span className="text-sm text-gray-400">{user.email}</span>
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full py-3 rounded-xl bg-[#E50914] hover:bg-red-700 text-white font-bold text-sm transition-all shadow-lg shadow-red-950/40 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save size={16} /> Save Changes</>}
            </button>
          </div>
        </Card>

        {/* ── Favorite Fandoms ──────────────────────────────────────────── */}
        <Card title="Favorite Fandoms">
          <p className="text-xs text-gray-400 mb-3">Select your interests to personalise content suggestions.</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {FANDOM_OPTIONS.map((fandom) => (
              <button
                key={fandom}
                onClick={() => toggleFandom(fandom)}
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase border transition-all duration-200 ${
                  selectedFandoms.includes(fandom)
                    ? 'bg-[#E50914] text-white border-[#E50914] shadow-lg shadow-red-950/40'
                    : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-[#E50914] hover:text-white'
                }`}
              >
                {fandom}
              </button>
            ))}
          </div>
        </Card>

        {/* ── Change Password ───────────────────────────────────────────── */}
        <Card title="Change Password">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Current Password</label>
              <div className="relative">
                <input
                  type={showOld ? 'text' : 'password'}
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914] transition-all text-sm"
                />
                <button type="button" onClick={() => setShowOld((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="min. 6 characters"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E50914] transition-all text-sm"
                />
                <button type="button" onClick={() => setShowNew((s) => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleChangePassword}
              disabled={changingPass}
              className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {changingPass ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Lock size={16} /> Change Password</>}
            </button>
          </div>
        </Card>

        {/* ── Sign Out ──────────────────────────────────────────────────── */}
        <button
          onClick={handleLogout}
          className="w-full py-4 rounded-2xl border border-red-900/50 bg-red-950/30 text-red-400 font-bold flex items-center justify-center gap-2 hover:bg-red-900/50 transition-all"
        >
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </main>
  );
}
