import { useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import { FiUsers, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

const ManagerDashboard = () => {
  const { rooms, bookings, fetchRooms, fetchBookings } = useHotel();

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, []);

  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === 'Available').length;
  const bookedRooms = rooms.filter(r => r.status === 'Booked').length;
  const revenue = bookings.reduce((acc, curr) => curr.status === 'CheckedOut' ? acc + curr.totalPrice : acc, 0);

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '2rem' }}>Hotel Analytics</h1>

      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <FiTrendingUp size={40} color="var(--primary-color)" />
          <h2 style={{ fontSize: '2.5rem', margin: '1rem 0 0.5rem' }}>{totalRooms}</h2>
          <p style={{ color: 'var(--text-muted)' }}>Total Rooms</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <FiCheckCircle size={40} color="var(--success-color)" />
          <h2 style={{ fontSize: '2.5rem', margin: '1rem 0 0.5rem' }}>{availableRooms}</h2>
          <p style={{ color: 'var(--text-muted)' }}>Available Rooms</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <FiUsers size={40} color="var(--primary-color)" />
          <h2 style={{ fontSize: '2.5rem', margin: '1rem 0 0.5rem' }}>${revenue}</h2>
          <p style={{ color: 'var(--text-muted)' }}>Realized Revenue</p>
        </div>
      </div>

      <div className="glass-panel">
        <h2>Occupancy Overview</h2>
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Occupancy Rate</span>
            <span>{totalRooms ? Math.round((bookedRooms / totalRooms) * 100) : 0}%</span>
          </div>
          <div style={{ width: '100%', background: 'rgba(0,0,0,0.5)', height: '10px', borderRadius: '5px' }}>
             <div style={{ width: `${totalRooms ? (bookedRooms / totalRooms) * 100 : 0}%`, background: 'var(--primary-color)', height: '10px', borderRadius: '5px' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
