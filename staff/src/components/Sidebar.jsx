import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiSettings, FiLogOut, FiUsers, FiBook, FiTrendingUp, FiCoffee, FiCheckCircle, FiShield, FiBarChart2 } from 'react-icons/fi';

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
            <div className={`sidebar-item ${isActive('/guests')}`} onClick={() => navigate('/guests')}>
              <FiUsers /> <span>Guests</span>
            </div>
            <div className={`sidebar-item ${isActive('/rooms')}`} onClick={() => navigate('/rooms')}>
              <FiBook /> <span>Rooms</span>
            </div>
            <div className={`sidebar-item ${isActive('/quick-checkin')}`} onClick={() => navigate('/quick-checkin')}>
              <FiCheckCircle /> <span>Quick Check-in</span>
            </div>
          </>
        );
      case 'manager':
        return (
          <>
            <div className={`sidebar-item ${isActive('/manager-dashboard')}`} onClick={() => navigate('/manager-dashboard')}>
              <FiBarChart2 /> <span>Analytics</span>
            </div>
            <div className={`sidebar-item ${isActive('/dining-management')}`} onClick={() => navigate('/dining-management')}>
              <FiCoffee /> <span>Dining</span>
            </div>
            <div className={`sidebar-item ${isActive('/reports')}`} onClick={() => navigate('/reports')}>
              <FiTrendingUp /> <span>Reports</span>
            </div>
            <div className={`sidebar-item ${isActive('/guests')}`} onClick={() => navigate('/guests')}>
              <FiUsers /> <span>Guests</span>
            </div>
          </>
        );
      case 'admin':
        return (
          <>
            <div className={`sidebar-item ${isActive('/admin-dashboard')}`} onClick={() => navigate('/admin-dashboard')}>
              <FiShield /> <span>System Admin</span>
            </div>
            <div className={`sidebar-item ${isActive('/dining-management')}`} onClick={() => navigate('/dining-management')}>
              <FiCoffee /> <span>Dining Management</span>
            </div>
            <div className={`sidebar-item ${isActive('/users')}`} onClick={() => navigate('/users')}>
              <FiUsers /> <span>Users</span>
            </div>
            <div className={`sidebar-item ${isActive('/rooms')}`} onClick={() => navigate('/rooms')}>
              <FiBook /> <span>Rooms</span>
            </div>
            <div className={`sidebar-item ${isActive('/reports')}`} onClick={() => navigate('/reports')}>
              <FiBarChart2 /> <span>Reports & Logs</span>
            </div>
          </>
        );
      default: return null;
    }
  };

  return (
    <div className="sidebar animate-fade-in">
      <h1 className="logo">COLONIAL GRAND</h1>
      <div className="sidebar-nav">
        {renderLinks()}
      </div>
      <div className="sidebar-bottom">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-input)', borderRadius: '12px', border: '1px solid var(--glass-border)', marginBottom: '1rem' }}>
          <div style={{ 
            width: '42px', height: '42px', borderRadius: '50%', 
            background: 'var(--gold-gradient)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#000', fontWeight: '800', fontSize: '1.25rem'
          }}>
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{user.name}</span>
            <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--gold-primary)', fontWeight: '600', letterSpacing: '0.05em' }}>{user.role}</span>
          </div>
        </div>
        <div className="sidebar-item" onClick={handleLogout} style={{ color: 'var(--status-danger)', padding: '1rem', justifyContent: 'center' }}>
          <FiLogOut /> <span>Sign Out</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
