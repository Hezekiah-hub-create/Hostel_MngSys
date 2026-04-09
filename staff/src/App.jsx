import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import ReceptionistDashboard from './pages/ReceptionistDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DiningManagement from './pages/DiningManagement';
import GuestsManagement from './pages/GuestsManagement';
import RoomsManagement from './pages/RoomsManagement';
import UserManagement from './pages/UserManagement';
import ReportsPage from './pages/ReportsPage';
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

const PlaceholderPage = ({ title }) => (
  <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-panel)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
    <h2 style={{ color: 'var(--gold-primary)', marginBottom: '1rem', fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>{title}</h2>
    <p style={{ color: 'var(--text-muted)' }}>This module is currently under development.</p>
  </div>
);

const CatchAllRoute = () => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to={`/${user.role}-dashboard`} />;
  }
  return <Navigate to="/" />;
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

      {/* Core Operational Routes */}
      <Route path="/guests" element={
        <PrivateRoute allowedRoles={['receptionist', 'manager', 'admin']}>
          <GuestsManagement />
        </PrivateRoute>
      } />
      <Route path="/rooms" element={
        <PrivateRoute allowedRoles={['receptionist', 'admin', 'manager']}>
          <RoomsManagement />
        </PrivateRoute>
      } />
      <Route path="/quick-checkin" element={
        <PrivateRoute allowedRoles={['receptionist']}>
          <PlaceholderPage title="Quick Check-in" />
        </PrivateRoute>
      } />
      <Route path="/reports" element={
        <PrivateRoute allowedRoles={['manager', 'admin']}>
          <ReportsPage />
        </PrivateRoute>
      } />
      <Route path="/users" element={
        <PrivateRoute allowedRoles={['admin']}>
          <UserManagement />
        </PrivateRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<CatchAllRoute />} />
    </Routes>
  );
}

export default App;
