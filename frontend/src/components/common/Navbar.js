import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  FiShoppingCart, FiUser, FiSearch, FiMenu, FiX,
  FiPackage, FiLogOut, FiSettings, FiShield
} from 'react-icons/fi';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${searchQuery.trim()}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" fill="url(#logoGrad)" />
              <ellipse cx="16" cy="16" rx="14" ry="5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
              <text x="16" y="21" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="Space Grotesk">N</text>
              <circle cx="24" cy="10" r="2.5" fill="#F59E0B" />
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="logo-text">Nebula<span>Cart</span></span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>Home</Link>
          <Link to="/products" className={location.pathname.startsWith('/products') ? 'nav-link active' : 'nav-link'}>Products</Link>
          {isAdmin && <Link to="/admin" className="nav-link admin-link"><FiShield size={14} />Admin</Link>}
        </div>

        {/* Search Bar */}
        <form className={`navbar-search ${searchOpen ? 'open' : ''}`} onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn"><FiSearch size={16} /></button>
        </form>

        {/* Actions */}
        <div className="navbar-actions">
          <button className="icon-btn" onClick={() => setSearchOpen(!searchOpen)} title="Search">
            {searchOpen ? <FiX size={20} /> : <FiSearch size={20} />}
          </button>

          <Link to="/cart" className="icon-btn cart-btn">
            <FiShoppingCart size={20} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {user ? (
            <div className="user-menu" ref={dropdownRef}>
              <button className="user-avatar-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>
                <span className="user-name-short">{user.name?.split(' ')[0]}</span>
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="avatar-lg">{user.name?.charAt(0).toUpperCase()}</div>
                    <div>
                      <p className="dropdown-name">{user.name}</p>
                      <p className="dropdown-email">{user.email}</p>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <FiShield size={15} /> Admin Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <FiSettings size={15} /> Profile
                  </Link>
                  <Link to="/orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <FiPackage size={15} /> My Orders
                  </Link>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <FiLogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}

          <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <form onSubmit={handleSearch} className="mobile-search">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
            />
            <button type="submit" className="btn btn-primary btn-sm">Search</button>
          </form>
          <Link to="/" className="mobile-nav-link">Home</Link>
          <Link to="/products" className="mobile-nav-link">Products</Link>
          <Link to="/cart" className="mobile-nav-link">Cart {totalItems > 0 && `(${totalItems})`}</Link>
          {user ? (
            <>
              <Link to="/profile" className="mobile-nav-link">Profile</Link>
              <Link to="/orders" className="mobile-nav-link">My Orders</Link>
              {isAdmin && <Link to="/admin" className="mobile-nav-link">Admin Dashboard</Link>}
              <button onClick={handleLogout} className="mobile-nav-link mobile-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-nav-link">Login</Link>
              <Link to="/register" className="mobile-nav-link">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
