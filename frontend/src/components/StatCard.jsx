export default function StatCard({ icon, label, value, hint, tone = 'brand' }) {
  const tones = {
    brand: 'from-brand-500 to-brand-700 text-white',
    orange: 'from-orange-400 to-orange-600 text-white',
    slate: 'from-slate-700 to-slate-900 text-white',
    emerald: 'from-emerald-400 to-emerald-600 text-white'
  };

  return (
    <div className="card relative overflow-hidden">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tones[tone]}`} />
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <h3 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{value}</h3>
          {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-2xl text-brand-600">
          {icon}
        </div>
      </div>
    </div>
  );
}
