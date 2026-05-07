import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import DashboardTable from '../components/DashboardTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, currency, statusClass } from '../utils/formatters';

export default function MyBorrowedBooksPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/borrow/my-records');
        setRecords(data.records);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to load your records');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <DashboardTable
        columns={[{ key: 'book', label: 'Book' }, { key: 'borrowed', label: 'Borrowed' }, { key: 'due', label: 'Due' }, { key: 'status', label: 'Status' }, { key: 'fine', label: 'Fine' }]}
        rows={records}
        renderRow={(record) => (
          <tr key={record._id}>
            <td className="px-5 py-4 font-semibold text-slate-900">{record.book?.title}</td>
            <td className="px-5 py-4 text-slate-600">{formatDate(record.borrowedDate)}</td>
            <td className="px-5 py-4 text-slate-600">{formatDate(record.dueDate)}</td>
            <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass(record.status)}`}>{record.status}</span></td>
            <td className="px-5 py-4 text-slate-600">{currency(record.fineAmount)}</td>
          </tr>
        )}
        emptyMessage="You have not borrowed any books yet."
      />
    </div>
  );
}
