import { Link } from 'react-router-dom';
import { Monitor, Shirt, Footprints, Home as HomeIcon, Watch, Sparkles } from 'lucide-react';
import './Home.css';

export default function Home() {
  const categories = [
    { id: 'electronics', name: 'Електроніка', icon: Monitor, path: '/category/electronics' },
    { id: 'clothing', name: 'Одяг', icon: Shirt, path: '/category/clothing' },
    { id: 'shoes', name: 'Взуття', icon: Footprints, path: '/category/shoes' },
    { id: 'home', name: 'Дім і сад', icon: HomeIcon, path: '/category/home' },
    { id: 'accessories', name: 'Аксесуари', icon: Watch, path: '/category/accessories' },
    { id: 'beauty', name: 'Краса', icon: Sparkles, path: '/category/beauty' },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>Ранковий вибір</span>
            </div>
            <h1 className="hero-title">Створи свій<br/>ідеальний ранок</h1>
            <p className="hero-subtitle">Товари, які додають комфорту кожному дню. Технології, краса та натхнення.</p>
            <div className="hero-actions">
              <Link to="/catalog" className="btn-primary">
                Перейти до каталогу
              </Link>
              <Link to="/category/new" className="btn-secondary">
                Дивитися новинки
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-placeholder">
              <div className="discount-badge">-20%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-container">
          <div className="categories-grid">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link key={cat.id} to={cat.path} className="category-card">
                  <div className="category-icon-wrapper">
                    <Icon size={28} strokeWidth={1.5} />
                  </div>
                  <span className="category-name">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
