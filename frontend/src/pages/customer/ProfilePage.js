import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiSave } from 'react-icons/fi';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password && form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      const { data } = await updateProfile(payload);
      updateUser(data);
      toast.success('Profile updated successfully!');
      setForm(f => ({ ...f, password: '', confirm: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 640 }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>My Profile</h1>
      <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '2rem' }}>Manage your account settings</p>

      {/* Avatar Card */}
      <div style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #7C3AED, #EC4899)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.2rem' }}>{user?.name}</h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>{user?.email}</p>
          <span style={{ display: 'inline-block', marginTop: '0.4rem', padding: '0.2rem 0.65rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, background: user?.role === 'admin' ? 'rgba(245,158,11,0.15)' : 'rgba(124,58,237,0.15)', color: user?.role === 'admin' ? '#F59E0B' : '#8B5CF6' }}>
            {user?.role === 'admin' ? '⚡ Admin' : '👤 Customer'}
          </span>
        </div>
      </div>

      {/* Edit Form */}
      <div style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Edit Profile</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <div style={{ position: 'relative' }}>
              <FiUser size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="Full name" />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <FiMail size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="Email address" />
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(124,58,237,0.1)', paddingTop: '1.25rem', marginTop: '0.5rem', marginBottom: '1.25rem' }}>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '1rem' }}>Leave password fields blank to keep your current password.</p>
          </div>

          <div className="input-group">
            <label>New Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                className="input-field" style={{ paddingLeft: '2.5rem' }} placeholder="New password (optional)" />
            </div>
          </div>

          <div className="input-group">
            <label>Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <FiLock size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
              <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })}
                className="input-field" style={{ paddingLeft: '2.5rem', borderColor: form.confirm && form.confirm !== form.password ? '#EF4444' : undefined }}
                placeholder="Confirm new password" />
            </div>
            {form.confirm && form.confirm !== form.password && (
              <p style={{ fontSize: '0.75rem', color: '#EF4444', marginTop: '0.3rem' }}>Passwords don't match</p>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
            <FiSave size={16} /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
