import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiBookOpen, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(form);
      navigate('/app', { replace: true });
      return user;
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-hero p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3 font-extrabold text-white">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
            <FiBookOpen />
          </div>
          <div>
            <p className="text-sm text-white/70">Library Management System</p>
            <h1 className="text-xl">Secure access for library operations</h1>
          </div>
        </div>
        <div>
          <h2 className="max-w-xl text-4xl font-black leading-tight">A clean login experience for admins, librarians, and students.</h2>
          <p className="mt-5 max-w-lg text-white/75">Use your account to access a role-based dashboard with books, borrowing, returns, reports, and profile tools.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {['Role-based routing', 'JWT security', 'Modern UI'].map((item) => <div key={item} className="rounded-3xl border border-white/10 bg-white/10 p-4 text-sm font-semibold">{item}</div>)}
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-lg rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft sm:p-10">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-600">Login to continue to your dashboard.</p>

          {error ? <div className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
              <div className="relative">
                <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input className="input-field pl-11" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="input-field pl-11 pr-11"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <button disabled={loading} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70" type="submit">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don’t have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-700 hover:text-brand-800">
              Register
            </Link>
          </p>

          <div className="mt-8 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
            Use your registered account credentials to sign in.
          </div>
        </div>
      </div>
    </div>
  );
}