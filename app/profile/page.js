'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Profile() {
  const [profile, setProfile] = useState({
    username: '',
    nickname: '',
    address: '',
    birthday: '',
    createdAt: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Mock data for purchases & shipping
  const purchases = [
    { id: 1, name: "[PALMY] 시그니처 로고 후드 (Black)", date: "2026-10-01" },
    { id: 2, name: "[PALMY] 오버핏 옥스포드 셔츠 (White)", date: "2026-10-05" }
  ];
  
  const shipping = [
    { id: 2, name: "[PALMY] 오버핏 옥스포드 셔츠 (White)", status: "배송중 (CJ대한통운 123456)" }
  ];

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }

    fetch(`/api/profile?username=${currentUser}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProfile({
            username: data.data.username || '',
            nickname: data.data.nickname || '',
            address: data.data.address || '',
            birthday: data.data.birthday || '',
            createdAt: new Date(data.data.createdAt).toLocaleDateString('ko-KR')
          });
        }
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: profile.username,
        nickname: profile.nickname,
        address: profile.address,
        birthday: profile.birthday
      })
    });
    const data = await res.json();
    if (data.success) {
      alert('프로필이 성공적으로 저장되었습니다!');
    } else {
      alert('저장 실패: ' + data.message);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">로딩중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-black transition-transform hover:-translate-x-1 z-10 font-medium bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        메인으로
      </Link>

      <div className="max-w-4xl mx-auto space-y-8 animate-[fadeInUp_0.5s_ease_forwards]">
        
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">마이페이지</h1>
            <p className="text-gray-500 mt-2">환영합니다, <span className="font-semibold text-black">{profile.nickname || profile.username}</span>님!</p>
          </div>
          <div className="text-right text-sm text-gray-500">
            <p>가입일</p>
            <p className="font-medium text-black">{profile.createdAt}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Settings Form */}
          <div className="md:col-span-1 space-y-6">
            <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
              <h2 className="text-lg font-bold text-gray-900 border-b pb-2">회원 정보 수정</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
                <input type="text" disabled value={profile.username} className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">닉네임</label>
                <input type="text" name="nickname" value={profile.nickname} onChange={handleChange} placeholder="닉네임을 입력하세요" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">생일</label>
                <input type="date" name="birthday" value={profile.birthday} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">배송지 주소</label>
                <textarea name="address" value={profile.address} onChange={handleChange} rows="3" placeholder="주소를 입력하세요" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"></textarea>
              </div>

              <button type="submit" disabled={saving} className="w-full bg-black text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors">
                {saving ? '저장 중...' : '정보 저장하기'}
              </button>
            </form>
          </div>

          {/* Orders & Shipping */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">배송중인 상품 🚚</h2>
              {shipping.length > 0 ? (
                <ul className="space-y-4">
                  {shipping.map(item => (
                    <li key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <span className="font-medium text-gray-800">{item.name}</span>
                      <span className="text-sm text-palmy-red font-bold bg-red-50 px-3 py-1 rounded-full">{item.status}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm py-4">배송중인 상품이 없습니다.</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">최근 구매 상품 🛍️</h2>
              {purchases.length > 0 ? (
                <ul className="space-y-4">
                  {purchases.map(item => (
                    <li key={item.id} className="flex justify-between items-center border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-400 mt-1">구매일: {item.date}</p>
                      </div>
                      <button className="text-xs border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 transition-colors">리뷰 작성</button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm py-4">구매 내역이 없습니다.</p>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
