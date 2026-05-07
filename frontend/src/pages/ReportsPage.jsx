import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiDownload, FiPrinter } from 'react-icons/fi';
import api from '../services/api';
import DashboardTable from '../components/DashboardTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const tabs = [
  { key: 'books', label: 'Books Report' },
  { key: 'borrowed', label: 'Borrowed Report' },
  { key: 'returned', label: 'Returned Report' },
  { key: 'overdue', label: 'Overdue Report' },
  { key: 'users', label: 'Users Report' },
  { key: 'monthly', label: 'Monthly Activity' }
];

export default function ReportsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('books');
  const [loading, setLoading] = useState(true);
  const [payload, setPayload] = useState({ total: 0, items: [] });

  const loadReport = async (tab = activeTab) => {
    setLoading(true);
    try {
      const route = tab === 'monthly' ? '/reports/monthly' : `/reports/${tab}`;
      const { data } = await api.get(route);
      setPayload({ total: data.total || data.records?.length || data.users?.length || 0, items: data.books || data.records || data.users || [] });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadReport(activeTab); }, [activeTab]);

  if (loading) return <LoadingSpinner />;
  if (user?.role === 'student') return <div className="card text-center text-slate-600">Reports are available to admin and librarian roles only.</div>;

  const handlePrint = () => window.print();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab.key ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'}`}>
            {tab.label}
          </button>
        ))}
        <button type="button" onClick={handlePrint} className="btn-secondary ml-auto"><FiPrinter /> Print</button>
        <button type="button" className="btn-primary"><FiDownload /> PDF Export</button>
      </div>

      <div className="card">
        <p className="text-sm uppercase tracking-[0.2em] text-brand-600">Report Preview</p>
        <h3 className="mt-2 text-2xl font-bold text-slate-900">Total Records: {payload.total}</h3>
        {activeTab === 'monthly' ? (
          <pre className="mt-6 overflow-auto rounded-2xl bg-slate-950 p-5 text-sm text-slate-100">{JSON.stringify(payload.items, null, 2)}</pre>
        ) : (
          <DashboardTable
            columns={activeTab === 'users' ? [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' }] : [{ key: 'one', label: 'Title' }, { key: 'two', label: 'Details' }]}
            rows={payload.items}
            renderRow={(item) => (
              <tr key={item._id}>
                {activeTab === 'users' ? (
                  <>
                    <td className="px-5 py-4 font-semibold text-slate-900">{item.fullName}</td>
                    <td className="px-5 py-4 text-slate-600">{item.email}</td>
                    <td className="px-5 py-4 uppercase text-slate-600">{item.role}</td>
                  </>
                ) : (
                  <>
                    <td className="px-5 py-4 font-semibold text-slate-900">{item.title || item.book?.title || item.name || item._id}</td>
                    <td className="px-5 py-4 text-slate-600">{item.author || item.user?.fullName || item.description || item.createdAt}</td>
                  </>
                )}
              </tr>
            )}
            emptyMessage="No records to display."
          />
        )}
      </div>
    </div>
  );
}
