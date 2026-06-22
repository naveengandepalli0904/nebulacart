import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, addReview } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FiStar, FiShoppingCart, FiArrowLeft, FiTruck, FiShield, FiRefreshCw, FiPackage } from 'react-icons/fi';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then(r => { setProduct(r.data); setActiveImg(0); })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    for (let i = 0; i < qty; i++) {
      addToCart({ _id: product._id, name: product.name, price: product.price, image: product.images?.[0], stock: product.stock });
    }
    toast.success(`${qty} item(s) added to cart!`);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to review');
    setSubmittingReview(true);
    try {
      await addReview(id, { rating: reviewRating, comment: reviewComment });
      toast.success('Review submitted!');
      setReviewComment('');
      const updated = await getProduct(id);
      setProduct(updated.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="page-loader">
      <div className="spinner" />
      <p>Loading product...</p>
    </div>
  );

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
      <p style={{ color: '#64748B' }}>Product not found.</p>
      <Link to="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Products</Link>
    </div>
  );

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#64748B', marginBottom: '1.5rem', fontSize: '0.875rem', textDecoration: 'none' }}>
        <FiArrowLeft size={15} /> Back to Products
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
        {/* Images */}
        <div>
          <div style={{ aspectRatio: '1', background: '#111827', borderRadius: 16, overflow: 'hidden', marginBottom: '1rem', border: '1px solid rgba(124,58,237,0.15)' }}>
            <img src={product.images?.[activeImg] || 'https://via.placeholder.com/500'} alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {product.images?.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', border: `2px solid ${activeImg === i ? '#7C3AED' : 'rgba(124,58,237,0.15)'}`, cursor: 'pointer', padding: 0, background: '#111827' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span style={{ fontSize: '0.75rem', color: '#8B5CF6', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{product.category}</span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.5rem 0 0.75rem', lineHeight: 1.3 }}>{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} size={16} style={{ fill: i < Math.round(product.rating) ? '#F59E0B' : 'transparent', color: '#F59E0B' }} />
              ))}
            </div>
            <span style={{ color: '#F59E0B', fontWeight: 600, fontSize: '0.9rem' }}>{product.rating?.toFixed(1)}</span>
            <span style={{ color: '#64748B', fontSize: '0.85rem' }}>({product.numReviews} reviews)</span>
            <span style={{ color: product.stock > 0 ? '#10B981' : '#EF4444', fontSize: '0.85rem', fontWeight: 600 }}>
              {product.stock > 0 ? `✓ In Stock (${product.stock})` : '✗ Out of Stock'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#F8FAFC' }}>₹{product.price?.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <>
                <span style={{ fontSize: '1.1rem', color: '#64748B', textDecoration: 'line-through' }}>₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                <span style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: 'white', fontSize: '0.8rem', fontWeight: 700, padding: '3px 10px', borderRadius: 6 }}>{discount}% OFF</span>
              </>
            )}
          </div>

          <p style={{ color: '#94A3B8', lineHeight: 1.7, marginBottom: '1.5rem', fontSize: '0.9rem' }}>{product.description}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#94A3B8' }}>Brand:</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#8B5CF6' }}>{product.brand}</span>
          </div>

          {/* Qty & Cart */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, overflow: 'hidden' }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', color: '#F8FAFC', cursor: 'pointer', fontSize: '1.1rem' }}>−</button>
              <span style={{ padding: '0 1rem', fontWeight: 600 }}>{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ padding: '0.75rem 1rem', background: 'none', border: 'none', color: '#F8FAFC', cursor: 'pointer', fontSize: '1.1rem' }}>+</button>
            </div>
            <button onClick={handleAddToCart} disabled={product.stock === 0}
              className="btn btn-primary btn-lg" style={{ flex: 1, justifyContent: 'center', opacity: product.stock === 0 ? 0.5 : 1 }}>
              <FiShoppingCart size={18} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {/* Trust */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              { icon: FiTruck, text: 'Free Delivery', sub: 'Above ₹999' },
              { icon: FiShield, text: 'Genuine Product', sub: 'Verified seller' },
              { icon: FiRefreshCw, text: 'Easy Returns', sub: '7-day policy' },
              { icon: FiPackage, text: 'Secure Packing', sub: 'Safe delivery' },
            ].map(({ icon: Icon, text, sub }) => (
              <div key={text} style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', padding: '0.75rem', background: 'rgba(124,58,237,0.06)', borderRadius: 10, border: '1px solid rgba(124,58,237,0.1)' }}>
                <Icon size={16} color="#8B5CF6" />
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#F8FAFC' }}>{text}</p>
                  <p style={{ fontSize: '0.7rem', color: '#64748B' }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div style={{ background: '#1a2035', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 16, padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Customer Reviews ({product.numReviews})</h2>

        {product.reviews?.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
            {product.reviews.map((r, i) => (
              <div key={i} style={{ paddingBottom: '1.25rem', borderBottom: i < product.reviews.length - 1 ? '1px solid rgba(124,58,237,0.1)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #7C3AED, #EC4899)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '0.85rem' }}>
                      {r.name?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, j) => <FiStar key={j} size={13} style={{ fill: j < r.rating ? '#F59E0B' : 'transparent', color: '#F59E0B' }} />)}
                  </div>
                </div>
                <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: 1.6 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>No reviews yet. Be the first to review!</p>
        )}

        {/* Add Review */}
        {user ? (
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Write a Review</h3>
            <form onSubmit={handleReview}>
              <div className="input-group">
                <label>Rating</label>
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} type="button" onClick={() => setReviewRating(s)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                      <FiStar size={24} style={{ fill: s <= reviewRating ? '#F59E0B' : 'transparent', color: '#F59E0B', transition: 'fill 0.15s' }} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="input-group">
                <label>Comment</label>
                <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} required
                  placeholder="Share your experience with this product..."
                  rows={4} className="input-field" style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        ) : (
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>
            <Link to="/login" style={{ color: '#8B5CF6' }}>Login</Link> to write a review.
          </p>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
}
