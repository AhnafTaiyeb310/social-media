'use client';
import { useState } from 'react';
import {
  LuSettings,
  LuShare2,
  LuMapPin,
  LuCalendar,
  LuLink,
  LuGithub,
  LuTwitter,
  LuPlus,
  LuLayoutGrid,
  LuMessageSquare,
  LuHeart,
} from 'react-icons/lu';
import PostCard from './PostCard'; // Reusing your existing component

import { DEFAULT_AVATAR } from '@/lib/constants';

export default function Profile({ user, posts }) {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* 1. HERO SECTION (Cover + Avatar) */}
      <div className="relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm">
        {/* Cover Image */}
        <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
          <img
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200"
            className="w-full h-full object-cover opacity-30"
            alt="Cover"
          />
        </div>

        {/* Profile Info Area */}
        <div className="px-6 pb-6">
          <div className="relative flex justify-between items-end -mt-12 sm:-mt-16 mb-4">
            {/* Avatar with Border */}
            <div className="relative inline-block">
              <img
                className="size-24 sm:size-32 rounded-3xl border-4 border-white dark:border-neutral-900 object-cover shadow-lg"
                src={user?.avatar || DEFAULT_AVATAR}
                alt="Profile"
              />
              <span className="absolute bottom-2 right-2 size-5 bg-green-500 border-2 border-white dark:border-neutral-900 rounded-full"></span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-x-2">
              <button className="p-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 transition">
                <LuShare2 className="size-5 text-gray-600 dark:text-neutral-400" />
              </button>
              <button className="py-2.5 px-5 inline-flex items-center gap-x-2 text-sm font-semibold rounded-xl border border-transparent bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition">
                <LuPlus className="size-4" /> Follow
              </button>
              <button className="p-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 transition">
                <LuSettings className="size-5 text-gray-600 dark:text-neutral-400" />
              </button>
            </div>
          </div>

          {/* User Bio Details */}
          <div className="space-y-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-100">
                {user?.name || 'Ahnaf'}
              </h1>
              <p className="text-gray-500 dark:text-neutral-400 font-medium">
                @{user?.username || 'ahnaf_dev'}
              </p>
            </div>

            <p className="text-sm text-gray-700 dark:text-neutral-300 max-w-2xl leading-relaxed">
              Fullstack Software Engineer building **Aura**. Passionate about
              Next.js, Django, and minimalist UI design. Always learning, always
              building. 🚀
            </p>

            <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs font-medium text-gray-500 dark:text-neutral-500">
              <span className="flex items-center gap-x-1.5">
                <LuMapPin className="size-4" /> Dhaka, Bangladesh
              </span>
              <span className="flex items-center gap-x-1.5">
                <LuLink className="size-4" />{' '}
                <a href="#" className="text-blue-500 hover:underline">
                  ahnaf.dev
                </a>
              </span>
              <span className="flex items-center gap-x-1.5">
                <LuCalendar className="size-4" /> Joined March 2026
              </span>
            </div>

            {/* Social Stats */}
            <div className="flex gap-x-5 pt-2">
              <div className="flex items-center gap-x-1">
                <span className="font-bold text-gray-800 dark:text-neutral-200">
                  1.2k
                </span>
                <span className="text-sm text-gray-500">Followers</span>
              </div>
              <div className="flex items-center gap-x-1">
                <span className="font-bold text-gray-800 dark:text-neutral-200">
                  458
                </span>
                <span className="text-sm text-gray-500">Following</span>
              </div>
              <div className="flex items-center gap-x-1">
                <span className="font-bold text-gray-800 dark:text-neutral-200">
                  15.4k
                </span>
                <span className="text-sm text-gray-500">Reputation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TABS NAVIGATION (Daily.dev Style) */}
      <nav className="flex gap-x-1 p-1 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl shadow-sm">
        {[
          { id: 'posts', label: 'Posts', icon: LuLayoutGrid },
          { id: 'comments', label: 'Comments', icon: LuMessageSquare },
          { id: 'upvoted', label: 'Upvoted', icon: LuHeart },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-x-2 py-3 text-sm font-semibold rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-gray-100 text-blue-600 dark:bg-neutral-800 dark:text-blue-500'
                : 'text-gray-500 hover:bg-gray-50 dark:text-neutral-400 dark:hover:bg-neutral-800'
            }`}
          >
            <tab.icon className="size-4" />
            {tab.label}
          </button>
        ))}
      </nav>

      {/* 3. DYNAMIC CONTENT AREA */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main Feed Column */}
        <div className="md:col-span-8 space-y-6">
          {activeTab === 'posts' && (
            <div className="space-y-6">
              {posts?.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
          {activeTab === 'comments' && (
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-10 text-center">
              <p className="text-gray-500">No comments yet.</p>
            </div>
          )}
        </div>

        {/* Sidebar Info (Daily.dev sidebar style) */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 dark:text-neutral-200 mb-4 text-sm uppercase tracking-wider">
              Socials
            </h3>
            <div className="space-y-3">
              <a
                href="#"
                className="flex items-center gap-x-3 text-gray-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-500 transition"
              >
                <LuGithub className="size-5" />
                <span className="text-sm font-medium">github.com/ahnaf</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-x-3 text-gray-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-500 transition"
              >
                <LuTwitter className="size-5" />
                <span className="text-sm font-medium">
                  twitter.com/ahnaf_dev
                </span>
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
            <h3 className="font-bold mb-2">Aura Premium</h3>
            <p className="text-xs text-blue-100 mb-4 leading-relaxed">
              Support the community and get exclusive badges, custom themes, and
              early access to features.
            </p>
            <button className="w-full py-2 bg-white text-blue-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
