import { useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import { FiUsers, FiSettings, FiShield, FiDatabase, FiAlertCircle, FiKey, FiHome, FiActivity, FiCpu, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

const StatCard = ({ icon: Icon, label, value, accent, sub }) => (
  <div style={{
    background: 'rgba(255,255,255,0.03)',
    border: `1px solid ${accent ? accent + '33' : 'rgba(255,255,255,0.08)'}`,
    borderTop: `3px solid ${accent || '#D4AF37'}`,
    borderRadius: '16px',
    padding: '1.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    cursor: 'default',
    position: 'relative',
    overflow: 'hidden',
  }}
  onMouseEnter={e => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = `0 12px 30px ${(accent || '#D4AF37')}22`;
  }}
  onMouseLeave={e => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'none';
  }}>
    <div style={{
      position: 'absolute', top: 0, right: 0, width: '80px', height: '80px',
      background: `radial-gradient(circle at top right, ${accent || '#D4AF37'}15, transparent 70%)`,
      borderRadius: '0 16px 0 80px'
    }} />
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', fontWeight: 600 }}>{label}</span>
      <Icon style={{ color: accent || '#D4AF37', fontSize: '1.25rem', opacity: 0.9 }} />
    </div>
    <div style={{ fontSize: '2.8rem', fontWeight: 700, color: '#fff', lineHeight: 1, letterSpacing: '-2px', fontFamily: 'Inter, sans-serif' }}>
      {value}
    </div>
    {sub && <div style={{ fontSize: '0.8rem', color: '#555' }}>{sub}</div>}
  </div>
);

const RolePill = ({ role }) => {
  const map = {
    admin: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'rgba(239,68,68,0.3)' },
    manager: { bg: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: 'rgba(212,175,55,0.3)' },
    receptionist: { bg: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
    client: { bg: 'rgba(16,185,129,0.15)', color: '#10b981', border: 'rgba(16,185,129,0.3)' },
  };
  const s = map[role] || { bg: 'rgba(255,255,255,0.08)', color: '#aaa', border: 'rgba(255,255,255,0.1)' };
  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      padding: '0.2rem 0.65rem', borderRadius: '999px',
      fontSize: '0.72rem', fontWeight: 700, textTransform: 'capitalize', letterSpacing: '0.03em'
    }}>{role}</span>
  );
};

