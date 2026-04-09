import { useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import {
  FiUsers, FiTrendingUp, FiBarChart2, FiDollarSign, FiClock,
  FiActivity, FiArrowUpRight, FiArrowDownRight
} from 'react-icons/fi';

const ManagerDashboard = () => {
  const { rooms, bookings, fetchRooms, fetchBookings } = useHotel();

  useEffect(() => {
    fetchRooms();
    fetchBookings();
  }, [fetchRooms, fetchBookings]);

  /* ── Metrics ── */
  const totalRooms       = rooms.length;
  const availableRooms   = rooms.filter(r => r.status === 'Available').length;
  const occupiedRooms    = totalRooms - availableRooms;
  const occupancyRate    = totalRooms ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
  const checkedOut       = bookings.filter(b => b.status === 'CheckedOut');
  const revenue          = checkedOut.reduce((s, b) => s + (b.totalPrice || 0), 0);
  const avgStay          = checkedOut.length
    ? Math.round(checkedOut.reduce((s, b) => s + (new Date(b.checkOutDate) - new Date(b.checkInDate)) / 86400000, 0) / checkedOut.length)
    : 0;
  const confirmed        = bookings.filter(b => b.status === 'Confirmed').length;
  const checkedIn        = bookings.filter(b => b.status === 'CheckedIn').length;
  const recentBookings   = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8);

  /* Room type donut data */
  const roomTypes = rooms.reduce((acc, r) => { acc[r.type] = (acc[r.type] || 0) + 1; return acc; }, {});
  const typeColors = ['#D4AF37', '#3498db', '#2ecc71', '#9b59b6', '#e67e22'];
  const typeEntries = Object.entries(roomTypes);

  /* Mini booking trend (last 7 days placeholders) */
  const today = new Date();
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });
    const count = bookings.filter(b =>
      new Date(b.createdAt).toDateString() === d.toDateString()
    ).length;
    return { label, count };
  });
  const maxDay = Math.max(...last7.map(d => d.count), 1);

  const KPIs = [
    {
      icon: <FiBarChart2 />, label: 'Occupancy Rate', value: `${occupancyRate}%`,
      sub: `${occupiedRooms} of ${totalRooms} rooms`, color: '#D4AF37', trend: null,
    },
    {
      icon: <FiUsers />, label: 'Guests In-House', value: occupiedRooms,
      sub: `${checkedIn} checked in today`, color: '#3498db', trend: null,
    },
    {
      icon: <FiDollarSign />, label: 'Total Revenue', value: `$${revenue.toLocaleString()}`,
      sub: 'from completed stays', color: '#2ecc71', trend: <FiArrowUpRight />,
    },
    {
      icon: <FiClock />, label: 'Avg Stay Length', value: `${avgStay}d`,
      sub: 'across checked-out bookings', color: '#9b59b6', trend: null,
    },
  ];

  const statusStyle = (s) => {
    const m = {
      confirmed:  { bg: 'rgba(52,152,219,0.12)',  color: '#3498db'  },
      checkedin:  { bg: 'rgba(212,175,55,0.12)',  color: '#D4AF37'  },
      checkedout: { bg: 'rgba(46,204,113,0.12)',  color: '#2ecc71'  },
      cancelled:  { bg: 'rgba(231,76,60,0.12)',   color: '#e74c3c'  },
    };
    return m[s?.toLowerCase()] || { bg: 'rgba(255,255,255,0.06)', color: '#888' };
  };

  return (
    <div className="animate-fade-in">

      {/* ── Header ── */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-family-title)', color: 'var(--primary-color)', marginBottom: '0.4rem' }}>
          Manager Dashboard
        </h1>
        <p className="text-muted">Live analytics and performance overview for Colonial Grand.</p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="md-kpi-grid">
        {KPIs.map((k, i) => (
          <div key={i} className="md-kpi-card" style={{ '--kc': k.color }}>
            <div className="md-kpi-top">
              <div className="md-kpi-icon" style={{ color: k.color, background: `${k.color}1a` }}>
                {k.icon}
              </div>
              {k.trend && (
                <span className="md-kpi-trend pos">{k.trend}</span>
              )}
            </div>
            <div className="md-kpi-val" style={{ color: k.color }}>{k.value}</div>
            <div className="md-kpi-label">{k.label}</div>
            <div className="md-kpi-sub text-muted">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Middle Row: 7-Day Trend + Room Types ── */}
      <div className="md-mid-row">

        {/* 7-Day Bookings Trend */}
        <div className="glass-panel md-trend-panel">
          <div className="md-panel-header">
            <h2 className="md-panel-title"><FiActivity size={16} /> Booking Trend (7 Days)</h2>
          </div>
          <div className="md-bar-group">
            {last7.map((d, i) => (
              <div key={i} className="md-day-bar">
                <div className="md-bar-wrap">
                  <div
                    className="md-bar-inner"
                    style={{ height: `${(d.count / maxDay) * 100}%` }}
                    title={`${d.count} bookings`}
                  />
                </div>
                <div className="md-bar-day">{d.label}</div>
                {d.count > 0 && <div className="md-bar-num">{d.count}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Room Type Breakdown */}
        <div className="glass-panel">
          <div className="md-panel-header">
            <h2 className="md-panel-title"><FiBarChart2 size={16} /> Room Inventory</h2>
          </div>
          <div className="md-room-types">
            {typeEntries.length === 0 ? (
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>No room data.</p>
            ) : typeEntries.map(([type, count], i) => {
              const color = typeColors[i % typeColors.length];
              const pct = Math.round((count / totalRooms) * 100);
              return (
                <div key={type} className="md-type-row">
                  <div className="md-type-dot" style={{ background: color }} />
                  <div style={{ flex: 1 }}>
                    <div className="md-type-top">
                      <span className="md-type-name">{type}</span>
                      <span className="md-type-count" style={{ color }}>{count} rooms</span>
                    </div>
                    <div className="md-type-track">
                      <div className="md-type-fill" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Occupancy ring summary */}
          <div className="md-occ-summary">
            <div className="md-occ-ring-wrap">
              <svg viewBox="0 0 100 100" className="md-occ-ring">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="url(#goldGrad)" strokeWidth="10"
                  strokeDasharray={`${occupancyRate * 2.513} 251.3`}
                  strokeLinecap="round"
                  strokeDashoffset="62.8"
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#F5D76E" />
                  </linearGradient>
                </defs>
                <text x="50" y="50" textAnchor="middle" dy="0.35em" fill="#D4AF37" fontSize="18" fontWeight="700">
                  {occupancyRate}%
                </text>
              </svg>
            </div>
            <div className="md-occ-details">
              <div className="md-occ-det-item">
                <span className="md-occ-dot" style={{ background: 'var(--primary-color)' }}/>
                <span>Occupied <strong>{occupiedRooms}</strong></span>
              </div>
              <div className="md-occ-det-item">
                <span className="md-occ-dot" style={{ background: 'rgba(255,255,255,0.15)' }}/>
                <span className="text-muted">Available <strong>{availableRooms}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Revenue Breakdown ── */}
      <div className="md-bottom-row">

        {/* Revenue */}
        <div className="glass-panel md-revenue-panel">
          <div className="md-panel-header">
            <h2 className="md-panel-title"><FiDollarSign size={16} /> Revenue Summary</h2>
          </div>
          <div className="md-metric-list">
            {[
              { label: 'Completed Stays',    val: checkedOut.length,         isCount: true },
              { label: 'Active Check-ins',   val: checkedIn,                  isCount: true },
              { label: 'Pending Confirms',   val: confirmed,                  isCount: true },
              { label: 'Avg Rate per Stay',  val: `$${Math.round(revenue / (checkedOut.length || 1)).toLocaleString()}` },
              { label: 'Total Revenue',      val: `$${revenue.toLocaleString()}`, highlight: true },
            ].map((m, i) => (
              <div key={i} className={`md-metric-row ${m.highlight ? 'highlight' : ''}`}>
                <span className={m.highlight ? '' : 'text-muted'}>{m.label}</span>
                <span style={m.highlight ? { color: 'var(--primary-color)', fontWeight: 700 } : { fontWeight: 600 }}>
                  {m.val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="glass-panel" style={{ flex: 2, padding: 0, overflow: 'hidden' }}>
          <div className="md-panel-header" style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid var(--glass-border)' }}>
            <h2 className="md-panel-title"><FiTrendingUp size={16} /> Recent Bookings</h2>
            <span className="text-muted" style={{ fontSize: '0.82rem' }}>{recentBookings.length} shown</span>
          </div>
          <div className="md-bk-header">
            <span>Guest</span><span>Room</span><span>Status</span><span>Value</span>
          </div>
          {recentBookings.map((b, i) => {
            const ss = statusStyle(b.status);
            return (
              <div key={b._id} className="md-bk-row" style={{ animationDelay: `${i * 0.04}s` }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{b.user?.name || 'Walk-in'}</span>
                <span className="text-muted" style={{ fontSize: '0.85rem' }}>{b.room?.roomNumber || '—'}</span>
                <span>
                  <span
                    style={{
                      display: 'inline-block', padding: '0.2rem 0.6rem',
                      borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
                      background: ss.bg, color: ss.color,
                    }}
                  >
                    {b.status}
                  </span>
                </span>
                <span style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '0.9rem' }}>
                  ${(b.totalPrice || 0).toLocaleString()}
                </span>
              </div>
            );
          })}
          {recentBookings.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No booking data.</div>
          )}
        </div>
      </div>

      <style>{`
        .md-kpi-grid {
          display: grid; grid-template-columns: repeat(4,1fr); gap: 1.25rem; margin-bottom: 1.75rem;
        }
        @media (max-width: 1024px) { .md-kpi-grid { grid-template-columns: repeat(2,1fr); } }

        .md-kpi-card {
          background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 18px;
          padding: 1.5rem; position: relative; overflow: hidden;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .md-kpi-card::after {
          content:''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
          background: var(--kc);
        }
        .md-kpi-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.4); }

        .md-kpi-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; }
        .md-kpi-icon { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.05rem; }
        .md-kpi-trend { font-size: 1rem; color: #2ecc71; }
        .md-kpi-val   { font-size: 2rem; font-weight: 700; line-height: 1; margin-bottom: 0.3rem; }
        .md-kpi-label { font-size: 0.82rem; font-weight: 600; margin-bottom: 0.25rem; }
        .md-kpi-sub   { font-size: 0.75rem; }

        .md-mid-row { display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
        @media (max-width: 900px) { .md-mid-row { grid-template-columns: 1fr; } }

        .md-panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .md-panel-title { font-size: 0.95rem; font-family: var(--font-family-title); color: var(--primary-color); margin: 0; display: flex; align-items: center; gap: 0.5rem; }

        .md-trend-panel { }
        .md-bar-group { display: flex; align-items: flex-end; gap: 0.75rem; height: 140px; }
        .md-day-bar { display: flex; flex-direction: column; align-items: center; gap: 0.35rem; flex: 1; }
        .md-bar-wrap { flex: 1; width: 100%; display: flex; align-items: flex-end; background: rgba(255,255,255,0.05); border-radius: 6px 6px 0 0; min-height: 4px; position: relative; }
        .md-bar-inner { width: 100%; background: var(--gold-gradient); border-radius: 6px 6px 0 0; min-height: 4px; transition: height 0.8s cubic-bezier(0.4,0,0.2,1); }
        .md-bar-day { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; }
        .md-bar-num { font-size: 0.68rem; color: var(--primary-color); font-weight: 700; }

        .md-room-types { display: flex; flex-direction: column; gap: 1.1rem; margin-bottom: 1.5rem; }
        .md-type-row { display: flex; align-items: center; gap: 0.85rem; }
        .md-type-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }
        .md-type-top { display: flex; justify-content: space-between; margin-bottom: 0.35rem; }
        .md-type-name { font-size: 0.82rem; font-weight: 500; }
        .md-type-count { font-size: 0.78rem; font-weight: 700; }
        .md-type-track { height: 6px; background: rgba(255,255,255,0.06); border-radius: 20px; overflow: hidden; }
        .md-type-fill { height: 100%; border-radius: 20px; transition: width 0.8s ease; min-width: 4px; }

        .md-occ-summary { display: flex; align-items: center; gap: 1.5rem; padding-top: 1.25rem; border-top: 1px solid var(--glass-border); }
        .md-occ-ring-wrap { width: 80px; flex-shrink: 0; }
        .md-occ-ring { width: 100%; }
        .md-occ-details { display: flex; flex-direction: column; gap: 0.6rem; }
        .md-occ-det-item { display: flex; align-items: center; gap: 0.6rem; font-size: 0.82rem; }
        .md-occ-dot { width: 10px; height: 10px; border-radius: 3px; flex-shrink: 0; }

        .md-bottom-row { display: flex; gap: 1.5rem; }
        @media (max-width: 900px) { .md-bottom-row { flex-direction: column; } }

        .md-revenue-panel { min-width: 220px; }
        .md-metric-list { display: flex; flex-direction: column; gap: 0; }
        .md-metric-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.85rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 0.87rem;
        }
        .md-metric-row:last-child { border-bottom: none; }
        .md-metric-row.highlight { padding-top: 1rem; margin-top: 0.5rem; border-top: 2px solid var(--primary-color); border-bottom: none; }

        .md-bk-header {
          display: grid; grid-template-columns: 2fr 1fr 1.2fr 1fr;
          padding: 0.65rem 1.75rem; background: rgba(0,0,0,0.25);
          font-size: 0.68rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--text-muted);
          border-bottom: 1px solid var(--glass-border);
        }
        .md-bk-row {
          display: grid; grid-template-columns: 2fr 1fr 1.2fr 1fr;
          align-items: center; padding: 0.85rem 1.75rem;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.2s; animation: fadeInUp 0.35s ease both;
        }
        .md-bk-row:last-child { border-bottom: none; }
        .md-bk-row:hover { background: rgba(212,175,55,0.03); }
      `}</style>
    </div>
  );
};

export default ManagerDashboard;
