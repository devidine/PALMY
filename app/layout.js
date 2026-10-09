export const metadata = {
  title: 'PALMY | Premium Collection',
  description: 'Discover the latest premium fashion collection at PALMY.',
};

import { CartProvider } from './CartContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  fontFamily: {
                    sans: ['Inter', 'sans-serif'],
                    serif: ['Playfair Display', 'serif'],
                  },
                  colors: {
                    palmy: {
                      50: '#f9f9f9',
                      100: '#f2f2f2',
                      900: '#111111',
                      red: '#ff3333',
                    }
                  }
                }
              }
            }
          `
        }} />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />
        <style>{`
          :root { --bg-color: #fcfcfc; --text-primary: #111111; }
          body { background-color: var(--bg-color); color: var(--text-primary); overflow-x: hidden; }
          .intro-overlay { position: fixed; inset: 0; background-color: #ffffff; z-index: 9999; display: flex; align-items: center; justify-content: center; transition: opacity 0.8s cubic-bezier(0.8, 0, 0.2, 1), transform 0.8s cubic-bezier(0.8, 0, 0.2, 1); }
          .intro-logo { animation: introDrawScale 2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
          @keyframes introDrawScale { 0% { opacity: 0; transform: scale(0.95) translateY(10px); filter: blur(4px); } 100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); } }
          @keyframes fadeInUp { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
          @keyframes slideInRight { 0% { opacity: 0; transform: translateX(20px); } 100% { opacity: 1; transform: translateX(0); } }
          .reveal-on-scroll { opacity: 0; transform: translateY(30px); transition: all 0.8s ease; }
          .reveal-on-scroll.visible { opacity: 1; transform: translateY(0); }
          .product-card:hover { transform: translateY(-6px); }
          .product-image-container { overflow: hidden; border-radius: 0.5rem; }
          .product-image { transition: transform 0.8s ease; }
          .product-card:hover .product-image { transform: scale(1.08); }
          .cart-btn { opacity: 0; transform: translateY(10px); transition: all 0.3s ease; }
          .product-card:hover .cart-btn { opacity: 1; transform: translateY(0); }
          .nav-link::after { content: ''; position: absolute; width: 0; height: 1px; bottom: -4px; left: 0; background-color: currentColor; transition: width 0.3s ease; }
          .nav-link:hover::after { width: 100%; }
        `}</style>
      </head>
      <body className="bg-palmy-50 text-palmy-900 font-sans selection:bg-palmy-900 selection:text-white">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
