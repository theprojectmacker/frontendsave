import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { loginAdmin } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await loginAdmin(email, password)

      if (!result.success) {
        setError(result.error || 'Invalid admin credentials')
        setShowErrorModal(true)
      }
    } catch (err) {
      setError('Connection error. Please try again.')
      setShowErrorModal(true)
      console.error('Admin login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setError('')
    setIsLoading(true)

    try {
      const result = await loginAdmin('freefall@gmail.com', 'freezeme21')

      if (!result.success) {
        setError(result.error || 'Admin account not available.')
        setShowErrorModal(true)
      }
    } catch (err) {
      setError('Connection error. Please try again.')
      setShowErrorModal(true)
      console.error('Admin login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const closeErrorModal = () => {
    setShowErrorModal(false)
    setError('')
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="animated-grid"></div>
      </div>

      <div className="login-wrapper">
        <div className="login-left">
          <div className="brand-section">
            <div className="brand-icon">🔒</div>
            <h1 className="brand-title">Admin Portal</h1>
            <p className="brand-tagline">Secure Management Hub</p>
          </div>

          <div className="story-section">
            <h2 className="story-headline">Manage Your Platform</h2>
            <p className="story-text">
              Administer users, monitor activity, and maintain platform security. Access comprehensive analytics and user management tools.
            </p>

            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">👥</div>
                <div className="feature-content">
                  <h4>User Management</h4>
                  <p>Manage users and platform access</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <div className="feature-content">
                  <h4>Analytics Dashboard</h4>
                  <p>Track platform metrics and user activity</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔐</div>
                <div className="feature-content">
                  <h4>Secure Access</h4>
                  <p>Enterprise-grade security and encryption</p>
                </div>
              </div>
            </div>

            <div className="trust-section">
              <p className="trust-text">Restricted to authorized administrators</p>
              <div className="trust-avatars">
                <div className="avatar">🔑</div>
                <div className="avatar">✓</div>
                <div className="avatar">🛡️</div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <button className="close-hint">✕</button>

            <div className="welcome-back">
              <h3>Admin Access</h3>
              <p>Enter your admin credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="form-input"
                  disabled={isLoading}
                  autoComplete="email"
                />
                <div className="input-icon">✉️</div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <div className="input-icon">🔒</div>
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="button-loader">
                    <span className="loader-spinner"></span> Signing in
                  </span>
                ) : (
                  <>
                    <span>Sign In as Admin</span>
                    <span className="arrow">→</span>
                  </>
                )}
              </button>

              <div className="divider">
                <span>or use demo</span>
              </div>

              <button
                type="button"
                className="demo-button"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                Try Admin Demo
              </button>
            </form>

            <div className="login-footer">
              <div className="footer-item">
                <span className="footer-icon">🌐</span>
                <span>No credit card needed</span>
              </div>
              <div className="footer-item">
                <span className="footer-icon">⏱️</span>
                <span>2-minute setup</span>
              </div>
            </div>
          </div>

          <div className="floating-card card-1">
            <div className="card-icon">📈</div>
            <p>35% average growth</p>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">⏱️</div>
            <p>Save 5 hours/week</p>
          </div>
        </div>
      </div>

      {showErrorModal && (
        <div className="modal-overlay">
          <div className="error-modal">
            <div className="modal-header">
              <div className="error-icon">⚠️</div>
              <h3>Login Failed</h3>
            </div>
            <p className="error-text">{error}</p>
            <button
              onClick={closeErrorModal}
              className="modal-button"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f172a;
          overflow: hidden;
          padding: 20px;
          position: relative;
        }

        .login-background {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 0;
        }

        .animated-grid {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image:
            linear-gradient(rgba(102, 126, 234, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102, 126, 234, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: gridMove 20s linear infinite;
        }

        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.25;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          top: -100px;
          left: -100px;
          animation: float 8s ease-in-out infinite;
        }

        .orb-2 {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          bottom: -50px;
          right: -50px;
          animation: float 10s ease-in-out infinite 1s;
        }

        .orb-3 {
          width: 250px;
          height: 250px;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          top: 50%;
          right: 10%;
          animation: float 9s ease-in-out infinite 2s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 30px); }
        }

        .login-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          width: 100%;
          max-width: 1300px;
          position: relative;
          z-index: 10;
          align-items: center;
        }

        .login-left {
          display: flex;
          flex-direction: column;
          gap: 48px;
          color: white;
        }

        .brand-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .brand-icon {
          font-size: 48px;
          margin-bottom: 8px;
        }

        .brand-title {
          font-size: 42px;
          font-weight: 900;
          margin: 0;
          letter-spacing: -1px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-tagline {
          font-size: 18px;
          color: #94a3b8;
          margin: 0;
        }

        .story-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .story-headline {
          font-size: 36px;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.5px;
          line-height: 1.2;
        }

        .story-text {
          font-size: 16px;
          color: #cbd5e0;
          line-height: 1.6;
          margin: 0;
          max-width: 400px;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .feature-item {
          display: flex;
          gap: 16px;
          animation: slideInFeature 0.6s ease forwards;
          opacity: 0;
        }

        .feature-item:nth-child(1) { animation-delay: 0.1s; }
        .feature-item:nth-child(2) { animation-delay: 0.2s; }
        .feature-item:nth-child(3) { animation-delay: 0.3s; }

        @keyframes slideInFeature {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .feature-icon {
          font-size: 28px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }

        .feature-content h4 {
          font-size: 15px;
          font-weight: 700;
          margin: 0 0 4px 0;
          color: white;
        }

        .feature-content p {
          font-size: 13px;
          color: #94a3b8;
          margin: 0;
        }

        .trust-section {
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .trust-text {
          font-size: 13px;
          color: #64748b;
          margin: 0 0 12px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .trust-avatars {
          display: flex;
          align-items: center;
          gap: -8px;
        }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          border: 2px solid #0f172a;
          margin-left: -8px;
        }

        .avatar:first-child {
          margin-left: 0;
        }

        .login-right {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .login-card {
          background: rgba(30, 41, 59, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          width: 100%;
          max-width: 420px;
          padding: 48px 40px;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
          position: relative;
          z-index: 5;
          animation: slideUp 0.7s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .close-hint {
          position: absolute;
          top: 16px;
          right: 16px;
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
          transition: color 0.2s;
        }

        .close-hint:hover {
          color: #e2e8f0;
        }

        .welcome-back {
          text-align: center;
          margin-bottom: 24px;
        }

        .welcome-back h3 {
          font-size: 24px;
          font-weight: 800;
          color: white;
          margin: 0 0 4px 0;
        }

        .welcome-back p {
          font-size: 13px;
          color: #94a3b8;
          margin: 0;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
          position: relative;
        }

        .form-label {
          font-size: 12px;
          font-weight: 700;
          color: #e2e8f0;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .form-input {
          padding: 14px 16px 14px 40px;
          background: rgba(71, 85, 105, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          font-size: 14px;
          color: white;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-input::placeholder {
          color: #64748b;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          background: rgba(71, 85, 105, 0.5);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }

        .form-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 38px;
          font-size: 16px;
          pointer-events: none;
        }

        .toggle-password-btn {
          position: absolute;
          right: 14px;
          top: 38px;
          background: transparent;
          border: none;
          font-size: 18px;
          cursor: pointer;
          padding: 4px 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          color: #94a3b8;
        }

        .toggle-password-btn:hover:not(:disabled) {
          color: #e2e8f0;
          transform: scale(1.1);
        }

        .toggle-password-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error-message {
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
          border-radius: 12px;
          font-size: 13px;
          border-left: 3px solid #f87171;
        }

        .login-button {
          padding: 14px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
          position: relative;
          overflow: hidden;
        }

        .login-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
          pointer-events: none;
        }

        .arrow {
          transition: transform 0.3s ease;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.4);
        }

        .login-button:hover:not(:disabled) .arrow {
          transform: translateX(4px);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .button-loader {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .loader-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.25);
          border-top-color: white;
          border-right-color: rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          animation: spin-smooth 0.8s cubic-bezier(0.4, 0.0, 0.2, 1) infinite;
        }

        @keyframes spin-smooth {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .divider {
          text-align: center;
          font-size: 12px;
          color: #64748b;
          position: relative;
          margin: 12px 0;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          z-index: 0;
        }

        .divider span {
          position: relative;
          background: rgba(30, 41, 59, 0.8);
          padding: 0 8px;
          z-index: 1;
        }

        .demo-button {
          padding: 13px 20px;
          background: transparent;
          color: #667eea;
          border: 1.5px solid rgba(102, 126, 234, 0.5);
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .demo-button:hover {
          background: rgba(102, 126, 234, 0.15);
          border-color: #667eea;
          transform: translateY(-2px);
        }

        .login-footer {
          display: flex;
          gap: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 12px;
          color: #94a3b8;
          justify-content: center;
        }

        .footer-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .footer-icon {
          font-size: 14px;
        }

        .floating-card {
          position: absolute;
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 16px;
          width: 140px;
          text-align: center;
          color: white;
          font-size: 12px;
          font-weight: 600;
          z-index: 4;
          animation: float 6s ease-in-out infinite;
        }

        .card-1 {
          top: -20px;
          right: -40px;
          animation-delay: 0s;
        }

        .card-2 {
          bottom: 40px;
          left: -30px;
          animation-delay: 1s;
        }

        .card-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }

        @media (max-width: 1024px) {
          .login-wrapper {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .login-left {
            gap: 32px;
          }

          .story-headline {
            font-size: 28px;
          }

          .brand-title {
            font-size: 36px;
          }
        }

        @media (max-width: 768px) {
          .login-wrapper {
            gap: 30px;
          }

          .login-left {
            gap: 24px;
            display: none;
          }

          .login-card {
            max-width: 100%;
            padding: 40px 30px;
          }

          .floating-card {
            display: none;
          }

          .brand-title {
            font-size: 32px;
          }
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 30px 20px;
          }

          .welcome-back h3 {
            font-size: 20px;
          }

          .gradient-orb {
            filter: blur(60px);
          }
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .error-modal {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 16px;
          padding: 40px 32px;
          max-width: 420px;
          width: 90%;
          text-align: center;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .error-icon {
          font-size: 48px;
        }

        .error-modal h3 {
          font-size: 22px;
          font-weight: 800;
          color: white;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .error-text {
          font-size: 14px;
          color: #cbd5e0;
          margin: 0 0 24px 0;
          line-height: 1.5;
        }

        .modal-button {
          width: 100%;
          padding: 14px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .modal-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }

        .modal-button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}
