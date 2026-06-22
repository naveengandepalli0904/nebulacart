import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid, FiPackage, FiShoppingBag, FiTag, FiUsers,
  FiLogOut, FiMenu, FiX, FiHome
} from 'react-icons/fi';

const NAV = [
  { path: '/admin', icon: FiGrid, label: 'Dashboard', exact: true },
  { path: '/admin/products', icon: FiPackage, label: 'Products' },
  { path: '/admin/orders', icon: FiShoppingBag, label: 'Orders' },
  { path: '/admin/coupons', icon: FiTag, label: 'Coupons' },
  { path: '/admin/users', icon: FiUsers, label: 'Users' },
];

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (path, exact) =>
    exact ? location.pathname === path : location.pathname.startsWith(path) && path !== '/admin';

  const Sidebar = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(124,58,237,0.15)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="url(#ag)" />
            <ellipse cx="16" cy="16" rx="14" ry="5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
            <text x="16" y="21" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Space Grotesk">N</text>
            <circle cx="24" cy="10" r="2.5" fill="#F59E0B" />
            <defs>
              <linearGradient id="ag" x1="0" y1="0" x2="32" y2="32">
                <stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
          <div>
            <span style={{ fontFamily: 'Space Grotesk', fontSize: '1rem', fontWeight: 700, color: '#F8FAFC' }}>NebulaCart</span>
            <p style={{ fontSize: '0.65rem', color: '#F59E0B', fontWeight: 600, marginTop: '-2px' }}>Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {NAV.map(({ path, icon: Icon, label, exact }) => {
          const active = isActive(path, exact) || (exact && location.pathname === '/admin');
          return (
            <Link key={path} to={path} onClick={() => setSidebarOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.7rem 0.875rem', borderRadius: 10,
                color: active ? '#F8FAFC' : '#64748B',
                background: active ? 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.15))' : 'transparent',
                border: active ? '1px solid rgba(124,58,237,0.3)' : '1px solid transparent',
                fontWeight: active ? 600 : 400, fontSize: '0.875rem',
                textDecoration: 'none', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#F8FAFC'; } }}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748B'; } }}>
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(124,58,237,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(124,58,237,0.08)', borderRadius: 10, marginBottom: '0.5rem' }}>
          <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #7C3AED, #EC4899)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '0.85rem', flexShrink: 0 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
            <p style={{ fontSize: '0.7rem', color: '#F59E0B', fontWeight: 600 }}>Admin</p>
          </div>
        </div>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.875rem', color: '#64748B', fontSize: '0.8rem', textDecoration: 'none', borderRadius: 8, transition: 'all 0.2s', marginBottom: '0.25rem' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#F8FAFC'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.background = 'transparent'; }}>
          <FiHome size={15} /> View Storefront
        </Link>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.875rem', color: '#EF4444', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', width: '100%', borderRadius: 8, transition: 'all 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <FiLogOut size={15} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#080C18' }}>
      {/* Desktop Sidebar */}
      <aside style={{ width: 240, background: '#0D1120', borderRight: '1px solid rgba(124,58,237,0.15)', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 100, display: 'flex', flexDirection: 'column' }} className="admin-sidebar">
        <Sidebar />
      </aside>
      <style>{`.admin-sidebar { display: flex !important; } @media(max-width: 768px) { .admin-sidebar { display: none !important; } }`}</style>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} onClick={() => setSidebarOpen(false)} />
          <aside style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 240, background: '#0D1120', borderRight: '1px solid rgba(124,58,237,0.15)', display: 'flex', flexDirection: 'column', zIndex: 1 }}>
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column' }} className="admin-main">
        <style>{`.admin-main { margin-left: 240px !important; } @media(max-width: 768px) { .admin-main { margin-left: 0 !important; } }`}</style>

        {/* Top Bar */}
        <header style={{ background: '#0D1120', borderBottom: '1px solid rgba(124,58,237,0.15)', padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'none' }} className="mob-menu-btn">
              <FiMenu size={22} />
            </button>
            <style>{`.mob-menu-btn { display: none !important; } @media(max-width: 768px) { .mob-menu-btn { display: flex !important; } }`}</style>
            <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>{title}</h1>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </header>

        <div style={{ flex: 1, padding: '1.75rem', overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
