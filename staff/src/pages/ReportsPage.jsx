import { useEffect, useState } from 'react';
import { useHotel } from '../context/HotelContext';
import {
  FiTrendingUp, FiDollarSign, FiBarChart2, FiPieChart,
  FiDownload, FiCalendar, FiRefreshCw, FiCheckCircle
} from 'react-icons/fi';

const PERIODS = ['7 Days', '30 Days', '90 Days', 'All Time'];

const ReportsPage = () => {
  const { rooms, bookings, users, fetchRooms, fetchBookings, fetchUsers } = useHotel();
  const [period, setPeriod] = useState('30 Days');
  const [exported, setExported] = useState(false);

  useEffect(() => {
    fetchRooms();
    fetchBookings();
    fetchUsers();
  }, [fetchRooms, fetchBookings, fetchUsers]);

  /* ── Derived Metrics ── */
  const totalRevenue     = bookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
  const totalBookings    = bookings.length;
  const avgBookingValue  = totalBookings ? Math.round(totalRevenue / totalBookings) : 0;
  const availableRooms   = rooms.filter(r => r.status === 'Available').length;
  const occupancyRate    = rooms.length ? Math.round(((rooms.length - availableRooms) / rooms.length) * 100) : 0;
  const checkedOut       = bookings.filter(b => b.status === 'CheckedOut');
  const checkedIn        = bookings.filter(b => b.status === 'CheckedIn');
  const confirmed        = bookings.filter(b => b.status === 'Confirmed');
  const totalGuests      = users.filter(u => u.role === 'client').length;

  /* Room type breakdown */
  const roomTypes = rooms.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {});
  const roomTypeEntries = Object.entries(roomTypes).sort((a, b) => b[1] - a[1]);
  const maxTypeCount = roomTypeEntries[0]?.[1] || 1;

  /* Booking status breakdown */
  const statusBreakdown = [
    { label: 'Confirmed',  count: confirmed.length,  color: '#3498db' },
    { label: 'Checked In', count: checkedIn.length,   color: '#D4AF37' },
    { label: 'Checked Out',count: checkedOut.length,  color: '#2ecc71' },
    { label: 'Cancelled',  count: bookings.filter(b => b.status === 'Cancelled').length, color: '#e74c3c' },
  ];
  const maxStatus = Math.max(...statusBreakdown.map(s => s.count), 1);

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  const KPIs = [
    { icon: <FiDollarSign />,  label: 'Total Revenue',       value: `GH₵${totalRevenue.toLocaleString()}`,   color: '#D4AF37', change: '+12%' },
    { icon: <FiBarChart2 />,   label: 'Total Bookings',      value: totalBookings,                          color: '#3498db', change: '+8%'  },
    { icon: <FiTrendingUp />,  label: 'Avg Booking Value',   value: `GH₵${avgBookingValue}`,                  color: '#2ecc71', change: '+3%'  },
    { icon: <FiPieChart />,    label: 'Occupancy Rate',      value: `${occupancyRate}%`,                    color: '#9b59b6', change: `${occupancyRate > 50 ? '+' : '-'}5%` },
    { icon: <FiCalendar />,    label: 'Checked Out Stays',   value: checkedOut.length,                      color: '#e67e22', change: '' },
    { icon: <FiBarChart2 />,   label: 'Registered Guests',   value: totalGuests,                            color: '#1abc9c', change: '' },
  ];

  return (
    <div className="animate-fade-in">

      {/* ── Header ── */}
      <div className="rp-header">
        <div>
          <h1 style={{ fontFamily: 'var(--font-family-title)', color: 'var(--primary-color)', marginBottom: '0.4rem' }}>
            Executive Reporting
          </h1>
          <p className="text-muted">Consolidated performance metrics and financial summaries.</p>
        </div>
        <div className="rp-header-actions">
          {/* Period Selector */}
          <div className="rp-period-group">
            {PERIODS.map(p => (
              <button
                key={p}
                className={`rp-period-btn ${period === p ? 'active' : ''}`}
                onClick={() => setPeriod(p)}
              >{p}</button>
            ))}
          </div>
          <button className="btn-primary rp-export-btn" onClick={handleExport}>
            {exported ? <FiCheckCircle size={15} /> : <FiDownload size={15} />}
            {exported ? 'Exported!' : 'Export Report'}
          </button>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div className="rp-kpi-grid">
        {KPIs.map((kpi, i) => (
          <div key={i} className="rp-kpi-card" style={{ '--kpi-color': kpi.color }}>
            <div className="rp-kpi-icon" style={{ color: kpi.color, background: `${kpi.color}1a` }}>
              {kpi.icon}
            </div>
            <div className="rp-kpi-info">
              <div className="rp-kpi-val">{kpi.value}</div>
              <div className="rp-kpi-label">{kpi.label}</div>
            </div>
            {kpi.change && (
              <span className={`rp-kpi-change ${kpi.change.startsWith('+') ? 'pos' : 'neg'}`}>
                {kpi.change}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="rp-charts-row">

        {/* Booking Status Chart */}
        <div className="glass-panel rp-chart-panel">
          <div className="rp-chart-header">
            <h2 className="rp-chart-title">Booking Status Breakdown</h2>
          </div>
          <div className="rp-bar-chart">
            {statusBreakdown.map(s => (
              <div key={s.label} className="rp-bar-row">
                <div className="rp-bar-label">{s.label}</div>
                <div className="rp-bar-track">
                  <div
                    className="rp-bar-fill"
                    style={{
                      width: `${(s.count / maxStatus) * 100}%`,
                      background: s.color,
                    }}
                  />
                </div>
                <div className="rp-bar-val" style={{ color: s.color }}>{s.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Room Type Chart */}
        <div className="glass-panel rp-chart-panel">
          <div className="rp-chart-header">
            <h2 className="rp-chart-title">Room Type Inventory</h2>
          </div>
          <div className="rp-bar-chart">
            {roomTypeEntries.length === 0 ? (
              <p className="text-muted" style={{ textAlign: 'center', padding: '2rem' }}>No room data.</p>
            ) : roomTypeEntries.map(([type, count], i) => {
              const colors = ['#D4AF37','#3498db','#2ecc71','#9b59b6','#e67e22'];
              return (
                <div key={type} className="rp-bar-row">
                  <div className="rp-bar-label">{type}</div>
                  <div className="rp-bar-track">
                    <div
                      className="rp-bar-fill"
                      style={{ width: `${(count / maxTypeCount) * 100}%`, background: colors[i % colors.length] }}
                    />
                  </div>
                  <div className="rp-bar-val" style={{ color: colors[i % colors.length] }}>{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Occupancy Gauge ── */}
      <div className="glass-panel rp-occupancy-panel">
        <div className="rp-chart-header">
          <h2 className="rp-chart-title">Live Occupancy</h2>
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>{rooms.length} total rooms</span>
        </div>
        <div className="rp-occ-track">
          <div className="rp-occ-fill" style={{ width: `${occupancyRate}%` }}>
            <span className="rp-occ-label">{occupancyRate}%</span>
          </div>
        </div>
        <div className="rp-occ-legend">
          <div className="rp-occ-leg-item">
            <span className="rp-occ-dot" style={{ background: 'var(--gold-gradient)' }} />
            <span>Occupied ({rooms.length - availableRooms} rooms)</span>
          </div>
          <div className="rp-occ-leg-item">
            <span className="rp-occ-dot" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid var(--glass-border)' }} />
            <span className="text-muted">Available ({availableRooms} rooms)</span>
          </div>
        </div>
      </div>

      {/* ── Recent Transactions ── */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="rp-table-toolbar">
          <h2 className="rp-chart-title">Recent Booking Transactions</h2>
          <button className="btn-action" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FiRefreshCw size={13} /> Refresh
          </button>
        </div>

        <div className="rp-table-head">
          <span>Guest</span><span>Room</span><span>Status</span><span>Value</span><span>Date</span>
        </div>

        {bookings.slice(0, 10).map((b, i) => (
          <div key={b._id} className="rp-table-row" style={{ animationDelay: `${i * 0.04}s` }}>
            <span style={{ fontWeight: 600 }}>{b.user?.name || 'Walk-in'}</span>
            <span className="text-muted">Room {b.room?.roomNumber || '—'}</span>
            <span>
              <span className={`status-badge ${b.status.toLowerCase()}`}>{b.status}</span>
            </span>
            <span style={{ color: 'var(--primary-color)', fontWeight: 700 }}>
              GH₵${(b.totalPrice || 0).toLocaleString()}
            </span>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              {new Date(b.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        ))}

        {bookings.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            No booking records found.
          </div>
        )}
      </div>

      <style>{`
        .rp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; gap: 1.5rem; }
        .rp-header-actions { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }

        .rp-period-group {
          display: flex; background: rgba(0,0,0,0.3); border: 1px solid var(--glass-border);
          border-radius: 10px; overflow: hidden;
        }
        .rp-period-btn {
          padding: 0.5rem 1rem; border: none; background: transparent;
          color: var(--text-muted); font-size: 0.8rem; cursor: pointer; transition: all 0.2s;
          white-space: nowrap;
        }
        .rp-period-btn.active { background: var(--gold-gradient); color: #000; font-weight: 700; }
        .rp-period-btn:not(.active):hover { color: var(--primary-color); }

        .rp-export-btn { display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; }

        .rp-kpi-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; margin-bottom: 1.75rem;
        }
        @media (max-width: 900px) { .rp-kpi-grid { grid-template-columns: repeat(2, 1fr); } }

        .rp-kpi-card {
          background: var(--glass-bg); border: 1px solid var(--glass-border);
          border-radius: 16px; padding: 1.4rem 1.6rem;
          display: flex; align-items: center; gap: 1.25rem;
          transition: all 0.25s; position: relative; overflow: hidden;
        }
        .rp-kpi-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: var(--kpi-color, var(--primary-color));
        }
        .rp-kpi-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.35); }

        .rp-kpi-icon {
          width: 48px; height: 48px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
        }
        .rp-kpi-info { flex: 1; }
        .rp-kpi-val  { font-size: 1.7rem; font-weight: 700; line-height: 1.1; }
        .rp-kpi-label{ font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.07em; margin-top: 0.3rem; }
        .rp-kpi-change {
          font-size: 0.78rem; font-weight: 700; padding: 0.25rem 0.6rem;
          border-radius: 20px; align-self: flex-start;
        }
        .rp-kpi-change.pos { background: rgba(46,204,113,0.15); color: #2ecc71; }
        .rp-kpi-change.neg { background: rgba(231,76,60,0.15);  color: #e74c3c; }

        .rp-charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
        @media (max-width: 900px) { .rp-charts-row { grid-template-columns: 1fr; } }

        .rp-chart-panel { }
        .rp-chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.75rem; }
        .rp-chart-title { font-size: 1rem; font-family: var(--font-family-title); color: var(--primary-color); margin: 0; }

        .rp-bar-chart { display: flex; flex-direction: column; gap: 1.2rem; }
        .rp-bar-row { display: flex; align-items: center; gap: 1rem; }
        .rp-bar-label { font-size: 0.8rem; color: var(--text-muted); width: 90px; flex-shrink: 0; }
        .rp-bar-track {
          flex: 1; height: 10px; background: rgba(255,255,255,0.06); border-radius: 20px; overflow: hidden;
        }
        .rp-bar-fill { height: 100%; border-radius: 20px; transition: width 0.8s cubic-bezier(0.4,0,0.2,1); min-width: 4px; }
        .rp-bar-val { width: 30px; text-align: right; font-size: 0.82rem; font-weight: 700; flex-shrink: 0; }

        .rp-occupancy-panel { margin-bottom: 1.5rem; }
        .rp-occ-track {
          height: 36px; background: rgba(255,255,255,0.06); border-radius: 20px;
          overflow: hidden; margin: 0.75rem 0 1.25rem;
        }
        .rp-occ-fill {
          height: 100%; background: var(--gold-gradient); border-radius: 20px;
          display: flex; align-items: center; justify-content: flex-end; padding-right: 1rem;
          transition: width 1s cubic-bezier(0.4,0,0.2,1); min-width: 48px;
        }
        .rp-occ-label { font-size: 0.8rem; font-weight: 700; color: #000; }
        .rp-occ-legend { display: flex; gap: 2rem; }
        .rp-occ-leg-item { display: flex; align-items: center; gap: 0.6rem; font-size: 0.85rem; }
        .rp-occ-dot { width: 14px; height: 14px; border-radius: 4px; flex-shrink: 0; }

        .rp-table-toolbar {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.25rem 2rem; border-bottom: 1px solid var(--glass-border);
        }
        .rp-table-head {
          display: grid; grid-template-columns: 2fr 1fr 1.2fr 1fr 1.2fr;
          padding: 0.7rem 2rem; background: rgba(0,0,0,0.25);
          font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--text-muted);
          border-bottom: 1px solid var(--glass-border);
        }
        .rp-table-row {
          display: grid; grid-template-columns: 2fr 1fr 1.2fr 1fr 1.2fr;
          align-items: center; padding: 0.9rem 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.2s; animation: fadeInUp 0.35s ease both;
        }
        .rp-table-row:last-child { border-bottom: none; }
        .rp-table-row:hover { background: rgba(212,175,55,0.03); }
      `}</style>
    </div>
  );
};

export default ReportsPage;
