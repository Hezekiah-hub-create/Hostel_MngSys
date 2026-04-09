import { useEffect, useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { FiUserPlus, FiShield, FiMail, FiTrash2, FiKey, FiSearch, FiX } from 'react-icons/fi';

const ROLE_FILTERS = ['all', 'admin', 'manager', 'receptionist', 'client'];

const ROLE_META = {
  admin:        { label: 'Admin',       color: '#e74c3c', bg: 'rgba(231,76,60,0.12)',    border: 'rgba(231,76,60,0.3)'  },
  manager:      { label: 'Manager',     color: '#D4AF37', bg: 'rgba(212,175,55,0.12)',   border: 'rgba(212,175,55,0.3)' },
  receptionist: { label: 'Front Desk',  color: '#3498db', bg: 'rgba(52,152,219,0.12)',   border: 'rgba(52,152,219,0.3)' },
  client:       { label: 'Guest',       color: '#2ecc71', bg: 'rgba(46,204,113,0.12)',   border: 'rgba(46,204,113,0.3)' },
};

const avatarGradients = {
  admin:        'linear-gradient(135deg,#e74c3c,#c0392b)',
  manager:      'linear-gradient(135deg,#D4AF37,#F5D76E)',
  receptionist: 'linear-gradient(135deg,#3498db,#5dade2)',
  client:       'linear-gradient(135deg,#2ecc71,#27ae60)',
};

const UserManagement = () => {
  const { users, fetchUsers } = useHotel();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const base = filter === 'all' ? users : users.filter(u => u.role === filter);
  const filteredUsers = base.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const countByRole = (role) => users.filter(u => u.role === role).length;

  return (
    <div className="animate-fade-in">

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-family-title)', color: 'var(--primary-color)', marginBottom: '0.4rem' }}>
            Access Control
          </h1>
          <p className="text-muted">Manage staff accounts, system roles, and security permissions.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <FiUserPlus size={15} /> Provision Staff
        </button>
      </div>

      {/* ── Role Stats ── */}
      <div className="um-stats">
        {Object.entries(ROLE_META).map(([role, meta]) => (
          <div
            key={role}
            className="um-stat-card"
            style={{ borderColor: filter === role ? meta.color : 'var(--glass-border)', cursor: 'pointer' }}
            onClick={() => setFilter(filter === role ? 'all' : role)}
          >
            <div className="um-stat-dot" style={{ background: meta.color }} />
            <div>
              <div className="um-stat-val">{countByRole(role)}</div>
              <div className="um-stat-role">{meta.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Tabs + Search ── */}
      <div className="um-toolbar glass-panel">
        <div className="um-tabs">
          {ROLE_FILTERS.map(r => (
            <button
              key={r}
              className={`um-tab ${filter === r ? 'active' : ''}`}
              onClick={() => setFilter(r)}
            >
              {r === 'all' ? 'All Personnel' : ROLE_META[r]?.label || r}
              <span className="um-tab-count">
                {r === 'all' ? users.length : countByRole(r)}
              </span>
            </button>
          ))}
        </div>

        <div className="um-search-wrap">
          <FiSearch size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search personnel…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="um-search-input"
          />
          {search && (
            <button className="um-clear-btn" onClick={() => setSearch('')}><FiX size={12} /></button>
          )}
        </div>
      </div>

      {/* ── User Table ── */}
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="um-table-header">
          <span>Personnel</span>
          <span>Role</span>
          <span>Email</span>
          <span>Security Status</span>
          <span>Actions</span>
        </div>

        {filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            No users match your criteria.
          </div>
        ) : (
          filteredUsers.map((u, idx) => {
            const meta = ROLE_META[u.role] || ROLE_META.client;
            return (
              <div key={u._id} className="um-row" style={{ animationDelay: `${idx * 0.04}s` }}>

                {/* Avatar + Name */}
                <div className="um-cell um-profile">
                  <div
                    className="um-avatar"
                    style={{ background: avatarGradients[u.role] || 'var(--glass-border)' }}
                  >
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="um-name">{u.name}</div>
                    <div className="um-sub text-muted">{u.needsPasswordChange ? 'Password change required' : 'Active account'}</div>
                  </div>
                </div>

                {/* Role */}
                <div className="um-cell">
                  <span
                    className="um-role-badge"
                    style={{ color: meta.color, background: meta.bg, border: `1px solid ${meta.border}` }}
                  >
                    {meta.label}
                  </span>
                </div>

                {/* Email */}
                <div className="um-cell">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.87rem' }}>
                    <FiMail size={13} className="text-muted" />
                    <span style={{ color: 'var(--text-muted)' }}>{u.email}</span>
                  </div>
                </div>

                {/* Security Status */}
                <div className="um-cell">
                  {u.needsPasswordChange ? (
                    <span className="um-sec-badge warn">
                      <FiKey size={11} /> Cycle Required
                    </span>
                  ) : (
                    <span className="um-sec-badge ok">
                      <FiShield size={11} /> Secure
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="um-cell" style={{ gap: '0.6rem' }}>
                  <button className="btn-small secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <FiKey size={11} /> Reset PW
                  </button>
                  <button className="btn-small danger" title="Deactivate" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <FiTrash2 size={11} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style>{`
        .um-stats {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem;
        }
        .um-stat-card {
          background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 14px;
          padding: 1.1rem 1.4rem; display: flex; align-items: center; gap: 1rem;
          transition: all 0.2s; cursor: pointer;
        }
        .um-stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .um-stat-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink:0; }
        .um-stat-val { font-size: 1.6rem; font-weight: 700; line-height: 1; }
        .um-stat-role { font-size: 0.73rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.07em; margin-top: 0.2rem; }

        .um-toolbar {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0.75rem 1.25rem !important; margin-bottom: 1.25rem; border-radius: 12px !important; gap: 1rem;
        }
        .um-tabs { display: flex; gap: 0.4rem; flex-wrap: wrap; flex: 1; }
        .um-tab {
          display: flex; align-items: center; gap: 0.45rem;
          padding: 0.45rem 0.9rem; background: transparent;
          border: 1px solid var(--glass-border); border-radius: 8px;
          color: var(--text-muted); font-size: 0.8rem; cursor: pointer; transition: all 0.2s;
        }
        .um-tab:hover { border-color: rgba(212,175,55,0.35); color: var(--primary-color); }
        .um-tab.active { background: rgba(212,175,55,0.15); border-color: var(--primary-color); color: var(--primary-color); }
        .um-tab-count {
          background: rgba(255,255,255,0.08); padding: 0.05rem 0.45rem;
          border-radius: 20px; font-size: 0.68rem; font-weight: 700;
        }

        .um-search-wrap {
          display: flex; align-items: center; gap: 0.5rem;
          background: rgba(0,0,0,0.2); border: 1px solid var(--glass-border);
          border-radius: 10px; padding: 0.5rem 0.9rem; min-width: 200px;
        }
        .um-search-input { background: transparent; border: none; outline: none; color: var(--text-color); font-size: 0.85rem; flex: 1; font-family: var(--font-family-body); }
        .um-search-input::placeholder { color: var(--text-muted); }
        .um-clear-btn { background: none; border: none; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; }

        .um-table-header {
          display: grid; grid-template-columns: 2.5fr 1fr 2fr 1.2fr 1.5fr;
          padding: 0.75rem 2rem; background: rgba(0,0,0,0.3);
          font-size: 0.72rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--text-muted);
          border-bottom: 1px solid var(--glass-border);
        }
        .um-row {
          display: grid; grid-template-columns: 2.5fr 1fr 2fr 1.2fr 1.5fr;
          align-items: center; padding: 1rem 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.2s; animation: fadeInUp 0.35s ease both;
        }
        .um-row:last-child { border-bottom: none; }
        .um-row:hover { background: rgba(212,175,55,0.03); }

        .um-cell { display: flex; align-items: center; }
        .um-profile { gap: 1rem; }
        .um-avatar {
          width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 1.1rem; color: #000;
        }
        .um-name { font-weight: 600; font-size: 0.95rem; }
        .um-sub { font-size: 0.75rem; margin-top: 0.15rem; }

        .um-role-badge {
          display: inline-flex; align-items: center; padding: 0.25rem 0.7rem;
          border-radius: 20px; font-size: 0.72rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.05em;
        }

        .um-sec-badge {
          display: inline-flex; align-items: center; gap: 0.35rem;
          padding: 0.28rem 0.7rem; border-radius: 20px; font-size: 0.75rem; font-weight: 600;
        }
        .um-sec-badge.ok   { background: rgba(46,204,113,0.12);  color: #2ecc71; border: 1px solid rgba(46,204,113,0.25); }
        .um-sec-badge.warn { background: rgba(243,156,18,0.12);  color: #f39c12; border: 1px solid rgba(243,156,18,0.25); }
      `}</style>
    </div>
  );
};

export default UserManagement;
