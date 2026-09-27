import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Heart, User, Search, Menu, X, Star, 
  ChevronRight, ArrowRight, ShieldCheck, Truck, RefreshCw, 
  SlidersHorizontal, Check, AlertCircle, Sparkles, Home, LogOut
} from 'lucide-react';
import { auth, database } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { ref, set, get, child } from 'firebase/database';

// Початкові демо-товари відповідно до дизайну
const INITIAL_PRODUCTS = [
  {
    id: 'iphone-15',
    name: 'Смартфон iPhone 15 128GB',
    price: 29999,
    oldPrice: 36999,
    discount: 19,
    rating: 4.8,
    reviewsCount: 108,
    categoryId: 'electronics',
    isNew: true,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80',
    description: 'Новітній смартфон із потужним чипом A16 Bionic, вдосконаленою камерою та розємом USB-C.'
  },
  {
    id: 'airpods-pro',
    name: 'Бездротові навушники AirPods Pro',
    price: 8999,
    oldPrice: 10499,
    discount: 14,
    rating: 4.9,
    reviewsCount: 240,
    categoryId: 'electronics',
    isNew: false,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500&auto=format&fit=crop&q=80',
    description: 'Активне шумозаглушення, адаптивний звук та надзвичайно чисте звучання.'
  },
  {
    id: 'aero-jacket',
    name: 'Куртка Aero',
    price: 2450,
    oldPrice: 2900,
    discount: 16,
    rating: 4.8,
    reviewsCount: 124,
    categoryId: 'clothing',
    isNew: true,
    isPopular: false,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=80',
    description: 'Легка та стильна демісезонна куртка для комфортних щоденних прогулянок.'
  },
  {
    id: 'smart-watch',
    name: 'Смарт-годинник Apple Watch SE',
    price: 11999,
    oldPrice: 13999,
    discount: 15,
    rating: 4.7,
    reviewsCount: 89,
    categoryId: 'electronics',
    isNew: false,
    isPopular: true,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80',
    description: 'Стежте за здоровʼям та тренуйтеся з передовим розумним годинником.'
  }
];

const CATEGORIES = [
  { id: 'electronics', name: 'Електроніка', icon: '📱', count: '1,420 товарів' },
  { id: 'clothing', name: 'Одяг', icon: '🧥', count: '890 товарів' },
  { id: 'shoes', name: 'Взуття', icon: '👟', count: '430 товарів' },
  { id: 'home', name: 'Дім і сад', icon: '🏡', count: '650 товарів' },
  { id: 'beauty', name: 'Краса', icon: '✨', count: '320 товарів' }
];

