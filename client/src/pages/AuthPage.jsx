import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiUser, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password);
      }
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', paddingTop: '80px' }}>
      {/* Left side: branding/image */}
      <div style={{ 
        flex: 1, 
        background: 'linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url("https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80") center/cover no-repeat', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '2rem', 
        color: '#fff',
        textAlign: 'center' 
      }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>Colonial Grand</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '400px', lineHeight: '1.6' }}>Unlock access to exclusive rooms, direct room service, and tailored experiences.</p>
      </div>

      {/* Right side: Form */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem', background: 'var(--surface-color)' }}>
        <div style={{ width: '100%', maxWidth: '400px' }} className="animate-fade-in">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{isLogin ? 'Welcome Back' : 'Join Us'}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
            {isLogin ? 'Please sign in to access your dashboard.' : 'Register to plan your dream luxury stay.'}
          </p>

          {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', padding: '0.8rem', background: 'rgba(217, 83, 79, 0.1)', borderLeft: '4px solid var(--danger-color)', borderRadius: '4px' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label><FiUser /> Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required={!isLogin}
                  style={{ background: 'var(--bg-color)' }}
                />
              </div>
            )}
            
            <div className="form-group">
              <label><FiMail /> Email Address</label>
              <input 
                type="email" 
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={{ background: 'var(--bg-color)' }}
              />
            </div>
            
            <div className="form-group">
              <label><FiLock /> Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                style={{ background: 'var(--bg-color)' }}
              />
            </div>
            
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
            {isLogin ? "New to Colonial Grand? " : "Already have an account? "}
            <span 
              style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Register Here' : 'Log In Here'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
