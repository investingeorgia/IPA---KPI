// ============================================================
// AdminRoute.jsx — redirect non-admins to /dashboard
// Wraps any route that only admin can access: /team, /reports
// ============================================================
import { Navigate } from 'react-router-dom';
import { useAuth } from '@shared/contexts/AuthContext';

export default function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}
