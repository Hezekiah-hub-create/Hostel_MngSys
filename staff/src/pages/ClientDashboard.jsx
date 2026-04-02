import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHotel } from '../context/HotelContext';

const ClientDashboard = () => {
  const { user } = useAuth();
  const { rooms, bookings, fetchRooms, fetchBookings, bookRoom } = useHotel();
  const [activeTab, setActiveTab] = useState('browse');

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, []);

  const handleBook = async (roomId, price) => {
    try {
      // Mocking 1 day stay for simplicity
      const checkIn = new Date();
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + 1);
      
      await bookRoom(roomId, checkIn, checkOut, price);
      alert('Room booked successfully!');
    } catch (err) {
      alert(err);
    }
  };

  const userBookings = bookings.filter(b => b.user === user._id || (b.user && b.user._id === user._id));

  return (
    <div className="animate-fade-in">
      <div className="flex-between">
        <h1>Welcome, {user.name}</h1>
        <div>
           <button className={`btn-secondary ${activeTab === 'browse' ? 'active' : ''}`} onClick={() => setActiveTab('browse')} style={{ marginRight: '1rem' }}>Browse Rooms</button>
           <button className={`btn-secondary ${activeTab === 'my-bookings' ? 'active' : ''}`} onClick={() => setActiveTab('my-bookings')}>My Bookings</button>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        {activeTab === 'browse' && (
          <div className="grid-3">
             {rooms.map(room => (
               <div key={room._id} className="glass-panel">
                 <h3>Room {room.roomNumber} ({room.type})</h3>
                 <p style={{ color: 'var(--primary-color)', fontSize: '1.2rem', margin: '0.5rem 0' }}>${room.price} / night</p>
                 <p style={{ color: 'var(--text-muted)' }}>Status: <span style={{ color: room.status === 'Available' ? 'var(--success-color)' : 'var(--danger-color)' }}>{room.status}</span></p>
                 <div style={{ margin: '1rem 0' }}>
                   {room.amenities.map(a => <span key={a} style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', marginRight: '0.5rem', fontSize: '0.8rem' }}>{a}</span>)}
                 </div>
                 {room.status === 'Available' && (
                   <button className="btn-primary" style={{ width: '100%' }} onClick={() => handleBook(room._id, room.price)}>Book Now</button>
                 )}
               </div>
             ))}
          </div>
        )}

        {activeTab === 'my-bookings' && (
          <div className="glass-panel">
             <h3>Booking History</h3>
             <table style={{ width: '100%', textAlign: 'left', marginTop: '1rem', borderCollapse: 'collapse' }}>
               <thead>
                 <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                   <th style={{ padding: '1rem 0' }}>Room</th>
                   <th>Check In</th>
                   <th>Check Out</th>
                   <th>Status</th>
                   <th>Price</th>
                 </tr>
               </thead>
               <tbody>
                  {userBookings.map(b => (
                    <tr key={b._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem 0' }}>{b.room?.roomNumber || 'N/A'}</td>
                      <td>{new Date(b.checkInDate).toLocaleDateString()}</td>
                      <td>{new Date(b.checkOutDate).toLocaleDateString()}</td>
                      <td style={{ color: 'var(--primary-color)' }}>{b.status}</td>
                      <td>${b.totalPrice}</td>
                    </tr>
                  ))}
                  {userBookings.length === 0 && <tr><td colSpan="5" style={{ padding: '1rem 0' }}>No bookings found.</td></tr>}
               </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
