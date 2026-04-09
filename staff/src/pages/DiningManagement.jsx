import { useEffect, useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { FiCalendar, FiClock, FiUsers, FiDownload, FiCheckCircle, FiXCircle, FiSearch, FiX } from 'react-icons/fi';

const FILTERS = ['Today', 'Upcoming', 'All'];

const DiningManagement = () => {
  const { diningReservations, fetchDiningReservations, updateDiningStatus } = useHotel();
  const [filter, setFilter] = useState('Today');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchDiningReservations(); }, [fetchDiningReservations]);

  const handleStatusChange = async (id, status) => {
    try { await updateDiningStatus(id, status); } catch (err) { alert(err); }
  };

  const today = new Date().toISOString().split('T')[0];

  const base = (() => {
    if (filter === 'Today')    return diningReservations.filter(r => new Date(r.date).toISOString().split('T')[0] === today);
    if (filter === 'Upcoming') return diningReservations.filter(r => new Date(r.date).toISOString().split('T')[0] > today && r.status === 'Confirmed');
    return diningReservations;
  })();

  const filtered = base.filter(r =>
    !search ||
    r.guest?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.guest?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const todayCount     = diningReservations.filter(r => new Date(r.date).toISOString().split('T')[0] === today).length;
  const confirmedCount = diningReservations.filter(r => r.status === 'Confirmed').length;
  const cancelledCount = diningReservations.filter(r => r.status === 'Cancelled').length;
  const completedCount = diningReservations.filter(r => r.status === 'Completed').length;

  const statusStyle = (s) => {
    const m = {
      confirmed: { bg: 'rgba(52,152,219,0.12)',   color: '#3498db',   border: 'rgba(52,152,219,0.25)'  },
      completed: { bg: 'rgba(46,204,113,0.12)',    color: '#2ecc71',   border: 'rgba(46,204,113,0.25)'  },
      cancelled: { bg: 'rgba(231,76,60,0.12)',     color: '#e74c3c',   border: 'rgba(231,76,60,0.25)'   },
    };
    return m[s?.toLowerCase()] || { bg: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: 'var(--glass-border)' };
  };

  return (
    <div className="animate-fade-in">

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-family-title)', color: 'var(--primary-color)', marginBottom: '0.4rem' }}>
            Dining Management
          </h1>
          <p className="text-muted">Oversee table reservations and guest arrivals for Colonial Dining.</p>
        </div>

        {/* Filter Pills */}
        <div className="dm-filter-group">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`dm-filter-pill ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="dm-stats">
        {[
          { label: "Today's Covers",    value: todayCount,     color: 'var(--primary-color)', border: 'rgba(212,175,55,0.3)' },
          { label: 'Confirmed',          value: confirmedCount, color: '#3498db',              border: 'rgba(52,152,219,0.3)' },
          { label: 'Completed',          value: completedCount, color: '#2ecc71',              border: 'rgba(46,204,113,0.3)' },
          { label: 'Cancelled',          value: cancelledCount, color: '#e74c3c',              border: 'rgba(231,76,60,0.3)'  },
        ].map(s => (
          <div key={s.label} className="dm-stat" style={{ borderColor: s.border }}>
            <span className="dm-stat-val" style={{ color: s.color }}>{s.value}</span>
            <span className="dm-stat-lbl">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Table Panel ── */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>

        {/* Panel Toolbar */}
        <div className="dm-panel-toolbar">
          <h2 style={{ margin: 0, fontSize: '1.05rem', fontFamily: 'var(--font-family-title)', color: 'var(--primary-color)' }}>
            {filter} Reservations
            <span className="dm-count-badge">{filtered.length}</span>
          </h2>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {/* Search */}
            <div className="dm-search">
              <FiSearch size={13} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text" placeholder="Search guest…"
                value={search} onChange={e => setSearch(e.target.value)}
                className="dm-search-inp"
              />
              {search && <button className="dm-clear" onClick={() => setSearch('')}><FiX size={12} /></button>}
            </div>
            <button className="btn-action" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FiDownload size={13} /> Export
            </button>
          </div>
        </div>

        {/* Column Headers */}
        <div className="dm-table-header">
          <span>Guest</span>
          <span>Table</span>
          <span>Date & Time</span>
          <span>Party</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="dm-empty">
            <FiCalendar size={36} style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }} />
            <p>No reservations found for this period.</p>
          </div>
        ) : (
          filtered.map((r, idx) => {
            const ss = statusStyle(r.status);
            return (
              <div key={r._id} className="dm-row" style={{ animationDelay: `${idx * 0.04}s` }}>

                {/* Guest */}
                <div className="dm-cell dm-guest">
                  <div className="dm-avatar">
                    {(r.guest?.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="dm-guest-name">{r.guest?.name || 'Unknown'}</div>
                    <div className="dm-guest-email text-muted">{r.guest?.email}</div>
                  </div>
                </div>

                {/* Table */}
                <div className="dm-cell">
                  <span className="dm-table-badge">
                    Table {r.table?.tableNumber ?? '—'}
                  </span>
                </div>

                {/* Date & Time */}
                <div className="dm-cell">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.87rem' }}>
                      <FiCalendar size={12} className="text-muted" />
                      {new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      <FiClock size={12} /> {r.time}
                    </div>
                  </div>
                </div>

                {/* Party Size */}
                <div className="dm-cell">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FiUsers size={13} className="text-muted" />
                    <span style={{ fontWeight: 600 }}>{r.partySize}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="dm-cell">
                  <span
                    className="dm-status-badge"
                    style={{ color: ss.color, background: ss.bg, borderColor: ss.border }}
                  >
                    {r.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="dm-cell" style={{ gap: '0.5rem' }}>
                  {r.status === 'Confirmed' && (
                    <>
                      <button
                        className="btn-small primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        onClick={() => handleStatusChange(r._id, 'Completed')}
                      >
                        <FiCheckCircle size={11} /> Seat
                      </button>
                      <button
                        className="btn-small danger"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                        onClick={() => handleStatusChange(r._id, 'Cancelled')}
                      >
                        <FiXCircle size={11} /> Cancel
                      </button>
                    </>
                  )}
                  {(r.status === 'Completed' || r.status === 'Cancelled') && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No actions
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .dm-filter-group { display: flex; gap: 0.4rem; background: rgba(0,0,0,0.25); padding: 0.35rem; border-radius: 12px; border: 1px solid var(--glass-border); }
        .dm-filter-pill {
          padding: 0.45rem 1.1rem; border-radius: 9px; border: none; cursor: pointer;
          font-size: 0.82rem; font-weight: 600; transition: all 0.2s;
          background: transparent; color: var(--text-muted);
        }
        .dm-filter-pill.active { background: var(--gold-gradient); color: #000; box-shadow: 0 3px 10px rgba(212,175,55,0.3); }
        .dm-filter-pill:not(.active):hover { color: var(--primary-color); }

        .dm-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .dm-stat {
          background: var(--glass-bg); border-radius: 14px; border: 1px solid var(--glass-border);
          padding: 1.2rem 1.5rem; display: flex; flex-direction: column; gap: 0.2rem;
          transition: transform 0.2s;
        }
        .dm-stat:hover { transform: translateY(-2px); }
        .dm-stat-val { font-size: 1.85rem; font-weight: 700; line-height: 1; }
        .dm-stat-lbl { font-size: 0.73rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; }

        .dm-panel-toolbar {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.25rem 2rem; border-bottom: 1px solid var(--glass-border);
        }
        .dm-count-badge {
          display: inline-flex; align-items: center; justify-content: center;
          background: rgba(212,175,55,0.15); color: var(--primary-color);
          border-radius: 20px; padding: 0.1rem 0.6rem; font-size: 0.72rem; font-weight: 700;
          margin-left: 0.6rem; font-family: var(--font-family-body);
        }
        .dm-search {
          display: flex; align-items: center; gap: 0.5rem;
          background: rgba(0,0,0,0.25); border: 1px solid var(--glass-border);
          border-radius: 9px; padding: 0.45rem 0.85rem;
        }
        .dm-search-inp { background: transparent; border: none; outline: none; color: var(--text-color); font-size: 0.83rem; width: 160px; font-family: var(--font-family-body); }
        .dm-search-inp::placeholder { color: var(--text-muted); }
        .dm-clear { background: none; border: none; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; }

        .dm-table-header {
          display: grid; grid-template-columns: 2.5fr 1fr 1.8fr 0.7fr 1fr 1.5fr;
          padding: 0.7rem 2rem; background: rgba(0,0,0,0.25);
          font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--text-muted);
          border-bottom: 1px solid var(--glass-border);
        }
        .dm-row {
          display: grid; grid-template-columns: 2.5fr 1fr 1.8fr 0.7fr 1fr 1.5fr;
          align-items: center; padding: 0.9rem 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.2s; animation: fadeInUp 0.35s ease both;
        }
        .dm-row:last-child { border-bottom: none; }
        .dm-row:hover { background: rgba(212,175,55,0.03); }
        .dm-cell { display: flex; align-items: center; }

        .dm-guest { gap: 0.85rem; }
        .dm-avatar {
          width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
          background: var(--gold-gradient); color: #000;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 1rem;
        }
        .dm-guest-name { font-weight: 600; font-size: 0.92rem; }
        .dm-guest-email { font-size: 0.77rem; margin-top: 0.15rem; }

        .dm-table-badge {
          display: inline-flex; align-items: center; padding: 0.25rem 0.7rem;
          border-radius: 8px; font-size: 0.78rem; font-weight: 600;
          background: rgba(212,175,55,0.1); color: var(--primary-color);
          border: 1px solid rgba(212,175,55,0.25);
        }
        .dm-status-badge {
          display: inline-flex; align-items: center; padding: 0.28rem 0.75rem;
          border-radius: 20px; font-size: 0.75rem; font-weight: 600;
          border: 1px solid transparent;
        }
        .dm-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 5rem; color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default DiningManagement;
