'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      alert('로그인 성공!');
      localStorage.setItem('currentUser', username);
      window.location.href = '/';
    } else {
      alert('로그인 실패: ' + data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Go to Main Button */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-black transition-transform hover:-translate-x-1 z-10 font-medium bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        메인으로
      </Link>

      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg border border-gray-100 z-10 animate-[fadeInUp_0.8s_ease_forwards]">
        <div>
          <h2 className="mt-6 text-center text-3xl font-serif font-bold text-gray-900">Sign in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm flex flex-col gap-4">
            <div className="animate-[slideInRight_0.5s_ease_0.1s_forwards] opacity-0" style={{ animationFillMode: 'forwards' }}>
              <input
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent sm:text-sm transition-all hover:shadow-md"
                placeholder="아이디"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="animate-[slideInRight_0.5s_ease_0.2s_forwards] opacity-0" style={{ animationFillMode: 'forwards' }}>
              <input
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent sm:text-sm transition-all hover:shadow-md"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="animate-[fadeInUp_0.5s_ease_0.3s_forwards] opacity-0" style={{ animationFillMode: 'forwards' }}>
            <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all hover:shadow-lg hover:-translate-y-1 active:translate-y-0">
              Sign in
            </button>
          </div>
          <div className="text-center mt-4 animate-[fadeInUp_0.5s_ease_0.4s_forwards] opacity-0" style={{ animationFillMode: 'forwards' }}>
            <a href="/register" className="text-sm font-medium text-gray-600 hover:text-black">아직 계정이 없으신가요? 회원가입</a>
          </div>
        </form>
      </div>
    </div>
  );
}
