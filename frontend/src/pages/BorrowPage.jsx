import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import DashboardTable from '../components/DashboardTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, currency, statusClass } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

const blankBorrow = { userId: '', bookId: '', dueDate: '' };

export default function BorrowPage() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(blankBorrow);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recordsRes, usersRes, booksRes] = await Promise.all([
        api.get('/borrow'),
        api.get('/users'),
        api.get('/books', { params: { availability: 'available' } })
      ]);
      setRecords(recordsRes.data.records);
      setUsers(usersRes.data.users.filter((item) => item.role === 'student'));
      setBooks(booksRes.data.books);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load borrow data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleChange = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/borrow', form);
      toast.success('Book issued successfully');
      setForm(blankBorrow);
      loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to issue book');
    }
  };

  const handleReturn = async (id) => {
    try {
      await api.put(`/borrow/${id}/return`);
      toast.success('Book returned successfully');
      loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to return book');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (user?.role === 'student') return <div className="card text-center text-slate-600">Borrowing operations are handled by librarians.</div>;

  return (
    <div className="space-y-8">
      <div className="card">
        <h3 className="text-xl font-bold">Issue Book</h3>
        <form className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3" onSubmit={handleSubmit}>
          <select className="input-field" name="userId" value={form.userId} onChange={handleChange} required>
            <option value="">Select student</option>
            {users.map((item) => <option key={item._id} value={item._id}>{item.fullName}</option>)}
          </select>
          <select className="input-field" name="bookId" value={form.bookId} onChange={handleChange} required>
            <option value="">Select book</option>
            {books.map((item) => <option key={item._id} value={item._id}>{item.title}</option>)}
          </select>
          <input className="input-field" type="date" name="dueDate" value={form.dueDate} onChange={handleChange} required />
          <button className="btn-primary md:col-span-2 xl:col-span-3" type="submit">Issue Book</button>
        </form>
      </div>

      <DashboardTable
        columns={[{ key: 'user', label: 'User' }, { key: 'book', label: 'Book' }, { key: 'dates', label: 'Dates' }, { key: 'status', label: 'Status' }, { key: 'fine', label: 'Fine' }, { key: 'actions', label: 'Actions' }]}
        rows={records}
        renderRow={(record) => (
          <tr key={record._id}>
            <td className="px-5 py-4 font-semibold text-slate-900">{record.user?.fullName}</td>
            <td className="px-5 py-4 text-slate-600">{record.book?.title}</td>
            <td className="px-5 py-4 text-slate-600">Borrowed {formatDate(record.borrowedDate)}<br />Due {formatDate(record.dueDate)}</td>
            <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass(record.status)}`}>{record.status}</span></td>
            <td className="px-5 py-4 text-slate-600">{currency(record.fineAmount)}</td>
            <td className="px-5 py-4">
              {record.status !== 'returned' ? <button className="rounded-2xl bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700" onClick={() => handleReturn(record._id)} type="button">Mark Returned</button> : <span className="text-xs text-slate-400">Closed</span>}
            </td>
          </tr>
        )}
        emptyMessage="No borrow records found."
      />
    </div>
  );
}
