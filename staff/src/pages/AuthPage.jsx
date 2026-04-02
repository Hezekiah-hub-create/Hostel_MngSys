import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiShield } from 'react-icons/fi';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      // login method redirects to valid role-dashboard
      // and it fails if backend says unauthorized
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#050505', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Left side: Enterprise Login Form */}
      <div style={{ flex: '1 1 40%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem', background: '#111', borderRight: '1px solid #333' }}>
        <div style={{ width: '100%', maxWidth: '380px' }} className="animate-fade-in">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '3rem' }}>
            <FiShield size={32} color="#007bff" />
            <h1 style={{ fontSize: '1.5rem', color: '#fff', margin: 0, fontWeight: '600' }}>HMS Access Control</h1>
          </div>

          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#f5f5f5' }}>Staff Portal</h2>
          <p style={{ color: '#888', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
            Authorized personnel only. Contact the system administrator if you cannot access your account.
          </p>

          {error && <div style={{ color: '#ff4d4f', marginBottom: '1.5rem', padding: '0.8rem', background: 'rgba(255, 77, 79, 0.1)', borderLeft: '4px solid #ff4d4f', borderRadius: '4px', fontSize: '0.9rem' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#ccc', fontSize: '0.9rem' }}>Employee Email</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FiMail style={{ position: 'absolute', left: '1rem', color: '#666' }} />
                <input 
                  type="email" 
                  placeholder="admin@hms.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '6px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = '#007bff'}
                  onBlur={(e) => e.target.style.borderColor = '#333'}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <label style={{ color: '#ccc', fontSize: '0.9rem' }}>Password</label>
              </div>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <FiLock style={{ position: 'absolute', left: '1rem', color: '#666' }} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', background: '#000', border: '1px solid #333', color: '#fff', borderRadius: '6px', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={(e) => e.target.style.borderColor = '#007bff'}
                  onBlur={(e) => e.target.style.borderColor = '#333'}
                />
              </div>
            </div>
            
            <button type="submit" style={{ width: '100%', padding: '1rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.target.style.background = '#0056b3'} onMouseOut={(e) => e.target.style.background = '#007bff'}>
              Secure Login
            </button>
          </form>

        </div>
      </div>
      
      {/* Right side: Abstract graphic/info */}
      <div style={{ flex: '1 1 60%', background: 'linear-gradient(135deg, #050505 0%, #1a1a2e 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '4rem', color: '#fff', textAlign: 'center' }}>
         <div style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '3rem', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(10px)', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#007bff' }}>Operations Management</h2>
            <p style={{ color: '#aaa', lineHeight: '1.6', marginBottom: '2rem' }}>
               Welcome to the centralized internal control system. Manage bookings, oversee analytics, and administer the hotel securely from a single, unified source of truth.
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-around', color: '#666', fontSize: '0.9rem' }}>
              <span>Encrypted</span>
              <span>•</span>
              <span>Monitored</span>
              <span>•</span>
              <span>Logged</span>
            </div>
         </div>
      </div>

    </div>
  );
};

export default AuthPage;
