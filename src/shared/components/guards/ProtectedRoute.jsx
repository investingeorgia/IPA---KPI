// ============================================================
// ProtectedRoute.jsx — redirect to /login if not authenticated
// CHUNK 1: always passes (mock user always exists)
// CHUNK 9: will actually redirect when Firebase user is null
// ============================================================
import { Navigate } from 'react-router-dom';
import { useAuth } from '@shared/contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
