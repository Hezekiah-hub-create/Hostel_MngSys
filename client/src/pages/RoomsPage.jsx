import { useState, useEffect, forwardRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHotel } from '../context/HotelContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiX, FiCheck, FiWifi, FiTv, FiCoffee, FiWind, FiSunset, FiClock, FiShield, FiArrowRight, FiMapPin, FiPhone, FiMail, FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filter, setFilter] = useState('All');
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { bookRoom } = useHotel();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get('http://localhost:5001/api/rooms');
        setRooms(data);
      } catch (error) {
        console.error('Failed to fetch rooms', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const closeModal = () => setSelectedRoom(null);

  const calculateNights = () => {
    if (!startDate || !endDate) return 1;
    const diff = endDate - startDate;
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
  };

  const handleBookRoom = async (roomId, pricePerNight) => {
    if (!user) {
      navigate('/login');
      return;
    }
    const nights = calculateNights();
    if (nights < 1) {
      alert('Check-out date must be after check-in date');
      return;
    }
    try {
      const totalPrice = pricePerNight * nights;
      await bookRoom(roomId, startDate, endDate, totalPrice);
      closeModal();
      navigate('/client-dashboard');
    } catch (err) {
      alert(err);
    }
  };

  const getAmenityIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('wifi')) return <FiWifi />;
    if (lower.includes('tv')) return <FiTv />;
    if (lower.includes('bar') || lower.includes('mini')) return <FiCoffee />;
    if (lower.includes('air') || lower.includes('wind')) return <FiWind />;
    if (lower.includes('view') || lower.includes('sunset')) return <FiSunset />;
    return <FiCheck />;
  };

  const CustomDateInput = forwardRef(({ value, onClick, label }, ref) => (
    <div style={{ width: '100%' }}>
      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', letterSpacing: '1px', textTransform: 'uppercase', fontFamily: 'var(--font-family-body)' }}>{label}</label>
      <div 
        className="custom-datepicker-input" 
        onClick={onClick} 
        ref={ref}
        style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--glass-border)', color: '#fff', cursor: 'pointer' }}
      >
        <FiClock style={{ color: 'var(--primary-color)' }} />
        {value}
      </div>
    </div>
  ));
  CustomDateInput.displayName = 'CustomDateInput';

  // Get unique room types for filter
  const roomTypes = ['All', ...new Set(rooms.map(r => r.type))];
  const filteredRooms = filter === 'All' ? rooms : rooms.filter(r => r.type === filter);

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', overflowX: 'hidden' }}>

      {/* Hero Header */}
      <section style={{ 
        paddingTop: '200px', 
        paddingBottom: '6rem',
        textAlign: 'center',
        backgroundImage: 'url("https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.5) 50%, var(--bg-color) 100%)' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h4 style={{ color: 'var(--primary-color)', letterSpacing: '8px', textTransform: 'uppercase', marginBottom: '1.5rem', fontSize: '0.8rem', fontFamily: 'var(--font-family-body)' }}>THE COLLECTION</h4>
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', marginBottom: '1.5rem', color: '#fff', fontWeight: '400' }}>
            Select Your <span style={{ fontStyle: 'italic', color: 'var(--primary-color)' }}>Sanctuary</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', maxWidth: '650px', margin: '0 auto', lineHeight: '1.8', fontWeight: '300', fontFamily: 'var(--font-family-body)' }}>
             Each suite is a narrative of comfort, artistry, and Colonial Grand heritage — meticulously crafted for those who settle for nothing less than extraordinary.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section style={{ padding: '0 5%', marginTop: '-2rem', position: 'relative', zIndex: 2 }}>
        <div style={{ 
          display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap',
          background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)', borderRadius: '20px',
          padding: '1.2rem 2rem', maxWidth: '800px', margin: '0 auto'
        }}>
          {roomTypes.map(type => (
            <button 
              key={type}
              onClick={() => setFilter(type)}
              style={{
                background: filter === type ? 'var(--gold-gradient)' : 'transparent',
                color: filter === type ? '#000' : 'var(--text-muted)',
                border: filter === type ? 'none' : '1px solid rgba(255,255,255,0.1)',
                padding: '0.6rem 1.8rem',
                borderRadius: '30px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.85rem',
                letterSpacing: '1px',
                transition: 'all 0.3s',
                fontFamily: 'var(--font-family-body)'
              }}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      {/* Room Showcase */}
      <section style={{ padding: '5rem 5% 8rem' }}>
         {loading ? (
           <div className="loading-spinner">Curating Collection...</div>
         ) : filteredRooms.length === 0 ? (
           <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
             <h3 style={{ color: '#fff', fontWeight: '300', marginBottom: '1rem' }}>No suites match your selection.</h3>
             <button className="btn-secondary" onClick={() => setFilter('All')}>View All Suites</button>
           </div>
         ) : (
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '3rem' }}>
             {filteredRooms.map((room) => (
               <div 
                 key={room._id} 
                 style={{ 
                   borderRadius: '24px',
                   overflow: 'hidden',
                   cursor: 'pointer',
                   transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)',
                   border: '1px solid rgba(212,175,55,0.08)',
                   background: 'var(--surface-color)'
                 }}
                 onClick={() => setSelectedRoom(room)}
                 onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-12px)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.4)'; }}
                 onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
               >
                 {/* Image */}
                 <div style={{ height: '320px', overflow: 'hidden', position: 'relative' }}>
                    <img 
                      src={room.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&w=800'} 
                      alt={room.type} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.8s ease' }} 
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.5) 100%)' }}></div>
                    
                    {/* Status badge */}
                    <div style={{ 
                      position: 'absolute', top: '1.5rem', right: '1.5rem',
                      background: room.status === 'Available' ? 'rgba(46,204,113,0.15)' : 'rgba(231,76,60,0.15)',
                      border: `1px solid ${room.status === 'Available' ? 'var(--success-color)' : 'var(--danger-color)'}`,
                      color: room.status === 'Available' ? 'var(--success-color)' : 'var(--danger-color)',
                      padding: '0.4rem 1rem', borderRadius: '30px',
                      fontSize: '0.7rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase',
                      fontFamily: 'var(--font-family-body)'
                    }}>
                      {room.status}
                    </div>

                    {/* Room number */}
                    <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.75rem', color: 'var(--primary-color)', letterSpacing: '2px', fontFamily: 'var(--font-family-body)', fontWeight: '600' }}>
                      ROOM {room.roomNumber}
                    </div>
                 </div>

                 {/* Info */}
                 <div style={{ padding: '2rem 2rem 2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                       <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#fff', fontWeight: '500' }}>{room.type}</h3>
                       <div style={{ textAlign: 'right' }}>
                          <div style={{ color: 'var(--primary-color)', fontSize: '1.3rem', fontWeight: '800' }}>GH₵ {room.price}</div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem', letterSpacing: '1px', fontFamily: 'var(--font-family-body)' }}>PER NIGHT</div>
                       </div>
                    </div>

                    {/* Amenities preview */}
                    <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                      {room.amenities.slice(0, 4).map(a => (
                        <span key={a} style={{ 
                          color: 'var(--text-muted)', fontSize: '0.8rem', 
                          display: 'flex', alignItems: 'center', gap: '0.4rem',
                          background: 'rgba(255,255,255,0.03)', padding: '0.3rem 0.8rem', borderRadius: '20px',
                          border: '1px solid rgba(255,255,255,0.05)',
                          fontFamily: 'var(--font-family-body)'
                        }}>
                          <span style={{ color: 'var(--primary-color)' }}>{getAmenityIcon(a)}</span> {a}
                        </span>
                      ))}
                      {room.amenities.length > 4 && (
                        <span style={{ color: 'var(--primary-color)', fontSize: '0.8rem', padding: '0.3rem 0.8rem', fontFamily: 'var(--font-family-body)' }}>+{room.amenities.length - 4} more</span>
                      )}
                    </div>

                    {/* CTA */}
                    <button className="btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.8rem', fontSize: '0.85rem' }}>
                       VIEW DETAILS <FiArrowRight />
                    </button>
                 </div>
               </div>
             ))}
           </div>
         )}
      </section>

      {/* Footer - matching Landing & Gastronomy */}
      <footer style={{ background: '#050505', borderTop: '1px solid var(--glass-border)', padding: '6rem 5% 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '4rem', marginBottom: '6rem' }}>
           <div>
              <h3 style={{ color: 'var(--primary-color)', letterSpacing: '4px', marginBottom: '2rem' }}>COLONIAL GRAND</h3>
              <p style={{ color: '#666', lineHeight: '2', marginBottom: '2rem', fontFamily: 'var(--font-family-body)' }}>Defining the pinnacle of luxury hospitality through centuries of tradition and modern innovation. Your sanctuary in the heart of the city.</p>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                 <FiFacebook style={{ cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-muted)' }} />
                 <FiTwitter style={{ cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-muted)' }} />
                 <FiInstagram style={{ cursor: 'pointer', fontSize: '1.5rem', color: 'var(--text-muted)' }} />
              </div>
           </div>

           <div>
              <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '2rem', letterSpacing: '2px', fontFamily: 'var(--font-family-body)' }}>COLLECTION</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#666', fontSize: '0.9rem', fontFamily: 'var(--font-family-body)' }}>
                 <li style={{ cursor: 'pointer', color: 'var(--primary-color)' }}>Classic Suites</li>
                 <li style={{ cursor: 'pointer' }}>Garden Villas</li>
                 <li style={{ cursor: 'pointer' }}>Ocean Penthouses</li>
                 <li style={{ cursor: 'pointer' }}>Presidential Wing</li>
              </ul>
           </div>

           <div>
              <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '2rem', letterSpacing: '2px', fontFamily: 'var(--font-family-body)' }}>QUICK LINKS</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#666', fontSize: '0.9rem', fontFamily: 'var(--font-family-body)' }}>
                 <li style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>Home</li>
                 <li style={{ cursor: 'pointer' }} onClick={() => navigate('/gastronomy')}>Gastronomy</li>
                 <li>Spa & Wellness</li>
                 <li>Events & Weddings</li>
              </ul>
           </div>

           <div>
              <h4 style={{ color: '#fff', fontSize: '1rem', marginBottom: '2rem', letterSpacing: '2px', fontFamily: 'var(--font-family-body)' }}>RESERVATIONS</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', color: '#666', fontSize: '0.9rem', fontFamily: 'var(--font-family-body)' }}>
                 <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><FiMapPin style={{ color: 'var(--primary-color)' }} /> 123 Luxury Ave, MT</li>
                 <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><FiPhone style={{ color: 'var(--primary-color)' }} /> +1 800 555 777</li>
                 <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><FiMail style={{ color: 'var(--primary-color)' }} /> reserve@colonialgrand.com</li>
              </ul>
           </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#444', fontSize: '0.8rem', flexWrap: 'wrap', gap: '1rem', fontFamily: 'var(--font-family-body)' }}>
           <p>&copy; {new Date().getFullYear()} COLONIAL GRAND HOTEL. ALL RIGHTS RESERVED.</p>
           <div style={{ display: 'flex', gap: '2rem' }}>
              <span>PRIVACY POLICY</span>
              <span>TERMS OF SERVICE</span>
           </div>
        </div>
      </footer>

      {/* Booking Modal */}
      {selectedRoom && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000,
          padding: '2rem'
        }} onClick={closeModal}>
          
          <div 
            style={{ 
              background: 'var(--bg-color)', 
              borderRadius: '28px', 
              width: '100%', 
              maxWidth: '1100px', 
              maxHeight: '90vh',
              display: 'flex', 
              flexWrap: 'wrap',
              overflowY: 'auto', 
              position: 'relative', 
              border: '1px solid rgba(212,175,55,0.15)',
              boxShadow: '0 25px 80px -12px rgba(212,175,55,0.15), 0 25px 50px -12px rgba(0,0,0,0.8)'
            }}
            onClick={(e) => e.stopPropagation()} 
          >
            <button onClick={closeModal} style={{ position: 'absolute', top: '25px', right: '25px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '1.2rem', width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--danger-color)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}><FiX /></button>
            
            {/* Left: Image Gallery */}
            <div style={{ flex: '1 1 500px', minHeight: '350px', position: 'relative' }}>
               <div style={{ height: '100%', backgroundImage: `url(${selectedRoom.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&w=800'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
               <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, var(--bg-color))' }}></div>
               <div style={{ position: 'absolute', bottom: '3rem', left: '3rem' }}>
                  <span style={{ color: 'var(--primary-color)', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', fontFamily: 'var(--font-family-body)' }}>ROOM {selectedRoom.roomNumber}</span>
                  <h2 style={{ fontSize: '3rem', color: '#fff', margin: '0.5rem 0', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>{selectedRoom.type}</h2>
               </div>
            </div>
            
            {/* Right: Booking Config */}
            <div style={{ flex: '1 1 400px', padding: '3.5rem 2rem', display: 'flex', flexDirection: 'column' }}>
              
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>
                   <FiShield /> <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'var(--font-family-body)' }}>Premium Verified Suite</span>
                </div>
                <p style={{ color: '#aaa', lineHeight: '1.8', fontSize: '1rem', fontFamily: 'var(--font-family-body)' }}>
                  Our {selectedRoom.type} offers a sanctuary of refined elegance. Experience bespoke furnishings and unparalleled attention to detail.
                </p>
              </div>
              
              <h4 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.1rem' }}>Amenities & Features</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '2rem' }}>
                {selectedRoom.amenities.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontFamily: 'var(--font-family-body)' }}>
                    <span style={{ color: 'var(--primary-color)' }}>{getAmenityIcon(item)}</span> {item}
                  </div>
                ))}
              </div>
              
              {/* Date Picker */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--glass-border)', marginBottom: 'auto' }}>
                <h4 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1rem', fontFamily: 'var(--font-family-body)' }}>Plan Your Journey</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   <DatePicker
                     selected={startDate}
                     onChange={(date) => {
                        setStartDate(date);
                        if (date >= endDate) {
                           setEndDate(new Date(new Date(date).setDate(date.getDate() + 1)));
                        }
                     }}
                     selectsStart startDate={startDate} endDate={endDate} minDate={new Date()}
                     customInput={<CustomDateInput label="Check In" />}
                   />
                   <DatePicker
                     selected={endDate}
                     onChange={(date) => setEndDate(date)}
                     selectsEnd startDate={startDate} endDate={endDate}
                     minDate={new Date(new Date(startDate).setDate(startDate.getDate() + 1))}
                     customInput={<CustomDateInput label="Check Out" />}
                   />
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
                   <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '1px', fontFamily: 'var(--font-family-body)' }}>DURATION</div>
                      <div style={{ color: '#fff', fontWeight: 'bold', fontFamily: 'var(--font-family-body)' }}>{calculateNights()} Night{calculateNights() > 1 ? 's' : ''}</div>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', letterSpacing: '1px', fontFamily: 'var(--font-family-body)' }}>TOTAL</div>
                      <div style={{ color: 'var(--primary-color)', fontWeight: '800', fontSize: '1.5rem' }}>GH₵ {selectedRoom.price * calculateNights()}</div>
                   </div>
                </div>
              </div>
              
              <div style={{ marginTop: '2rem' }}>
                {selectedRoom.status === 'Available' ? (
                  <button className="btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1rem' }} onClick={() => handleBookRoom(selectedRoom._id, selectedRoom.price)}>
                    {user ? 'CONFIRM RESERVATION' : 'SIGN IN TO BOOK'}
                  </button>
                ) : (
                   <button className="btn-secondary" style={{ width: '100%', padding: '1.2rem', cursor: 'not-allowed', opacity: 0.6 }} disabled>CURRENTLY RESERVED</button>
                )}
                <p style={{ color: '#555', fontSize: '0.7rem', textAlign: 'center', marginTop: '1rem', fontFamily: 'var(--font-family-body)' }}>
                   Secured by Colonial Grand Reservations. Cancellation policy applies.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;
