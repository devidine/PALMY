'use client';
import { useState, useEffect } from 'react';
import { useCart } from './CartContext';

const INITIAL_PRODUCTS = [
  { id: 1, name: '[PALMY] 오버핏 후디 2COLOR', price: 39900, image: '/2.jpg', category: 'hoodie', isNew: true },
  { id: 2, name: '[PALMY] 에센셜 로고 맨투맨', price: 39900, originalPrice: 49000, image: '/3.jpg', category: 'shirt' },
  { id: 3, name: '[PALMY] 와이드 핏 데님 팬츠', price: 39900, originalPrice: 49900, image: '/2.png', category: 'pants', discount: '-20%' },
  { id: 4, name: '[PALMY] 시그니처 로고 볼캡', price: 29000, image: '/2.png', category: 'accessories' },
  { id: 5, name: '[PALMY] 베이직 옥스포드 셔츠', price: 45000, image: '/2.png', category: 'shirt' },
  { id: 6, name: '[PALMY] 카고 스트링 팬츠', price: 59000, image: '/2.png', category: 'pants' },
  { id: 7, name: '[PALMY] 헤비웨이트 집업 후디', price: 65000, image: '/2.png', category: 'hoodie' },
  { id: 8, name: '[PALMY] 레더 스퀘어 백', price: 89000, image: '/2.png', category: 'accessories' }
];

export default function Home() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [filter, setFilter] = useState('all');
  const [showIntro, setShowIntro] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const { cart, addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('currentUser');
    if (isLoggedIn) {
      setShowIntro(false);
    } else {
      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [filter, products]);

  // Fetch products from Admin API (Optional, combined with initial)
  useEffect(() => {
    fetch('/api/items')
      .then(res => res.json())
      .then(data => {
        if(data && data.length > 0) {
          const apiProducts = data.map((item, idx) => ({
            id: 100 + idx,
            name: item.name,
            price: item.price,
            image: '/1.png',
            category: 'accessories' // Default
          }));
          setProducts([...INITIAL_PRODUCTS, ...apiProducts]);
        }
      });
  }, []);

  const filteredProducts = filter === 'all' ? products : products.filter(p => p.category === filter);

  return (
    <>
      {/* Intro Animation */}
      <div className={`intro-overlay ${showIntro ? '' : 'opacity-0 scale-105 pointer-events-none'}`}>
        <img src="/1.png" alt="PALMY" className="intro-logo w-40 md:w-56 object-contain" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-lg border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center w-1/3">
              <nav className="hidden md:flex items-center gap-8">
                {['shirt', 'pants', 'hoodie', 'accessories'].map(cat => (
                  <button key={cat} onClick={() => setFilter(cat)} className="nav-link text-sm font-medium text-gray-600 hover:text-black uppercase">
                    {cat}
                  </button>
                ))}
              </nav>
            </div>
            <div className="flex justify-center w-1/3">
              <a href="#" onClick={() => setFilter('all')} className="hover:opacity-70 transition-opacity">
                <img src="/1.png" alt="PALMY" className="h-8 md:h-10 object-contain hover:scale-105 transition-transform" />
              </a>
            </div>
            <div className="flex justify-end items-center gap-4 w-1/3">
              <div className="relative">
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="hidden sm:flex items-center gap-2 group p-2 rounded-full hover:bg-gray-100 focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-palmy-900 text-white flex items-center justify-center group-hover:bg-palmy-red transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-100 rounded-lg shadow-lg py-2 z-50">
                    {typeof window !== 'undefined' && localStorage.getItem('currentUser') ? (
                      <>
                        <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-center font-bold">마이페이지</a>
                        <button onClick={() => { localStorage.removeItem('currentUser'); window.location.reload(); }} className="w-full text-center px-4 py-2 text-sm text-gray-500 hover:bg-gray-50">로그아웃</button>
                      </>
                    ) : (
                      <>
                        <a href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-center">로그인</a>
                        <a href="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-center">회원가입</a>
                      </>
                    )}
                  </div>
                )}
              </div>
              <button onClick={() => setIsCartOpen(true)} className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full relative">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cart.length > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-palmy-red rounded-full text-[10px] text-white flex items-center justify-center font-bold">{cart.reduce((s,i)=>s+i.quantity,0)}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <section className="relative w-full h-[60vh] md:h-[70vh] bg-gray-100 overflow-hidden">
        <img src="/2.jpg" alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-end items-center text-center pb-20 px-4">
          <h1 className="font-serif text-4xl md:text-6xl text-white font-bold mb-4 drop-shadow-lg reveal-on-scroll">The New Standard</h1>
          <p className="text-white/90 max-w-md mx-auto mb-8 font-light reveal-on-scroll" style={{ transitionDelay: '100ms' }}>Discover our latest collection designed for the modern aesthetic.</p>
        </div>
      </section>

      {/* Collection */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen">
        <div className="flex justify-between items-end mb-10 reveal-on-scroll">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">New Arrivals</h2>
            <p className="text-gray-500 text-sm mt-2">Latest essentials for your wardrobe.</p>
          </div>
          <button onClick={() => setFilter('all')} className="text-sm font-medium border-b border-black pb-1 hover:text-gray-600">View All</button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-6 sm:gap-y-16">
          {filteredProducts.map((product, idx) => (
            <div key={product.id} onClick={() => window.location.href = `/item/${product.id}`} className="product-card cursor-pointer group reveal-on-scroll" style={{ transitionDelay: `${(idx % 4) * 100}ms` }}>
              <div className="product-image-container relative aspect-[4/5] bg-white border border-gray-100 shadow-sm sm:p-2">
                <img src={product.image} alt={product.name} className="product-image object-cover w-full h-full rounded-sm" />
                {product.isNew && <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 text-[10px] font-bold text-palmy-900 uppercase">NEW</div>}
                {product.discount && <div className="absolute top-3 left-3 bg-palmy-red px-2 py-1 text-[10px] font-bold text-white">{product.discount}</div>}
                
                <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="cart-btn absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/90 text-white px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 hover:bg-black z-10 w-32 justify-center">
                  Add to Cart
                </button>
              </div>
              <div className="mt-5 flex flex-col gap-1 px-1">
                <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-semibold text-gray-900">{product.price.toLocaleString()}원</span>
                  {product.originalPrice && <span className="text-xs font-medium text-gray-400 line-through">{product.originalPrice.toLocaleString()}원</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

    </>
  );
}
