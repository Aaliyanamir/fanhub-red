'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Users, Film, FileText, MessageSquare, Shield, Check, X, Sparkles, RefreshCw, Database, Layers, BarChart3,
} from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function AdminDashboardPage() {
  const { token, user } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 142,
    totalContent: 85,
    totalSubmissions: 28,
    pendingSubmissions: 6,
    totalFeedback: 34,
    totalMerch: 8,
    activeCategories: 8,
  });

  const [submissions, setSubmissions] = useState([
    { _id: '1', author_name: 'AnimeFan99', title: 'Why Demon Slayer Infinity Castle Arc Breaks Records', category: 'Anime', type: 'article', status: 'pending', createdAt: '2026-09-24' },
    { _id: '2', author_name: 'CosplayQueen', title: 'My Handcrafted Cyberpunk Visor Build', category: 'Cosplay', type: 'cosplay_photo', status: 'pending', createdAt: '2026-09-23' },
    { _id: '3', author_name: 'GamerX', title: 'Elden Ring DLC Boss Ranking & Guide', category: 'Gaming', type: 'article', status: 'approved', createdAt: '2026-09-20' },
  ]);

  const [usersList, setUsersList] = useState([
    { _id: 'u1', name: 'System Admin', email: 'admin@fanhub.com', role: 'admin', createdAt: '2026-09-01' },
    { _id: 'u2', name: 'Regular Fan', email: 'user@fanhub.com', role: 'user', createdAt: '2026-09-10' },
  ]);

  const [feedbacks, setFeedbacks] = useState([
    { _id: 'f1', user_name: 'OtakuRider', type: 'suggestion', message: 'Please add a dark mode auto-switch based on system settings!', rating: 5, status: 'new' },
    { _id: 'f2', user_name: 'MovieBuff', type: 'bug', message: 'Server 2 player takes 3 seconds to load on mobile.', rating: 4, status: 'reviewed' },
  ]);

  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  // Fetch real data from express backend if available
  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [resStats, resSub, resUsers, resFb] = await Promise.all([
          fetch(`${API}/api/admin/dashboard-stats`).then((r) => r.json()).catch(() => null),
          fetch(`${API}/api/admin/submissions`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).catch(() => null),
          fetch(`${API}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).catch(() => null),
          fetch(`${API}/api/admin/feedback`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).catch(() => null),
        ]);

        if (resStats?.data) setStats(resStats.data);
        if (resSub?.data) setSubmissions(resSub.data);
        if (resUsers?.data) setUsersList(resUsers.data);
        if (resFb?.data) setFeedbacks(resFb.data);
      } catch (err) {
        console.log('Using demo admin data mode');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [token]);

  // Handle Submission Approve/Reject
  const handleModerateSubmission = async (id, status) => {
    try {
      await fetch(`${API}/api/admin/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      setSubmissions((prev) =>
        prev.map((sub) => (sub._id === id ? { ...sub, status } : sub))
      );
      setActionMsg(`Submission ${status} successfully!`);
      setTimeout(() => setActionMsg(''), 3000);
    } catch (e) {
      setSubmissions((prev) =>
        prev.map((sub) => (sub._id === id ? { ...sub, status } : sub))
      );
    }
  };

  // Handle User Role Toggle
  const handleToggleUserRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await fetch(`${API}/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role: newRole }),
      });
      setUsersList((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
      setActionMsg(`User role changed to ${newRole}`);
      setTimeout(() => setActionMsg(''), 3000);
    } catch (e) {
      setUsersList((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-body p-6 md:p-10 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-brand-primary text-xs font-bold uppercase tracking-wider mb-1">
            <Shield size={16} /> Restricted Control Panel
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-white">
            Fan Hub Plus Admin Control Center
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Logged in as <span className="text-brand-primary font-bold">{user?.email || 'admin@fanhub.com'}</span>
          </p>
        </div>

        {actionMsg && (
          <div className="px-4 py-2 rounded-xl bg-green-900/40 border border-green-700 text-green-400 text-xs font-bold flex items-center gap-2">
            <Check size={14} /> {actionMsg}
          </div>
        )}
      </div>

      {/* ── Metric Stat Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 shadow-lg">
          <div className="flex items-center justify-between text-brand-primary mb-2">
            <Users size={22} />
            <span className="text-[10px] uppercase font-bold text-gray-500">Users</span>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalUsers}</div>
          <span className="text-xs text-gray-400">Registered Members</span>
        </div>

        <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 shadow-lg">
          <div className="flex items-center justify-between text-brand-accent mb-2">
            <FileText size={22} />
            <span className="text-[10px] uppercase font-bold text-gray-500">Submissions</span>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalSubmissions}</div>
          <span className="text-xs text-amber-400 font-bold">{stats.pendingSubmissions} Pending Review</span>
        </div>

        <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 shadow-lg">
          <div className="flex items-center justify-between text-purple-400 mb-2">
            <Layers size={22} />
            <span className="text-[10px] uppercase font-bold text-gray-500">Fandoms</span>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.activeCategories}</div>
          <span className="text-xs text-gray-400">Active Categories</span>
        </div>

        <div className="p-5 rounded-2xl bg-gray-900 border border-gray-800 shadow-lg">
          <div className="flex items-center justify-between text-green-400 mb-2">
            <MessageSquare size={22} />
            <span className="text-[10px] uppercase font-bold text-gray-500">Feedback</span>
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.totalFeedback}</div>
          <span className="text-xs text-gray-400">User Submissions</span>
        </div>
      </div>

      {/* ── Admin Tabs Navigation ────────────────────────────────────── */}
      <div className="flex gap-2 border-b border-gray-800 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { id: 'overview', label: '📊 Platform Analytics', icon: BarChart3 },
          { id: 'submissions', label: '✍️ Moderation Queue', count: stats.pendingSubmissions },
          { id: 'users', label: '👥 User Management', icon: Users },
          { id: 'feedback', label: '💬 User Feedback', icon: MessageSquare },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all shrink-0 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/30'
                : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {tab.label}
            {tab.count != null && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── TAB 1: OVERVIEW & ANALYTICS ──────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gray-900 border border-gray-800">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-brand-primary" /> Fandom Popularity & Content Breakdown
            </h2>
            <div className="space-y-4">
              {[
                { name: 'Anime', count: 42, color: 'bg-pink-500' },
                { name: 'Gaming', count: 28, color: 'bg-green-500' },
                { name: 'Movies', count: 35, color: 'bg-blue-500' },
                { name: 'TV Shows', count: 22, color: 'bg-cyan-500' },
                { name: 'K-Pop', count: 18, color: 'bg-purple-500' },
                { name: 'Comics', count: 15, color: 'bg-orange-500' },
                { name: 'Manga', count: 12, color: 'bg-indigo-500' },
                { name: 'Cosplay', count: 10, color: 'bg-rose-500' },
              ].map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-300">{cat.name}</span>
                    <span className="text-gray-500">{cat.count} items</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-gray-800 overflow-hidden">
                    <div className={`h-full ${cat.color}`} style={{ width: `${(cat.count / 42) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: MODERATION QUEUE ──────────────────────────────────── */}
      {activeTab === 'submissions' && (
        <div className="rounded-3xl bg-gray-900 border border-gray-800 overflow-hidden">
          <div className="p-5 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Fan Article & Art Moderation Queue</h2>
            <span className="text-xs text-gray-400">{submissions.length} Total Submissions</span>
          </div>

          <div className="divide-y divide-gray-800">
            {submissions.map((sub) => (
              <div key={sub._id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-primary/20 text-brand-primary uppercase">
                      {sub.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      sub.status === 'approved' ? 'bg-green-900/60 text-green-400' : sub.status === 'rejected' ? 'bg-red-900/60 text-red-400' : 'bg-amber-900/60 text-amber-400'
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{sub.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Submitted by {sub.author_name} on {sub.createdAt}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleModerateSubmission(sub._id, 'approved')}
                    disabled={sub.status === 'approved'}
                    className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs flex items-center gap-1 disabled:opacity-40"
                  >
                    <Check size={14} /> Approve
                  </button>
                  <button
                    onClick={() => handleModerateSubmission(sub._id, 'rejected')}
                    disabled={sub.status === 'rejected'}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1 disabled:opacity-40"
                  >
                    <X size={14} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: USER MANAGEMENT ───────────────────────────────────── */}
      {activeTab === 'users' && (
        <div className="rounded-3xl bg-gray-900 border border-gray-800 overflow-hidden">
          <div className="p-5 border-b border-gray-800">
            <h2 className="text-base font-bold text-white">Registered Platform Users</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-950 text-gray-400 uppercase font-semibold border-b border-gray-800">
                <tr>
                  <th className="p-4">User Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-800/40">
                    <td className="p-4 font-bold text-white">{u.name}</td>
                    <td className="p-4 text-gray-300">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-purple-900/60 text-purple-300' : 'bg-gray-800 text-gray-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleUserRole(u._id, u.role)}
                        className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-xs"
                      >
                        Toggle Role ({u.role === 'admin' ? 'Make User' : 'Make Admin'})
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 4: USER FEEDBACK ─────────────────────────────────────── */}
      {activeTab === 'feedback' && (
        <div className="rounded-3xl bg-gray-900 border border-gray-800 overflow-hidden p-6 space-y-4">
          <h2 className="text-base font-bold text-white">User Feedback Entries</h2>

          <div className="space-y-3">
            {feedbacks.map((fb) => (
              <div key={fb._id} className="p-4 rounded-2xl bg-gray-950 border border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{fb.user_name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-accent/20 text-brand-accent uppercase">
                      {fb.type}
                    </span>
                  </div>
                  <span className="text-xs text-amber-400 font-bold">⭐ {fb.rating}/5</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">{fb.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
