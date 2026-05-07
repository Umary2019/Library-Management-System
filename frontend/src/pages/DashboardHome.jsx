import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiBookOpen, FiUsers, FiRepeat, FiAlertTriangle, FiCheckCircle, FiActivity } from 'react-icons/fi';
import { BarChart, Bar, CartesianGrid, Cell, PieChart, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import DashboardTable from '../components/DashboardTable';
import EmptyState from '../components/EmptyState';
import { formatDate } from '../utils/formatters';

export default function DashboardHome() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const endpoint = user?.role === 'admin' ? '/dashboard/admin' : user?.role === 'librarian' ? '/dashboard/librarian' : '/dashboard/student';
        const { data: response } = await api.get(endpoint);
        setData(response);
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.role]);

  if (loading) return <LoadingSpinner />;
  if (!data) return <EmptyState title="Dashboard unavailable" description="We could not load dashboard information right now." />;

  if (user?.role === 'student') {
    return (
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard icon={<FiBookOpen />} label="Available Books" value={data.stats.availableBooks} />
          <StatCard icon={<FiRepeat />} label="My Borrowed Books" value={data.stats.myBorrowedCount} tone="orange" />
          <StatCard icon={<FiAlertTriangle />} label="Overdue Books" value={data.stats.overdueCount} tone="slate" />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="card">
            <h3 className="text-xl font-bold text-slate-900">My Borrowed Books</h3>
            <div className="mt-5">
              <DashboardTable
                columns={[{ key: 'book', label: 'Book' }, { key: 'due', label: 'Due Date' }, { key: 'status', label: 'Status' }]}
                rows={data.myBorrowedBooks}
                renderRow={(row) => (
                  <tr key={row._id}>
                    <td className="px-5 py-4 font-semibold text-slate-900">{row.book?.title}</td>
                    <td className="px-5 py-4 text-slate-600">{formatDate(row.dueDate)}</td>
                    <td className="px-5 py-4 uppercase text-brand-700">{row.status}</td>
                  </tr>
                )}
                emptyMessage="You do not have borrowed books yet."
              />
            </div>
          </div>
          <div className="card">
            <h3 className="text-xl font-bold text-slate-900">Recommended Books</h3>
            <div className="mt-5 space-y-3">
              {data.recommendedBooks.map((book) => (
                <div key={book._id} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-900">{book.title}</p>
                    <p className="text-sm text-slate-500">{book.author}</p>
                  </div>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">Available</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = user?.role === 'admin'
    ? [
        { icon: <FiBookOpen />, label: 'Total Books', value: data.stats.totalBooks },
        { icon: <FiUsers />, label: 'Total Users', value: data.stats.totalUsers, tone: 'orange' },
        { icon: <FiUsers />, label: 'Librarians', value: data.stats.totalLibrarians, tone: 'slate' },
        { icon: <FiUsers />, label: 'Students', value: data.stats.totalStudents, tone: 'emerald' },
        { icon: <FiRepeat />, label: 'Borrowed Books', value: data.stats.borrowedBooks },
        { icon: <FiCheckCircle />, label: 'Returned Books', value: data.stats.returnedBooks, tone: 'emerald' },
        { icon: <FiAlertTriangle />, label: 'Overdue Books', value: data.stats.overdueBooks, tone: 'orange' }
      ]
    : [
        { icon: <FiBookOpen />, label: 'Total Books', value: data.stats.totalBooks },
        { icon: <FiBookOpen />, label: 'Available Books', value: data.stats.availableBooks, tone: 'emerald' },
        { icon: <FiRepeat />, label: 'Borrowed Books', value: data.stats.borrowedBooks },
        { icon: <FiCheckCircle />, label: 'Returned Books', value: data.stats.returnedBooks, tone: 'emerald' },
        { icon: <FiAlertTriangle />, label: 'Overdue Books', value: data.stats.overdueBooks, tone: 'orange' }
      ];

  return (
    <div className="space-y-8">
      <div className={`grid gap-4 ${user?.role === 'admin' ? 'md:grid-cols-2 xl:grid-cols-4' : 'md:grid-cols-2 xl:grid-cols-5'}`}>
        {stats.map((item) => <StatCard key={item.label} icon={item.icon} label={item.label} value={item.value} tone={item.tone} />)}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="card">
          <div className="mb-5 flex items-center gap-3">
            <FiActivity className="text-brand-600" />
            <h3 className="text-xl font-bold">Recent Activities</h3>
          </div>
          <div className="space-y-3">
            {(data.recentActivities || []).map((item) => (
              <div key={item._id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">{item.action}</p>
                <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                <p className="mt-2 text-xs text-slate-400">{formatDate(item.createdAt)}</p>
              </div>
            ))}
            {(data.recentActivities || []).length === 0 ? <EmptyState title="No recent activity" description="Activities will appear here when users start using the system." /> : null}
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-bold">Book Availability</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.availabilityStats || []} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={4}>
                  {(data.availabilityStats || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#1f9a80' : '#f97316'} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {user?.role === 'admin' ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="card">
            <h3 className="text-xl font-bold">Borrowing Statistics</h3>
            <div className="mt-5 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.borrowStats || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="_id.month" tickFormatter={(value) => `M${value}`} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1f9a80" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <h3 className="text-xl font-bold">Recent Borrowing Overview</h3>
            <p className="mt-3 text-sm text-slate-600">Live operational summary for admin review.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-brand-50 p-4"><p className="text-sm text-brand-700">Borrowed</p><p className="mt-2 text-2xl font-black text-brand-900">{data.stats.borrowedBooks}</p></div>
              <div className="rounded-2xl bg-emerald-50 p-4"><p className="text-sm text-emerald-700">Returned</p><p className="mt-2 text-2xl font-black text-emerald-900">{data.stats.returnedBooks}</p></div>
              <div className="rounded-2xl bg-orange-50 p-4"><p className="text-sm text-orange-700">Overdue</p><p className="mt-2 text-2xl font-black text-orange-900">{data.stats.overdueBooks}</p></div>
              <div className="rounded-2xl bg-slate-100 p-4"><p className="text-sm text-slate-700">Users</p><p className="mt-2 text-2xl font-black text-slate-900">{data.stats.totalUsers}</p></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="card">
            <h3 className="text-xl font-bold">Recent Borrow Records</h3>
            <div className="mt-5 space-y-3">
              {(data.recentBorrowRecords || []).map((item) => (
                <div key={item._id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{item.user?.fullName} borrowed {item.book?.title}</p>
                  <p className="mt-1 text-sm text-slate-600">Due {formatDate(item.dueDate)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 className="text-xl font-bold">Recent Return Records</h3>
            <div className="mt-5 space-y-3">
              {(data.recentReturnRecords || []).map((item) => (
                <div key={item._id} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{item.user?.fullName} returned {item.book?.title}</p>
                  <p className="mt-1 text-sm text-slate-600">Returned {formatDate(item.returnedDate)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
