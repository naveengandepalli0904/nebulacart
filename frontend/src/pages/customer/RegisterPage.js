import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await registerUser({ name: form.name, email: form.email, password: form.password });
      login(data);
      toast.success('Account created! Welcome to NebulaCart 🚀');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthColors = ['', '#EF4444', '#F59E0B', '#10B981'];
  const strengthLabels = ['', 'Weak', 'Good', 'Strong'];

  return (
    <div style={{
      minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.1) 0%, transparent 70%), #0A0E1A',
      padding: '2rem 1rem',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <svg width="52" height="52" viewBox="0 0 32 32" fill="none" style={{ marginBottom: '0.75rem' }}>
            <circle cx="16" cy="16" r="14" fill="url(#rg)" />
            <ellipse cx="16" cy="16" rx="14" ry="5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
            <text x="16" y="21" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Space Grotesk">N</text>
            <circle cx="24" cy="10" r="2.5" fill="#F59E0B" />
            <defs>
              <linearGradient id="rg" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Create Account</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>Join the NebulaCart universe today</p>
        </div>

        <div style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full Name</label>
              <div style={{ position: 'relative' }}>
                <FiUser size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="Your full name" />
              </div>
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="you@example.com" />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input type={showPwd ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="input-field" style={{ paddingLeft: '2.5rem', paddingRight: '2.75rem' }} placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}>
                  {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: '0.4rem' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '0.25rem' }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthColors[strength] : 'rgba(255,255,255,0.08)', transition: 'all 0.3s' }} />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.7rem', color: strengthColors[strength] }}>{strengthLabels[strength]}</p>
                </div>
              )}
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input type={showPwd ? 'text' : 'password'} required value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  className="input-field" style={{ paddingLeft: '2.5rem', borderColor: form.confirm && form.confirm !== form.password ? '#EF4444' : undefined }}
                  placeholder="Repeat password" />
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.3rem' }}>Passwords don't match</p>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(124,58,237,0.12)' }}>
            <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#8B5CF6', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