const OccupancyBar = ({ label, value, max, color }) => {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: '1.1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <span style={{ fontSize: '0.85rem', color: '#aaa' }}>{label}</span>
        <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{value} <span style={{ color: '#555', fontWeight: 400 }}>/ {max}</span></span>
      </div>
      <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: '99px',
          background: color || 'linear-gradient(90deg, #D4AF37, #B29124)',
          transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
          boxShadow: `0 0 8px ${color || '#D4AF37'}66`
        }} />
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { users, rooms, bookings, fetchUsers, fetchRooms, fetchBookings } = useHotel();

  useEffect(() => {
    fetchUsers();
    fetchRooms();
    fetchBookings();
  }, [fetchUsers, fetchRooms, fetchBookings]);

  const totalUsers = users.length;
  const staffUsers = users.filter(u => ['admin', 'manager', 'receptionist'].includes(u.role)).length;
  const clientUsers = users.filter(u => u.role === 'client').length;
  const needsReset = users.filter(u => u.needsPasswordChange).length;
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === 'Available').length;
  const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
  const maintenanceRooms = rooms.filter(r => r.status === 'Maintenance').length;
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const checkedIn = bookings.filter(b => b.status === 'checkedin').length;

  const activityItems = [
    { icon: FiCheckCircle, color: '#10b981', text: `${confirmedBookings} bookings currently confirmed`, time: 'Live' },
    { icon: FiHome, color: '#D4AF37', text: `${occupiedRooms} rooms occupied out of ${totalRooms}`, time: 'Live' },
    { icon: needsReset > 0 ? FiAlertCircle : FiShield, color: needsReset > 0 ? '#ef4444' : '#10b981',
      text: needsReset > 0 ? `${needsReset} user(s) require password reset` : 'All user passwords are secure', time: 'Live' },
    { icon: FiUsers, color: '#3b82f6', text: `${checkedIn} guests currently checked in`, time: 'Live' },
    { icon: FiCpu, color: '#8b5cf6', text: `System running normally — ${totalBookings} total records logged`, time: 'System' },
  ];

  return (
    <div className="animate-fade-in" style={{ width: '100%' }}>

      {/* Header */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.5rem' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #D4AF37, #B29124)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(212,175,55,0.35)'
            }}>
              <FiSettings style={{ color: '#000', fontSize: '1.2rem' }} />
            </div>
            <h1 style={{ margin: 0, fontSize: '1.9rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff' }}>
              System Administration
            </h1>
          </div>
          <p style={{ color: '#555', margin: 0, fontSize: '0.9rem' }}>
            Full system overview · Manage users, rooms & access controls
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.6rem 1.25rem', borderRadius: '10px' }}>
            Export Report
          </button>
          <button style={{
            background: 'linear-gradient(135deg, #D4AF37, #B29124)', color: '#000',
            padding: '0.6rem 1.25rem', borderRadius: '10px', border: 'none',
            fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(212,175,55,0.3)',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            <FiUsers size={14} /> Add User
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard icon={FiUsers} label="Total Users" value={totalUsers} sub={`${staffUsers} staff · ${clientUsers} clients`} />
        <StatCard icon={FiShield} label="Staff Accounts" value={staffUsers} accent="#3b82f6" sub="Admin, Manager, Receptionist" />
        <StatCard icon={FiHome} label="Total Rooms" value={totalRooms} accent="#10b981" sub={`${availableRooms} available now`} />
        <StatCard icon={FiDatabase} label="Total Records" value={totalBookings} accent="#8b5cf6" sub={`${confirmedBookings} confirmed`} />
        {needsReset > 0 && (
          <StatCard icon={FiAlertCircle} label="Needs PW Reset" value={needsReset} accent="#ef4444" sub="Requires attention" />
        )}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Users Table */}
        <div style={{
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '20px', padding: '1.75rem', backdropFilter: 'blur(12px)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#fff', fontWeight: 600 }}>User Directory</h2>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#555' }}>{totalUsers} registered accounts</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', display: 'inline-block' }} />
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Live</span>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr>
                {['User', 'Role', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.6rem 1rem', color: '#444', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 8).map((u, i) => (
                <tr key={u._id}
                  style={{ transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '0.9rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: `hsl(${(i * 47) % 360}, 60%, 45%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.8rem', fontWeight: 700, color: '#fff', flexShrink: 0
                      }}>
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ color: '#e5e7eb', fontSize: '0.9rem', fontWeight: 500 }}>{u.name}</div>
                        <div style={{ color: '#444', fontSize: '0.75rem' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.9rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <RolePill role={u.role} />
                  </td>
                  <td style={{ padding: '0.9rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {u.needsPasswordChange
                      ? <span style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700 }}>Needs Reset</span>
                      : <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', padding: '0.2rem 0.65rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700 }}>Active</span>
                    }
                  </td>
                  <td style={{ padding: '0.9rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)', padding: '0.3rem 0.7rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                        <FiKey size={11} style={{ marginRight: '4px' }} /> Reset
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Occupancy */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.75rem' }}>
            <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.1rem', color: '#fff', fontWeight: 600 }}>Room Occupancy</h2>
            <OccupancyBar label="Available" value={availableRooms} max={totalRooms} color="#10b981" />
            <OccupancyBar label="Occupied" value={occupiedRooms} max={totalRooms} color="linear-gradient(90deg, #D4AF37, #B29124)" />
            <OccupancyBar label="Maintenance" value={maintenanceRooms} max={totalRooms} color="#ef4444" />
            <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(212,175,55,0.07)', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.15)', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#D4AF37', letterSpacing: '-1px' }}>
                {totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0}%
              </div>
              <div style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Occupancy Rate</div>
            </div>
          </div>

          {/* Role breakdown */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.75rem' }}>
            <h2 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', color: '#fff', fontWeight: 600 }}>Role Breakdown</h2>
            {['admin', 'manager', 'receptionist', 'client'].map(role => {
              const count = users.filter(u => u.role === role).length;
              const pct = totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0;
              const colors = { admin: '#ef4444', manager: '#D4AF37', receptionist: '#3b82f6', client: '#10b981' };
              return (
                <div key={role} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors[role], flexShrink: 0, boxShadow: `0 0 6px ${colors[role]}` }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.82rem', color: '#aaa', textTransform: 'capitalize' }}>{role}</span>
                      <span style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>{count}</span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: colors[role], borderRadius: '99px', boxShadow: `0 0 6px ${colors[role]}66` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '20px', padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#fff', fontWeight: 600 }}>System Activity</h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#555' }}>Real-time status overview</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '99px', padding: '0.3rem 0.8rem' }}>
            <FiActivity size={12} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>All Systems Normal</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
          {activityItems.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '1rem 1.25rem', background: 'rgba(0,0,0,0.2)',
              borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${item.color}33`}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
            >
              <div style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: `${item.color}18`, display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0,
                border: `1px solid ${item.color}33`
              }}>
                <item.icon style={{ color: item.color, fontSize: '1rem' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', color: '#d1d5db' }}>{item.text}</div>
                <div style={{ fontSize: '0.72rem', color: '#444', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.time}</div>
              </div>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color, boxShadow: `0 0 6px ${item.color}`, flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
