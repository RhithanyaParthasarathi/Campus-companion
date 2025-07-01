// src/auth/ProtectedRoute.tsx
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, Outlet } from 'react-router-dom';
import { auth } from '../firebase';

const ProtectedRoute = () => {
  const [user, loading] = useAuthState(auth);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};
export default ProtectedRoute;