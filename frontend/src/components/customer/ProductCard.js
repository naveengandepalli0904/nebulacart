import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return toast.error('Out of stock');
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      stock: product.stock,
    });
    toast.success('Added to cart!');
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount || 0;

  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-card-img">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'}
          alt={product.name}
          loading="lazy"
        />
        {discount > 0 && <span className="discount-badge">-{discount}%</span>}
        {product.stock === 0 && <div className="out-of-stock-overlay">Out of Stock</div>}
        <div className="card-actions">
          <button className="card-action-btn" onClick={handleAddToCart} title="Add to Cart">
            <FiShoppingCart size={16} />
          </button>
        </div>
      </div>
      <div className="product-card-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <FiStar size={13} style={{ fill: '#F59E0B', color: '#F59E0B' }} />
          <span>{product.rating?.toFixed(1)}</span>
          <span className="review-count">({product.numReviews})</span>
        </div>
        <div className="product-price">
          <span className="price-current">₹{product.price?.toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <span className="price-original">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
          )}
        </div>
      </div>
      <style>{`
        .product-card {
          display: block;
          background: #1a2035;
          border: 1px solid rgba(124,58,237,0.15);
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          transition: all 0.3s;
          position: relative;
        }
        .product-card:hover {
          border-color: rgba(124,58,237,0.5);
          box-shadow: 0 8px 32px rgba(124,58,237,0.2);
          transform: translateY(-4px);
        }
        .product-card-img {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          background: #111827;
        }
        .product-card-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s;
        }
        .product-card:hover .product-card-img img { transform: scale(1.06); }
        .discount-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: linear-gradient(135deg, #7C3AED, #EC4899);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
        }
        .out-of-stock-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #EF4444;
          font-weight: 700;
          font-size: 0.9rem;
        }
        .card-actions {
          position: absolute;
          bottom: 10px;
          right: 10px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          opacity: 0;
          transform: translateX(10px);
          transition: all 0.3s;
        }
        .product-card:hover .card-actions { opacity: 1; transform: translateX(0); }
        .card-action-btn {
          width: 36px;
          height: 36px;
          background: rgba(10,14,26,0.9);
          border: 1px solid rgba(124,58,237,0.4);
          border-radius: 8px;
          color: #F8FAFC;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .card-action-btn:hover { background: #7C3AED; border-color: #7C3AED; }
        .product-card-info { padding: 1rem; }
        .product-category { font-size: 0.7rem; color: #8B5CF6; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.35rem; }
        .product-name { font-size: 0.9rem; color: #F8FAFC; font-weight: 600; margin-bottom: 0.5rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4; }
        .product-rating { display: flex; align-items: center; gap: 0.3rem; margin-bottom: 0.6rem; }
        .product-rating span { font-size: 0.8rem; color: #F59E0B; font-weight: 600; }
        .review-count { color: #64748B !important; font-weight: 400 !important; }
        .product-price { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; }
        .price-current { font-size: 1.05rem; font-weight: 700; color: #F8FAFC; }
        .price-original { font-size: 0.8rem; color: #64748B; text-decoration: line-through; }
      `}</style>
    </Link>
  );
}
