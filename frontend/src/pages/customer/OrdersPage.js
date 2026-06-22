import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../../utils/api';
import { FiPackage, FiChevronRight, FiShoppingBag } from 'react-icons/fi';

const STATUS_COLORS = {
  Pending: '#F59E0B',
  Processing: '#8B5CF6',
  Shipped: '#06B6D4',
  Delivered: '#10B981',
  Cancelled: '#EF4444',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(r => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="page-loader"><div className="spinner" /><p>Loading orders...</p></div>
  );

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>My Orders</h1>
      <p style={{ color: '#64748B', fontSize: '0.875rem', marginBottom: '2rem' }}>{orders.length} order(s) found</p>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <FiPackage size={60} color="#475569" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Orders Yet</h3>
          <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>Start shopping to see your orders here</p>
          <Link to="/products" className="btn btn-primary"><FiShoppingBag size={16} /> Shop Now</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map(order => (
            <Link key={order._id} to={`/orders/${order._id}`}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '1.25rem 1.5rem', textDecoration: 'none', color: 'inherit', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.15)'; e.currentTarget.style.transform = ''; }}>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                {/* Thumbnails */}
                <div style={{ display: 'flex' }}>
                  {order.orderItems.slice(0, 3).map((item, i) => (
                    <img key={i} src={item.image || 'https://via.placeholder.com/48'} alt={item.name}
                      style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', border: '2px solid #0A0E1A', marginLeft: i > 0 ? '-12px' : 0 }} />
                  ))}
                  {order.orderItems.length > 3 && (
                    <div style={{ width: 48, height: 48, borderRadius: 8, background: 'rgba(124,58,237,0.2)', border: '2px solid #0A0E1A', marginLeft: '-12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#8B5CF6' }}>
                      +{order.orderItems.length - 3}
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p style={{ color: '#64748B', fontSize: '0.8rem' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    &nbsp;·&nbsp;{order.orderItems.length} item(s)
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, fontSize: '1rem', color: '#F8FAFC' }}>₹{order.totalPrice?.toLocaleString('en-IN')}</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748B' }}>{order.paymentMethod}</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    display: 'inline-block', padding: '0.3rem 0.75rem', borderRadius: 100,
                    fontSize: '0.75rem', fontWeight: 700,
                    background: `${STATUS_COLORS[order.status]}20`,
                    color: STATUS_COLORS[order.status],
                  }}>{order.status}</span>
                </div>
                <FiChevronRight size={18} color="#475569" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
