'use client'
import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/useAuthStore';
import { SleekButton } from '../ui/SleekElements';

export default function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50 px-4">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">S</div>
          <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:block">Sync</span>
        </Link>

        <div className="flex-1 max-w-lg mx-8 hidden md:block">
          <div className="relative group">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors text-sm">🔍</span>
             <input 
               type="text" 
               placeholder="Search Sync..." 
               className="w-full bg-gray-100 border-none rounded-full pl-10 pr-4 py-2 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none"
             />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <SleekButton 
                variant="primary" 
                className="hidden sm:inline-flex !py-2 !px-5 !text-xs !rounded-full shadow-sm"
              >
                Create Post
              </SleekButton>
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors border border-gray-200/50">
                <span className="text-xl">👤</span>
              </div>
              <button 
                onClick={logout}
                className="text-xs font-bold text-gray-400 hover:text-danger transition-colors uppercase tracking-wider ml-2"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-gray-900 px-2">Sign in</Link>
              <Link href="/signup" className="sleek-btn sleek-btn-primary !py-2 !px-6 !text-xs !rounded-full">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
