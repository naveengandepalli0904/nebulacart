import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer style={{
      background: '#060810',
      borderTop: '1px solid rgba(124,58,237,0.15)',
      padding: '3rem 0 1.5rem',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" fill="url(#fg)" />
                <ellipse cx="16" cy="16" rx="14" ry="5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
                <text x="16" y="21" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Space Grotesk">N</text>
                <circle cx="24" cy="10" r="2.5" fill="#F59E0B" />
                <defs>
                  <linearGradient id="fg" x1="0" y1="0" x2="32" y2="32">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
              <span style={{ fontFamily: 'Space Grotesk', fontSize: '1.1rem', fontWeight: 700, color: '#F8FAFC' }}>
                Nebula<span style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Cart</span>
              </span>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.6, maxWidth: '220px' }}>
              Your cosmic shopping destination. Explore products from across the universe.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              {[FiGithub, FiTwitter, FiInstagram, FiMail].map((Icon, i) => (
                <a key={i} href="#" style={{ width: 34, height: 34, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#8B5CF6'; e.currentTarget.style.borderColor = '#7C3AED'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)'; }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ color: '#F8FAFC', fontWeight: 600, marginBottom: '1rem', fontSize: '0.9rem' }}>Shop</h4>
            {['Electronics', 'Fashion', 'Sports', 'Home & Living', 'Beauty'].map(cat => (
              <Link key={cat} to={`/products?category=${cat}`} style={{ display: 'block', color: '#64748B', fontSize: '0.85rem', marginBottom: '0.6rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#8B5CF6'}
                onMouseLeave={e => e.target.style.color = '#64748B'}>
                {cat}
              </Link>
            ))}
          </div>

          {/* Account */}
          <div>
            <h4 style={{ color: '#F8FAFC', fontWeight: 600, marginBottom: '1rem', fontSize: '0.9rem' }}>Account</h4>
            {[['My Profile', '/profile'], ['My Orders', '/orders'], ['Cart', '/cart'], ['Login', '/login'], ['Register', '/register']].map(([label, path]) => (
              <Link key={label} to={path} style={{ display: 'block', color: '#64748B', fontSize: '0.85rem', marginBottom: '0.6rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#8B5CF6'}
                onMouseLeave={e => e.target.style.color = '#64748B'}>
                {label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#F8FAFC', fontWeight: 600, marginBottom: '1rem', fontSize: '0.9rem' }}>Contact</h4>
            <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '0.5rem' }}>support@nebulacart.com</p>
            <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '0.5rem' }}>+91 98765 43210</p>
            <p style={{ color: '#64748B', fontSize: '0.85rem' }}>Mon–Sat, 9am–6pm IST</p>
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10 }}>
              <p style={{ color: '#8B5CF6', fontSize: '0.8rem', fontWeight: 600 }}>🚀 Free Shipping</p>
              <p style={{ color: '#64748B', fontSize: '0.75rem' }}>On orders above ₹999</p>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(124,58,237,0.1)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: '#475569', fontSize: '0.8rem' }}>© 2024 NebulaCart. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(item => (
              <a key={item} href="#" style={{ color: '#475569', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#8B5CF6'}
                onMouseLeave={e => e.target.style.color = '#475569'}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
