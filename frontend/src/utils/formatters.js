export const formatDate = (value) => {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(value));
};

export const statusClass = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized.includes('available') || normalized.includes('returned')) return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
  if (normalized.includes('overdue')) return 'bg-rose-50 text-rose-700 ring-rose-200';
  if (normalized.includes('inactive') || normalized.includes('unavailable')) return 'bg-slate-100 text-slate-600 ring-slate-200';
  return 'bg-amber-50 text-amber-700 ring-amber-200';
};

export const currency = (value) => `₦${Number(value || 0).toLocaleString()}`;
