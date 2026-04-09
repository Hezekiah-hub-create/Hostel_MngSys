import { useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import { FiUsers, FiSettings, FiShield, FiDatabase, FiAlertCircle } from 'react-icons/fi';

const AdminDashboard = () => {
  const { users, rooms, bookings, fetchUsers, fetchRooms, fetchBookings } = useHotel();

  useEffect(() => {
    fetchUsers();
    fetchRooms();
    fetchBookings();
  }, [fetchUsers, fetchRooms, fetchBookings]);

  // Stats
  const totalUsers = users.length;
  const staffUsers = users.filter(u => ['admin', 'manager', 'receptionist'].includes(u.role)).length;
  const needsReset = users.filter(u => u.needsPasswordChange).length;
  const totalBookings = bookings.length;
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === 'Available').length;

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-4">
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Admin Dashboard</h1>
          <p className="text-muted">System overview and user management.</p>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="stats-grid mb-4">
        <div className="stat-card">
          <FiUsers />
          <span className="stat-number">{totalUsers}</span>
          <span>Total Users</span>
        </div>
        <div className="stat-card">
          <FiShield />
          <span className="stat-number">{staffUsers}</span>
          <span>Staff Access</span>
        </div>
        <div className="stat-card warning">
          <FiAlertCircle />
          <span className="stat-number">{needsReset}</span>
          <span>Needs PW Reset</span>
        </div>
        <div className="stat-card">
          <FiDatabase />
          <span className="stat-number">{totalBookings}</span>
          <span>Records Logged</span>
        </div>
      </div>

      <div className="grid-2">
        {/* Users Management */}
        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <div className="table-header">
            <h2>Users ({totalUsers})</h2>
            <button className="btn-primary">Add User</button>
          </div>
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 8).map(u => (
                  <tr key={u._id}>
                    <td>
                      <div>{u.name}</div>
                      <div className="text-muted" style={{ fontSize: '0.8rem' }}>{u.email}</div>
                    </td>
                    <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                    <td>
                      {u.needsPasswordChange ? 
                        <span className="status-badge pending">Reset Req</span> : 
                        <span className="status-badge confirmed">Active</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn-small secondary">Reset</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rooms Management */}
        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <div className="table-header">
            <h2>Rooms ({totalRooms})</h2>
            <button className="btn-secondary">View All</button>
          </div>
          <div className="data-table">
            <table>
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {rooms.slice(0, 8).map(room => (
                  <tr key={room._id}>
                    <td><strong>{room.roomNumber}</strong></td>
                    <td className="text-muted">{room.type}</td>
                    <td><span className={`status-badge ${room.status.toLowerCase()}`}>{room.status}</span></td>
                    <td>${room.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* System Activity */}
      <div className="glass-panel">
        <div className="table-header">
          <h2>Recent Activity</h2>
          <select className="form-input" style={{ width: 'auto', padding: '0.5rem 1rem' }}>
            <option>Last 24h</option>
            <option>Last 7 days</option>
          </select>
        </div>
        <div className="activity-feed">
          <div className="activity-item">
            <span className="activity-icon success"></span>
            <span>Room 101 assigned to John Doe</span>
            <span className="activity-time">2min ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon primary"></span>
            <span>New booking #123 confirmed</span>
            <span className="activity-time">15min ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon warning"></span>
            <span>User needsPasswordChange=true</span>
            <span className="activity-time">1hr ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
