import { useEffect, useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { 
  FiUserPlus, FiCheckCircle, FiXCircle, FiGrid, FiList, 
  FiClock, FiActivity, FiRefreshCw, FiHome, FiCoffee 
} from 'react-icons/fi';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div style={{
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderTop: `3px solid ${color || 'var(--primary-color)'}`,
    borderRadius: '16px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666', fontWeight: 600 }}>{label}</span>
      <Icon style={{ color: color || 'var(--primary-color)', fontSize: '1.1rem', opacity: 0.8 }} />
    </div>
    <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#fff' }}>{value}</div>
    {sub && <div style={{ fontSize: '0.75rem', color: '#555' }}>{sub}</div>}
  </div>
);

const ReceptionistDashboard = () => {
  const { 
    rooms, bookings, fetchRooms, fetchBookings, 
    updateBookingStatus, handleWalkIn, runAutoCheckout 
  } = useHotel();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isCleaning, setIsCleaning] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: 'password123' });

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, [fetchRooms, fetchBookings]);

  // Logic/Stats
  const today = new Date().toDateString();
  const todayArrivals = bookings.filter(b => b.status === 'Confirmed' && new Date(b.checkInDate).toDateString() === today).length;
  const inHouseGuests = bookings.filter(b => b.status === 'CheckedIn').length;
  const availableRooms = rooms.filter(r => r.status === 'Available').length;
  const pendingCheckouts = bookings.filter(b => b.status === 'CheckedIn' && new Date(b.checkOutDate) <= new Date()).length;

  const onRegisterWalkIn = async (e) => {
    e.preventDefault();
    try {
      await handleWalkIn(formData.name, formData.email, formData.password);
      alert('Walk-in registered successfully. Default password is password123.');
      setFormData({ name: '', email: '', password: 'password123' });
      setActiveTab('bookings');
    } catch (err) {
      alert(err);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
    } catch (err) {
      alert(err);
    }
  };

  const handleManualCleanup = async () => {
    if (!window.confirm('This will automatically check out any guests whose stay has elapsed. Continue?')) return;
    
    setIsCleaning(true);
    try {
      const result = await runAutoCheckout();
      alert(`System Cleanup Successful!\n- Bookings Updated: ${result.bookingsUpdated}\n- Rooms Made Available: ${result.roomsFreed}\n- Dining Completed: ${result.diningUpdated}`);
    } catch (err) {
      alert(err);
    } finally {
      setIsCleaning(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ color: '#fff' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 700, margin: 0, letterSpacing: '-1px' }}>
            Front <span style={{ color: 'var(--primary-color)', fontStyle: 'italic' }}>Desk</span>
          </h1>
          <p className="text-muted" style={{ marginTop: '0.4rem' }}>Managing the heart of Colonial Grand.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button 
            onClick={handleManualCleanup}
            disabled={isCleaning}
            style={{ 
              background: 'rgba(212,175,55,0.08)', color: 'var(--primary-color)', 
              border: '1px solid rgba(212,175,55,0.3)', padding: '0.7rem 1.2rem', 
              borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer'
            }}
          >
            <FiRefreshCw className={isCleaning ? 'spin' : ''} /> {isCleaning ? 'Processing...' : 'System Cleanup'}
          </button>
          <button 
            onClick={() => setActiveTab('walkin')}
            className="btn-primary" 
            style={{ borderRadius: '10px', padding: '0.7rem 1.5rem' }}
          >
            <FiUserPlus /> Walk-in Guest
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <StatCard icon={FiCheckCircle} label="Today's Arrivals" value={todayArrivals} sub="Confirmed bookings" />
        <StatCard icon={FiActivity} label="In-House" value={inHouseGuests} color="#3498db" sub="Active stays" />
        <StatCard icon={FiClock} label="Pending Checkout" value={pendingCheckouts} color={pendingCheckouts > 0 ? '#ef4444' : '#10b981'} sub="Auto-cleanup available" />
        <StatCard icon={FiHome} label="Available Rooms" value={availableRooms} color="#10b981" sub={`Out of ${rooms.length} total`} />
      </div>

      {/* Navigation Tabs */}
      <div className="tab-nav" style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
        {['overview', 'bookings', 'rooms', 'walkin'].map((tab) => (
          <button 
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`} 
            onClick={() => setActiveTab(tab)}
            style={{ 
              background: 'transparent', border: 'none', padding: '0.8rem 1.5rem', 
              color: activeTab === tab ? 'var(--primary-color)' : '#666',
              fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
              borderBottom: activeTab === tab ? '2px solid var(--primary-color)' : 'none',
              textTransform: 'capitalize'
            }}
          >
            {tab === 'walkin' ? 'New Registration' : tab}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="tab-content" style={{ minHeight: '400px' }}>
        
        {activeTab === 'overview' && (
          <div className="grid-2">
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><FiList /> Recent Movements</h3>
              <div className="activity-feed">
                {bookings.slice(0, 5).map(b => (
                  <div key={b._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{b.user?.name || 'Guest'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#555' }}>Room {b.room?.roomNumber} • {b.room?.type}</div>
                    </div>
                    <span className={`status-badge ${b.status.toLowerCase()}`} style={{ fontSize: '0.65rem' }}>{b.status}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}><FiActivity /> Front Desk Quick Tools</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button className="quick-action-btn" onClick={() => setActiveTab('walkin')} style={{ height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem' }}>
                  <FiUserPlus size={20} />
                  <span>Walk-in</span>
                </button>
                <button className="quick-action-btn" onClick={() => setActiveTab('rooms')} style={{ height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem' }}>
                  <FiGrid size={20} />
                  <span>Room Grid</span>
                </button>
                <button className="quick-action-btn" onClick={handleManualCleanup} style={{ height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem', gridColumn: 'span 2' }}>
                  <FiRefreshCw size={20} />
                  <span>Run System Cleanup (Auto-Checkout)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>Active Reservations ({bookings.length})</h2>
            </div>
            <div className="data-table">
              <table style={{ width: '100%' }}>
                <thead>
                  <tr style={{ color: 'var(--primary-color)', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <th style={{ paddingBottom: '1rem' }}>Guest</th>
                    <th style={{ paddingBottom: '1rem' }}>Room</th>
                    <th style={{ paddingBottom: '1rem' }}>Duration</th>
                    <th style={{ paddingBottom: '1rem' }}>Status</th>
                    <th style={{ paddingBottom: '1rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '1.2rem 0' }}>
                        <div style={{ fontWeight: 600 }}>{b.user?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#555' }}>{b.user?.email}</div>
                      </td>
                      <td>
                        <div style={{ color: '#fff' }}>#{b.room?.roomNumber}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--primary-color)' }}>{b.room?.type}</div>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#aaa' }}>
                        {new Date(b.checkInDate).toLocaleDateString()} - {new Date(b.checkOutDate).toLocaleDateString()}
                      </td>
                      <td>
                        <span className={`status-badge ${b.status.toLowerCase()}`}>{b.status}</span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          {b.status === 'Confirmed' && (
                            <button className="btn-small primary" onClick={() => handleStatusChange(b._id, 'CheckedIn')}>Check-in</button>
                          )}
                          {b.status === 'CheckedIn' && (
                            <button className="btn-small secondary" onClick={() => handleStatusChange(b._id, 'CheckedOut')}>Check-out</button>
                          )}
                          <button className="btn-small" style={{ opacity: 0.5 }}>Details</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'walkin' && (
          <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-color)' }}>Walk-in Registration</h2>
              <p className="text-muted">Instant guest profile creation for on-site arrivals.</p>
            </div>
            <form onSubmit={onRegisterWalkIn}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', color: '#aaa' }}>Full Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  required 
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', color: '#aaa' }}>Email Address</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  required 
                  style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px', color: '#fff' }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.85rem', color: '#aaa' }}>Temporary Access Key</label>
                <input 
                  type="text" 
                  value={formData.password} 
                  disabled 
                  style={{ width: '100%', background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.1)', padding: '1rem', borderRadius: '8px', color: 'var(--primary-color)', fontWeight: 700 }} 
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', borderRadius: '12px' }}>
                Complete Registration
              </button>
            </form>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="rooms-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {rooms.map(room => (
              <div key={room._id} className="glass-panel" style={{ padding: '1.5rem', border: `1px solid ${room.status === 'Available' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>{room.roomNumber}</h3>
                  <span className={`status-badge ${room.status.toLowerCase()}`} style={{ fontSize: '0.6rem' }}>{room.status}</span>
                </div>
                <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '1.5rem' }}>{room.type} • GH₵{room.price}</p>
                <button className={`btn-small ${room.status === 'Available' ? 'primary' : ''}`} style={{ width: '100%' }}>
                  {room.status === 'Available' ? 'Assign Guest' : 'View Status'}
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        @media (max-width: 900px) { .grid-2 { grid-template-columns: 1fr; } }
        .quick-action-btn {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: #fff;
          cursor: pointer;
          transition: all 0.2s;
          font-weight: 600;
        }
        .quick-action-btn:hover {
          background: rgba(212,175,55,0.05);
          border-color: var(--primary-color);
          color: var(--primary-color);
        }
      `}</style>
    </div>
  );
};

export default ReceptionistDashboard;
