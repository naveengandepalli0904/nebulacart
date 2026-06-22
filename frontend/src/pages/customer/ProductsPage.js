import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../../utils/api';
import ProductCard from '../../components/customer/ProductCard';
import { FiFilter, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Living', 'Sports', 'Books', 'Beauty', 'Toys', 'Food'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');
  const featured = searchParams.get('featured') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getProducts({ keyword, category, sort, page, featured, minPrice, maxPrice, limit: 12 });
      setProducts(data.products);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [keyword, category, sort, page, featured, minPrice, maxPrice]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setParam = (key, value) => {
    const params = Object.fromEntries(searchParams);
    if (value) params[key] = value; else delete params[key];
    params.page = '1';
    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams({});

  const hasFilters = category || minPrice || maxPrice || keyword || featured;

  const Sidebar = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Categories */}
      <div>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categories</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <button onClick={() => setParam('category', '')}
            style={{ textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: 8, border: 'none', background: !category ? 'rgba(124,58,237,0.15)' : 'transparent', color: !category ? '#8B5CF6' : '#94A3B8', fontSize: '0.875rem', fontWeight: !category ? 600 : 400, cursor: 'pointer', transition: 'all 0.2s' }}>
            All Categories
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setParam('category', cat)}
              style={{ textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: 8, border: 'none', background: category === cat ? 'rgba(124,58,237,0.15)' : 'transparent', color: category === cat ? '#8B5CF6' : '#94A3B8', fontSize: '0.875rem', fontWeight: category === cat ? 600 : 400, cursor: 'pointer', transition: 'all 0.2s' }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#F8FAFC', marginBottom: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Price Range</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input type="number" placeholder="Min ₹" defaultValue={minPrice}
            onBlur={e => setParam('minPrice', e.target.value)}
            className="input-field" style={{ flex: 1 }} />
          <span style={{ color: '#475569' }}>–</span>
          <input type="number" placeholder="Max ₹" defaultValue={maxPrice}
            onBlur={e => setParam('maxPrice', e.target.value)}
            className="input-field" style={{ flex: 1 }} />
        </div>
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
          <FiX size={14} /> Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          {keyword ? `Results for "${keyword}"` : category || (featured ? 'Featured Products' : 'All Products')}
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.875rem' }}>{total} products found</p>
      </div>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Desktop Sidebar */}
        <aside style={{ width: '220px', flexShrink: 0, display: 'none', ...{} }} className="desktop-sidebar">
          <Sidebar />
        </aside>
        <style>{`.desktop-sidebar { display: block !important; } @media(max-width: 768px) { .desktop-sidebar { display: none !important; } }`}</style>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button className="btn btn-ghost btn-sm mobile-filter-btn" onClick={() => setSidebarOpen(true)}>
              <FiFilter size={15} /> Filters {hasFilters && `(active)`}
            </button>
            <style>{`.mobile-filter-btn { display: none !important; } @media(max-width: 768px) { .mobile-filter-btn { display: flex !important; } }`}</style>
            <select value={sort} onChange={e => setParam('sort', e.target.value)} className="input-field" style={{ width: 'auto', padding: '0.5rem 0.875rem' }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="products-grid">
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ borderRadius: 16, overflow: 'hidden', background: '#1a2035' }}>
                  <div className="skeleton" style={{ height: 240 }} />
                  <div style={{ padding: '1rem' }}>
                    <div className="skeleton" style={{ height: 12, width: '60%', marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 16, marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 20, width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔭</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Products Found</h3>
              <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>Try adjusting your filters or search query</p>
              <button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
              <button onClick={() => setParam('page', String(page - 1))} disabled={page === 1}
                className="btn btn-ghost btn-sm" style={{ opacity: page === 1 ? 0.4 : 1 }}>
                <FiChevronLeft size={16} />
              </button>
              {[...Array(pages)].map((_, i) => (
                <button key={i} onClick={() => setParam('page', String(i + 1))}
                  className={`btn btn-sm ${page === i + 1 ? 'btn-primary' : 'btn-ghost'}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setParam('page', String(page + 1))} disabled={page === pages}
                className="btn btn-ghost btn-sm" style={{ opacity: page === pages ? 0.4 : 1 }}>
                <FiChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '280px', background: '#1a2035', padding: '1.5rem', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontWeight: 700 }}>Filters</h3>
              <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}><FiX size={20} /></button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}
