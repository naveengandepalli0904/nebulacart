import React, { useEffect, useState } from 'react';
import { getAllOrdersAdmin, updateOrderStatus } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { FiSearch, FiEye, FiX } from 'react-icons/fi';

const STATUSES = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLORS = { Pending: '#F59E0B', Processing: '#8B5CF6', Shipped: '#06B6D4', Delivered: '#10B981', Cancelled: '#EF4444' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [tracking, setTracking] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    getAllOrdersAdmin({ limit: 100 })
      .then(r => setOrders(r.data.orders || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };
  useEffect(fetchOrders, []);

  const handleUpdateStatus = async () => {
    if (!newStatus) return;
    setUpdating(true);
    try {
      await updateOrderStatus(selected._id, { status: newStatus, trackingNumber: tracking });
      toast.success('Order status updated!');
      setSelected(null);
      fetchOrders();
    } catch { toast.error('Update failed'); }
    finally { setUpdating(false); }
  };

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchSearch = o._id.toLowerCase().includes(search.toLowerCase()) || o.user?.name?.toLowerCase().includes(search.toLowerCase()) || o.user?.email?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <AdminLayout title="Orders">
      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              style={{ padding: '0.4rem 0.875rem', borderRadius: 100, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', border: 'none', background: statusFilter === s ? (STATUS_COLORS[s] || '#7C3AED') : 'rgba(255,255,255,0.06)', color: statusFilter === s ? 'white' : '#64748B', transition: 'all 0.2s' }}>
              {s}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, padding: '0.5rem 0.875rem' }}>
          <FiSearch size={15} color="#475569" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID or customer..." style={{ background: 'none', border: 'none', outline: 'none', color: '#F8FAFC', fontSize: '0.875rem', width: 220 }} />
        </div>
      </div>

      <div style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(124,58,237,0.08)', borderBottom: '1px solid rgba(124,58,237,0.15)' }}>
                {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Action'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.875rem 1rem', color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}><td colSpan={8} style={{ padding: '0.875rem' }}><div className="skeleton" style={{ height: 32, borderRadius: 8 }} /></td></tr>
                ))
              ) : filtered.map(order => (
                <tr key={order._id} style={{ borderBottom: '1px solid rgba(124,58,237,0.07)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.82rem', fontWeight: 600, color: '#8B5CF6', whiteSpace: 'nowrap' }}>#{order._id.slice(-8).toUpperCase()}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <p style={{ fontSize: '0.82rem', color: '#CBD5E1', fontWeight: 500 }}>{order.user?.name || 'N/A'}</p>
                    <p style={{ fontSize: '0.72rem', color: '#475569' }}>{order.user?.email}</p>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.82rem', color: '#94A3B8' }}>{order.orderItems?.length}</td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.82rem', fontWeight: 700, color: '#F8FAFC', whiteSpace: 'nowrap' }}>₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: order.isPaid ? '#10B981' : '#F59E0B' }}>
                      {order.isPaid ? '✓ Paid' : '⏳ Pending'}</span>
                    <p style={{ fontSize: '0.7rem', color: '#475569' }}>{order.paymentMethod}</p>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ padding: '0.25rem 0.65rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, background: `${STATUS_COLORS[order.status]}20`, color: STATUS_COLORS[order.status], whiteSpace: 'nowrap' }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.78rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <button onClick={() => { setSelected(order); setNewStatus(order.status); setTracking(order.trackingNumber || ''); }}
                      style={{ width: 32, height: 32, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 8, color: '#8B5CF6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiEye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && <p style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>No orders found</p>}
        </div>
      </div>

      {/* Update Order Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)' }} onClick={() => setSelected(null)} />
          <div style={{ position: 'relative', background: '#1a2035', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 500, zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Update Order #{selected._id.slice(-8).toUpperCase()}</h2>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}><FiX size={20} /></button>
            </div>

            {/* Order Summary */}
            <div style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 12, padding: '1rem', marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '0.35rem' }}><strong>Customer:</strong> {selected.user?.name} ({selected.user?.email})</p>
              <p style={{ fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '0.35rem' }}><strong>Items:</strong> {selected.orderItems?.length} · <strong>Total:</strong> ₹{selected.totalPrice?.toLocaleString('en-IN')}</p>
              <p style={{ fontSize: '0.85rem', color: '#CBD5E1' }}><strong>Address:</strong> {selected.shippingAddress?.city}, {selected.shippingAddress?.state}</p>
            </div>

            <div className="input-group">
              <label>Update Status</label>
              <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="input-field">
                {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {(newStatus === 'Shipped' || newStatus === 'Delivered') && (
              <div className="input-group">
                <label>Tracking Number (optional)</label>
                <input value={tracking} onChange={e => setTracking(e.target.value)} className="input-field" placeholder="e.g. IND123456789" />
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button onClick={() => setSelected(null)} className="btn btn-ghost">Cancel</button>
              <button onClick={handleUpdateStatus} disabled={updating} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
