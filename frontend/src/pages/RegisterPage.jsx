import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiHome, FiBookOpen } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const initialState = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  registrationNumber: '',
  department: '',
  level: '',
  address: ''
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/app', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3 font-extrabold">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600">
            <FiBookOpen />
          </div>
          <div>
            <p className="text-sm text-white/60">Library Management System</p>
            <h1 className="text-xl">Create a student account</h1>
          </div>
        </div>
        <div>
          <h2 className="max-w-xl text-4xl font-black leading-tight">Register once and start tracking books, due dates, and borrowing history instantly.</h2>
          <p className="mt-5 max-w-lg text-white/70">The default role is student, which keeps registration simple and secure.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {['Responsive forms', 'Protected access', 'Role default: student', 'Clean design'].map((item) => <div key={item} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm font-semibold">{item}</div>)}
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft sm:p-10">
          <h2 className="text-3xl font-black tracking-tight text-slate-900">Create account</h2>
          <p className="mt-2 text-sm text-slate-600">Register as a student to access your library dashboard.</p>

          {error ? <div className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

          <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
            <Field icon={FiUser} label="Full name" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter full name" />
            <Field icon={FiMail} label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            <Field icon={FiLock} label="Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Create password" />
            <Field icon={FiPhone} label="Phone number" name="phone" value={form.phone} onChange={handleChange} placeholder="08012345678" />
            <Field icon={FiBookOpen} label="Registration number / Library ID" name="registrationNumber" value={form.registrationNumber} onChange={handleChange} placeholder="CSC/2026/001" />
            <Field icon={FiBookOpen} label="Department" name="department" value={form.department} onChange={handleChange} placeholder="Computer Science" />
            <Field icon={FiBookOpen} label="Level / Class" name="level" value={form.level} onChange={handleChange} placeholder="ND 1" />
            <Field icon={FiHome} label="Address" name="address" value={form.address} onChange={handleChange} placeholder="Home or hostel address" />
            <button disabled={loading} className="btn-primary md:col-span-2 disabled:cursor-not-allowed disabled:opacity-70" type="submit">
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input {...props} className="input-field pl-11" />
      </div>
    </div>
  );
}
