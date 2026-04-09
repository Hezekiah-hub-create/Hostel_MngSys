import { useEffect, useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { useAuth } from '../context/AuthContext';
import { FiEdit2, FiPlus, FiTrash2, FiTag, FiLayout, FiGrid, FiList, FiX, FiCheckCircle } from 'react-icons/fi';

const STATUS_FILTERS = ['All', 'Available', 'Booked', 'Maintenance'];

const RoomsManagement = () => {
  const { user } = useAuth();
  const { rooms, fetchRooms } = useHotel();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [statusFilter, setStatusFilter] = useState('All');

  const isAuthorized = user?.role === 'admin' || user?.role === 'manager';

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const openEditModal = (room) => { setSelectedRoom(room); setIsModalOpen(true); };

  const filtered = statusFilter === 'All'
    ? rooms
    : rooms.filter(r => r.status.toLowerCase() === statusFilter.toLowerCase());

  const available = rooms.filter(r => r.status === 'Available').length;
  const occupied  = rooms.filter(r => r.status === 'Booked').length;

  const statusColor = (s) => {
    const m = { available: '#2ecc71', booked: '#e74c3c', maintenance: '#f39c12' };
    return m[s?.toLowerCase()] || '#888';
  };

  return (
    <div className="animate-fade-in">

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-family-title)', color: 'var(--primary-color)', marginBottom: '0.4rem' }}>
            Room Inventory
          </h1>
          <p className="text-muted">Configure room details, pricing, and availability status.</p>
        </div>
        {isAuthorized && (
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FiPlus /> Add Room
          </button>
        )}
      </div>

      {/* ── Stats ── */}
      <div className="rm-stats">
        {[
          { label: 'Total Rooms',  value: rooms.length,  color: 'var(--primary-color)' },
          { label: 'Available',    value: available,      color: '#2ecc71' },
          { label: 'Occupied',     value: occupied,       color: '#e74c3c' },
          { label: 'Occupancy',    value: `${rooms.length ? Math.round(occupied / rooms.length * 100) : 0}%`, color: '#3498db' },
        ].map(stat => (
          <div key={stat.label} className="rm-stat">
            <span className="rm-stat-val" style={{ color: stat.color }}>{stat.value}</span>
            <span className="rm-stat-lbl">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* ── Filter + View Toggle ── */}
      <div className="rm-toolbar glass-panel">
        <div className="rm-filter-tabs">
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              className={`rm-filter-btn ${statusFilter === f ? 'active' : ''}`}
              onClick={() => setStatusFilter(f)}
            >
              {f}
              <span className="rm-filter-count">
                {f === 'All' ? rooms.length : rooms.filter(r => r.status.toLowerCase() === f.toLowerCase()).length}
              </span>
            </button>
          ))}
        </div>
        <div className="rm-view-toggle">
          <button className={`rm-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}><FiGrid /></button>
          <button className={`rm-toggle-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><FiList /></button>
        </div>
      </div>

      {/* ── Grid View ── */}
      {viewMode === 'grid' && (
        <div className="rm-grid">
          {filtered.map((room, idx) => (
            <div key={room._id} className="rm-card" style={{ animationDelay: `${idx * 0.05}s` }}>

              {/* Image */}
              <div className="rm-card-img">
                <img
                  src={room.imageUrl || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'}
                  alt={`Room ${room.roomNumber}`}
                />
                <div className="rm-card-num">#{room.roomNumber}</div>
                <div className="rm-card-status-pill" style={{ background: statusColor(room.status) }}>
                  {room.status}
                </div>
              </div>

              {/* Info */}
              <div className="rm-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontFamily: 'var(--font-family-title)', color: 'var(--primary-color)' }}>{room.type}</h3>
                </div>

                <div className="rm-card-meta">
                  <div className="rm-meta-item">
                    <FiTag size={13} />
                    <span>${room.price} / night</span>
                  </div>
                  <div className="rm-meta-item">
                    <FiLayout size={13} />
                    <span>{room.amenities?.length || 0} amenities</span>
                  </div>
                </div>

                {isAuthorized && (
                  <div className="rm-card-actions">
                    <button className="btn-small secondary" onClick={() => openEditModal(room)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <FiEdit2 size={12} /> Edit
                    </button>
                    <button className="btn-small danger" title="Archive Room" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <FiTrash2 size={12} /> Archive
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── List View ── */}
      {viewMode === 'list' && (
        <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="rm-list-header">
            <span>Room</span><span>Type</span><span>Price</span><span>Status</span>{isAuthorized && <span>Actions</span>}
          </div>
          {filtered.map(room => (
            <div key={room._id} className="rm-list-row">
              <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>#{room.roomNumber}</span>
              <span className="text-muted">{room.type}</span>
              <span style={{ fontWeight: 600 }}>${room.price}<span className="text-muted" style={{ fontWeight: 400, fontSize:'0.78rem' }}>/night</span></span>
              <span>
                <span className="rm-dot" style={{ background: statusColor(room.status) }} />
                <span style={{ fontSize: '0.85rem' }}>{room.status}</span>
              </span>
              {isAuthorized && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-small secondary" onClick={() => openEditModal(room)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FiEdit2 size={12} /> Edit
                  </button>
                  <button className="btn-small danger" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <FiTrash2 size={12} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
          No rooms match the selected filter.
        </div>
      )}

      {/* ── Edit Modal ── */}
      {isModalOpen && (
        <div className="rm-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="rm-modal glass-panel" onClick={e => e.stopPropagation()}>
            <div className="rm-modal-header">
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Edit Room #{selectedRoom?.roomNumber}</h2>
              <button className="gm-close-btn" onClick={() => setIsModalOpen(false)}><FiX size={18} /></button>
            </div>

            <div style={{ padding: '1.75rem' }}>
              <div className="form-group">
                <label>Room Category</label>
                <select defaultValue={selectedRoom?.type} className="form-input">
                  <option>Single</option><option>Double</option><option>Suite</option><option>Penthouse</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nightly Rate ($)</label>
                <input type="number" defaultValue={selectedRoom?.price} className="form-input" />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select defaultValue={selectedRoom?.status} className="form-input">
                  <option>Available</option><option>Booked</option><option>Maintenance</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <FiCheckCircle size={15} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .rm-stats {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem;
        }
        .rm-stat {
          background: var(--glass-bg); border: 1px solid var(--glass-border);
          border-radius: 14px; padding: 1.25rem 1.5rem;
          display: flex; flex-direction: column; gap: 0.25rem;
          transition: transform 0.2s; cursor: default;
        }
        .rm-stat:hover { transform: translateY(-2px); }
        .rm-stat-val { font-size: 1.9rem; font-weight: 700; line-height: 1; }
        .rm-stat-lbl { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; }

        .rm-toolbar {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.75rem 1.25rem !important; margin-bottom: 1.5rem; border-radius: 12px !important;
        }
        .rm-filter-tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .rm-filter-btn {
          display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem;
          background: transparent; border: 1px solid var(--glass-border);
          border-radius: 8px; color: var(--text-muted); font-size: 0.82rem; cursor: pointer;
          transition: all 0.2s;
        }
        .rm-filter-btn:hover { border-color: rgba(212,175,55,0.4); color: var(--primary-color); }
        .rm-filter-btn.active { background: rgba(212,175,55,0.15); border-color: var(--primary-color); color: var(--primary-color); }
        .rm-filter-count {
          background: rgba(255,255,255,0.08); border-radius: 20px;
          padding: 0.1rem 0.5rem; font-size: 0.7rem; font-weight: 700;
        }
        .rm-view-toggle { display: flex; gap: 0.35rem; }
        .rm-toggle-btn {
          width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;
          border: 1px solid var(--glass-border); border-radius: 8px; background: transparent;
          color: var(--text-muted); cursor: pointer; transition: all 0.2s;
        }
        .rm-toggle-btn.active, .rm-toggle-btn:hover {
          background: rgba(212,175,55,0.15); border-color: var(--primary-color); color: var(--primary-color);
        }

        .rm-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;
        }
        .rm-card {
          background: var(--glass-bg); border: 1px solid var(--glass-border);
          border-radius: 20px; overflow: hidden;
          transition: transform 0.25s, box-shadow 0.25s;
          animation: fadeInUp 0.4s ease both;
        }
        .rm-card:hover { transform: translateY(-5px); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
        .rm-card-img { position: relative; height: 170px; overflow: hidden; }
        .rm-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .rm-card:hover .rm-card-img img { transform: scale(1.06); }
        .rm-card-num {
          position: absolute; top: 0.85rem; left: 0.85rem;
          background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
          padding: 0.25rem 0.7rem; border-radius: 8px; font-weight: 700; font-size: 0.85rem;
        }
        .rm-card-status-pill {
          position: absolute; top: 0.85rem; right: 0.85rem;
          padding: 0.25rem 0.75rem; border-radius: 20px;
          font-size: 0.72rem; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.05em;
        }
        .rm-card-body { padding: 1.35rem; }
        .rm-card-meta { display: flex; flex-direction: column; gap: 0.45rem; margin-bottom: 1.25rem; }
        .rm-meta-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-muted); }
        .rm-card-actions { display: flex; gap: 0.6rem; }

        .rm-list-header {
          display: grid; grid-template-columns: 0.5fr 1fr 1fr 1fr 1.5fr;
          padding: 0.75rem 2rem; background: rgba(0,0,0,0.3);
          font-size: 0.72rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--text-muted);
          border-bottom: 1px solid var(--glass-border);
        }
        .rm-list-row {
          display: grid; grid-template-columns: 0.5fr 1fr 1fr 1fr 1.5fr;
          align-items: center; padding: 1rem 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.2s;
        }
        .rm-list-row:last-child { border-bottom: none; }
        .rm-list-row:hover { background: rgba(212,175,55,0.04); }
        .rm-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 0.5rem; }

        .rm-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 1000;
          display: flex; align-items: center; justify-content: center;
          animation: fadeIn 0.2s ease; backdrop-filter: blur(4px);
        }
        .rm-modal { width: 100%; max-width: 480px; padding: 0 !important; }
        .rm-modal-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.5rem 1.75rem; border-bottom: 1px solid var(--glass-border);
        }
        .gm-close-btn {
          background: rgba(255,255,255,0.07); border: 1px solid var(--glass-border);
          border-radius: 8px; color: var(--text-muted); cursor: pointer; padding: 0.4rem;
          display: flex; align-items: center; transition: all 0.2s;
        }
        .gm-close-btn:hover { color: var(--text-color); background: rgba(255,255,255,0.12); }
      `}</style>
    </div>
  );
};

export default RoomsManagement;
