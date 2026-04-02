import { useEffect } from 'react';
import { useHotel } from '../context/HotelContext';

const AdminDashboard = () => {
  const { users, rooms, bookings, fetchUsers, fetchRooms, fetchBookings } = useHotel();

  useEffect(() => {
    fetchUsers();
    fetchRooms();
    fetchBookings();
  }, []);

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '2rem' }}>System Administration</h1>

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h2>System Users</h2>
        <table style={{ width: '100%', textAlign: 'left', marginTop: '1rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <th style={{ padding: '1rem 0' }}>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>PW Reset Needed</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '1rem 0' }}>{u.name}</td>
                <td>{u.email}</td>
                <td style={{ textTransform: 'capitalize', color: 'var(--primary-color)' }}>{u.role}</td>
                <td>{u.needsPasswordChange ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass-panel">
        <h2>All Rooms Status</h2>
        <div className="grid-3" style={{ marginTop: '1rem' }}>
          {rooms.map(room => (
            <div key={room._id} style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
              <h3>{room.roomNumber} ({room.type})</h3>
              <p>Status: <span style={{ color: room.status === 'Available' ? 'var(--success-color)' : 'var(--danger-color)' }}>{room.status}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
