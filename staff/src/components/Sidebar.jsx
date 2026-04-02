import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiSettings, FiLogOut, FiUsers, FiBook, FiTrendingUp, FiCoffee } from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const renderLinks = () => {
    switch (user.role) {
      case 'client':
        return (
          <>
            <div className={`sidebar-item ${isActive('/client-dashboard')}`} onClick={() => navigate('/client-dashboard')}>
              <FiHome /> <span>Dashboard</span>
            </div>
          </>
        );
      case 'receptionist':
        return (
          <>
            <div className={`sidebar-item ${isActive('/receptionist-dashboard')}`} onClick={() => navigate('/receptionist-dashboard')}>
              <FiHome /> <span>Front Desk</span>
            </div>
            {/* Optional other links can be added based on routing structure */}
          </>
        );
      case 'manager':
        return (
          <>
            <div className={`sidebar-item ${isActive('/manager-dashboard')}`} onClick={() => navigate('/manager-dashboard')}>
              <FiTrendingUp /> <span>Analytics</span>
            </div>
            <div className={`sidebar-item ${isActive('/dining-management')}`} onClick={() => navigate('/dining-management')}>
              <FiCoffee /> <span>Dining Management</span>
            </div>
          </>
        );
      case 'admin':
        return (
          <>
            <div className={`sidebar-item ${isActive('/admin-dashboard')}`} onClick={() => navigate('/admin-dashboard')}>
              <FiSettings /> <span>System Admin</span>
            </div>
            <div className={`sidebar-item ${isActive('/dining-management')}`} onClick={() => navigate('/dining-management')}>
              <FiCoffee /> <span>Dining Management</span>
            </div>
          </>
        );
      default: return null;
    }
  };

  return (
    <div className="sidebar animate-fade-in">
      <div className="logo">HMS Grand</div>
      <div className="sidebar-nav">
        {renderLinks()}
      </div>
      <div className="sidebar-bottom">
        <div className="sidebar-item" style={{ marginBottom: '1rem' }}>
          <FiUsers /> <span>{user.name} ({user.role})</span>
        </div>
        <div className="sidebar-item text-danger" onClick={handleLogout} style={{ color: 'var(--danger-color)' }}>
          <FiLogOut /> <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
