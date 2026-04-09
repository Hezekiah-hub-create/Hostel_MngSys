import { useEffect, useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { FiUserPlus, FiCheckCircle, FiXCircle, FiGrid, FiList, FiClock, FiActivity } from 'react-icons/fi';

const ReceptionistDashboard = () => {
  const { rooms, bookings, fetchRooms, fetchBookings, updateBookingStatus, handleWalkIn } = useHotel();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Walk-in form state
  const [formData, setFormData] = useState({ name: '', email: '', password: 'password123' });

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, [fetchRooms, fetchBookings]);

  // Stats
  const today = new Date().toDateString();
  const todayBookings = bookings.filter(b => new Date(b.checkInDate).toDateString() === today);
  const availableRooms = rooms.filter(r => r.status === 'Available').length;
  const occupancyRate = rooms.length ? Math.round((rooms.length - availableRooms) / rooms.length * 100) : 0;

  const onRegisterWalkIn = async (e) => {
    e.preventDefault();
    try {
      await handleWalkIn(formData.name, formData.email, formData.password);
      alert('Walk-in registered successfully. Default password is password123.');
      setFormData({ name: '', email: '', password: 'password123' });
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

  return (
    <div className="animate-fade-in">
      {/* Top Stats */}
      <div className="flex-between mb-4">
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Front Desk Dashboard</h1>
          <p className="text-muted">Manage arrivals, walk-ins, and active room assignments.</p>
        </div>
      </div>

      <div className="stats-grid mb-4">
        <div className="stat-card">
          <FiUserPlus />
          <span className="stat-number">{todayBookings.length}</span>
          <span>Today's Arrivals</span>
        </div>
        <div className="stat-card">
          <FiActivity />
          <span className="stat-number">{occupancyRate}%</span>
          <span>Occupancy</span>
        </div>
        <div className="stat-card">
          <FiGrid />
          <span className="stat-number">{availableRooms}</span>
          <span>Available Rooms</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-nav">
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>Bookings</button>
        <button className={`tab-btn ${activeTab === 'walkin' ? 'active' : ''}`} onClick={() => setActiveTab('walkin')}>Walk-in Register</button>
        <button className={`tab-btn ${activeTab === 'rooms' ? 'active' : ''}`} onClick={() => setActiveTab('rooms')}>Grid View</button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid-2">
          <div className="glass-panel">
            <h2 className="mb-4">Quick Actions</h2>
            <div className="quick-actions-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <button className="quick-action-btn primary" onClick={() => setActiveTab('walkin')}>Register Walk-in Guest</button>
              <button className="quick-action-btn" onClick={() => setActiveTab('bookings')}>Manage Bookings</button>
              <button className="quick-action-btn" onClick={() => setActiveTab('rooms')}>Room Grid</button>
              <button className="quick-action-btn">Generate Report</button>
            </div>
          </div>
          <div className="glass-panel">
            <h2 className="mb-4">Recent Arrivings</h2>
            <div className="activity-feed">
              {bookings.slice(0, 4).map(b => (
                <div key={b._id} className="activity-item">
                  <span className="activity-icon primary"></span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{b.user?.name || 'Unknown'}</div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>Room {b.room?.roomNumber}</div>
                  </div>
                  <span className={`status-badge ${b.status.toLowerCase()}`}>{b.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="glass-panel">
          <div className="table-header">
            <h2>Today's Bookings ({bookings.length})</h2>
            <button className="btn-secondary">Export Schedule</button>
          </div>
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Guest Profile</th>
                  <th>Room</th>
                  <th>Check In / Out</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id}>
                    <td><strong>{b.user?.name}</strong></td>
                    <td>{b.room?.roomNumber}</td>
                    <td className="text-muted">
                      {new Date(b.checkInDate).toLocaleDateString()} - {new Date(b.checkOutDate).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`status-badge ${b.status.toLowerCase()}`}>{b.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {b.status === 'Confirmed' && (
                          <button className="btn-small primary" onClick={() => handleStatusChange(b._id, 'CheckedIn')}>
                            Check-in Key
                          </button>
                        )}
                        {b.status === 'CheckedIn' && (
                          <button className="btn-small secondary" onClick={() => handleStatusChange(b._id, 'CheckedOut')}>
                            Check-out
                          </button>
                        )}
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
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2>New Walk-in Registration</h2>
            <p className="text-muted">Create a guest profile. They will be mandated to update their password upon first login.</p>
          </div>
          <form onSubmit={onRegisterWalkIn}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Temporary Security Code</label>
              <input type="text" value={formData.password} disabled style={{ opacity: 0.7 }} />
            </div>
            <button type="submit" className="btn-primary full-width" style={{ marginTop: '1rem' }}>Complete Registration</button>
          </form>
        </div>
      )}

      {activeTab === 'rooms' && (
        <div className="rooms-grid">
          {rooms.map(room => (
            <div key={room._id} className="room-card">
              <div className="room-header">
                <h3>{room.roomNumber}</h3>
                <span className={`room-status ${room.status.toLowerCase()}`}>{room.status}</span>
              </div>
              <p className="room-type">{room.type} <span style={{ margin: '0 0.5rem' }}>•</span> ${room.price}/night</p>
              <div className="room-actions">
                {room.status === 'Available' && <button className="btn-small primary">Assign Room</button>}
                {room.status !== 'Available' && <button className="btn-small">View Folio</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceptionistDashboard;
