import { useEffect, useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { FiUserPlus, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const ReceptionistDashboard = () => {
  const { rooms, bookings, fetchRooms, fetchBookings, updateBookingStatus, handleWalkIn } = useHotel();
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Walk-in form state
  const [formData, setFormData] = useState({ name: '', email: '', password: 'password123' });

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, [fetchRooms, fetchBookings]);

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
      alert(`Booking marked as ${newStatus}`);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1>Front Desk Operations</h1>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button className={`btn-secondary ${activeTab === 'bookings' ? 'active' : ''}`} onClick={() => setActiveTab('bookings')}>Manage Bookings</button>
        <button className={`btn-secondary ${activeTab === 'walkin' ? 'active' : ''}`} onClick={() => setActiveTab('walkin')}>Register Walk-in</button>
        <button className={`btn-secondary ${activeTab === 'rooms' ? 'active' : ''}`} onClick={() => setActiveTab('rooms')}>Room Status</button>
      </div>

      {activeTab === 'bookings' && (
        <div className="glass-panel">
          <h2>Today's Bookings</h2>
          <table style={{ width: '100%', textAlign: 'left', marginTop: '1rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <th style={{ padding: '1rem 0' }}>Client</th>
                <th>Room</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '1rem 0' }}>{b.user?.name}</td>
                  <td>{b.room?.roomNumber}</td>
                  <td>{new Date(b.checkInDate).toLocaleDateString()}</td>
                  <td>{new Date(b.checkOutDate).toLocaleDateString()}</td>
                  <td style={{ color: 'var(--primary-color)' }}>{b.status}</td>
                  <td>
                    {b.status === 'Confirmed' && (
                      <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleStatusChange(b._id, 'CheckedIn')}>
                        Check-in
                      </button>
                    )}
                    {b.status === 'CheckedIn' && (
                      <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleStatusChange(b._id, 'CheckedOut')}>
                        Check-out
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && <tr><td colSpan="6" style={{ padding: '1rem 0' }}>No bookings found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'walkin' && (
        <div className="glass-panel" style={{ maxWidth: '500px' }}>
          <h2><FiUserPlus /> Register New Guest</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Walk-in guests are forced to change their password on first login.</p>
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
              <label>Temporary Password</label>
              <input type="text" value={formData.password} disabled style={{ color: 'var(--text-muted)' }} />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Register Walk-in</button>
          </form>
        </div>
      )}

      {activeTab === 'rooms' && (
        <div className="grid-3">
          {rooms.map(room => (
            <div key={room._id} className="glass-panel">
              <h3>{room.roomNumber} ({room.type})</h3>
              <p>Status: <span style={{ color: room.status === 'Available' ? 'var(--success-color)' : 'var(--danger-color)' }}>{room.status}</span></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceptionistDashboard;
