'use client';

import { useState } from 'react';
import { MERCHANDISE } from '@/data/merchandise';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ShoppingBag, Eye, X, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

const TAG_FILTERS = ['All', 'Limited Edition', 'Pre-Order', 'Collectible', 'Hot Drop'];

const TAG_COLOURS = {
  'Limited Edition': 'bg-red-600 text-white',
  'Pre-Order': 'bg-amber-600 text-white',
  'Collectible': 'bg-blue-600 text-white',
  'Hot Drop': 'bg-emerald-600 text-white',
  'Standard': 'bg-gray-600 text-white',
};

export default function MerchandisePage() {
  const [activeTag, setActiveTag] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);

  // Pre-order / Registration form state
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', address: '', quantity: 1 });
  const [orderSuccess, setOrderSuccess] = useState(false);

  const filteredItems = activeTag === 'All'
    ? MERCHANDISE
    : MERCHANDISE.filter((item) => item.tag === activeTag);

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setShowOrderForm(false);
      setSelectedItem(null);
      setFormData({ name: '', email: '', address: '', quantity: 1 });
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-[#090C15] text-gray-50 transition-colors duration-500 pb-40">
      <div className="px-6 md:px-16 pt-8">
        <Breadcrumbs />

        <div className="mt-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#E50914] text-xs font-bold uppercase tracking-wider mb-1">
              <ShoppingBag size={16} /> Official Resource Library
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight">
              Merchandise Showcase
            </h1>
            <p className="text-gray-400 text-lg mt-1">
              Discover official figures, apparel, and pre-order collectibles across all 8 fandoms.
            </p>
          </div>
        </div>

        {/* ── Filter Pills ────────────────────────────────────────────── */}
        <div className="flex gap-2 flex-wrap mb-8">
          {TAG_FILTERS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold uppercase border transition-all duration-200 ${
                activeTag === tag
                  ? 'bg-[#E50914] text-white border-[#E50914] shadow-lg shadow-red-900/40'
                  : 'bg-gray-900 border-gray-800 text-gray-300 hover:border-[#E50914] hover:text-white'
              }`}
            >
              {tag === 'All' ? 'All Items' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ───────────────────────────────────────────────────── */}
      <div className="px-6 md:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => { setSelectedItem(item); setShowOrderForm(false); }}
              className="group relative flex flex-col rounded-3xl overflow-hidden
                         border border-gray-800
                         bg-gray-900/70 shadow-lg
                         hover:shadow-red-900/30 hover:-translate-y-1.5 hover:border-[#E50914] transition-all duration-300 cursor-pointer"
            >
              {/* Image & Badges */}
              <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500';
                  }}
                />
                <span className={`absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg ${TAG_COLOURS[item.tag]}`}>
                  {item.tag}
                </span>
                <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-white flex items-center gap-1 border border-white/10">
                  <Eye size={12} /> {item.views}
                </span>
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <span className="text-[10px] font-extrabold text-[#E50914] uppercase tracking-wider">
                    {item.category} Fandom
                  </span>
                  <h3 className="text-base font-bold text-white line-clamp-2 mt-1 group-hover:text-[#E50914] transition-colors">
                    {item.name}
                  </h3>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
                  <div className="text-lg font-extrabold text-white">
                    ${item.price.toFixed(2)}
                  </div>
                  <span className="px-4 py-2 rounded-xl bg-[#E50914]/20 text-[#E50914] font-bold text-xs group-hover:bg-[#E50914] group-hover:text-white transition-all">
                    Pre-Order / Reserve
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Item Detail & Pre-Order Registration Modal ───────────────────── */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full max-w-lg rounded-3xl overflow-hidden border border-gray-800 bg-gray-900 shadow-2xl p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-gray-400 hover:text-white transition-all"
            >
              <X size={20} />
            </button>

            {orderSuccess ? (
              <div className="text-center py-10 space-y-4">
                <CheckCircle size={56} className="text-green-500 mx-auto" />
                <h3 className="text-2xl font-bold text-white">Reservation Confirmed!</h3>
                <p className="text-sm text-gray-400">
                  Thank you <strong>{formData.name}</strong>. Your pre-order for <strong>{selectedItem.name}</strong> has been registered successfully.
                </p>
              </div>
            ) : !showOrderForm ? (
              <>
                <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-black/40">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500';
                    }}
                  />
                </div>

                <span className={`inline-block text-[10px] font-extrabold uppercase px-3 py-1 rounded-full mb-2 ${TAG_COLOURS[selectedItem.tag]}`}>
                  {selectedItem.tag}
                </span>
                <h2 className="text-2xl font-bold text-white leading-tight mb-2">
                  {selectedItem.name}
                </h2>
                <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                  {selectedItem.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div>
                    <span className="text-xs text-gray-500 block">Est. Price</span>
                    <span className="text-2xl font-extrabold text-white">${selectedItem.price.toFixed(2)} USD</span>
                  </div>
                  <button
                    onClick={() => setShowOrderForm(true)}
                    className="px-6 py-3 rounded-2xl bg-[#E50914] text-white font-bold text-sm shadow-lg shadow-red-900/40 hover:bg-red-700 transition-all flex items-center gap-2"
                  >
                    <Sparkles size={16} /> Pre-Order Registration
                  </button>
                </div>
              </>
            ) : (
              /* Pre-Order Registration Form */
              <form onSubmit={handleOrderSubmit} className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-2">
                  <h3 className="text-lg font-bold text-white">Reserve {selectedItem.name}</h3>
                  <button type="button" onClick={() => setShowOrderForm(false)} className="text-xs text-gray-400 hover:text-white">
                    Back to Details
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Shipping Address</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Full street address & city"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#E50914]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#E50914] text-white font-bold text-sm shadow-lg shadow-red-900/40 hover:bg-red-700 transition-all"
                  >
                    Confirm Pre-Order Reservation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="pb-32" />
    </main>
  );
}
