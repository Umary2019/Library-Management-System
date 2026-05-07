import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import DashboardTable from '../components/DashboardTable';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import { statusClass } from '../utils/formatters';

const blankBook = {
  title: '',
  author: '',
  isbn: '',
  category: '',
  publisher: '',
  publicationYear: '',
  totalCopies: 1,
  availableCopies: 1,
  shelfLocation: '',
  description: '',
  status: 'available'
};

export default function BooksPage() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ category: '', status: '', availability: '' });
  const [form, setForm] = useState(blankBook);
  const [editingId, setEditingId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksRes, categoriesRes] = await Promise.all([api.get('/books'), api.get('/categories')]);
      setBooks(booksRes.data.books);
      setCategories(categoriesRes.data.categories);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (event) => setForm((value) => ({ ...value, [event.target.name]: event.target.value }));
  const handleFilterChange = (event) => setFilters((value) => ({ ...value, [event.target.name]: event.target.value }));

  const filteredBooks = books.filter((book) => {
    const matchesQuery = [book.title, book.author, book.isbn].some((field) => String(field || '').toLowerCase().includes(query.toLowerCase()));
    const matchesCategory = !filters.category || book.category?._id === filters.category;
    const matchesStatus = !filters.status || book.status === filters.status;
    const matchesAvailability = !filters.availability || (filters.availability === 'available' ? book.availableCopies > 0 : book.availableCopies === 0);
    return matchesQuery && matchesCategory && matchesStatus && matchesAvailability;
  });

  const resetForm = () => {
    setForm(blankBook);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = { ...form, publicationYear: Number(form.publicationYear), totalCopies: Number(form.totalCopies), availableCopies: Number(form.availableCopies) };
      if (editingId) {
        await api.put(`/books/${editingId}`, payload);
        toast.success('Book updated');
      } else {
        await api.post('/books', payload);
        toast.success('Book created');
      }
      resetForm();
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to save book');
    }
  };

  const handleEdit = (book) => {
    setEditingId(book._id);
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category?._id || '',
      publisher: book.publisher || '',
      publicationYear: book.publicationYear || '',
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies,
      shelfLocation: book.shelfLocation || '',
      description: book.description || '',
      status: book.status
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await api.delete(`/books/${id}`);
      toast.success('Book deleted');
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to delete book');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      {(user?.role === 'admin' || user?.role === 'librarian') ? (
        <div className="card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold">{editingId ? 'Edit Book' : 'Add Book'}</h3>
              <p className="text-sm text-slate-600">Manage the library catalog from here.</p>
            </div>
            {editingId ? <button className="btn-secondary" onClick={resetForm}>Cancel</button> : null}
          </div>
          <form className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3" onSubmit={handleSubmit}>
            {['title', 'author', 'isbn', 'publisher', 'publicationYear', 'totalCopies', 'availableCopies', 'shelfLocation'].map((field) => (
              <input key={field} className="input-field" name={field} type={field.includes('Copies') || field === 'publicationYear' ? 'number' : 'text'} value={form[field]} onChange={handleChange} placeholder={field.replace(/([A-Z])/g, ' $1')} />
            ))}
            <select className="input-field" name="category" value={form.category} onChange={handleChange}>
              <option value="">Select category</option>
              {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
            </select>
            <select className="input-field" name="status" value={form.status} onChange={handleChange}>
              <option value="available">available</option>
              <option value="unavailable">unavailable</option>
            </select>
            <textarea className="input-field md:col-span-2 xl:col-span-3" rows="4" name="description" value={form.description} onChange={handleChange} placeholder="Description" />
            <button className="btn-primary md:col-span-2 xl:col-span-3" type="submit">{editingId ? 'Update Book' : 'Save Book'}</button>
          </form>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <input className="input-field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, author, or ISBN" />
        <select className="input-field" name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">All categories</option>
          {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
        </select>
        <select className="input-field" name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All statuses</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
        <select className="input-field" name="availability" value={filters.availability} onChange={handleFilterChange}>
          <option value="">All availability</option>
          <option value="available">Has stock</option>
          <option value="unavailable">Out of stock</option>
        </select>
      </div>

      <DashboardTable
        columns={[{ key: 'title', label: 'Title' }, { key: 'author', label: 'Author' }, { key: 'category', label: 'Category' }, { key: 'copies', label: 'Copies' }, { key: 'status', label: 'Status' }, { key: 'actions', label: 'Actions' }]}
        rows={filteredBooks}
        renderRow={(book) => (
          <tr key={book._id}>
            <td className="px-5 py-4 font-semibold text-slate-900">{book.title}</td>
            <td className="px-5 py-4 text-slate-600">{book.author}</td>
            <td className="px-5 py-4 text-slate-600">{book.category?.name || '-'}</td>
            <td className="px-5 py-4 text-slate-600">{book.availableCopies}/{book.totalCopies}</td>
            <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClass(book.status)}`}>{book.status}</span></td>
            <td className="px-5 py-4">
              {(user?.role === 'admin' || user?.role === 'librarian') ? (
                <div className="flex gap-2">
                  <button className="rounded-2xl bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-700" onClick={() => handleEdit(book)} type="button">Edit</button>
                  <button className="rounded-2xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700" onClick={() => handleDelete(book._id)} type="button">Delete</button>
                </div>
              ) : <span className="text-xs text-slate-400">View only</span>}
            </td>
          </tr>
        )}
        emptyMessage="No books match the selected filters."
      />
      {filteredBooks.length === 0 ? <div className="mt-6"><EmptyState title="No books found" description="Try a different search term or filter combination." /></div> : null}
    </div>
  );
}
