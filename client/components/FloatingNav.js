'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, List, LogIn, Users, BookOpen, ShoppingBag, Compass, UploadCloud, Cat, X } from 'lucide-react';
import { useSearch } from '@/context/SearchContext';
import { useAuth } from '@/context/AuthContext';
import AccessibilityControls from './AccessibilityControls';

const FloatingNav = () => {
  const { openSearch } = useSearch();
  const { user } = useAuth();
  const pathname = usePathname();

  // State to manage navbar toggle (Open vs Collapsed)
  const [isOpen, setIsOpen] = useState(false);

  // Hide floating dock completely on auth pages so it never overlaps forms
  if (['/login', '/register', '/forgot-password'].includes(pathname)) {
    return null;
  }

  const navItems = [
    { label: 'Home', icon: <Home size={20} />, href: '/' },
    { label: 'Search', icon: <Search size={20} />, onClick: openSearch },
    { label: 'Characters', icon: <Users size={20} />, href: '/characters' },
    { label: 'Articles', icon: <BookOpen size={20} />, href: '/articles' },
    { label: 'Merch', icon: <ShoppingBag size={20} />, href: '/merchandise' },
    { label: 'Events', icon: <Compass size={20} />, href: '/events' },
    { label: 'Submit', icon: <UploadCloud size={20} />, href: '/submit' },
    { label: 'My List', icon: <List size={20} />, href: '/mylist' },
    user
      ? {
          label: user.name.split(' ')[0],
          icon: user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
          ) : (
            <span className="w-5 h-5 rounded-full bg-[#E50914] text-white flex items-center justify-center text-[10px] font-extrabold">
              {user.name.charAt(0).toUpperCase()}
            </span>
          ),
          href: '/profile',
        }
      : { label: 'Sign In', icon: <LogIn size={20} />, href: '/login' },
  ];

  return (
    <>
      {/* ── COLLAPSED STATE: Animated Cat Mascot Button in Corner ── */}
      {!isOpen && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2 group">
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-3.5 rounded-full bg-gray-900 border-2 border-[#E50914] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-500 ease-out flex items-center justify-center"
            title="Open Navigation"
          >
            {/* Slow Pulse Ring */}
            <span className="absolute inset-0 rounded-full bg-[#E50914] animate-slow-pulse pointer-events-none" />
            
            {/* Ultra Smooth Slow Floating Cat Mascot */}
            <Cat size={24} className="text-[#E50914] animate-slow-float" />
          </button>

          {/* Label Tooltip */}
          <span className="px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-extrabold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xl pointer-events-none whitespace-nowrap">
            Open Menu
          </span>
        </div>
      )}

      {/* ── EXPANDED STATE: Full Animated Floating Navigation Dock ── */}
      {isOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 animate-in fade-in zoom-in-95 slide-in-from-bottom-6 duration-700 ease-out">
          {/* Accessibility pill above dock */}
          <AccessibilityControls />

          {/* Rounded Pill Dock */}
          <nav className="flex items-center gap-1 px-3 py-2 rounded-full bg-gray-900/95 backdrop-blur-2xl border-2 border-[#E50914]/40 shadow-2xl transition-all duration-500 ease-out">
            {navItems.map((item, index) => {
              const btnClass = [
                "group relative flex items-center justify-center",
                "rounded-full p-2.5",
                "text-gray-300",
                "hover:bg-white/10",
                "hover:text-[#E50914]",
                "active:scale-90 transition-all duration-300 ease-out",
              ].join(' ');

              const Tooltip = (
                <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-gray-950 border border-gray-800 text-white text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-xl">
                  {item.label}
                </span>
              );

              if (item.onClick) {
                return (
                  <button key={index} onClick={item.onClick} className={btnClass}>
                    {Tooltip}
                    {item.icon}
                  </button>
                );
              }

              return (
                <Link key={index} href={item.href} className={btnClass}>
                  {Tooltip}
                  {item.icon}
                </Link>
              );
            })}

            {/* Divider */}
            <div className="w-px h-6 bg-gray-800 mx-1" />

            {/* Close Button (collapses dock back into animated Cat mascot) */}
            <button
              onClick={() => setIsOpen(false)}
              className="group relative p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-red-600/80 transition-all duration-300"
              title="Close Menu"
            >
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-gray-950 border border-gray-800 text-white text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-xl">
                Close Menu
              </span>
              <X size={20} />
            </button>
          </nav>
        </div>
      )}

    </>
  );
};

export default FloatingNav;
