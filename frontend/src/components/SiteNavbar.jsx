import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Benefits', href: '#benefits' },
  { label: 'Contact', href: '#contact' }
];

export default function SiteNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 font-extrabold tracking-tight text-slate-900">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-600 text-lg text-white shadow-lg shadow-brand-200">
            LS
          </span>
          <span className="text-sm md:text-base">Library Management System</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a key={link.label} href={link.href} className="text-sm font-semibold text-slate-600 transition hover:text-brand-700">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="btn-secondary text-sm">
            Login
          </Link>
          <Link to="/register" className="btn-primary text-sm">
            Get Started
          </Link>
        </div>

        <button type="button" onClick={() => setOpen((value) => !value)} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 md:hidden">
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <a key={link.label} href={link.href} className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50" onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link to="/login" className="btn-secondary text-sm" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm" onClick={() => setOpen(false)}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
