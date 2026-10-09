'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadTossPayments } from '@tosspayments/payment-sdk';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState('');

  // Load from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('palmy_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {}
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('palmy_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { ...product, quantity }];
    });
    showToast('장바구니에 상품이 담겼습니다.');
    setIsCartOpen(true); // Automatically open cart like real e-commerce
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showToast('장바구니가 비어있습니다.');
      return;
    }
    try {
      const tossPayments = await loadTossPayments("test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq");
      const orderId = "ORDER_" + new Date().getTime();
      const orderName = cart.length === 1 ? cart[0].name : `${cart[0].name} 외 ${cart.length - 1}건`;

      const currentUser = typeof window !== 'undefined' ? localStorage.getItem('currentUser') : null;
      await tossPayments.requestPayment('카드', {
        amount: cartTotal,
        orderId: orderId,
        orderName: orderName,
        customerName: currentUser || '비회원',
        successUrl: window.location.origin + '/?success=true',
        failUrl: window.location.origin + '/?fail=true',
      });
    } catch (error) {
      console.error(error);
      showToast('결제 모듈을 불러오지 못했습니다.');
    }
  };

  // Payment Success Handler
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('success')) {
        setCart([]);
        localStorage.removeItem('palmy_cart');
        showToast('결제가 성공적으로 완료되었습니다.');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, cartTotal, isCartOpen, setIsCartOpen }}>
      {children}

      {/* Global Toast */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-2xl z-[100] animate-[fadeInUp_0.3s_ease_forwards] text-sm font-medium">
          {toast}
        </div>
      )}

      {/* Global Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]" onClick={() => setIsCartOpen(false)}>
          <div className="absolute top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[100] shadow-2xl flex flex-col transform transition-transform duration-500 translate-x-0" onClick={e => e.stopPropagation()}>
            <div className="p-6 flex justify-between items-center border-b border-gray-100">
              <span className="font-serif text-xl font-bold">Shopping Bag</span>
              <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-500 hover:text-black transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  <p>장바구니가 비어있습니다.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 group">
                    <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-md border border-gray-100" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">{item.name}</h4>
                        <p className="text-sm font-semibold mt-1">{item.price.toLocaleString()}원</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 border border-gray-200 rounded-md px-2 py-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-500 hover:text-black">-</button>
                          <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-500 hover:text-black">+</button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-xs text-gray-400 hover:text-red-500 underline underline-offset-2">Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-medium text-gray-600">Total</span>
                  <span className="text-xl font-bold text-gray-900">{cartTotal.toLocaleString()}원</span>
                </div>
                <button onClick={handleCheckout} className="w-full bg-black text-white py-4 rounded-full font-bold hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
                  결제하기 (Checkout)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
