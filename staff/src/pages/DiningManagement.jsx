import { useEffect, useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { FiCalendar, FiClock, FiUsers, FiCheckCircle, FiXCircle, FiMoreVertical } from 'react-icons/fi';

const DiningManagement = () => {
  const { diningReservations, fetchDiningReservations, updateDiningStatus } = useHotel();
  const [filter, setFilter] = useState('Today');
  
  useEffect(() => {
    fetchDiningReservations();
  }, [fetchDiningReservations]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateDiningStatus(id, status);
    } catch (err) {
      alert(err);
    }
  };

  const getFilteredReservations = () => {
    const today = new Date().toISOString().split('T')[0];
    if (filter === 'Today') {
      return diningReservations.filter(r => new Date(r.date).toISOString().split('T')[0] === today);
    }
    if (filter === 'Upcoming') {
      return diningReservations.filter(r => new Date(r.date).toISOString().split('T')[0] > today && r.status === 'Confirmed');
    }
    return diningReservations;
  };

  const filtered = getFilteredReservations();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'var(--primary-color)';
      case 'Completed': return 'var(--success-color)';
      case 'Cancelled': return 'var(--danger-color)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Dining Management</h1>
          <p className="text-muted">Oversee table reservations and guest arrivals for Colonial Dining.</p>
        </div>
        <div className="glass-panel" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
          {['Today', 'Upcoming', 'All'].map(f => (
            <button 
              key={f}
              className={`btn-secondary ${filter === f ? 'active' : ''}`}
              style={{ border: 'none', background: filter === f ? 'var(--primary-color)' : 'transparent' }}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-panel">
          <p className="text-muted">Total Today</p>
          <h2>{diningReservations.filter(r => new Date(r.date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0]).length}</h2>
        </div>
        <div className="glass-panel">
          <p className="text-muted">Upcoming Bookings</p>
          <h2>{diningReservations.filter(r => r.status === 'Confirmed').length}</h2>
        </div>
        <div className="glass-panel">
          <p className="text-muted">Cancelled Reservations</p>
          <h2 style={{ color: 'var(--danger-color)' }}>{diningReservations.filter(r => r.status === 'Cancelled').length}</h2>
        </div>
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '1.5rem' }}>{filter} Reservations</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
              <th style={{ paddingBottom: '1rem' }}>Guest</th>
              <th style={{ paddingBottom: '1rem' }}>Table</th>
              <th style={{ paddingBottom: '1rem' }}>Date & Time</th>
              <th style={{ paddingBottom: '1rem' }}>Party Size</th>
              <th style={{ paddingBottom: '1rem' }}>Status</th>
              <th style={{ paddingBottom: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <td style={{ padding: '1.2rem 0' }}>
                  <div style={{ fontWeight: '600' }}>{r.guest?.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.guest?.email}</div>
                </td>
                <td>
                  <span className="badge">Table {r.table?.tableNumber}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
                    <FiCalendar size={14} /> {new Date(r.date).toLocaleDateString()}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <FiClock size={14} /> {r.time}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FiUsers size={14} /> {r.partySize}
                  </div>
                </td>
                <td>
                  <span style={{ 
                    color: getStatusColor(r.status), 
                    background: `${getStatusColor(r.status)}15`,
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    {r.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {r.status === 'Confirmed' && (
                      <>
                        <button 
                          className="btn-primary" 
                          style={{ padding: '0.4rem 0.7rem', fontSize: '0.8rem' }}
                          onClick={() => handleStatusChange(r._id, 'Completed')}
                        >
                          Complete
                        </button>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '0.4rem 0.7rem', fontSize: '0.8rem', color: 'var(--danger-color)' }}
                          onClick={() => handleStatusChange(r._id, 'Cancelled')}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No reservations found for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DiningManagement;
