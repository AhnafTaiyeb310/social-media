'use client'
import React from 'react';
import Link from 'next/link';
import { SleekCard } from '../ui/SleekElements';
import { useAuthStore } from '@/store/useAuthStore';

const NavItem = ({ href, icon, label, count, active }) => (
  <Link href={href} className={`group flex items-center justify-between p-3 rounded-xl transition-all font-semibold ${active ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
    <div className="flex items-center gap-3">
      <span className={`text-xl ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{icon}</span>
      <span className="text-sm tracking-tight">{label}</span>
    </div>
    {count && <span className="bg-primary text-white px-2 py-0.5 text-[10px] font-black rounded-full shadow-sm">{count}</span>}
  </Link>
);

export default function SidebarLeft() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <SleekCard className="p-0 overflow-hidden border-none shadow-none bg-transparent">
        {user && (
          <div className="p-5 mb-4 bg-white rounded-2xl border border-gray-100 shadow-sleek-md">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary/20">
                {user.username?.[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-gray-900 truncate leading-tight">{user.username}</h2>
                <p className="text-sm text-gray-400 font-medium truncate">@{user.username}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-50">
               <div className="text-center"><p className="font-bold text-gray-900">42</p><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Posts</p></div>
               <div className="text-center border-x border-gray-50"><p className="font-bold text-gray-900">1.2k</p><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fans</p></div>
               <div className="text-center"><p className="font-bold text-gray-900">842</p><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Following</p></div>
            </div>
          </div>
        )}
        <nav className="flex flex-col space-y-1">
          <NavItem href="/" icon="🏠" label="Feed" active />
          <NavItem href="/explore" icon="🌍" label="Explore" />
          <NavItem href="/notifications" icon="🔔" label="Activity" count="3" />
          <NavItem href="/messages" icon="✉️" label="Messages" />
          <NavItem href="/bookmarks" icon="🔖" label="Saved" />
          <NavItem href="/profile" icon="👤" label="Settings" />
        </nav>
      </SleekCard>

      <div className="px-5 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
        <Link href="/about" className="hover:text-primary transition-colors">About</Link>
        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
        <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
        <span>© 2026 Sync</span>
      </div>
    </div>
  );
}
