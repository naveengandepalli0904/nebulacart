import React, { useEffect, useState } from 'react';
import { getAllUsers, updateUser } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { FiSearch, FiShield, FiUser, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    getAllUsers().then(r => setUsers(r.data)).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(fetchUsers, []);

  const handleToggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Change ${user.name}'s role to ${newRole}?`)) return;
    setUpdating(user._id);
    try {
      await updateUser(user._id, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
    } catch { toast.error('Update failed'); }
    finally { setUpdating(null); }
  };

  const handleToggleActive = async (user) => {
    setUpdating(user._id);
    try {
      await updateUser(user._id, { isActive: !user.isActive });
      toast.success(user.isActive ? 'User deactivated' : 'User activated');
      fetchUsers();
    } catch { toast.error('Update failed'); }
    finally { setUpdating(null); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const adminCount = users.filter(u => u.role === 'admin').length;
  const activeCount = users.filter(u => u.isActive).length;

  return (
    <AdminLayout title="Users">
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Users', value: users.length, color: '#8B5CF6' },
          { label: 'Admins', value: adminCount, color: '#F59E0B' },
          { label: 'Active', value: activeCount, color: '#10B981' },
          { label: 'Inactive', value: users.length - activeCount, color: '#EF4444' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 14, padding: '1.1rem 1.25rem' }}>
            <p style={{ color: '#64748B', fontSize: '0.78rem', marginBottom: '0.35rem' }}>{label}</p>
            <p style={{ fontSize: '1.6rem', fontWeight: 800, color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, padding: '0.5rem 0.875rem', marginBottom: '1.25rem', maxWidth: 360 }}>
        <FiSearch size={15} color="#475569" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
          style={{ background: 'none', border: 'none', outline: 'none', color: '#F8FAFC', fontSize: '0.875rem', flex: 1 }} />
      </div>

      <div style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(124,58,237,0.08)', borderBottom: '1px solid rgba(124,58,237,0.15)' }}>
                {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.875rem 1rem', color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={6} style={{ padding: '0.875rem' }}><div className="skeleton" style={{ height: 32, borderRadius: 8 }} /></td></tr>
                ))
              ) : filtered.map(user => (
                <tr key={user._id} style={{ borderBottom: '1px solid rgba(124,58,237,0.07)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: user.role === 'admin' ? 'linear-gradient(135deg, #F59E0B, #EC4899)' : 'linear-gradient(135deg, #7C3AED, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '0.85rem', flexShrink: 0 }}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F8FAFC' }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.82rem', color: '#94A3B8' }}>{user.email}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: 100, background: user.role === 'admin' ? 'rgba(245,158,11,0.15)' : 'rgba(124,58,237,0.15)', color: user.role === 'admin' ? '#F59E0B' : '#8B5CF6' }}>
                      {user.role === 'admin' ? <FiShield size={11} /> : <FiUser size={11} />}
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: 100, background: user.isActive ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: user.isActive ? '#10B981' : '#EF4444' }}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.78rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                    {new Date(user.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleToggleRole(user)} disabled={updating === user._id}
                        title={`Make ${user.role === 'admin' ? 'Customer' : 'Admin'}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.65rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 8, color: '#F59E0B', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600, transition: 'all 0.2s', opacity: updating === user._id ? 0.5 : 1 }}>
                        <FiShield size={12} /> {user.role === 'admin' ? '→ User' : '→ Admin'}
                      </button>
                      <button onClick={() => handleToggleActive(user)} disabled={updating === user._id}
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                        style={{ display: 'flex', alignItems: 'center', padding: '0.35rem 0.5rem', background: user.isActive ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', border: `1px solid ${user.isActive ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`, borderRadius: 8, color: user.isActive ? '#EF4444' : '#10B981', cursor: 'pointer', transition: 'all 0.2s', opacity: updating === user._id ? 0.5 : 1 }}>
                        {user.isActive ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && <p style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>No users found</p>}
        </div>
      </div>
    </AdminLayout>
  );
}
