'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captchaText, setCaptchaText] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const canvasRef = useRef(null);

  const generateRandomText = () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const drawCaptcha = () => {
    const code = generateRandomText();
    setCaptchaText(code);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background noise
    ctx.strokeStyle = '#888';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Text style
    ctx.font = 'bold 24px monospace';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < code.length; i++) {
      ctx.fillStyle = `rgb(${Math.floor(Math.random()*150)}, ${Math.floor(Math.random()*150)}, ${Math.floor(Math.random()*150)})`;
      const x = 15 + i * 20;
      const y = canvas.height / 2 + (Math.random() * 10 - 5);
      ctx.fillText(code[i], x, y);
    }
  };

  useEffect(() => {
    drawCaptcha();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return alert('비밀번호가 일치하지 않습니다.');
    }
    if (captchaInput !== captchaText) {
      alert('보안코드가 일치하지 않습니다. 다시 시도하세요.');
      drawCaptcha();
      setCaptchaInput('');
      return;
    }

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      alert('회원가입이 완료되었습니다!');
      window.location.href = '/login';
    } else {
      alert('회원가입 실패: ' + data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Go to Main Button */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-black transition-transform hover:-translate-x-1 z-10 font-medium bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm shadow-sm">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        메인으로
      </Link>

      <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-white/50 z-10 transform transition-all duration-700 opacity-0 translate-y-10 animate-[fadeInUp_0.8s_ease_forwards]">
        <div>
          <h2 className="mt-2 text-center text-3xl font-serif font-bold text-gray-900 drop-shadow-sm">Create Account</h2>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleRegister}>
          <div className="rounded-md flex flex-col gap-4">
            <div className="transform transition-all duration-500 delay-100 opacity-0 translate-x-5 animate-[slideInRight_0.5s_ease_0.1s_forwards]">
              <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
              <input
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent sm:text-sm transition-all hover:shadow-md bg-white/50 focus:bg-white"
                placeholder="아이디를 입력하세요"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="transform transition-all duration-500 delay-200 opacity-0 translate-x-5 animate-[slideInRight_0.5s_ease_0.2s_forwards]">
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <input
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent sm:text-sm transition-all hover:shadow-md bg-white/50 focus:bg-white"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="transform transition-all duration-500 delay-300 opacity-0 translate-x-5 animate-[slideInRight_0.5s_ease_0.3s_forwards]">
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
              <input
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent sm:text-sm transition-all hover:shadow-md bg-white/50 focus:bg-white"
                placeholder="비밀번호 다시 입력"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <div className="border border-gray-100 p-4 rounded-xl bg-gray-50/50 shadow-inner transform transition-all duration-500 delay-400 opacity-0 translate-y-5 animate-[fadeInUp_0.5s_ease_0.4s_forwards]">
              <label className="block text-sm font-medium text-gray-700 mb-2">자동가입방지 (보안코드)</label>
              <div className="flex items-center gap-4 mb-3">
                <canvas ref={canvasRef} width="150" height="50" className="border border-gray-300 bg-gray-100 rounded-md shadow-sm"></canvas>
                <button 
                  type="button" 
                  onClick={() => drawCaptcha()}
                  className="text-sm px-3 py-1.5 rounded-md bg-white border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50 transition-colors shadow-sm active:scale-95"
                >
                  새로고침
                </button>
              </div>
              <input
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent sm:text-sm transition-all hover:shadow-md bg-white/50 focus:bg-white"
                placeholder="위 문자를 입력하세요"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
              />
            </div>

          </div>
          <div className="transform transition-all duration-500 delay-500 opacity-0 animate-[fadeInUp_0.5s_ease_0.5s_forwards]">
            <button type="submit" className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all hover:shadow-lg hover:-translate-y-1 active:translate-y-0 active:shadow-md">
              회원가입 완료
            </button>
          </div>
          <div className="text-center mt-4 transform transition-all duration-500 delay-500 opacity-0 animate-[fadeInUp_0.5s_ease_0.5s_forwards]">
            <a href="/login" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">이미 계정이 있으신가요? 로그인</a>
          </div>
        </form>
      </div>
    </div>
  );
}
