import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ title = 'No records found', description = 'Try adjusting your search or filters.', action }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl text-brand-600 shadow-sm">
        <FiInbox />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
