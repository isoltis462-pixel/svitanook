import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Тимчасові компоненти-заглушки для перевірки роутингу
const Layout = ({ children }) => <div><header>Header</header><main>{children}</main><footer>Footer</footer></div>;
const Home = () => <h1>Головна сторінка</h1>;
const Catalog = () => <h1>Каталог товарів</h1>;
const Product = () => <h1>Сторінка товару</h1>;
const Cart = () => <h1>Кошик</h1>;
const NotFound = () => <h1>404 - Сторінку не знайдено</h1>;

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/category/:slug" element={<Catalog />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
