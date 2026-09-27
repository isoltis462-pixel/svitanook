import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-links">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-mark"></div>
              <span className="logo-text">Світанок</span>
            </Link>
            <p className="brand-desc">Твій простір для красивих покупок.</p>
          </div>

          <div className="footer-column">
            <h3>Покупцям</h3>
            <Link to="/about">Про магазин</Link>
            <Link to="/delivery">Доставка</Link>
            <Link to="/payment">Оплата</Link>
            <Link to="/returns">Повернення</Link>
            <Link to="/contacts">Контакти</Link>
          </div>

          <div className="footer-column">
            <h3>Категорії</h3>
            <Link to="/category/new">Новинки</Link>
            <Link to="/category/sale">Акції</Link>
            <Link to="/category/popular">Популярне</Link>
          </div>

          <div className="footer-column">
            <h3>Допомога</h3>
            <Link to="/faq">FAQ</Link>
            <Link to="/support">Підтримка</Link>
            <Link to="/rules">Правила</Link>
            <Link to="/privacy">Політика конфіденційності</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container bottom-container">
          <p>© 2026 Світанок</p>
        </div>
      </div>
    </footer>
  );
}
