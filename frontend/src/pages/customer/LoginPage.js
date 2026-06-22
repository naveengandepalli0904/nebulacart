import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginUser(form);
      login(data);
      toast.success(`Welcome back, ${data.name}! 🚀`);
      navigate(data.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.1) 0%, transparent 70%), #0A0E1A',
      padding: '2rem 1rem',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <svg width="52" height="52" viewBox="0 0 32 32" fill="none" style={{ marginBottom: '0.75rem' }}>
            <circle cx="16" cy="16" r="14" fill="url(#lg)" />
            <ellipse cx="16" cy="16" rx="14" ry="5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
            <text x="16" y="21" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Space Grotesk">N</text>
            <circle cx="24" cy="10" r="2.5" fill="#F59E0B" />
            <defs>
              <linearGradient id="lg" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Welcome Back</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Sign in to your NebulaCart account</p>
        </div>

        <div style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input
                  type="email" required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input
                  type={showPwd ? 'text' : 'password'} required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-field"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }}
                  placeholder="Your password"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}>
                  {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', fontSize: '0.95rem', marginTop: '0.5rem' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(124,58,237,0.12)' }}>
            <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#8B5CF6', fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div style={{ marginTop: '1.25rem', padding: '0.875rem', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 10 }}>
            <p style={{ fontSize: '0.75rem', color: '#8B5CF6', fontWeight: 600, marginBottom: '0.4rem' }}>🔑 Demo Credentials</p>
            <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Admin: admin@nebulacart.com / admin123456</p>
            <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Customer: customer@test.com / customer123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
