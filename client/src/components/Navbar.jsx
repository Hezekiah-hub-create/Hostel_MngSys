import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiGrid, FiCalendar, FiUser, FiLogOut, FiHome, FiLayers, FiCoffee } from 'react-icons/fi';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHome = location.pathname === '/';
  const currentPath = location.pathname;

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (sectionId) => {
    if (isHome) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
    setIsMobileMenuOpen(false);
  };

  const navItemStyle = (path) => ({ 
    color: currentPath === path ? 'var(--primary-color)' : '#fff', 
    fontSize: '0.85rem', 
    fontWeight: '700', 
    textTransform: 'uppercase', 
    letterSpacing: '2px', 
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'color 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  });

  const mobileItemStyle = (path) => ({ 
    padding: '1.5rem 0', 
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)', 
    color: currentPath === path ? 'var(--primary-color)' : '#fff', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '0.8rem',
    fontSize: '0.95rem',
    cursor: 'pointer'
  });

  // Public nav links (guest, not logged in)
  const publicLinks = (
    <>
      <span onClick={() => navigate('/')} style={navItemStyle('/')} className="nav-link">
        Home
      </span>
      <span onClick={() => navigate('/rooms')} style={navItemStyle('/rooms')} className="nav-link">
        Collection
      </span>
      <span onClick={() => navigate('/gastronomy')} style={navItemStyle('/gastronomy')} className="nav-link">
        Gastronomy
      </span>
    </>
  );

  // Authenticated nav links (client logged in)
  const clientLinks = (
    <>
      <span onClick={() => navigate('/client-dashboard')} style={navItemStyle('/client-dashboard')} className="nav-link">
        <FiGrid size={14} /> Dashboard
      </span>
      <span onClick={() => navigate('/rooms')} style={navItemStyle('/rooms')} className="nav-link">
        <FiCalendar size={14} /> Book A Stay
      </span>
      <span onClick={() => navigate('/gastronomy')} style={navItemStyle('/gastronomy')} className="nav-link">
        <FiCoffee size={14} /> Dining
      </span>
    </>
  );

  // Public mobile links
  const publicMobileLinks = (
    <>
      <span onClick={() => { navigate('/'); setIsMobileMenuOpen(false); }} style={mobileItemStyle('/')}>
        <FiHome size={16} /> Home
      </span>
      <span onClick={() => { navigate('/rooms'); setIsMobileMenuOpen(false); }} style={mobileItemStyle('/rooms')}>
        <FiLayers size={16} /> Collection
      </span>
      <span onClick={() => { navigate('/gastronomy'); setIsMobileMenuOpen(false); }} style={mobileItemStyle('/gastronomy')}>
        <FiCoffee size={16} /> Gastronomy
      </span>
    </>
  );

  // Client mobile links
  const clientMobileLinks = (
    <>
      <span onClick={() => { navigate('/client-dashboard'); setIsMobileMenuOpen(false); }} style={mobileItemStyle('/client-dashboard')}>
        <FiGrid size={16} /> Dashboard
      </span>
      <span onClick={() => { navigate('/rooms'); setIsMobileMenuOpen(false); }} style={mobileItemStyle('/rooms')}>
        <FiCalendar size={16} /> Book A Stay
      </span>
      <span onClick={() => { navigate('/gastronomy'); setIsMobileMenuOpen(false); }} style={mobileItemStyle('/gastronomy')}>
        <FiCoffee size={16} /> Dining
      </span>
    </>
  );

  return (
    <nav style={{ 
      padding: '1.2rem 5%', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      background: 'rgba(10, 10, 10, 0.85)', 
      backdropFilter: 'blur(24px)', 
      borderBottom: '1px solid var(--glass-border)', 
      position: 'fixed', 
      width: '100%', 
      top: 0, 
      zIndex: 1000,
      gap: '1rem'
    }}>
      <h1 
        style={{ margin: 0, fontSize: 'clamp(1.2rem, 4vw, 1.8rem)', color: 'var(--primary-color)', cursor: 'pointer', letterSpacing: '3px', whiteSpace: 'nowrap' }} 
        onClick={() => navigate('/')}
      >
        COLONIAL GRAND
      </h1>
      
      {/* Desktop Menu */}
      <div className="desktop-menu">
        {user ? clientLinks : publicLinks}
        
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1.5rem', paddingLeft: '1.5rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ 
                width: '34px', height: '34px', borderRadius: '50%', 
                background: 'var(--gold-gradient)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#000', fontWeight: '800', fontSize: '0.8rem'
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: '#fff', fontSize: '0.85rem', fontWeight: '600', fontFamily: 'var(--font-family-body)' }}>
                {user.name?.split(' ')[0]}
              </span>
            </div>
            <span 
              onClick={handleLogout} 
              style={{ color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'color 0.3s' }}
              className="nav-link"
              onMouseOver={e => e.currentTarget.style.color = 'var(--danger-color)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <FiLogOut size={14} /> Sign Out
            </span>
          </div>
        ) : (
          <button 
            className="btn-primary" 
            onClick={() => navigate('/login')} 
            style={{ padding: '0.7rem 2rem', marginLeft: '1.5rem', borderRadius: '30px', fontWeight: 'bold' }}
          >
            RESERVE NOW
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        style={{ color: 'var(--primary-color)' }}
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="mobile-dropdown" style={{ background: '#0a0a0a', padding: '1rem 0' }}>
          
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 0 2rem', borderBottom: '1px solid rgba(212,175,55,0.15)', marginBottom: '0.5rem' }}>
              <div style={{ 
                width: '42px', height: '42px', borderRadius: '50%', 
                background: 'var(--gold-gradient)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#000', fontWeight: '800', fontSize: '1rem'
              }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: '600', fontSize: '1rem' }}>{user.name}</div>
                <div style={{ color: 'var(--primary-color)', fontSize: '0.7rem', letterSpacing: '1px', fontFamily: 'var(--font-family-body)' }}>GUEST</div>
              </div>
            </div>
          )}

          {user ? clientMobileLinks : publicMobileLinks}

          <button 
            className={user ? "btn-secondary" : "btn-primary"}
            onClick={() => {
              if (user) { handleLogout(); } 
              else { navigate('/login'); setIsMobileMenuOpen(false); }
            }} 
            style={{ marginTop: '1.5rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {user ? <><FiLogOut /> SIGN OUT</> : 'RESERVE NOW'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
