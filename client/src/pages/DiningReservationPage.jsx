import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiX, FiCheck, FiClock, FiUsers, FiMapPin, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const DiningReservationPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null);
  const [filter, setFilter] = useState('All');
  
  const [resDate, setResDate] = useState(new Date());
  const [resTime, setResTime] = useState('19:00');
  const [partySize, setPartySize] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/dining');
        setTables(data);
      } catch (error) {
        console.error('Failed to fetch tables', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, []);

  const closeModal = () => setSelectedTable(null);

  const handleReserve = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/dining/reserve', {
        tableId: selectedTable._id,
        date: resDate,
        time: resTime,
        partySize,
        specialRequests
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Reservation confirmed! We look forward to hosting you.');
      closeModal();
      navigate('/client-dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Reservation failed. Please try a different slot.');
    }
  };

  const locations = ['All', 'Main Hall', 'Terrace', 'Rooftop', 'Private Room', 'Wine Cellar'];
  const filteredTables = filter === 'All' ? tables : tables.filter(t => t.location === filter);

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ 
        paddingTop: '160px', paddingBottom: '6rem', textAlign: 'center',
        backgroundImage: 'url("https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, var(--bg-color) 100%)' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h4 style={{ color: 'var(--primary-color)', letterSpacing: '6px', textTransform: 'uppercase', marginBottom: '1.5rem', fontSize: '0.8rem' }}>THE ART OF DINING</h4>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: '#fff', fontWeight: '400' }}>Reserve Your <span style={{ fontStyle: 'italic', color: 'var(--primary-color)' }}>Table</span></h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', maxWidth: '600px', margin: '1.5rem auto 0', lineHeight: '1.8' }}>
            Experience culinary excellence in our carefully curated dining spaces. From the historic Main Hall to our private Wine Cellar.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section style={{ padding: '0 5%', marginTop: '-2rem', position: 'relative', zIndex: 2 }}>
        <div style={{ 
          display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap',
          background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)', borderRadius: '30px',
          padding: '1rem 2rem', maxWidth: '900px', margin: '0 auto'
        }}>
          {locations.map(loc => (
            <button 
              key={loc}
              onClick={() => setFilter(loc)}
              style={{
                background: filter === loc ? 'var(--gold-gradient)' : 'transparent',
                color: filter === loc ? '#000' : 'var(--text-muted)',
                border: filter === loc ? 'none' : '1px solid rgba(255,255,255,0.1)',
                padding: '0.6rem 1.5rem', borderRadius: '30px', cursor: 'pointer',
                fontWeight: '600', transition: 'all 0.3s'
              }}
            >
              {loc.toUpperCase()}
            </button>
          ))}
        </div>
      </section>

      {/* Table Grid */}
      <section style={{ padding: '5rem 5% 8rem' }}>
        {loading ? (
          <div className="loading-spinner">Preparing your table...</div>
        ) : (
          <div className="grid-3">
            {filteredTables.map(table => (
              <div 
                key={table._id}
                style={{ 
                  borderRadius: '24px', overflow: 'hidden', cursor: 'pointer',
                  border: '1px solid rgba(212,175,55,0.08)', background: 'var(--surface-color)',
                  transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
                }}
                onClick={() => setSelectedTable(table)}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.3)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(212,175,55,0.08)'; }}
              >
                <div style={{ height: '240px', position: 'relative' }}>
                  <img src={table.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600'} alt={`Table ${table.tableNumber}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '1.2rem', left: '1.2rem', background: 'rgba(0,0,0,0.6)', padding: '0.4rem 1rem', borderRadius: '20px', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                    TABLE {table.tableNumber}
                  </div>
                  <div style={{ position: 'absolute', bottom: '1.2rem', right: '1.2rem', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', padding: '0.4rem 1rem', borderRadius: '30px', fontSize: '0.75rem', fontWeight: '700' }}>
                    {table.location.toUpperCase()}
                  </div>
                </div>
                <div style={{ padding: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff' }}>
                      <FiUsers /> <span>Seats up to {table.capacity}</span>
                    </div>
                    <div style={{ color: table.status === 'Available' ? 'var(--success-color)' : 'var(--danger-color)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {table.status.toUpperCase()}
                    </div>
                  </div>
                  <button className="btn-secondary" style={{ width: '100%', gap: '0.8rem' }}>
                    SELECT TABLE <FiArrowRight />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reservation Modal */}
      {selectedTable && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 2000,
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem'
        }} onClick={closeModal}>
          <div 
            style={{ 
              background: 'var(--bg-color)', borderRadius: '30px', width: '100%', maxWidth: '800px',
              display: 'flex', flexWrap: 'wrap', overflowY: 'auto', maxHeight: '90vh', border: '1px solid var(--glass-border)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ flex: '1 1 300px', minHeight: '250px', backgroundImage: `url(${selectedTable.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            <div style={{ flex: '1.5 1 350px', padding: '3rem 2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                  <h4 style={{ color: 'var(--primary-color)', fontSize: '0.8rem', letterSpacing: '2px' }}>TABLE {selectedTable.tableNumber} • {selectedTable.location}</h4>
                  <h2 style={{ color: '#fff', fontSize: '2rem', marginTop: '0.5rem' }}>Reservation Details</h2>
                </div>
                <button onClick={closeModal} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' }}><FiX /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Date</label>
                  <DatePicker 
                    selected={resDate} onChange={date => setResDate(date)} minDate={new Date()}
                    customInput={<div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '15px', border: '1px solid var(--glass-border)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem' }}><FiCalendar style={{ color: 'var(--primary-color)' }} /> {resDate.toDateString()}</div>}
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Time Slot</label>
                    <select value={resTime} onChange={e => setResTime(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '15px', border: '1px solid var(--glass-border)', color: '#fff', cursor: 'pointer' }}>
                      {['12:00', '13:00', '14:00', '18:00', '19:00', '20:00', '21:00'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Party Size</label>
                    <input type="number" min="1" max={selectedTable.capacity} value={partySize} onChange={e => setPartySize(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '15px', border: '1px solid var(--glass-border)', color: '#fff' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Special Requests</label>
                  <textarea value={specialRequests} onChange={e => setSpecialRequests(e.target.value)} placeholder="Allergies, anniversaries, or seat preference..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '15px', border: '1px solid var(--glass-border)', color: '#fff', minHeight: '100px' }} />
                </div>

                <button className="btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', marginTop: '1rem' }} onClick={handleReserve}>
                  CONFIRM RESERVATION
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiningReservationPage;
