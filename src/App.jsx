import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';

const Home = () => <div style={{ padding: '40px 20px', maxWidth: '1360px', margin: '0 auto', height: '100vh' }}><h1>Головна сторінка</h1></div>;
const Catalog = () => <div style={{ padding: '40px 20px', maxWidth: '1360px', margin: '0 auto' }}><h1>Каталог товарів</h1></div>;
const Product = () => <div style={{ padding: '40px 20px', maxWidth: '1360px', margin: '0 auto' }}><h1>Сторінка товару</h1></div>;
const Cart = () => <div style={{ padding: '40px 20px', maxWidth: '1360px', margin: '0 auto' }}><h1>Кошик</h1></div>;
const NotFound = () => <div style={{ padding: '40px 20px', maxWidth: '1360px', margin: '0 auto' }}><h1>404 - Сторінку не знайдено</h1></div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="category/:slug" element={<Catalog />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="cart" element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
