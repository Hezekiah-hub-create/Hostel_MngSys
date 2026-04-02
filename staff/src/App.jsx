import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DiningManagement from './pages/DiningManagement';
import Sidebar from './components/Sidebar';

// A simple PrivateRoute that checks token and role
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!user) return <Navigate to="/" />;
  
  // If user must change password (walk-in login scenario)
  if (user.needsPasswordChange && window.location.pathname !== '/change-password') {
    return <Navigate to="/change-password" />;
  }

  // If role isn't allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}-dashboard`} />;
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">{children}</div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
      
      
      <Route path="/receptionist-dashboard" element={
        <PrivateRoute allowedRoles={['receptionist', 'admin']}>
          <ReceptionistDashboard />
        </PrivateRoute>
      } />
      
      <Route path="/manager-dashboard" element={
        <PrivateRoute allowedRoles={['manager', 'admin']}>
          <ManagerDashboard />
        </PrivateRoute>
      } />
      
      <Route path="/admin-dashboard" element={
        <PrivateRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </PrivateRoute>
      } />

      <Route path="/dining-management" element={
        <PrivateRoute allowedRoles={['manager', 'admin']}>
          <DiningManagement />
        </PrivateRoute>
      } />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
