import React, { useEffect, useState } from 'react';
import { getAllProductsAdmin, createProduct, updateProduct, deleteProduct } from '../../utils/api';
import AdminLayout from '../../components/admin/AdminLayout';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch } from 'react-icons/fi';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Living', 'Sports', 'Books', 'Beauty', 'Toys', 'Food'];
const EMPTY_FORM = { name: '', description: '', price: '', originalPrice: '', category: 'Electronics', brand: '', images: [''], stock: '', isFeatured: false, discount: 0 };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    getAllProductsAdmin().then(r => setProducts(r.data)).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(fetchProducts, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, price: p.price, originalPrice: p.originalPrice || '', category: p.category, brand: p.brand, images: p.images?.length ? p.images : [''], stock: p.stock, isFeatured: p.isFeatured, discount: p.discount || 0 });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock), originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined, images: form.images.filter(Boolean) };
      if (editing) {
        await updateProduct(editing._id, payload);
        toast.success('Product updated!');
      } else {
        await createProduct(payload);
        toast.success('Product created!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}"?`)) return;
    try {
      await deleteProduct(id);
      toast.success('Product removed');
      fetchProducts();
    } catch { toast.error('Delete failed'); }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Products">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, padding: '0.5rem 0.875rem', flex: 1, maxWidth: 340 }}>
          <FiSearch size={15} color="#475569" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ background: 'none', border: 'none', outline: 'none', color: '#F8FAFC', fontSize: '0.875rem', flex: 1 }} />
        </div>
        <button onClick={openCreate} className="btn btn-primary"><FiPlus size={16} /> Add Product</button>
      </div>

      {/* Table */}
      <div style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(124,58,237,0.08)', borderBottom: '1px solid rgba(124,58,237,0.15)' }}>
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.875rem 1rem', color: '#64748B', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={6} style={{ padding: '1rem' }}><div className="skeleton" style={{ height: 36, borderRadius: 8 }} /></td></tr>
                ))
              ) : filtered.map(p => (
                <tr key={p._id} style={{ borderBottom: '1px solid rgba(124,58,237,0.07)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={p.images?.[0] || 'https://via.placeholder.com/40'} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: '1px solid rgba(124,58,237,0.2)' }} />
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F8FAFC', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</p>
                        <p style={{ fontSize: '0.75rem', color: '#64748B' }}>{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}><span style={{ fontSize: '0.8rem', color: '#8B5CF6', background: 'rgba(124,58,237,0.1)', padding: '0.2rem 0.6rem', borderRadius: 6, fontWeight: 600 }}>{p.category}</span></td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', fontWeight: 700, color: '#F8FAFC', whiteSpace: 'nowrap' }}>₹{p.price?.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: p.stock < 10 ? '#EF4444' : p.stock < 30 ? '#F59E0B' : '#10B981', fontWeight: 600 }}>{p.stock}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: 100, background: p.isActive ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: p.isActive ? '#10B981' : '#EF4444' }}>
                      {p.isActive ? 'Active' : 'Hidden'}
                    </span>
                    {p.isFeatured && <span style={{ marginLeft: '0.4rem', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: 100, background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>⭐ Featured</span>}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEdit(p)} style={{ width: 32, height: 32, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 8, color: '#8B5CF6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.3)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,58,237,0.15)'}>
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(p._id, p.name)} style={{ width: 32, height: 32, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}>
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && filtered.length === 0 && <p style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>No products found</p>}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)' }} onClick={() => setShowModal(false)} />
          <div style={{ position: 'relative', background: '#1a2035', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 20, padding: '2rem', width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Product Name *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Product name" />
                </div>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Description *</label>
                  <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field" placeholder="Product description" style={{ resize: 'vertical' }} />
                </div>
                <div className="input-group">
                  <label>Price (₹) *</label>
                  <input required type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="input-field" placeholder="0" />
                </div>
                <div className="input-group">
                  <label>Original Price (₹)</label>
                  <input type="number" min="0" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} className="input-field" placeholder="MRP (optional)" />
                </div>
                <div className="input-group">
                  <label>Category *</label>
                  <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Brand *</label>
                  <input required value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className="input-field" placeholder="Brand name" />
                </div>
                <div className="input-group">
                  <label>Stock *</label>
                  <input required type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className="input-field" placeholder="0" />
                </div>
                <div className="input-group">
                  <label>Discount (%)</label>
                  <input type="number" min="0" max="100" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} className="input-field" placeholder="0" />
                </div>
                <div className="input-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Image URL</label>
                  <input value={form.images[0] || ''} onChange={e => setForm({ ...form, images: [e.target.value] })} className="input-field" placeholder="https://..." />
                </div>
                <div className="input-group" style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input type="checkbox" id="featured" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} style={{ accentColor: '#7C3AED', width: 16, height: 16 }} />
                  <label htmlFor="featured" style={{ margin: 0, cursor: 'pointer' }}>Mark as Featured Product</label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-ghost">Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                  {saving ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
