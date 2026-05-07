import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import DashboardTable from '../components/DashboardTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { statusClass } from '../utils/formatters';

const blankUser = { fullName: '', email: '', password: '', phone: '', registrationNumber: '', department: '', level: '', address: '' };

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(blankUser);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users', { params: { role: roleFilter, search } });
      setUsers(data.users);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, [roleFilter]);

  const handleChange = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/users/librarian', { ...form, password: form.password || 'Librarian12345' });
      toast.success('Librarian created');
      setForm(blankUser);
      loadUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to create librarian');
    }
  };

  const toggleStatus = async (item) => {
    try {
      const nextStatus = item.status === 'active' ? 'inactive' : 'active';
      await api.patch(`/users/${item._id}/status`, { status: nextStatus });
      toast.success('Status updated');
      loadUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to update status');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted');
      loadUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to delete user');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (user?.role !== 'admin') return <div className="card text-center text-slate-600">Access denied. Admin only.</div>;

  return (
    <div className="space-y-8">
      <div className="card">
        <h3 className="text-xl font-bold">Create Librarian</h3>
        <form className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3" onSubmit={handleSubmit}>
          {['fullName', 'email', 'password', 'phone', 'registrationNumber', 'department', 'level', 'address'].map((field) => (
            <input key={field} className="input-field" name={field} type={field === 'password' ? 'password' : 'text'} value={form[field]} onChange={handleChange} placeholder={field.replace(/([A-Z])/g, ' $1')} required={field !== 'address'} />
          ))}
          <button className="btn-primary md:col-span-2 xl:col-span-3" type="submit">Create Librarian</button>
        </form>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <input className="input-field" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search users" />
        <select className="input-field" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="librarian">Librarian</option>
          <option value="student">Student</option>
        </select>
        <button className="btn-secondary" onClick={loadUsers} type="button">Apply Search</button>
      </div>

      <DashboardTable
        columns={[{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' }, { key: 'dept', label: 'Department' }, { key: 'status', label: 'Status' }, { key: 'actions', label: 'Actions' }]}
        rows={users}
        renderRow={(item) => (
          <tr key={item._id}>
            <td className="px-5 py-4 font-semibold text-slate-900">{item.fullName}</td>
            <td className="px-5 py-4 text-slate-600">{item.email}</td>
            <td className="px-5 py-4 uppercase text-slate-600">{item.role}</td>
            <td className="px-5 py-4 text-slate-600">{item.department || '-'}</td>
            <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass(item.status)}`}>{item.status}</span></td>
            <td className="px-5 py-4">
              <div className="flex gap-2">
                <button className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700" onClick={() => toggleStatus(item)} type="button">Toggle Status</button>
                <button className="rounded-2xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700" onClick={() => deleteUser(item._id)} type="button">Delete</button>
              </div>
            </td>
          </tr>
        )}
        emptyMessage="No users found."
      />
    </div>
  );
}
