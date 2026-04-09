import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useLoginForm } from '../hooks/useLoginForm';
import './AuthPage.css'; // Import the new premium stylesheet

const AuthPage = () => {
  const { login } = useAuth();
  const {
    formData,
    showPassword,
    errors,
    submitError,
    isSubmitting,
    handleChange,
    handleSubmit,
    togglePassword
  } = useLoginForm(async (email, password) => {
    await login(email, password);
  });

  return (
    <div className="auth-container">
      {/* Left side: branding/image with Ken Burns */}
      <div className="auth-branding">
        <div className="auth-branding-bg"></div>
        <div className="auth-branding-overlay"></div>
        
        <div className="auth-branding-content">
          <img src="/CH_LOGO.jpg" alt="Colonial Grand Logo" className="auth-logo-img" />
          <h1 className="auth-title">Colonial Grand</h1>
          <p className="auth-subtitle">
            Premium Staff Portal. Secure, encrypted access for authorized personnel.
          </p>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Welcome Back</h2>
            <p className="auth-form-subtitle">
              Enter your credentials to access the internal dashboard.
            </p>
          </div>

          {submitError && (
            <div className="auth-alert" role="alert">
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-input-group">
              <label className="auth-label">
                <FiMail /> Email Address
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="email-input"
                  type="email"
                  className={`auth-input ${errors.email ? 'has-error' : ''}`}
                  placeholder="staff@colonialgrand.com"
                  value={formData.email}
                  onChange={handleChange('email')}
                  disabled={isSubmitting}
                  autoComplete="email"
                  required
                />
              </div>
              {errors.email && (
                <span className="auth-error-text">{errors.email}</span>
              )}
            </div>

            <div className="auth-input-group">
              <label className="auth-label">
                <FiLock /> Password
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  className={`auth-input ${errors.password ? 'has-error' : ''}`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange('password')}
                  disabled={isSubmitting}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="auth-pwd-toggle"
                  onClick={togglePassword}
                  disabled={isSubmitting}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="auth-error-text">{errors.password}</span>
              )}
            </div>

            <button 
              type="submit" 
              className="auth-submit-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer">
            Your session is secured with military-grade encryption
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
