import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMapPin, FiCreditCard, FiCheckCircle } from 'react-icons/fi';

const STEPS = ['Address', 'Payment', 'Confirm'];

export default function CheckoutPage() {
  const { cartItems, itemsPrice, shippingPrice, taxPrice, discountAmount, totalPrice, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);

  const [address, setAddress] = useState({
    name: user?.name || '', phone: '', street: '', city: '', state: '', pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const { name, phone, street, city, state, pincode } = address;
    if (!name || !phone || !street || !city || !state || !pincode) return toast.error('Please fill all address fields');
    if (!/^\d{10}$/.test(phone)) return toast.error('Enter valid 10-digit phone number');
    if (!/^\d{6}$/.test(pincode)) return toast.error('Enter valid 6-digit pincode');
    setStep(1);
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const orderItems = cartItems.map(i => ({
        product: i._id, name: i.name, image: i.image || '', price: i.price, quantity: i.quantity,
      }));
      const { data } = await createOrder({
        orderItems, shippingAddress: address, paymentMethod,
        couponCode: coupon?.code,
      });
      clearCart();
      toast.success('Order placed successfully! 🚀');
      navigate(`/orders/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  const summaryCard = (
    <div style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '1.25rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Order Summary</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
        {cartItems.map(i => (
          <div key={i._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: '#94A3B8' }}>{i.name} × {i.quantity}</span>
            <span style={{ fontWeight: 600 }}>₹{(i.price * i.quantity).toLocaleString('en-IN')}</span>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(124,58,237,0.1)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {[
          { l: 'Subtotal', v: `₹${itemsPrice.toLocaleString('en-IN')}` },
          { l: 'Shipping', v: shippingPrice === 0 ? 'FREE' : `₹${shippingPrice}`, c: shippingPrice === 0 ? '#10B981' : undefined },
          { l: 'GST', v: `₹${taxPrice.toLocaleString('en-IN')}` },
          ...(discountAmount > 0 ? [{ l: 'Discount', v: `-₹${discountAmount.toLocaleString('en-IN')}`, c: '#10B981' }] : []),
        ].map(({ l, v, c }) => (
          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: '#64748B' }}>{l}</span>
            <span style={{ fontWeight: 600, color: c || '#F8FAFC' }}>{v}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(124,58,237,0.1)' }}>
          <span style={{ fontWeight: 700 }}>Total</span>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#8B5CF6' }}>₹{totalPrice.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: 960 }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>Checkout</h1>

      {/* Step Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem' }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: i <= step ? 'linear-gradient(135deg, #7C3AED, #EC4899)' : 'rgba(255,255,255,0.08)',
                fontSize: '0.8rem', fontWeight: 700, color: i <= step ? 'white' : '#64748B',
              }}>{i + 1}</div>
              <span style={{ fontSize: '0.875rem', fontWeight: i === step ? 600 : 400, color: i <= step ? '#F8FAFC' : '#64748B' }}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: i < step ? '#7C3AED' : 'rgba(124,58,237,0.15)', margin: '0 0.75rem' }} />}
          </React.Fragment>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
        <div>
          {/* Step 0: Address */}
          {step === 0 && (
            <div style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiMapPin color="#8B5CF6" /> Delivery Address
              </h2>
              <form onSubmit={handleAddressSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label>Full Name</label>
                    <input value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} className="input-field" placeholder="Your full name" required />
                  </div>
                  <div className="input-group">
                    <label>Phone Number</label>
                    <input value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} className="input-field" placeholder="10-digit mobile" required />
                  </div>
                </div>
                <div className="input-group">
                  <label>Street Address</label>
                  <input value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} className="input-field" placeholder="House No., Street, Area" required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label>City</label>
                    <input value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} className="input-field" placeholder="City" required />
                  </div>
                  <div className="input-group">
                    <label>State</label>
                    <input value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} className="input-field" placeholder="State" required />
                  </div>
                  <div className="input-group">
                    <label>Pincode</label>
                    <input value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} className="input-field" placeholder="6-digit pincode" required />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Continue to Payment</button>
              </form>
            </div>
          )}

          {/* Step 1: Payment */}
          {step === 1 && (
            <div style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '1.75rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiCreditCard color="#8B5CF6" /> Payment Method
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {[
                  { value: 'COD', label: 'Cash on Delivery', sub: 'Pay when your order arrives', icon: '💵' },
                  { value: 'Online', label: 'Online Payment (Simulated)', sub: 'UPI, Net Banking, Cards', icon: '💳' },
                ].map(opt => (
                  <label key={opt.value} style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 1.25rem', borderRadius: 12, cursor: 'pointer',
                    border: `2px solid ${paymentMethod === opt.value ? '#7C3AED' : 'rgba(124,58,237,0.15)'}`,
                    background: paymentMethod === opt.value ? 'rgba(124,58,237,0.1)' : 'transparent',
                    transition: 'all 0.2s',
                  }}>
                    <input type="radio" value={opt.value} checked={paymentMethod === opt.value}
                      onChange={() => setPaymentMethod(opt.value)} style={{ accentColor: '#7C3AED' }} />
                    <span style={{ fontSize: '1.5rem' }}>{opt.icon}</span>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{opt.label}</p>
                      <p style={{ color: '#64748B', fontSize: '0.8rem' }}>{opt.sub}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setStep(0)} className="btn btn-ghost">← Back</button>
                <button onClick={() => setStep(2)} className="btn btn-primary">Review Order</button>
              </div>
            </div>
          )}

          {/* Step 2: Confirm */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>📍 Delivery Address</h3>
                <p style={{ fontSize: '0.9rem', color: '#CBD5E1', lineHeight: 1.7 }}>
                  <strong>{address.name}</strong><br />
                  {address.phone}<br />
                  {address.street}, {address.city}, {address.state} — {address.pincode}
                </p>
              </div>
              <div style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>💳 Payment Method</h3>
                <p style={{ color: '#CBD5E1', fontSize: '0.9rem' }}>{paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment (Simulated)'}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setStep(1)} className="btn btn-ghost">← Back</button>
                <button onClick={handlePlaceOrder} disabled={placing} className="btn btn-primary"
                  style={{ flex: 1, justifyContent: 'center', fontSize: '1rem', padding: '0.875rem' }}>
                  <FiCheckCircle size={18} /> {placing ? 'Placing Order...' : `Place Order · ₹${totalPrice.toLocaleString('en-IN')}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div>{summaryCard}</div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 320px"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: 1fr 1fr 1fr"] { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          div[style*="grid-template-columns: 1fr 1fr"]:not([style*="320px"]) { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
