import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAnalytics, getAllOrdersAdmin } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { FiDollarSign, FiShoppingBag, FiUsers, FiPackage, FiArrowRight } from 'react-icons/fi';

const STATUS_COLORS = { Pending: '#F59E0B', Processing: '#8B5CF6', Shipped: '#06B6D4', Delivered: '#10B981', Cancelled: '#EF4444' };
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAnalytics(), getAllOrdersAdmin({ limit: 5 })])
      .then(([a, o]) => { setAnalytics(a.data); setRecentOrders(o.data.orders || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AdminLayout title="Dashboard">
      <div className="page-loader"><div className="spinner" /><p>Loading analytics...</p></div>
    </AdminLayout>
  );

  const revenueData = analytics?.revenueByMonth?.slice().reverse().map(item => ({
    name: `${MONTHS[item._id.month - 1]} ${item._id.year}`,
    revenue: item.revenue,
    orders: item.orders,
  })) || [];

  const statusData = analytics?.ordersByStatus?.map(s => ({
    name: s._id, count: s.count, fill: STATUS_COLORS[s._id] || '#7C3AED',
  })) || [];

  const STAT_CARDS = [
    { label: 'Total Revenue', value: `₹${(analytics?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: FiDollarSign, color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
    { label: 'Total Orders', value: analytics?.totalOrders || 0, icon: FiShoppingBag, color: '#8B5CF6', bg: 'rgba(124,58,237,0.15)' },
    { label: 'Total Customers', value: analytics?.totalUsers || 0, icon: FiUsers, color: '#EC4899', bg: 'rgba(236,72,153,0.15)' },
    { label: 'Active Products', value: analytics?.totalProducts || 0, icon: FiPackage, color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        {STAT_CARDS.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 52, height: 52, background: bg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <p style={{ color: '#64748B', fontSize: '0.8rem', marginBottom: '0.25rem' }}>{label}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F8FAFC' }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', marginBottom: '1.75rem' }}>
        {/* Revenue Chart */}
        <div style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Revenue Overview</h3>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.1)" />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748B', fontSize: 11 }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: '#0D1120', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 10, fontSize: '0.8rem' }} formatter={v => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2.5} dot={{ fill: '#8B5CF6', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>No revenue data yet</div>
          )}
        </div>

        {/* Orders by Status */}
        <div style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Orders by Status</h3>
          {statusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={statusData} barSize={28}>
                  <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#0D1120', border: '1px solid rgba(124,58,237,0.3)', borderRadius: 10, fontSize: '0.8rem' }} />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[6, 6, 0, 0]}>
                    {statusData.map((entry, i) => (
                      <rect key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.75rem' }}>
                {statusData.map(s => (
                  <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.fill }} />
                      <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{s.name}</span>
                    </div>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: s.fill }}>{s.count}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>No orders yet</div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Orders</h3>
          <Link to="/admin/orders" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#8B5CF6', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 600 }}>
            View All <FiArrowRight size={14} />
          </Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(124,58,237,0.15)' }}>
                {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.6rem 0.875rem', color: '#64748B', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order._id} style={{ borderBottom: '1px solid rgba(124,58,237,0.07)' }}>
                  <td style={{ padding: '0.875rem', fontSize: '0.82rem', fontWeight: 600, color: '#8B5CF6' }}>#{order._id.slice(-8).toUpperCase()}</td>
                  <td style={{ padding: '0.875rem', fontSize: '0.82rem', color: '#CBD5E1' }}>{order.user?.name || 'N/A'}</td>
                  <td style={{ padding: '0.875rem', fontSize: '0.82rem', color: '#94A3B8' }}>{order.orderItems?.length}</td>
                  <td style={{ padding: '0.875rem', fontSize: '0.82rem', fontWeight: 700, color: '#F8FAFC' }}>₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.875rem' }}>
                    <span style={{ padding: '0.25rem 0.65rem', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, background: `${STATUS_COLORS[order.status]}20`, color: STATUS_COLORS[order.status] }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem', fontSize: '0.78rem', color: '#64748B' }}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentOrders.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: '#475569' }}>No orders yet</p>}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 2fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AdminLayout>
  );
}
