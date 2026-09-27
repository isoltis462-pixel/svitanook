import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, User, ShoppingCart } from 'lucide-react';
import './Header.css';

export default function Header() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isSticky ? 'sticky' : ''}`}>
      <div className="header-container">
        <Link to="/" className="logo">
          <div className="logo-mark"></div>
          <span className="logo-text">Світанок</span>
        </Link>

        <div className="search-bar">
          <Search className="search-icon" size={20} />
          <input type="text" placeholder="Пошук товарів..." />
        </div>

        <div className="header-actions">
          <Link to="/profile/favorites" className="action-btn">
            <Heart size={24} />
          </Link>
          <Link to="/profile" className="action-btn">
            <User size={24} />
          </Link>
          <Link to="/cart" className="action-btn cart-btn">
            <ShoppingCart size={24} />
            <span className="cart-badge">3</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
