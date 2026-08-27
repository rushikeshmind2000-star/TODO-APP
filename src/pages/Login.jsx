import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Mail, Lock, Eye, EyeOff, Users, BarChart2, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import illustration from '../assets/login_illustration.jpg';
import './Login.css';

const DEMO_ROLES = [
  { id: 'user-1', name: 'Rushikesh', role: 'Developer', color: '#6366f1' },
];

export default function Login() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const [email, setEmail] = useState('rushikesh@techpulse.com');
  const [password, setPassword] = useState('password123');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 900)); // simulate auth
    setLoading(false);
    dispatch({ type: 'LOGIN', payload: DEMO_ROLES[0] });
    navigate('/dashboard');
  };

  return (
    <div className="login-layout">
      {/* Left side text overlay */}
      <div className="login-left-text">
        <h1 className="login-left-title">
          Organize. Prioritize.<br />
          <span>Achieve More Together.</span>
        </h1>
        <p className="login-left-subtitle">
          TechPulse TaskHub helps teams stay aligned, manage tasks efficiently and deliver projects on time, every time.
        </p>
      </div>

      {/* Login Card Panel */}
      <div className="login-right">
        <div className="login-card scale-in">
          <div className="login-header">
            <h2>Welcome Back! 👋</h2>
            <p>Sign in to continue to TechPulse TaskHub</p>
          </div>

          <form onSubmit={handleLogin}>
            {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
            
            <div className="login-form-group">
              <div className="login-field">
                <label className="login-label">Email address</label>
                <div className="login-input-wrap">
                  <Mail size={18} className="login-input-icon" />
                  <input
                    type="email"
                    className="login-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="login-field">
                <label className="login-label">Password</label>
                <div className="login-input-wrap">
                  <Lock size={18} className="login-input-icon" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="login-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <button type="button" className="login-pw-toggle" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="login-forgot">Forgot password?</div>
              </div>
            </div>

            <label className="login-remember">
              <input type="checkbox" defaultChecked />
              Remember me
            </label>

            <button type="submit" className="login-btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="login-divider">or continue with</div>

          <div className="login-sso-group">
            <button type="button" className="login-btn-sso">
              <svg className="login-sso-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>
            <button type="button" className="login-btn-sso">
              <svg className="login-sso-icon" viewBox="0 0 21 21">
                <path fill="#f25022" d="M1 1h9v9H1z" />
                <path fill="#7fba00" d="M11 1h9v9h-9z" />
                <path fill="#00a4ef" d="M1 11h9v9H1z" />
                <path fill="#ffb900" d="M11 11h9v9h-9z" />
              </svg>
              Sign in with Microsoft
            </button>
          </div>

          <div className="login-signup">
            Don't have an account? <a href="#signup">Sign up</a>
          </div>
        </div>
        
        <div className="login-footer-text">
          © 2026 TechPulse IT Services. All rights reserved.
        </div>
      </div>
    </div>
  );
}
