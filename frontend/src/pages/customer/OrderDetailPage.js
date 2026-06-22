import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../../utils/api';
import { FiArrowLeft, FiPackage, FiMapPin, FiCreditCard, FiCheckCircle } from 'react-icons/fi';

const STATUS_COLORS = { Pending: '#F59E0B', Processing: '#8B5CF6', Shipped: '#06B6D4', Delivered: '#10B981', Cancelled: '#EF4444' };
const STATUS_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(id).then(r => setOrder(r.data)).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loader"><div className="spinner" /><p>Loading order...</p></div>;
  if (!order) return <div style={{ textAlign: 'center', padding: '4rem' }}><p style={{ color: '#64748B' }}>Order not found.</p></div>;

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', marginBottom: '1.5rem', fontSize: '0.875rem', textDecoration: 'none' }}>
        <FiArrowLeft size={15} /> Back to Orders
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>Order #{order._id.slice(-8).toUpperCase()}</h1>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <span style={{
          padding: '0.4rem 1.25rem', borderRadius: 100, fontSize: '0.875rem', fontWeight: 700,
          background: `${STATUS_COLORS[order.status]}20`, color: STATUS_COLORS[order.status],
        }}>{order.status}</span>
      </div>

      {/* Progress Tracker */}
      {order.status !== 'Cancelled' && (
        <div style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '1.75rem', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Order Progress</h3>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {STATUS_STEPS.map((step, i) => (
              <React.Fragment key={step}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: i <= currentStep ? 'linear-gradient(135deg, #7C3AED, #EC4899)' : 'rgba(255,255,255,0.06)',
                    border: i === currentStep ? '3px solid #EC4899' : 'none',
                    transition: 'all 0.3s',
                  }}>
                    {i < currentStep ? <FiCheckCircle size={16} color="white" /> : <FiPackage size={15} color={i <= currentStep ? 'white' : '#475569'} />}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: i <= currentStep ? '#F8FAFC' : '#475569', fontWeight: i === currentStep ? 700 : 400, textAlign: 'center' }}>{step}</span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 3, background: i < currentStep ? 'linear-gradient(90deg, #7C3AED, #EC4899)' : 'rgba(255,255,255,0.06)', margin: '0 0.5rem', marginBottom: '1.5rem', borderRadius: 2, transition: 'all 0.3s' }} />
                )}
              </React.Fragment>
            ))}
          </div>
          {order.trackingNumber && (
            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748B' }}>
              Tracking: <strong style={{ color: '#8B5CF6' }}>{order.trackingNumber}</strong>
            </p>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
        {/* Order Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Order Items ({order.orderItems.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {order.orderItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingBottom: i < order.orderItems.length - 1 ? '1rem' : 0, borderBottom: i < order.orderItems.length - 1 ? '1px solid rgba(124,58,237,0.1)' : 'none' }}>
                  <img src={item.image || 'https://via.placeholder.com/56'} alt={item.name}
                    style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', border: '1px solid rgba(124,58,237,0.15)' }} />
                  <div style={{ flex: 1 }}>
                    <Link to={`/products/${item.product}`} style={{ fontWeight: 600, fontSize: '0.9rem', color: '#F8FAFC', textDecoration: 'none' }}>{item.name}</Link>
                    <p style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '0.2rem' }}>Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</p>
                  </div>
                  <p style={{ fontWeight: 700, color: '#F8FAFC' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiMapPin size={16} color="#8B5CF6" /> Delivery Address
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.875rem', lineHeight: 1.8 }}>
              <strong>{order.shippingAddress.name}</strong><br />
              {order.shippingAddress.phone}<br />
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
            </p>
          </div>
        </div>

        {/* Price Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Price Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { l: 'Subtotal', v: `₹${order.itemsPrice?.toLocaleString('en-IN')}` },
                { l: 'Shipping', v: order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`, c: order.shippingPrice === 0 ? '#10B981' : undefined },
                { l: 'GST', v: `₹${order.taxPrice?.toLocaleString('en-IN')}` },
                ...(order.discountAmount > 0 ? [{ l: 'Discount', v: `-₹${order.discountAmount?.toLocaleString('en-IN')}`, c: '#10B981' }] : []),
              ].map(({ l, v, c }) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                  <span style={{ color: '#64748B' }}>{l}</span>
                  <span style={{ fontWeight: 600, color: c || '#F8FAFC' }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(124,58,237,0.1)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#8B5CF6' }}>₹{order.totalPrice?.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FiCreditCard size={16} color="#8B5CF6" /> Payment
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#64748B', fontSize: '0.875rem' }}>Method</span>
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{order.paymentMethod}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B', fontSize: '0.875rem' }}>Status</span>
              <span style={{ fontWeight: 600, fontSize: '0.875rem', color: order.isPaid ? '#10B981' : '#F59E0B' }}>
                {order.isPaid ? '✓ Paid' : 'Pending'}
              </span>
            </div>
            {order.couponCode && (
              <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8 }}>
                <p style={{ fontSize: '0.8rem', color: '#10B981' }}>🎟 Coupon: {order.couponCode}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 340px"] { grid-template-columns: 1fr !important; }
          div[style*="display: flex"][style*="STATUS_STEPS"] { overflow-x: auto; }
        }
      `}</style>
    </div>
  );
}
