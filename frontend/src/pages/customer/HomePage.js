import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts } from '../../utils/api';
import ProductCard from '../../components/customer/ProductCard';
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiRefreshCw, FiStar } from 'react-icons/fi';

const CATEGORIES = [
  { name: 'Electronics', icon: '💻', color: '#7C3AED' },
  { name: 'Fashion', icon: '👗', color: '#EC4899' },
  { name: 'Sports', icon: '⚽', color: '#10B981' },
  { name: 'Home & Living', icon: '🏠', color: '#F59E0B' },
  { name: 'Beauty', icon: '✨', color: '#8B5CF6' },
  { name: 'Books', icon: '📚', color: '#06B6D4' },
];

const TESTIMONIALS = [
  { name: 'Arjun Sharma', rating: 5, text: 'NebulaCart has the best collection! The cosmic theme is absolutely stunning and delivery was super fast.', avatar: 'A' },
  { name: 'Priya Nair', rating: 5, text: 'Amazing shopping experience. The products are genuine and the website is very easy to use. Highly recommend!', avatar: 'P' },
  { name: 'Rahul Mehta', rating: 4, text: 'Great deals and excellent customer support. My go-to e-commerce platform now. Keep it up NebulaCart!', avatar: 'R' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts({ featured: true, limit: 8 })
      .then(res => setFeatured(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        background: 'radial-gradient(ellipse at 70% 50%, rgba(124,58,237,0.15) 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, rgba(236,72,153,0.1) 0%, transparent 60%), #0A0E1A',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated stars bg */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {[...Array(50)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              background: 'white',
              borderRadius: '50%',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.1,
              animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite alternate`,
            }} />
          ))}
        </div>
        <style>{`@keyframes twinkle { from { opacity: 0.1; } to { opacity: 0.7; } }`}</style>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div className="fade-in-up">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '100px', padding: '0.4rem 1rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#8B5CF6', fontWeight: 600 }}>🚀 New Arrivals Every Week</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.25rem' }}>
                Shop the{' '}
                <span className="gradient-text">Cosmic</span>
                <br />Collection
              </h1>
              <p style={{ color: '#94A3B8', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '440px' }}>
                Discover thousands of products from across the universe. Electronics, Fashion, Sports and more — all at stellar prices with free shipping on orders above ₹999.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/products" className="btn btn-primary btn-lg">
                  <FiShoppingBag size={18} /> Shop Now <FiArrowRight size={16} />
                </Link>
                <Link to="/products?featured=true" className="btn btn-outline btn-lg">
                  View Featured
                </Link>
              </div>
              <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem' }}>
                {[['50K+', 'Products'], ['2M+', 'Customers'], ['4.8★', 'Rating']].map(([val, label]) => (
                  <div key={label}>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#8B5CF6' }}>{val}</p>
                    <p style={{ fontSize: '0.8rem', color: '#64748B' }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '380px', height: '380px' }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%)',
                  borderRadius: '50%',
                  animation: 'pulse 3s ease-in-out infinite',
                }} />
                <style>{`@keyframes pulse { 0%,100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 1; } }`}</style>
                <div style={{
                  position: 'absolute', inset: '20px',
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.15))',
                  border: '1px solid rgba(124,58,237,0.3)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
                    <circle cx="100" cy="100" r="80" fill="url(#heroGrad)" opacity="0.9" />
                    <ellipse cx="100" cy="100" rx="80" ry="28" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
                    <text x="100" y="118" textAnchor="middle" fill="white" fontSize="80" fontWeight="900" fontFamily="Space Grotesk" opacity="0.95">N</text>
                    <circle cx="155" cy="50" r="12" fill="#F59E0B" opacity="0.9" />
                    <circle cx="30" cy="140" r="7" fill="#EC4899" opacity="0.7" />
                    <circle cx="170" cy="150" r="5" fill="#8B5CF6" opacity="0.8" />
                    <defs>
                      <linearGradient id="heroGrad" x1="0" y1="0" x2="200" y2="200">
                        <stop offset="0%" stopColor="#7C3AED" />
                        <stop offset="100%" stopColor="#EC4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                {/* Floating badges */}
                {[
                  { text: '🔥 Trending', top: '10%', left: '-10%', bg: 'rgba(236,72,153,0.2)', border: 'rgba(236,72,153,0.4)' },
                  { text: '⚡ Fast Delivery', bottom: '15%', right: '-15%', bg: 'rgba(245,158,11,0.2)', border: 'rgba(245,158,11,0.4)' },
                  { text: '✅ Genuine', top: '60%', left: '-20%', bg: 'rgba(16,185,129,0.2)', border: 'rgba(16,185,129,0.4)' },
                ].map((badge, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    ...badge,
                    background: badge.bg,
                    border: `1px solid ${badge.border}`,
                    borderRadius: '10px',
                    padding: '0.5rem 0.875rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#F8FAFC',
                    whiteSpace: 'nowrap',
                    backdropFilter: 'blur(10px)',
                  }}>
                    {badge.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{ background: '#111827', borderTop: '1px solid rgba(124,58,237,0.1)', borderBottom: '1px solid rgba(124,58,237,0.1)', padding: '1.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { icon: FiTruck, text: 'Free Shipping over ₹999', sub: 'Pan India Delivery' },
              { icon: FiShield, text: '100% Secure Payments', sub: 'SSL Encrypted' },
              { icon: FiRefreshCw, text: 'Easy Returns', sub: '7-Day Return Policy' },
              { icon: FiStar, text: 'Top Quality Products', sub: 'Verified by NebulaCart' },
            ].map(({ icon: Icon, text, sub }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{ width: 40, height: 40, background: 'rgba(124,58,237,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={18} color="#8B5CF6" />
                </div>
                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#F8FAFC' }}>{text}</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748B' }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <h2>Shop by <span className="gradient-text">Category</span></h2>
            <p>Explore our wide range of product categories</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={`/products?category=${cat.name}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
                  padding: '1.75rem 1rem',
                  background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)',
                  borderRadius: 16, textDecoration: 'none', transition: 'all 0.3s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${cat.color}30`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.15)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', textAlign: 'center' }}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h2>Featured <span className="gradient-text">Products</span></h2>
              <p>Handpicked bestsellers just for you</p>
            </div>
            <Link to="/products?featured=true" className="btn btn-outline btn-sm">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ borderRadius: 16, overflow: 'hidden', background: '#1a2035' }}>
                  <div className="skeleton" style={{ height: '260px' }} />
                  <div style={{ padding: '1rem' }}>
                    <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 16, marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 20, width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section style={{ padding: '0 0 5rem' }}>
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.2))',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 24,
            padding: '3rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2rem',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: 200, height: 200, background: 'rgba(124,58,237,0.15)', borderRadius: '50%' }} />
            <div style={{ position: 'relative' }}>
              <p style={{ color: '#F59E0B', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.875rem' }}>⚡ LIMITED TIME OFFER</p>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Get 20% Off Your First Order</h2>
              <p style={{ color: '#94A3B8' }}>Use code <strong style={{ color: '#8B5CF6' }}>NEBULA10</strong> at checkout. T&C apply.</p>
            </div>
            <Link to="/products" className="btn btn-primary btn-lg">
              Shop Now <FiArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <h2>What Our <span className="gradient-text">Customers Say</span></h2>
            <p>Trusted by millions of happy shoppers</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{
                background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)',
                borderRadius: 16, padding: '1.5rem',
              }}>
                <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
                  {[...Array(t.rating)].map((_, i) => <FiStar key={i} size={14} style={{ fill: '#F59E0B', color: '#F59E0B' }} />)}
                </div>
                <p style={{ color: '#CBD5E1', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #7C3AED, #EC4899)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.875rem', color: '#F8FAFC' }}>{t.name}</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748B' }}>Verified Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
