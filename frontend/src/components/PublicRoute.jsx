import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const roleRedirect = (role) => {
  if (role === 'admin') return '/app';
  if (role === 'librarian') return '/app';
  return '/app';
};

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;
  if (user) return <Navigate to={roleRedirect(user.role)} replace />;
  return children;
}
