'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user === 'admin') {
      setIsAdmin(true);
    } else {
      alert('관리자 권한이 없습니다.');
      window.location.href = '/';
    }
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price: Number(price), description }),
    });
    const data = await res.json();
    if (data.success) {
      alert('아이템이 추가되었습니다.');
      setName('');
      setPrice('');
      setDescription('');
    } else {
      alert('오류 발생: ' + data.message);
    }
  };

  if (!isAdmin) return null; // Wait for check

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-black transition-transform hover:-translate-x-1 z-10 font-medium bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        메인으로
      </Link>

      <div className="max-w-xl w-full bg-white p-10 rounded-xl shadow-lg border border-gray-100 animate-[fadeInUp_0.5s_ease_forwards]">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2 text-center">Admin Dashboard</h1>
        <p className="text-gray-500 text-center mb-8">Add new items to the store.</p>
        
        <form onSubmit={handleAddItem} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
            <input
              type="text"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
              placeholder="e.g. [PALMY] 시그니처 셔츠"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (원)</label>
            <input
              type="number"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
              placeholder="e.g. 45000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows="3"
              className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
              placeholder="Product description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors">
            Add Item
          </button>
        </form>
      </div>
    </div>
  );
}
