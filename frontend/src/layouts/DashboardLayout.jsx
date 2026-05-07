import { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { FiBook, FiGrid, FiLogOut, FiMenu, FiFolder, FiUsers, FiRepeat, FiFileText, FiUser, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const navConfig = {
  admin: [
    { to: '/app', label: 'Dashboard', icon: FiGrid },
    { to: '/app/books', label: 'Books', icon: FiBook },
    { to: '/app/users', label: 'Users', icon: FiUsers },
    { to: '/app/categories', label: 'Categories', icon: FiFolder },
    { to: '/app/borrow', label: 'Borrowing', icon: FiRepeat },
    { to: '/app/reports', label: 'Reports', icon: FiFileText },
    { to: '/app/profile', label: 'Profile', icon: FiUser }
  ],
  librarian: [
    { to: '/app', label: 'Dashboard', icon: FiGrid },
    { to: '/app/books', label: 'Books', icon: FiBook },
    { to: '/app/categories', label: 'Categories', icon: FiFolder },
    { to: '/app/borrow', label: 'Borrowing', icon: FiRepeat },
    { to: '/app/reports', label: 'Reports', icon: FiFileText },
    { to: '/app/profile', label: 'Profile', icon: FiUser }
  ],
  student: [
    { to: '/app', label: 'Dashboard', icon: FiGrid },
    { to: '/app/books', label: 'Books', icon: FiBook },
    { to: '/app/my-borrowed', label: 'My Borrowed', icon: FiRepeat },
    { to: '/app/profile', label: 'Profile', icon: FiUser }
  ]
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigation = useMemo(() => navConfig[user?.role] || navConfig.student, [user?.role]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-slate-950 text-white transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:flex lg:flex-col`}>
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 lg:justify-start lg:gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 font-black text-white">LS</div>
            <div>
              <p className="text-sm font-semibold text-white/70">Library System</p>
              <h1 className="text-lg font-extrabold">{user?.role?.toUpperCase() || 'DASHBOARD'}</h1>
            </div>
            <button type="button" className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-white lg:hidden" onClick={() => setMobileOpen(false)}>
              <FiX />
            </button>
          </div>

          <nav className="flex-1 space-y-2 px-4 py-5">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.to} to={item.to} end={item.to === '/app'} onClick={() => setMobileOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-brand-600 text-white shadow-lg' : 'text-white/75 hover:bg-white/5 hover:text-white'}`}>
                  <Icon className="text-base" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-4">
            <button type="button" onClick={logout} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
              <FiLogOut /> Logout
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div>
                <button type="button" onClick={() => setMobileOpen(true)} className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 lg:hidden">
                  <FiMenu />
                </button>
                <p className="text-sm font-medium text-slate-500">{location.pathname.replace('/app', '').replace('/', '').toUpperCase() || 'Dashboard'}</p>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Welcome back, {user?.fullName?.split(' ')[0] || 'User'}</h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-slate-900">{user?.fullName}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-600">{user?.role}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
