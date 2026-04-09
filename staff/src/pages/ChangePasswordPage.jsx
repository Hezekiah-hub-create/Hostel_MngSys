import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiLock, FiShield } from 'react-icons/fi';

const ChangePasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { changePassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setIsSubmitting(true);
    try {
      await changePassword(newPassword);
    } catch (err) {
      setError(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page-container">
      <main className="login-main">
        <section className="login-card">
          <header className="branding-header">
            <FiShield className="branding-icon" />
            <h1 className="branding-title">Security Check</h1>
            <p className="branding-desc">Update your credentials to proceed</p>
          </header>
          
          {error && <div className="auth-alert" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="field-group">
              <label className="form-label"><FiLock className="icon-field" /> New Password</label>
              <input 
                type="password" 
                className="form-input"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="field-group">
              <label className="form-label"><FiLock className="icon-field" /> Confirm Password</label>
              <input 
                type="password" 
                className="form-input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Updating Registry...' : 'Update & Continue'}
            </button>
          </form>

          <p className="auth-footer" style={{ marginTop: '2rem' }}>
            Encrypted session security active
          </p>
        </section>
      </main>
    </div>
  );
};

export default ChangePasswordPage;
