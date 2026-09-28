import Link from 'next/link';
import { FANDOM_CATEGORIES } from '@/utils/tmdb';

export const metadata = {
  title: 'Sitemap — Fan Hub Plus',
};

const Section = ({ title, links }) => (
  <div>
    <h2 className="text-sm font-bold text-[#86868b] dark:text-gray-500 uppercase tracking-widest mb-3">
      {title}
    </h2>
    <ul className="space-y-2">
      {links.map(({ href, label }) => (
        <li key={href}>
          <Link
            href={href}
            className="text-[#1d1d1f] dark:text-gray-200 hover:text-brand-primary dark:hover:text-brand-primary font-medium text-sm transition-colors"
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function SitemapPage() {
  return (
    <main className="min-h-screen bg-[#FBFBFD] dark:bg-brand-bg text-[#1d1d1f] dark:text-gray-50 px-6 md:px-16 py-12 pb-40 transition-colors duration-500">
      <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight mb-2">Sitemap</h1>
      <p className="text-[#86868b] dark:text-gray-400 mb-12 text-lg">Every page on Fan Hub Plus, organised for you.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        <Section
          title="Main Explorer"
          links={[
            { href: '/', label: 'Home' },
            { href: '/mylist', label: 'My List' },
            { href: '/characters', label: 'Character Profiles' },
            { href: '/articles', label: 'Featured Articles' },
            { href: '/merchandise', label: 'Merchandise Showcase' },
            { href: '/events', label: 'Event Discovery & Calendar' },
            { href: '/submit', label: 'Submit Fan Content' },
            { href: '/sitemap', label: 'Sitemap' },
          ]}
        />

        <Section
          title="Fandom Categories"
          links={FANDOM_CATEGORIES.map((c) => ({
            href: `/fandom/${c.slug}`,
            label: `${c.emoji} ${c.label}`,
          }))}
        />

        <Section
          title="Account"
          links={[
            { href: '/login', label: 'Sign In' },
            { href: '/register', label: 'Create Account' },
            { href: '/profile', label: 'My Profile' },
          ]}
        />

        <Section
          title="Admin"
          links={[{ href: '/admin/dashboard', label: 'Admin Dashboard' }]}
        />
      </div>

      <div className="pb-32" />
    </main>
  );
}
