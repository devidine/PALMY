module.exports=[[10876,a=>{var b=a.i(11857);let c=(0,b.registerClientReference)(function(){throw Error("Attempted to call CartProvider() from the server but CartProvider is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/app/CartContext.js","CartProvider");(0,b.registerClientReference)(function(){throw Error("Attempted to call useCart() from the server but useCart is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/app/CartContext.js","useCart"),a.s(["CartProvider",0,c])},42408,a=>{var b=a.i(10876);a.n(b)},62925,a=>{var b=a.i(7997),c=a.i(42408);a.s(["default",0,function({children:a}){return(0,b.jsxs)("html",{lang:"en",children:[(0,b.jsxs)("head",{children:[(0,b.jsx)("script",{src:"https://cdn.tailwindcss.com"}),(0,b.jsx)("script",{dangerouslySetInnerHTML:{__html:`
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
          `}}),(0,b.jsx)("link",{href:"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap",rel:"stylesheet"}),(0,b.jsx)("style",{children:`
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
        `})]}),(0,b.jsx)("body",{className:"bg-palmy-50 text-palmy-900 font-sans selection:bg-palmy-900 selection:text-white",children:(0,b.jsx)(c.CartProvider,{children:a})})]})},"metadata",0,{title:"PALMY | Premium Collection",description:"Discover the latest premium fashion collection at PALMY."}])}],19325,function(a){a.n(a.i(62925))}];

//# sourceMappingURL=app_0ol72iglkkcv_._.js.map