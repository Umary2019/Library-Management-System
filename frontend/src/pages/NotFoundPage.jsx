import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center">
      <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-600">404</p>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Page not found</h1>
        <p className="mt-3 text-slate-600">The page you requested does not exist or has been moved.</p>
        <Link to="/" className="btn-primary mt-6">
          Go Home
        </Link>
      </div>
    </div>
  );
}
