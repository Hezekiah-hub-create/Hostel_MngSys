import { useEffect, useState, forwardRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHotel } from '../context/HotelContext';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { FiLogOut, FiCalendar, FiBriefcase, FiEdit, FiX, FiClock } from 'react-icons/fi';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const { bookings, fetchBookings, updateBooking } = useHotel();
  const navigate = useNavigate();
  const [editingBooking, setEditingBooking] = useState(null);
  const [newStartDate, setNewStartDate] = useState(null);
  const [newEndDate, setNewEndDate] = useState(null);
  const [diningReservations, setDiningReservations] = useState([]);
  const [loadingDining, setLoadingDining] = useState(true);


  useEffect(() => {
    fetchBookings();
    fetchDiningReservations();
  }, [fetchBookings]);

  const fetchDiningReservations = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/dining/my-reservations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDiningReservations(data);
    } catch (error) {
      console.error('Failed to fetch dining reservations', error);
    } finally {
      setLoadingDining(false);
    }
  };

  const handleCancelDining = async (id) => {
    if (window.confirm('Are you sure you want to cancel this table reservation?')) {
      try {
        await axios.delete(`http://localhost:5000/api/dining/reserve/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchDiningReservations();
      } catch (error) {
        alert('Failed to cancel reservation');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const userBookings = bookings.filter(b => b.user === user?._id || (b.user && b.user._id === user?._id));

  const handleEditClick = (booking) => {
    setEditingBooking(booking);
    setNewStartDate(new Date(booking.checkInDate));
    setNewEndDate(new Date(booking.checkOutDate));
  };

  const calculateNewPrice = () => {
    if (!newStartDate || !newEndDate || !editingBooking?.room) return 0;
    const diff = newEndDate - newStartDate;
    const nights = Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
    return editingBooking.room.price * nights;
  };

  const handleUpdateBooking = async () => {
    try {
      const totalPrice = calculateNewPrice();
      await updateBooking(editingBooking._id, newStartDate, newEndDate, totalPrice);
      setEditingBooking(null);
      alert('Your stay duration has been successfully updated.');
    } catch (err) {
      alert(err);
    }
  };

  const CustomDateInput = forwardRef(({ value, onClick, label }, ref) => (
    <div style={{ width: '100%' }}>
      <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{label}</label>
      <div 
        className="custom-datepicker-input" 
        onClick={onClick} 
        ref={ref}
        style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', color: '#fff', cursor: 'pointer' }}
      >
        <FiClock style={{ color: 'var(--primary-color)' }} />
        {value}
      </div>
    </div>
  ));
  CustomDateInput.displayName = 'CustomDateInput';


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', paddingBottom: '8rem' }}>

      {/* Hero Section - Concierge Style */}
      <section style={{ 
        padding: '12rem 5% 8rem',
        background: 'linear-gradient(to bottom, rgba(5,5,5,0.4) 0%, var(--bg-color) 100%), url("https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80") center/cover no-repeat',
        position: 'relative'
      }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px' }} className="reveal">
           <h4 style={{ color: 'var(--primary-color)', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '1.5rem', fontSize: '0.8rem' }}>PERSONAL CONCIERGE</h4>
           <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#fff', marginBottom: '1rem', fontWeight: '400' }}>
              {getGreeting()}, <span style={{ fontStyle: 'italic', color: 'var(--primary-color)' }}>{user?.name?.split(' ')[0]}</span>
           </h1>
           <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', fontWeight: '300', letterSpacing: '1px' }}>Your curated journey with Colonial Grand awaits.</p>
        </div>
      </section>

      {/* Content Section - Reservation Cards */}
      <section style={{ padding: '0 5%', marginTop: '-4rem', position: 'relative', zIndex: 2 }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
           <h2 style={{ fontSize: '2.5rem', margin: 0, fontWeight: '400', color: '#fff' }}>Your <span style={{ fontStyle: 'italic', color: 'var(--primary-color)' }}>Itineraries</span></h2>
           <button className="btn-primary" onClick={() => navigate('/rooms')}>
              Book A New Experience
           </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(Min(100%, 450px), 1fr))', gap: '2rem' }}>
           {/* Room Bookings */}
           {userBookings.map(b => (
             <div key={b._id} className="glass-panel" style={{ padding: '0', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.1)', display: 'flex', flexWrap: 'wrap', minHeight: '240px' }}>
                <div style={{ flex: '1 1 180px', minHeight: '180px', backgroundImage: `url(${b.room?.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&w=800'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                   <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                         <div>
                            <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#fff', fontWeight: '500' }}>{b.room?.type || 'Luxury Suite'}</h3>
                            <span style={{ color: 'var(--primary-color)', fontSize: '0.75rem', letterSpacing: '1px' }}>ROOM {b.room?.roomNumber}</span>
                         </div>
                         <span style={{ 
                            padding: '0.4rem 0.8rem', borderRadius: '2px', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase',
                            background: b.status === 'Confirmed' ? 'rgba(92, 184, 92, 0.1)' : 'rgba(255,255,255,0.05)',
                            color: b.status === 'Confirmed' ? 'var(--success-color)' : '#aaa',
                            border: `1px solid ${b.status === 'Confirmed' ? 'var(--success-color)' : '#444'}`
                         }}>
                            {b.status}
                         </span>
                      </div>
                      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem' }}>
                         <div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Check In</div>
                            <div style={{ fontSize: '0.9rem', color: '#fff' }}>{new Date(b.checkInDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                         </div>
                         <div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Check Out</div>
                            <div style={{ fontSize: '0.9rem', color: '#fff' }}>{new Date(b.checkOutDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                         </div>
                      </div>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                      <div style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>GH₵ {b.totalPrice}</div>
                      {b.status === 'Confirmed' && (
                        <button 
                           onClick={() => handleEditClick(b)}
                           style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', opacity: 0.7 }}
                        >
                           <FiEdit /> Modify Stay
                        </button>
                      )}
                   </div>
                </div>
             </div>
           ))}

           {/* Dining Reservations */}
           {diningReservations.filter(r => r.status !== 'Cancelled').map(r => (
             <div key={r._id} className="glass-panel" style={{ padding: '0', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.1)', display: 'flex', flexWrap: 'wrap', minHeight: '240px' }}>
                <div style={{ flex: '1 1 180px', minHeight: '180px', backgroundImage: `url(${r.table?.imageUrl || 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                   <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                         <div>
                            <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#fff', fontWeight: '500' }}>Dinner Reservation</h3>
                            <span style={{ color: 'var(--primary-color)', fontSize: '0.75rem', letterSpacing: '1px' }}>TABLE {r.table?.tableNumber} • {r.table?.location}</span>
                         </div>
                         <span style={{ 
                            padding: '0.4rem 0.8rem', borderRadius: '2px', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase',
                            background: 'rgba(92, 184, 92, 0.1)',
                            color: 'var(--success-color)',
                            border: '1px solid var(--success-color)'
                         }}>
                            {r.status}
                         </span>
                      </div>
                      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem' }}>
                         <div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</div>
                            <div style={{ fontSize: '0.9rem', color: '#fff' }}>{new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                         </div>
                         <div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Time</div>
                            <div style={{ fontSize: '0.9rem', color: '#fff' }}>{r.time}</div>
                         </div>
                         <div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Guests</div>
                            <div style={{ fontSize: '0.9rem', color: '#fff' }}>{r.partySize}</div>
                         </div>
                      </div>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                      <button 
                         onClick={() => handleCancelDining(r._id)}
                         style={{ background: 'transparent', border: 'none', color: 'var(--danger-color)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', opacity: 0.7 }}
                      >
                         <FiX /> Cancel Table
                      </button>
                   </div>
                </div>
             </div>
           ))}

           {userBookings.length === 0 && diningReservations.length === 0 && (
             <div className="glass-panel" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem' }}>
                <FiBriefcase style={{ fontSize: '4rem', color: 'var(--primary-color)', opacity: 0.3, marginBottom: '2rem' }} />
                <h3 style={{ color: '#fff', fontWeight: '300' }}>Your Itinerary is empty.</h3>
                <button className="btn-secondary" onClick={() => navigate('/rooms')} style={{ marginTop: '2rem' }}>Begin Your Selection</button>
             </div>
           )}
        </div>
      </section>
      
      {/* Edit Booking Modal */}
      {editingBooking && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', 
          zIndex: 2000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' 
        }}>
          <div className="glass-panel animate-fade-in" style={{ maxWidth: '500px', width: '100%', padding: '3rem', position: 'relative', border: '1px solid var(--glass-border)' }}>
            <button 
              onClick={() => setEditingBooking(null)} 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.5rem' }}
            >
              <FiX />
            </button>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#fff' }}>Modify Your Stay</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
              Adjust your duration for the <span style={{ color: 'var(--primary-color)' }}>{editingBooking.room?.type}</span> (Room {editingBooking.room?.roomNumber}).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
              <DatePicker
                selected={newStartDate}
                onChange={(date) => {
                  setNewStartDate(date);
                  if (date >= newEndDate) {
                    setNewEndDate(new Date(new Date(date).setDate(date.getDate() + 1)));
                  }
                }}
                selectsStart
                startDate={newStartDate}
                endDate={newEndDate}
                minDate={new Date()}
                customInput={<CustomDateInput label="Arrival" />}
              />
              <DatePicker
                selected={newEndDate}
                onChange={(date) => setNewEndDate(date)}
                selectsEnd
                startDate={newStartDate}
                endDate={newEndDate}
                minDate={new Date(new Date(newStartDate).setDate(newStartDate.getDate() + 1))}
                customInput={<CustomDateInput label="Departure" />}
              />
            </div>

            <div style={{ background: 'rgba(212,175,55,0.05)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(212,175,55,0.1)' }}>
               <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>New Total Rate</div>
                  <div style={{ color: 'var(--primary-color)', fontSize: '1.8rem', fontWeight: '800' }}>GH₵ {calculateNewPrice()}</div>
               </div>
               <div style={{ textAlign: 'right', color: '#666', fontSize: '0.9rem' }}>
                  {editingBooking.room?.price} / night
               </div>
            </div>

            <button className="btn-primary" onClick={handleUpdateBooking} style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', fontSize: '1.1rem' }}>
               CONFIRM MODIFICATION
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
