import React, { useEffect, useState } from 'react';
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiTag } from 'react-icons/fi';

const EMPTY = { code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxDiscountAmount: '', expiresAt: '', usageLimit: '', isActive: true };

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetchCoupons = () => {
    setLoading(true);
    getAllCoupons().then(r => setCoupons(r.data)).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(fetchCoupons, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({
      code: c.code, discountType: c.discountType, discountValue: c.discountValue,
      minOrderAmount: c.minOrderAmount || '', maxDiscountAmount: c.maxDiscountAmount || '',
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : '',
      usageLimit: c.usageLimit || '', isActive: c.isActive,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        discountValue: Number(form.discountValue),
        minOrderAmount: Number(form.minOrderAmount) || 0,
        maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        code: form.code.toUpperCase(),
      };
      if (editing) { await updateCoupon(editing._id, payload); toast.success('Coupon updated!'); }
      else { await createCoupon(payload); toast.success('Coupon created!'); }
      setShowModal(false);
      fetchCoupons();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try { await deleteCoupon(id); toast.success('Coupon deleted'); fetchCoupons(); }
    catch { toast.error('Delete failed'); }
  };

  const isExpired = (date) => new Date(date) < new Date();

  return (
    <AdminLayout title="Coupons">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <p style={{ color: '#64748B', fontSize: '0.875rem' }}>{coupons.length} coupon(s)</p>
        <button onClick={openCreate} className="btn btn-primary"><FiPlus size={16} /> Create Coupon</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 160, borderRadius: 16 }} />)
        ) : coupons.map(c => {
          const expired = isExpired(c.expiresAt);
          return (
            <div key={c._id} style={{ background: '#1a2035', border: `1px solid ${expired ? 'rgba(239,68,68,0.2)' : c.isActive ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 16, padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
              {/* Background Icon */}
              <FiTag size={80} style={{ position: 'absolute', right: -20, bottom: -20, color: 'rgba(124,58,237,0.06)' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
                <div>
                  <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#8B5CF6', letterSpacing: '0.05em', fontFamily: 'monospace' }}>{c.code}</p>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.2rem' }}>
                    {c.discountType === 'percentage' ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
                    {c.maxDiscountAmount ? ` (max ₹${c.maxDiscountAmount})` : ''}
                  </p>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: 100, background: expired ? 'rgba(239,68,68,0.15)' : c.isActive ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.08)', color: expired ? '#EF4444' : c.isActive ? '#10B981' : '#64748B' }}>
                  {expired ? 'Expired' : c.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.78rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.5rem 0.6rem', borderRadius: 8 }}>
                  <p style={{ color: '#475569' }}>Min Order</p>
                  <p style={{ color: '#F8FAFC', fontWeight: 600 }}>₹{c.minOrderAmount}</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.5rem 0.6rem', borderRadius: 8 }}>
                  <p style={{ color: '#475569' }}>Used / Limit</p>
                  <p style={{ color: '#F8FAFC', fontWeight: 600 }}>{c.usedCount} / {c.usageLimit || '∞'}</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '0.5rem 0.6rem', borderRadius: 8, gridColumn: '1 / -1' }}>
                  <p style={{ color: '#475569' }}>Expires</p>
                  <p style={{ color: expired ? '#EF4444' : '#F8FAFC', fontWeight: 600 }}>{new Date(c.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => openEdit(c)} className="btn btn-outline btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                  <FiEdit2 size={13} /> Edit
                </button>
                <button onClick={() => handleDelete(c._id, c.code)} className="btn btn-danger btn-sm">
                  <FiTrash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {!loading && coupons.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#475569' }}>
          <FiTag size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
          <p>No coupons yet. Create your first coupon!</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)' }} onClick={() => setShowModal(false)} />
          <div style={{ position: 'relative', background: '#1a2035', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{editing ? 'Edit Coupon' : 'Create Coupon'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="input-group">
                <label>Coupon Code *</label>
                <input required value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="input-field" placeholder="e.g. SAVE20" style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.1em' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label>Discount Type *</label>
                  <select required value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })} className="input-field">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Discount Value *</label>
                  <input required type="number" min="0" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })}
                    className="input-field" placeholder={form.discountType === 'percentage' ? '10' : '200'} />
                </div>
                <div className="input-group">
                  <label>Min Order Amount (₹)</label>
                  <input type="number" min="0" value={form.minOrderAmount} onChange={e => setForm({ ...form, minOrderAmount: e.target.value })} className="input-field" placeholder="0" />
                </div>
                <div className="input-group">
                  <label>Max Discount (₹)</label>
                  <input type="number" min="0" value={form.maxDiscountAmount} onChange={e => setForm({ ...form, maxDiscountAmount: e.target.value })} className="input-field" placeholder="Optional cap" />
                </div>
                <div className="input-group">
                  <label>Expiry Date *</label>
                  <input required type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })} className="input-field" />
                </div>
                <div className="input-group">
                  <label>Usage Limit</label>
                  <input type="number" min="0" value={form.usageLimit} onChange={e => setForm({ ...form, usageLimit: e.target.value })} className="input-field" placeholder="Blank = unlimited" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <input type="checkbox" id="couponActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} style={{ accentColor: '#7C3AED', width: 16, height: 16 }} />
                <label htmlFor="couponActive" style={{ margin: 0, cursor: 'pointer', fontSize: '0.875rem' }}>Coupon is Active</label>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {saving ? 'Saving...' : editing ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