export default function App() {
  const [currentRoute, setCurrentRoute] = useState('home'); // home, catalog, product, cart, checkout, order-success, profile, login, register
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Спостереження за авторизацією Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Показувати Toast сповіщення
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  // Додавання в кошик
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast('✓ Товар додано в кошик');
  };

  // Додавання в обране
  const toggleFavorite = (product, e) => {
    e?.stopPropagation();
    setFavorites(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        showToast('Видалено з обраного');
        return prev.filter(item => item.id === product.id);
      }
      showToast('♥ Додано в обране');
      return [...prev, product];
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#EFEAF2] text-[#201C3B] font-['Manrope'] flex flex-col justify-between pb-16 md:pb-0">
      
      {/* Toast сповіщення */}
      {toast && (
        <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 bg-white border border-[#DED8E8] shadow-lg rounded-xl px-5 py-3 flex items-center gap-3 animate-bounce">
          <span className="text-[#2FA876] font-bold">✔</span>
          <span className="text-sm font-semibold text-[#23204A]">{toast}</span>
        </div>
      )}

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#DED8E8] transition-all">
        <div className="max-w-[1360px] mx-auto px-4 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentRoute('home')}>
            <div className="w-10 h-10 rounded-full sunrise-gradient flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-[#23204A]">Світанок</span>
              <span className="hidden md:block text-[10px] text-[#88849F] font-medium tracking-wider uppercase">Твій простір для покупок</span>
            </div>
          </div>

          {/* Search input (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl relative">
            <input 
              type="text" 
              placeholder="Пошук товарів, брендів або категорій..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setCurrentRoute('catalog')}
              className="w-full bg-[#F5F2F6] border border-[#E8E2ED] rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-[#FF4D6D] transition-colors"
            />
            <Search className="w-5 h-5 text-[#88849F] absolute left-3.5 top-2.5" />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={() => setCurrentRoute('favorites')} className="relative p-2.5 rounded-full hover:bg-[#F5F2F6] transition-colors">
              <Heart className="w-6 h-6 text-[#23204A]" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#FF4D6D] text-white text-[10px] font-bold flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

            <button onClick={() => setCurrentRoute(user ? 'profile' : 'login')} className="p-2.5 rounded-full hover:bg-[#F5F2F6] transition-colors">
              <User className="w-6 h-6 text-[#23204A]" />
            </button>

            <button onClick={() => setCurrentRoute('cart')} className="relative flex items-center gap-2 bg-[#23204A] text-white px-4 py-2.5 rounded-full font-semibold text-sm hover:bg-[#DE2C4F] transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden md:inline">Кошик</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#FF4D6D] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden p-2.5 rounded-full hover:bg-[#F5F2F6]">
              <Menu className="w-6 h-6 text-[#23204A]" />
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT AREA */}
      <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 py-6">
        
        {/* ================= 1. ГОЛОВНА СТОРІНКА ================= */}
        {currentRoute === 'home' && (
          <div className="space-y-12">
            
            {/* Hero блок */}
            <div className="relative rounded-[24px] sunrise-gradient p-8 md:p-14 text-white overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between">
              <div className="max-w-xl space-y-4 z-10">
                <span className="bg-white/25 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">✦ Новинка сезону</span>
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Створи свій ідеальний ранок</h1>
                <p className="text-white/80 text-base md:text-lg">Товари, які додають комфорту кожному дню. Обирай найкраще для себе та близьких.</p>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setCurrentRoute('catalog')} className="bg-[#FF4D6D] hover:bg-[#DE2C4F] text-white px-7 py-3.5 rounded-full font-bold shadow-lg transition-transform active:scale-95">
                    Перейти до каталогу
                  </button>
                </div>
              </div>
              <div className="mt-8 md:mt-0 z-10">
                <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=80" alt="Morning" className="w-72 md:w-96 h-64 object-cover rounded-2xl shadow-2xl border-4 border-white/20" />
              </div>
            </div>

            {/* Категорії */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-[#23204A]">Категорії</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {CATEGORIES.map(cat => (
                  <div 
                    key={cat.id} 
                    onClick={() => setCurrentRoute('catalog')}
                    className="bg-white p-5 rounded-[16px] border border-[#DED8E8] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col items-center text-center group"
                  >
                    <span className="text-4xl mb-3 p-3 bg-[#F5F2F6] rounded-full group-hover:bg-[#FF4D6D]/10 transition-colors">{cat.icon}</span>
                    <h3 className="font-bold text-[#23204A]">{cat.name}</h3>
                    <span className="text-xs text-[#88849F] mt-1">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Популярні товари */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-extrabold text-[#23204A]">Популярні товари</h2>
                <button onClick={() => setCurrentRoute('catalog')} className="text-[#FF4D6D] font-bold text-sm hover:underline flex items-center gap-1">
                  Дивитися всі <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {INITIAL_PRODUCTS.map(product => (
                  <div 
                    key={product.id}
                    onClick={() => { setSelectedProduct(product); setCurrentRoute('product'); }}
                    className="bg-white rounded-[16px] border border-[#DED8E8] p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative"
                  >
                    <div>
                      <div className="relative bg-[#F5F2F6] rounded-xl h-52 mb-4 overflow-hidden flex items-center justify-center">
                        {product.isNew && (
                          <span className="absolute top-3 left-3 bg-[#FFB648] text-[#23204A] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">NEW</span>
                        )}
                        {product.discount > 0 && (
                          <span className="absolute top-3 left-3 bg-[#FF4D6D] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full">-{product.discount}%</span>
                        )}
                        <button onClick={(e) => toggleFavorite(product, e)} className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-[#23204A] transition-colors">
                          <Heart className="w-4 h-4" />
                        </button>
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>

                      <h3 className="font-bold text-[#23204A] text-base mb-1 line-clamp-1">{product.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-[#88849F] mb-3">
                        <Star className="w-3.5 h-3.5 fill-[#FFB648] text-[#FFB648]" />
                        <span className="font-bold text-[#23204A]">{product.rating}</span>
                        <span>({product.reviewsCount})</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E8E2ED]">
                      <div>
                        {product.oldPrice && (
                          <span className="text-xs text-[#88849F] line-through block">{product.oldPrice} ₴</span>
                        )}
                        <span className="text-lg font-extrabold text-[#23204A]">{product.price} ₴</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                        className="bg-[#FF4D6D] hover:bg-[#DE2C4F] text-white p-2.5 rounded-full shadow transition-transform active:scale-90"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Переваги */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-[20px] border border-[#DED8E8]">
              <div className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-full bg-[#FF4D6D]/10 text-[#FF4D6D] flex items-center justify-center font-bold">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Швидка доставка</h4>
                  <p className="text-xs text-[#88849F]">Нова Пошта по всій Україні</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-full bg-[#FFB648]/20 text-[#FFB648] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Гарантія якості</h4>
                  <p className="text-xs text-[#88849F]">100% оригінальні товари</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-full bg-[#2FA876]/10 text-[#2FA876] flex items-center justify-center font-bold">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Зручна оплата</h4>
                  <p className="text-xs text-[#88849F]">Карткою або при отриманні</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 rounded-full bg-[#23204A]/10 text-[#23204A] flex items-center justify-center font-bold">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Підтримка 24/7</h4>
                  <p className="text-xs text-[#88849F]">Завжди на зв'язку з вами</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= 2. КАТАЛОГ ================= */}
        {currentRoute === 'catalog' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-[#88849F]">
              <span className="cursor-pointer hover:text-[#23204A]" onClick={() => setCurrentRoute('home')}>Головна</span>
              <span>/</span>
              <span className="text-[#23204A] font-semibold">Каталог</span>
            </div>

            <h1 className="text-3xl font-extrabold text-[#23204A]">Каталог товарів</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Фільтри */}
              <div className="bg-white p-6 rounded-[16px] border border-[#DED8E8] h-fit space-y-6">
                <h3 className="font-bold text-lg text-[#23204A] flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5" /> Фільтри
                </h3>
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-[#23204A]">Категорії</h4>
                  {CATEGORIES.map(c => (
                    <label key={c.id} className="flex items-center gap-2 text-sm text-[#67628A] cursor-pointer">
                      <input type="checkbox" className="rounded border-[#DED8E8] text-[#FF4D6D] focus:ring-0" />
                      {c.name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Сітка товарів */}
              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {INITIAL_PRODUCTS.map(product => (
                  <div 
                    key={product.id}
                    onClick={() => { setSelectedProduct(product); setCurrentRoute('product'); }}
                    className="bg-white rounded-[16px] border border-[#DED8E8] p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative bg-[#F5F2F6] rounded-xl h-48 mb-4 overflow-hidden flex items-center justify-center">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <h3 className="font-bold text-[#23204A] mb-1">{product.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-[#88849F] mb-3">
                        <Star className="w-3.5 h-3.5 fill-[#FFB648] text-[#FFB648]" />
                        <span className="font-bold text-[#23204A]">{product.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#E8E2ED]">
                      <span className="text-lg font-extrabold text-[#23204A]">{product.price} ₴</span>
                      <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="bg-[#FF4D6D] text-white p-2.5 rounded-full shadow">
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. СТОРІНКА ТОВАРУ ================= */}
        {currentRoute === 'product' && selectedProduct && (
          <div className="space-y-8 bg-white p-6 md:p-10 rounded-[20px] border border-[#DED8E8]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-[#F5F2F6] rounded-2xl h-[400px] flex items-center justify-center overflow-hidden">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-6">
                <h1 className="text-3xl font-extrabold text-[#23204A]">{selectedProduct.name}</h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-[#FFB648]">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-[#23204A] ml-1">{selectedProduct.rating}</span>
                  </div>
                  <span className="text-xs text-[#88849F]">({selectedProduct.reviewsCount} відгуків)</span>
                </div>
                <div className="text-3xl font-extrabold text-[#23204A]">
                  {selectedProduct.price} ₴
                  {selectedProduct.oldPrice && <span className="text-lg font-normal text-[#88849F] line-through ml-3">{selectedProduct.oldPrice} ₴</span>}
                </div>
                <p className="text-sm text-[#67628A] leading-relaxed">{selectedProduct.description}</p>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => addToCart(selectedProduct)} className="flex-1 bg-[#FF4D6D] hover:bg-[#DE2C4F] text-white py-3.5 rounded-full font-bold shadow-lg transition-all">
                    Додати до кошика
                  </button>
                  <button onClick={() => { addToCart(selectedProduct); setCurrentRoute('checkout'); }} className="flex-1 bg-[#23204A] hover:bg-[#35306B] text-white py-3.5 rounded-full font-bold shadow-lg transition-all">
                    Купити зараз
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. КОШИК ================= */}
        {currentRoute === 'cart' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-extrabold text-[#23204A]">Кошик</h1>
            {cart.length === 0 ? (
              <div className="bg-white p-12 rounded-[20px] text-center border border-[#DED8E8] space-y-4">
                <p className="text-lg text-[#67628A]">Ваш кошик зараз порожній</p>
                <button onClick={() => setCurrentRoute('catalog')} className="bg-[#FF4D6D] text-white px-6 py-3 rounded-full font-bold">
                  Перейти до покупок
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-xl border border-[#DED8E8] flex items-center justify-between gap-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg bg-[#F5F2F6]" />
                      <div className="flex-1">
                        <h4 className="font-bold text-[#23204A]">{item.name}</h4>
                        <span className="text-sm text-[#88849F]">{item.price} ₴ x {item.quantity}</span>
                      </div>
                      <span className="font-extrabold text-[#23204A]">{item.price * item.quantity} ₴</span>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-6 rounded-xl border border-[#DED8E8] h-fit space-y-4">
                  <h3 className="font-bold text-lg text-[#23204A]">Підсумок замовлення</h3>
                  <div className="flex justify-between text-sm text-[#67628A]">
                    <span>Товари</span>
                    <span className="font-bold text-[#23204A]">{cartTotal} ₴</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-[#23204A] pt-3 border-t border-[#E8E2ED]">
                    <span>Разом</span>
                    <span className="text-[#FF4D6D]">{cartTotal} ₴</span>
                  </div>
                  <button onClick={() => setCurrentRoute('checkout')} className="w-full bg-[#FF4D6D] hover:bg-[#DE2C4F] text-white py-3.5 rounded-full font-bold shadow-lg">
                    Оформити замовлення
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 5. ОФОРМЛЕННЯ ЗАМОВЛЕННЯ (CHECKOUT) ================= */}
        {currentRoute === 'checkout' && (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-[20px] border border-[#DED8E8] space-y-6">
            <h1 className="text-2xl font-extrabold text-[#23204A]">Оформлення замовлення</h1>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Ім'я та прізвище</label>
                <input type="text" placeholder="Денис ..." className="w-full p-3 border rounded-xl bg-[#F5F2F6] border-[#E8E2ED] focus:outline-none focus:border-[#FF4D6D]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Телефон</label>
                <input type="text" placeholder="+380 XX XXX XX XX" className="w-full p-3 border rounded-xl bg-[#F5F2F6] border-[#E8E2ED] focus:outline-none focus:border-[#FF4D6D]" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Місто та відділення Нової Пошти</label>
                <input type="text" placeholder="м. Львів, відділення №1" className="w-full p-3 border rounded-xl bg-[#F5F2F6] border-[#E8E2ED] focus:outline-none focus:border-[#FF4D6D]" />
              </div>
              <button onClick={() => { setCart([]); setCurrentRoute('order-success'); }} className="w-full bg-[#FF4D6D] hover:bg-[#DE2C4F] text-white py-4 rounded-full font-bold shadow-lg">
                Підтвердити замовлення
              </button>
            </div>
          </div>
        )}

        {/* ================= 6. УСПІШНЕ ЗАМОВЛЕННЯ ================= */}
        {currentRoute === 'order-success' && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-[20px] border border-[#DED8E8] text-center space-y-6">
            <div className="w-16 h-16 bg-[#2FA876]/10 text-[#2FA876] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">✓</div>
            <h1 className="text-2xl font-extrabold text-[#23204A]">Дякуємо за замовлення!</h1>
            <p className="text-sm text-[#88849F]">Ваше замовлення №SV-10482 успішно оформлено. Ми зв'яжемося з вами найближчим часом.</p>
            <button onClick={() => setCurrentRoute('home')} className="w-full bg-[#23204A] text-white py-3.5 rounded-full font-bold">
              На головну
            </button>
          </div>
        )}

        {/* ================= 7. АВТОРИЗАЦІЯ (LOGIN) ================= */}
        {currentRoute === 'login' && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-[20px] border border-[#DED8E8] space-y-6">
            <h1 className="text-2xl font-extrabold text-[#23204A]">Ласкаво просимо!</h1>
            <form onSubmit={(e) => { e.preventDefault(); setUser({ email: 'denis@gmail.com' }); setCurrentRoute('profile'); }} className="space-y-4">
              <input type="email" placeholder="Email або телефон" className="w-full p-3 border rounded-xl bg-[#F5F2F6] border-[#E8E2ED]" required />
              <input type="password" placeholder="Пароль" className="w-full p-3 border rounded-xl bg-[#F5F2F6] border-[#E8E2ED]" required />
              <button type="submit" className="w-full bg-[#FF4D6D] text-white py-3.5 rounded-full font-bold">Увійти</button>
            </form>
            <p className="text-sm text-center text-[#88849F]">Немає акаунта? <span className="text-[#FF4D6D] font-bold cursor-pointer" onClick={() => setCurrentRoute('register')}>Зареєструватися</span></p>
          </div>
        )}

        {/* ================= 8. РЕЄСТРАЦІЯ ================= */}
        {currentRoute === 'register' && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-[20px] border border-[#DED8E8] space-y-6">
            <h1 className="text-2xl font-extrabold text-[#23204A]">Створити акаунт</h1>
            <form onSubmit={(e) => { e.preventDefault(); setUser({ email: 'denis@gmail.com' }); setCurrentRoute('profile'); }} className="space-y-4">
              <input type="text" placeholder="Ім'я" className="w-full p-3 border rounded-xl bg-[#F5F2F6] border-[#E8E2ED]" required />
              <input type="email" placeholder="Email" className="w-full p-3 border rounded-xl bg-[#F5F2F6] border-[#E8E2ED]" required />
              <input type="password" placeholder="Пароль" className="w-full p-3 border rounded-xl bg-[#F5F2F6] border-[#E8E2ED]" required />
              <button type="submit" className="w-full bg-[#FF4D6D] text-white py-3.5 rounded-full font-bold">Створити акаунт</button>
            </form>
          </div>
        )}

        {/* ================= 10. ПРОФІЛЬ КОРИСТУВАЧА ================= */}
        {currentRoute === 'profile' && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-[20px] border border-[#DED8E8] space-y-6 text-center">
            <div className="w-20 h-20 bg-[#FF4D6D]/10 text-[#FF4D6D] rounded-full flex items-center justify-center mx-auto text-2xl font-bold">Д</div>
            <div>
              <h1 className="text-xl font-extrabold text-[#23204A]">Денис</h1>
              <p className="text-sm text-[#88849F]">{user?.email || 'denis@gmail.com'}</p>
            </div>
            <button onClick={() => { setUser(null); setCurrentRoute('home'); }} className="w-full bg-[#E15554] text-white py-3 rounded-full font-bold flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" /> Вийти з акаунта
            </button>
          </div>
        )}

        {/* ================= 12. ОБРАНЕ ================= */}
        {currentRoute === 'favorites' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-[#23204A]">Обране</h1>
            {favorites.length === 0 ? (
              <div className="bg-white p-12 rounded-[20px] text-center border border-[#DED8E8]">
                <p className="text-[#88849F]">Ви ще нічого не зберегли в обране</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {favorites.map(product => (
                  <div key={product.id} className="bg-white p-4 rounded-xl border border-[#DED8E8]">
                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-3" />
                    <h3 className="font-bold">{product.name}</h3>
                    <span className="text-lg font-extrabold">{product.price} ₴</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#DED8E8] mt-16 py-10">
        <div className="max-w-[1360px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <span className="text-xl font-extrabold text-[#23204A]">Світанок</span>
            <p className="text-xs text-[#88849F] mt-1">© 2026 Світанок. Всі права захищені.</p>
          </div>
          <div className="flex gap-6 text-sm text-[#67628A] font-medium">
            <span className="cursor-pointer hover:text-[#FF4D6D]">Доставка</span>
            <span className="cursor-pointer hover:text-[#FF4D6D]">Оплата</span>
            <span className="cursor-pointer hover:text-[#FF4D6D]">Контакти</span>
          </div>
        </div>
      </footer>

      {/* Мобільна нижня навігація (Mobile Bottom Nav) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#DED8E8] py-2 px-6 flex justify-between items-center z-50">
        <button onClick={() => setCurrentRoute('home')} className="flex flex-col items-center text-[#67628A] hover:text-[#FF4D6D]">
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-1">Головна</span>
        </button>
        <button onClick={() => setCurrentRoute('catalog')} className="flex flex-col items-center text-[#67628A] hover:text-[#FF4D6D]">
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-1">Пошук</span>
        </button>
        <button onClick={() => setCurrentRoute('favorites')} className="flex flex-col items-center text-[#67628A] hover:text-[#FF4D6D]">
          <Heart className="w-5 h-5" />
          <span className="text-[10px] mt-1">Обране</span>
        </button>
        <button onClick={() => setCurrentRoute('cart')} className="flex flex-col items-center text-[#67628A] hover:text-[#FF4D6D]">
          <ShoppingCart className="w-5 h-5" />
          <span className="text-[10px] mt-1">Кошик</span>
        </button>
        <button onClick={() => setCurrentRoute(user ? 'profile' : 'login')} className="flex flex-col items-center text-[#67628A] hover:text-[#FF4D6D]">
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1">Профіль</span>
        </button>
      </div>

    </div>
  );
}
