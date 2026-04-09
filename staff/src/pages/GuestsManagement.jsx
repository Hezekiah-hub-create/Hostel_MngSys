import { useEffect, useState } from 'react';
import { useHotel } from '../context/HotelContext';
import {
  FiUsers, FiSearch, FiUserCheck, FiMail, FiCalendar, FiEye, FiX, FiPhone
} from 'react-icons/fi';

const GuestsManagement = () => {
  const { users, fetchUsers } = useHotel();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const guests = users.filter(u => u.role === 'client');
  const filteredGuests = guests.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const thisMonth = new Date().getMonth();
  const newThisMonth = guests.filter(g =>
    new Date(g.createdAt || Date.now()).getMonth() === thisMonth
  ).length;

  const avatarColors = [
    'linear-gradient(135deg,#D4AF37,#F5D76E)',
    'linear-gradient(135deg,#3498db,#5dade2)',
    'linear-gradient(135deg,#2ecc71,#27ae60)',
    'linear-gradient(135deg,#9b59b6,#8e44ad)',
    'linear-gradient(135deg,#e74c3c,#c0392b)',
  ];

  const getAvatarColor = (name) =>
    avatarColors[name.charCodeAt(0) % avatarColors.length];

  return (
    <div className="animate-fade-in">

      {/* ── Header ── */}
      <div className="gm-header">
        <div>
          <h1 className="gm-title">Guest Registry</h1>
          <p className="text-muted">Comprehensive list of all registered guests at Colonial Grand.</p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="gm-stats">
        <div className="gm-stat-card">
          <div className="gm-stat-icon gold">
            <FiUsers size={20} />
          </div>
          <div>
            <div className="gm-stat-value">{guests.length}</div>
            <div className="gm-stat-label">Total Guests</div>
          </div>
        </div>
        <div className="gm-stat-card">
          <div className="gm-stat-icon blue">
            <FiUserCheck size={20} />
          </div>
          <div>
            <div className="gm-stat-value">{newThisMonth}</div>
            <div className="gm-stat-label">New This Month</div>
          </div>
        </div>
        <div className="gm-stat-card">
          <div className="gm-stat-icon green">
            <FiUserCheck size={20} />
          </div>
          <div>
            <div className="gm-stat-value">{guests.length}</div>
            <div className="gm-stat-label">Verified</div>
          </div>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="gm-search-bar glass-panel">
        <div className="gm-search-input-wrap">
          <FiSearch className="gm-search-icon" />
          <input
            type="text"
            placeholder="Search by name or email address…"
            className="gm-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="gm-search-clear" onClick={() => setSearchTerm('')}>
              <FiX size={14} />
            </button>
          )}
        </div>
        <span className="text-muted" style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
          {filteredGuests.length} result{filteredGuests.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ── Guest Table ── */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="gm-table-header">
          <span>Guest Profile</span>
          <span>Contact</span>
          <span>Registered</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {filteredGuests.length === 0 ? (
          <div className="gm-empty">
            <FiUsers size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <p>No guests match your search.</p>
          </div>
        ) : (
          <div className="gm-list">
            {filteredGuests.map((guest, idx) => (
              <div key={guest._id} className="gm-row" style={{ animationDelay: `${idx * 0.04}s` }}>

                {/* Avatar + Name */}
                <div className="gm-cell gm-profile">
                  <div className="gm-avatar" style={{ background: getAvatarColor(guest.name) }}>
                    {guest.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="gm-name">{guest.name}</div>
                    <div className="gm-id text-muted">ID #{guest._id?.slice(-6).toUpperCase()}</div>
                  </div>
                </div>

                {/* Email */}
                <div className="gm-cell">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                    <FiMail size={13} className="text-muted" />
                    <span>{guest.email}</span>
                  </div>
                </div>

                {/* Date */}
                <div className="gm-cell">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                    <FiCalendar size={13} className="text-muted" />
                    <span>{new Date(guest.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="gm-cell">
                  <span className="gm-badge verified">
                    <span className="gm-badge-dot" /> Verified
                  </span>
                </div>

                {/* Actions */}
                <div className="gm-cell">
                  <button
                    className="gm-view-btn"
                    onClick={() => setSelectedGuest(guest)}
                  >
                    <FiEye size={13} /> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Guest Detail Drawer ── */}
      {selectedGuest && (
        <div className="gm-overlay" onClick={() => setSelectedGuest(null)}>
          <div className="gm-drawer" onClick={e => e.stopPropagation()}>
            <div className="gm-drawer-header">
              <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Guest Profile</h2>
              <button className="gm-close-btn" onClick={() => setSelectedGuest(null)}>
                <FiX size={18} />
              </button>
            </div>

            <div style={{ textAlign: 'center', padding: '2rem 0 1.5rem' }}>
              <div className="gm-avatar gm-avatar-lg" style={{ background: getAvatarColor(selectedGuest.name), margin: '0 auto 1rem' }}>
                {selectedGuest.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: '700' }}>{selectedGuest.name}</div>
              <span className="gm-badge verified" style={{ marginTop: '0.5rem', display: 'inline-flex' }}>
                <span className="gm-badge-dot" /> Verified Guest
              </span>
            </div>

            <div className="gm-drawer-fields">
              <div className="gm-drawer-field">
                <FiMail className="text-muted" />
                <div>
                  <div className="gm-field-label">Email Address</div>
                  <div className="gm-field-value">{selectedGuest.email}</div>
                </div>
              </div>
              <div className="gm-drawer-field">
                <FiCalendar className="text-muted" />
                <div>
                  <div className="gm-field-label">Member Since</div>
                  <div className="gm-field-value">
                    {new Date(selectedGuest.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .gm-header { margin-bottom: 2rem; }
        .gm-title { font-family: var(--font-family-title); color: var(--primary-color); margin-bottom: 0.4rem; }

        .gm-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem; }
        .gm-stat-card {
          background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 16px;
          padding: 1.4rem 1.6rem; display: flex; align-items: center; gap: 1.2rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .gm-stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .gm-stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .gm-stat-icon.gold  { background: rgba(212,175,55,0.15); color: var(--primary-color); }
        .gm-stat-icon.blue  { background: rgba(52,152,219,0.15); color: #3498db; }
        .gm-stat-icon.green { background: rgba(46,204,113,0.15); color: #2ecc71; }
        .gm-stat-value { font-size: 1.8rem; font-weight: 700; color: var(--primary-color); line-height: 1; }
        .gm-stat-label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; margin-top: 0.3rem; }

        .gm-search-bar {
          display: flex; align-items: center; gap: 1.5rem;
          padding: 0.9rem 1.5rem; margin-bottom: 1.25rem; border-radius: 14px !important;
        }
        .gm-search-input-wrap { flex: 1; display: flex; align-items: center; gap: 0.75rem; position: relative; }
        .gm-search-icon { color: var(--text-muted); flex-shrink: 0; }
        .gm-search-input {
          flex: 1; background: transparent; border: none; outline: none;
          color: var(--text-color); font-size: 0.95rem; font-family: var(--font-family-body);
        }
        .gm-search-input::placeholder { color: var(--text-muted); }
        .gm-search-clear {
          background: rgba(255,255,255,0.08); border: none; border-radius: 6px;
          color: var(--text-muted); cursor: pointer; padding: 0.3rem; display: flex; align-items: center;
          transition: all 0.2s;
        }
        .gm-search-clear:hover { color: var(--text-color); background: rgba(255,255,255,0.14); }

        .gm-table-header {
          display: grid; grid-template-columns: 2.5fr 2fr 1.5fr 1fr 1fr;
          padding: 0.75rem 2rem; background: rgba(0,0,0,0.3);
          font-size: 0.72rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--text-muted);
          border-bottom: 1px solid var(--glass-border);
        }

        .gm-list { display: flex; flex-direction: column; }

        .gm-row {
          display: grid; grid-template-columns: 2.5fr 2fr 1.5fr 1fr 1fr;
          align-items: center; padding: 1rem 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.2s;
          animation: fadeInUp 0.35s ease both;
        }
        .gm-row:last-child { border-bottom: none; }
        .gm-row:hover { background: rgba(212,175,55,0.04); }

        .gm-cell { display: flex; align-items: center; }

        .gm-profile { gap: 1rem; }
        .gm-avatar {
          width: 40px; height: 40px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 1.1rem; color: #000; flex-shrink: 0;
        }
        .gm-avatar-lg { width: 72px; height: 72px; border-radius: 18px; font-size: 2rem; }
        .gm-name { font-weight: 600; font-size: 0.95rem; }
        .gm-id { font-size: 0.75rem; margin-top: 0.15rem; }

        .gm-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.28rem 0.75rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600;
        }
        .gm-badge.verified { background: rgba(46,204,113,0.12); color: #2ecc71; border: 1px solid rgba(46,204,113,0.25); }
        .gm-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; display: inline-block; }

        .gm-view-btn {
          display: inline-flex; align-items: center; gap: 0.4rem;
          padding: 0.45rem 1.1rem; font-size: 0.78rem; font-weight: 600;
          letter-spacing: 0.05em; text-transform: uppercase;
          color: var(--primary-color); background: rgba(212,175,55,0.08);
          border: 1px solid rgba(212,175,55,0.3); border-radius: 8px;
          cursor: pointer; transition: all 0.25s ease; white-space: nowrap;
        }
        .gm-view-btn:hover {
          background: rgba(212,175,55,0.18); border-color: var(--primary-color);
          box-shadow: 0 4px 14px rgba(212,175,55,0.18); transform: translateY(-1px);
        }

        .gm-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 5rem 2rem; color: var(--text-muted);
        }

        .gm-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 1000;
          display: flex; justify-content: flex-end; animation: fadeIn 0.2s ease;
          backdrop-filter: blur(4px);
        }
        .gm-drawer {
          width: 380px; background: #111; border-left: 1px solid var(--glass-border);
          height: 100%; overflow-y: auto; animation: slideFromRight 0.3s cubic-bezier(0.25,0.46,0.45,0.94) both;
        }
        @keyframes slideFromRight { from { transform: translateX(100%); opacity:0; } to { transform: translateX(0); opacity:1; } }

        .gm-drawer-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.5rem 1.75rem; border-bottom: 1px solid var(--glass-border);
        }
        .gm-close-btn {
          background: rgba(255,255,255,0.07); border: 1px solid var(--glass-border);
          border-radius: 8px; color: var(--text-muted); cursor: pointer; padding: 0.4rem;
          display: flex; align-items: center; transition: all 0.2s;
        }
        .gm-close-btn:hover { color: var(--text-color); background: rgba(255,255,255,0.12); }

        .gm-drawer-fields { padding: 1.5rem 1.75rem; display: flex; flex-direction: column; gap: 1.25rem; }
        .gm-drawer-field { display: flex; align-items: flex-start; gap: 1rem; }
        .gm-field-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.07em; color: var(--text-muted); margin-bottom: 0.2rem; }
        .gm-field-value { font-size: 0.95rem; font-weight: 500; }
      `}</style>
    </div>
  );
};

export default GuestsManagement;
