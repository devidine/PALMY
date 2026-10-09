'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useCart } from '../../CartContext';

export default function ItemDetail({ params }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const [product, setProduct] = useState(null);
  
  // Admin Editing State
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', price: 0, description: '' });

  // UI State
  const [activeTab, setActiveTab] = useState('detail');
  const [quantity, setQuantity] = useState(1);
  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user === 'admin') {
      setIsAdmin(true);
    }

    fetch('/api/items')
      .then(res => res.json())
      .then(data => {
        let found = data.find(p => p.id.toString() === id);
        
        if (!found) {
          const MOCK = [
            { id: 1, name: "[PALMY] 시그니처 로고 후드 (Black)", price: 69000, category: 'hoodie', image: '/1.png', description: '프리미엄 코튼 소재로 제작된 에센셜 후드. 탄탄한 핏과 편안한 착용감을 선사합니다.' },
            { id: 2, name: "[PALMY] 에센셜 와이드 팬츠 (Charcoal)", price: 54000, category: 'pants', image: '/1.png', description: '트렌디한 와이드 핏 실루엣으로 어디에나 매치하기 좋은 데일리 팬츠.' },
            { id: 3, name: "[PALMY] 오버핏 옥스포드 셔츠 (White)", price: 49000, category: 'shirt', image: '/1.png', description: '사계절 내내 활용 가능한 오버사이즈 옥스포드 셔츠입니다.' },
            { id: 4, name: "[PALMY] 로고 볼캡 (Navy)", price: 32000, category: 'accessories', image: '/1.png', description: '어떤 룩에도 자연스럽게 어울리는 빈티지 무드의 볼캡.' }
          ];
          found = MOCK.find(p => p.id.toString() === id);
        }

        if (found) {
          if (!found.image) found.image = '/1.png';
          setProduct(found);
          setEditForm({ name: found.name, price: found.price, description: found.description || '' });
        }
      });
  }, [id]);

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full"></div></div>;
  }

  const handleAdminSave = async () => {
    try {
      const res = await fetch(`/api/items/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        setProduct({ ...product, ...editForm });
        setIsEditing(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              뒤로가기
            </Link>
            <Link href="/" className="hover:opacity-70 transition-opacity">
              <img src="/1.png" alt="PALMY" className="h-8 object-contain" />
            </Link>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* Left: Product Image */}
          <div className="w-full lg:w-3/5">
            <div className="aspect-[4/5] bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden sticky top-24">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
            </div>
          </div>

          {/* Right: Product Info & Cart Panel */}
          <div className="w-full lg:w-2/5 flex flex-col sticky top-24">
            
            {isAdmin && (
              <div className="mb-4 flex items-center justify-between bg-black text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
                <span>관리자 상품 관리</span>
                <button onClick={() => setIsEditing(!isEditing)} className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200 transition-colors">
                  {isEditing ? '취소' : '수정하기'}
                </button>
              </div>
            )}

            <div className="uppercase text-xs font-bold tracking-widest text-gray-400 mb-3">{product.category || 'CATEGORY'}</div>
            
            {isEditing ? (
              <div className="space-y-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full text-2xl font-serif font-bold p-2 border border-gray-300 rounded" />
                <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} className="w-full text-xl font-semibold p-2 border border-gray-300 rounded" />
                <textarea value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} rows="4" className="w-full p-2 border border-gray-300 rounded text-sm text-gray-600" />
                <button onClick={handleAdminSave} className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700">변경사항 저장</button>
              </div>
            ) : (
              <>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
                <p className="text-2xl font-semibold text-gray-900 mb-6">{product.price.toLocaleString()}원</p>
                <div className="prose prose-sm text-gray-600 mb-8 leading-relaxed">
                  <p>{product.description || '프리미엄 소재로 제작된 PALMY의 시그니처 아이템입니다. 일상에서 편안하게 착용할 수 있는 미니멀한 디자인을 제안합니다.'}</p>
                </div>
              </>
            )}
            
            {/* Options */}
            <div className="border-t border-gray-100 pt-6 mb-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <div className="flex gap-3">
                  {['S', 'M', 'L', 'XL'].map(size => (
                    <button key={size} className="w-12 h-12 border border-gray-200 rounded-md flex items-center justify-center text-sm font-medium hover:border-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all">
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-100 mt-6">
                <span className="text-sm font-medium text-gray-700">수량</span>
                <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-md px-2">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-gray-500 hover:text-black">-</button>
                  <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-gray-500 hover:text-black">+</button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-500 font-medium">총 상품 금액</span>
              <span className="text-2xl font-bold text-gray-900">{(product.price * quantity).toLocaleString()}원</span>
            </div>

            <div className="flex gap-4">
              <button onClick={handleAddToCart} className="w-full bg-black text-white py-4 rounded-full font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:-translate-y-1 active:translate-y-0">
                장바구니 담기
              </button>
            </div>

          </div>
        </div>

        {/* Detailed Info Tabs (Review, QNA, Details) */}
        <div className="mt-24 border-t border-gray-100">
          <div className="flex justify-center border-b border-gray-200 sticky top-16 bg-white/95 backdrop-blur-md z-30">
            {['detail', 'review', 'qna'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black'}`}
              >
                {tab === 'detail' && '상세정보'}
                {tab === 'review' && '리뷰 (12)'}
                {tab === 'qna' && 'Q&A (3)'}
              </button>
            ))}
          </div>

          <div className="py-16 max-w-4xl mx-auto">
            {/* Detail Tab */}
            {activeTab === 'detail' && (
              <div className="space-y-12 animate-[fadeInUp_0.5s_ease_forwards] opacity-0 text-center">
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8">Product Details</h3>
                <img src="/1.png" alt="Detail 1" className="w-full max-w-2xl mx-auto rounded-xl shadow-sm" />
                <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  PALMY의 이번 시즌은 본질에 충실한 미니멀리즘을 추구합니다.<br/>
                  섬세한 디테일과 프리미엄 원단의 조화를 직접 경험해보세요.
                </p>
                <div className="bg-gray-50 p-8 rounded-xl text-left text-sm text-gray-600 max-w-2xl mx-auto">
                  <p className="font-bold text-gray-900 mb-2">세탁 및 취급 주의사항</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>단독 손세탁을 권장합니다.</li>
                    <li>건조기 사용 시 수축이 발생할 수 있습니다.</li>
                    <li>표백제를 사용하지 마십시오.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Review Tab */}
            {activeTab === 'review' && (
              <div className="space-y-8 animate-[fadeInUp_0.5s_ease_forwards] opacity-0">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-serif font-bold text-gray-900">Customer Reviews</h3>
                  <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">리뷰 작성하기</button>
                </div>
                
                <div className="flex items-center gap-6 p-8 bg-gray-50 rounded-2xl mb-8">
                  <div className="text-center">
                    <p className="text-5xl font-bold text-gray-900">4.8</p>
                    <div className="flex text-yellow-400 text-lg mt-2 justify-center">★★★★★</div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center text-sm"><span className="w-12 text-gray-500">5점</span><div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden ml-2"><div className="bg-black w-[85%] h-full"></div></div><span className="w-8 text-right text-gray-500 ml-2">85%</span></div>
                    <div className="flex items-center text-sm"><span className="w-12 text-gray-500">4점</span><div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden ml-2"><div className="bg-black w-[10%] h-full"></div></div><span className="w-8 text-right text-gray-500 ml-2">10%</span></div>
                    <div className="flex items-center text-sm"><span className="w-12 text-gray-500">3점</span><div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden ml-2"><div className="bg-black w-[5%] h-full"></div></div><span className="w-8 text-right text-gray-500 ml-2">5%</span></div>
                  </div>
                </div>

                <div className="space-y-6">
                  {[
                    { id: 1, author: '김*민', date: '2026.10.05', text: '핏이 정말 예뻐요! 생각했던 것보다 재질도 너무 좋아서 만족합니다.', rating: '★★★★★' },
                    { id: 2, author: '이*훈', date: '2026.09.28', text: '배송이 빨라서 좋았어요. 사이즈는 정사이즈 느낌이네요.', rating: '★★★★☆' },
                    { id: 3, author: '박*서', date: '2026.09.15', text: '데일리로 입기 최고입니다. 다른 색상도 구매하고 싶어요!', rating: '★★★★★' }
                  ].map(review => (
                    <div key={review.id} className="border-b border-gray-100 pb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-400 text-sm tracking-widest">{review.rating}</span>
                          <span className="font-bold text-gray-900 ml-2">{review.author}</span>
                        </div>
                        <span className="text-xs text-gray-400">{review.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* QnA Tab */}
            {activeTab === 'qna' && (
              <div className="space-y-8 animate-[fadeInUp_0.5s_ease_forwards] opacity-0">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-serif font-bold text-gray-900">Q & A</h3>
                  <button className="border border-black text-black px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">문의하기</button>
                </div>
                
                <div className="border-t border-gray-900">
                  {[
                    { id: 1, status: '답변완료', q: '재입고 언제 되나요?', a: '안녕하세요 고객님, 해당 상품은 10월 말 재입고 예정입니다. 감사합니다.', author: '최*영', date: '2026.10.08' },
                    { id: 2, status: '답변완료', q: '사이즈 추천 부탁드려요. 키 175cm 입니다.', a: '오버핏을 원하시면 L 사이즈를, 정핏을 원하시면 M 사이즈를 추천드립니다.', author: '정*수', date: '2026.10.02' },
                    { id: 3, status: '답변대기', q: '배송지 변경 가능한가요?', a: null, author: '강*혁', date: '2026.10.09' }
                  ].map(qna => (
                    <div key={qna.id} className="border-b border-gray-200 py-6">
                      <div className="flex items-center gap-4 mb-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${qna.status === '답변완료' ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>{qna.status}</span>
                        <h4 className="font-medium text-gray-900 flex-1">{qna.q}</h4>
                        <span className="text-xs text-gray-400 w-16">{qna.author}</span>
                        <span className="text-xs text-gray-400 w-20 text-right">{qna.date}</span>
                      </div>
                      {qna.a && (
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg text-sm text-gray-600 flex gap-3">
                          <span className="font-bold text-black">A.</span>
                          <p>{qna.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
