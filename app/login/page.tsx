'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/utils/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        router.replace('/');
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
        } else {
          setMessage('เข้าสู่ระบบสำเร็จแล้ว กำลังไปยังหน้าแรก...');
          router.push('/');
        }
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) {
          setError(signUpError.message);
        } else {
          setMessage('สมัครสมาชิกสำเร็จแล้ว กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ');
        }
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden" style={{fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif'}}>
      {/* Subtle background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Minimal geometric accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gray-50/80 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gray-100/50 rounded-full blur-3xl"></div>
        
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.05) 75%, rgba(0,0,0,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0,0,0,.05) 25%, rgba(0,0,0,.05) 26%, transparent 27%, transparent 74%, rgba(0,0,0,.05) 75%, rgba(0,0,0,.05) 76%, transparent 77%, transparent)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        
        {/* Header */}
        <div className="mb-16 text-center">
          {/* Logo */}
          <div className="inline-block mb-8">
            <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-sm">
              <span className="text-lg text-white font-light">S</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-light text-black mb-2 tracking-tight">
            {mode === 'signin' ? 'Welcome' : 'Create Account'}
          </h1>
          <p className="text-sm text-gray-500 font-light tracking-wide">
            {mode === 'signin' 
              ? 'Access your Smart Tile dashboard'
              : 'Join Smart Tile Platform'}
          </p>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          
          {/* Mode tabs */}
          <div className="mb-8 flex gap-2 bg-gray-50 rounded-lg p-1">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError(null);
                setMessage(null);
              }}
              className={`flex-1 py-2.5 px-4 text-sm font-light rounded-md transition-all duration-300 tracking-wide ${
                mode === 'signin' 
                  ? 'bg-black text-white shadow-sm' 
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
                setMessage(null);
              }}
              className={`flex-1 py-2.5 px-4 text-sm font-light rounded-md transition-all duration-300 tracking-wide ${
                mode === 'signup' 
                  ? 'bg-black text-white shadow-sm' 
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email input */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-700 mb-3 font-light">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 outline-none transition-all duration-300 focus:border-black focus:bg-white hover:border-gray-300 font-light"
                placeholder="you@example.com"
              />
            </div>

            {/* Password input */}
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-700 mb-3 font-light">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-black placeholder-gray-400 outline-none transition-all duration-300 focus:border-black focus:bg-white hover:border-gray-300 font-light"
                placeholder="••••••••••"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 px-4 bg-black text-white font-light text-sm uppercase tracking-wide rounded-lg shadow-sm transition-all duration-300 hover:shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-sm"
            >
              {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 font-light">or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Footer toggle */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
                setMessage(null);
              }}
              className="text-xs text-gray-600 hover:text-black transition-colors font-light tracking-wide"
            >
              {mode === 'signin' 
                ? 'Don\'t have an account? Sign Up' 
                : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>

        {/* Info box */}
        <div className="px-0 py-4 text-center border-t border-gray-200">
          <p className="text-xs text-gray-500 leading-relaxed font-light">
            Secure login powered by industry-standard encryption
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg animate-fadeIn">
            <p className="text-sm text-gray-800 font-light">{message}</p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-fadeIn">
            <p className="text-sm text-red-700 font-light">{error}</p>
          </div>
        )}

        {/* Bottom link */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-xs text-gray-500 hover:text-black transition-colors font-light tracking-wide">
            Back to Home
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
}
