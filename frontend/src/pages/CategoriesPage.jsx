import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import DashboardTable from '../components/DashboardTable';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const blankCategory = { name: '', description: '' };

export default function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(blankCategory);
  const [editingId, setEditingId] = useState(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      setCategories(data.categories);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, []);

  const handleChange = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
        toast.success('Category updated');
      } else {
        await api.post('/categories', form);
        toast.success('Category created');
      }
      setForm(blankCategory);
      setEditingId(null);
      loadCategories();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to save category');
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setForm({ name: category.name, description: category.description || '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success('Category deleted');
      loadCategories();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to delete category');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (user?.role === 'student') return <div className="card text-center text-slate-600">Students can view categories only through books.</div>;

  return (
    <div className="space-y-8">
      <div className="card">
        <h3 className="text-xl font-bold">{editingId ? 'Edit Category' : 'Add Category'}</h3>
        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <input className="input-field" name="name" value={form.name} onChange={handleChange} placeholder="Category name" required />
          <input className="input-field" name="description" value={form.description} onChange={handleChange} placeholder="Description" />
          <button className="btn-primary md:col-span-2" type="submit">{editingId ? 'Update Category' : 'Save Category'}</button>
        </form>
      </div>

      <DashboardTable
        columns={[{ key: 'name', label: 'Name' }, { key: 'description', label: 'Description' }, { key: 'actions', label: 'Actions' }]}
        rows={categories}
        renderRow={(category) => (
          <tr key={category._id}>
            <td className="px-5 py-4 font-semibold text-slate-900">{category.name}</td>
            <td className="px-5 py-4 text-slate-600">{category.description || '-'}</td>
            <td className="px-5 py-4">
              <div className="flex gap-2">
                <button className="rounded-2xl bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700" onClick={() => handleEdit(category)} type="button">Edit</button>
                {user?.role === 'admin' ? <button className="rounded-2xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700" onClick={() => handleDelete(category._id)} type="button">Delete</button> : null}
              </div>
            </td>
          </tr>
        )}
        emptyMessage="No categories found."
      />
    </div>
  );
}
