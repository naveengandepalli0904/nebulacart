import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { validateCoupon } from '../../utils/api';
import toast from 'react-hot-toast';
import { FiTrash2, FiShoppingBag, FiTag, FiX } from 'react-icons/fi';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, itemsPrice, shippingPrice, taxPrice, discountAmount, coupon, applyCoupon, removeCoupon, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const handleCoupon = async () => {
    if (!couponInput.trim()) return;
    setValidatingCoupon(true);
    try {
      const { data } = await validateCoupon({ code: couponInput.trim(), orderAmount: itemsPrice });
      applyCoupon({ ...data, code: couponInput.toUpperCase() });
      toast.success(`Coupon applied! You save ₹${data.discount}`);
      setCouponInput('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to continue');
      return navigate('/login');
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) return (
    <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
      <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🛒</div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Your Cart is Empty</h2>
      <p style={{ color: '#64748B', marginBottom: '2rem' }}>Explore our cosmic collection and add items to your cart</p>
      <Link to="/products" className="btn btn-primary btn-lg">
        <FiShoppingBag size={18} /> Start Shopping
      </Link>
    </div>
  );

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>Shopping Cart</h1>
      <p style={{ color: '#64748B', marginBottom: '2rem', fontSize: '0.875rem' }}>{totalItems} item(s)</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cartItems.map(item => (
            <div key={item._id} style={{ display: 'flex', gap: '1rem', background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '1rem', alignItems: 'center' }}>
              <Link to={`/products/${item._id}`}>
                <img src={item.image || 'https://via.placeholder.com/80'} alt={item.name}
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, border: '1px solid rgba(124,58,237,0.15)' }} />
              </Link>
              <div style={{ flex: 1 }}>
                <Link to={`/products/${item._id}`} style={{ fontWeight: 600, fontSize: '0.95rem', color: '#F8FAFC', textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }}>
                  {item.name}
                </Link>
                <p style={{ color: '#8B5CF6', fontWeight: 700, fontSize: '1rem' }}>₹{item.price?.toLocaleString('en-IN')}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 8, overflow: 'hidden' }}>
                <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  style={{ padding: '0.5rem 0.75rem', background: 'none', border: 'none', color: '#F8FAFC', cursor: 'pointer' }}>−</button>
                <span style={{ padding: '0 0.75rem', fontWeight: 600, fontSize: '0.9rem' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  style={{ padding: '0.5rem 0.75rem', background: 'none', border: 'none', color: '#F8FAFC', cursor: 'pointer', opacity: item.quantity >= item.stock ? 0.4 : 1 }}>+</button>
              </div>
              <div style={{ textAlign: 'right', minWidth: '80px' }}>
                <p style={{ fontWeight: 700, color: '#F8FAFC' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
              </div>
              <button onClick={() => removeFromCart(item._id)}
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '0.5rem', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}>
                <FiTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <div style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '1.5rem', position: 'sticky', top: '5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Order Summary</h2>

            {/* Coupon */}
            <div style={{ marginBottom: '1.25rem' }}>
              {coupon ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FiTag size={14} color="#10B981" />
                    <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 600 }}>{coupon.code}</span>
                  </div>
                  <button onClick={removeCoupon} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}><FiX size={15} /></button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Coupon code" className="input-field" style={{ flex: 1 }}
                    onKeyDown={e => e.key === 'Enter' && handleCoupon()} />
                  <button onClick={handleCoupon} disabled={validatingCoupon} className="btn btn-outline btn-sm">
                    {validatingCoupon ? '...' : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {[
                { label: 'Subtotal', value: `₹${itemsPrice.toLocaleString('en-IN')}` },
                { label: 'Shipping', value: shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`, color: shippingPrice === 0 ? '#10B981' : undefined },
                { label: 'GST (18%)', value: `₹${taxPrice.toLocaleString('en-IN')}` },
                ...(discountAmount > 0 ? [{ label: 'Discount', value: `-₹${discountAmount.toLocaleString('en-IN')}`, color: '#10B981' }] : []),
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>{label}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: color || '#F8FAFC' }}>{value}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(124,58,237,0.15)', paddingTop: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: '1.25rem', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              {shippingPrice > 0 && <p style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '0.35rem' }}>Add ₹{(999 - itemsPrice).toLocaleString('en-IN')} more for free shipping</p>}
            </div>

            <button onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '0.875rem' }}>
              Proceed to Checkout
            </button>
            <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: '0.875rem', color: '#64748B', fontSize: '0.85rem', textDecoration: 'none' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 360px"] { grid-template-columns: 1fr !important; }
          div[style*="position: sticky"] { position: static !important; }
        }
        @media (max-width: 480px) {
          div[style*="gap: 1rem"][style*="align-items: center"] { flex-wrap: wrap; }
        }
      `}</style>
    </div>
  );
}
