'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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
import { useProfile } from '@/features/auth/hooks/useLogin';
import { usePosts } from '@/features/post/hooks/usePost';
import PostCard from '@/components/feed/PostCard';
import Image from 'next/image';

export default function ProfilePage() {
  const { username } = useParams();
  const { data: profile, isLoading: isProfileLoading } = useProfile(username);
  const { data: postsData, isLoading: isPostsLoading } = usePosts();
  
  const [activeTab, setActiveTab] = useState('posts');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (isProfileLoading) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center animate-pulse text-gray-400">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center text-gray-500">
        User not found.
      </div>
    );
  }

  // Filter posts for this specific user and only show published
  const userPosts = postsData?.results?.filter(
    (p) => p.author === username && p.status === 'published'
  ) || [];

  const defaultAvatar = 'https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?auto=format&fit=facearea&facepad=2&w=300&h=300&q=80';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 px-4 pt-6">
      {/* 1. HERO SECTION */}
      <div className="relative bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="h-32 sm:h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
          <img
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200"
            className="w-full h-full object-cover opacity-30"
            alt="Cover"
          />
        </div>

        <div className="px-6 pb-6">
          <div className="relative flex justify-between items-end -mt-12 sm:-mt-16 mb-4">
            <div className="relative size-24 sm:size-32 rounded-3xl border-4 border-white dark:border-neutral-900 overflow-hidden shadow-lg bg-white">
              <Image
                className="object-cover"
                src={profile.profile_picture_url || defaultAvatar}
                alt="Profile"
                fill
              />
            </div>

            <div className="flex gap-x-2">
              <button className="p-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 transition">
                <LuShare2 className="size-5 text-gray-600 dark:text-neutral-400" />
              </button>
              <button className="py-2.5 px-5 inline-flex items-center gap-x-2 text-sm font-semibold rounded-xl border border-transparent bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition">
                <LuPlus className="size-4" /> Follow
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-100">
                {profile.first_name} {profile.last_name}
              </h1>
              <p className="text-gray-500 dark:text-neutral-400 font-medium">
                @{profile.username}
              </p>
            </div>

            <p className="text-sm text-gray-700 dark:text-neutral-300 max-w-2xl leading-relaxed whitespace-pre-wrap">
              {profile.bio || "No bio available yet."}
            </p>

            <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs font-medium text-gray-500 dark:text-neutral-500">
              <span className="flex items-center gap-x-1.5">
                <LuMapPin className="size-4" /> {profile.location || 'Everywhere'}
              </span>
              <span className="flex items-center gap-x-1.5">
                <LuCalendar className="size-4" /> Joined {new Date(profile.date_joined).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
              </span>
            </div>

            <div className="flex gap-x-5 pt-2">
              <div className="flex items-center gap-x-1">
                <span className="font-bold text-gray-800 dark:text-neutral-200">{profile.followers_count || 0}</span>
                <span className="text-sm text-gray-500">Followers</span>
              </div>
              <div className="flex items-center gap-x-1">
                <span className="font-bold text-gray-800 dark:text-neutral-200">{profile.following_count || 0}</span>
                <span className="text-sm text-gray-500">Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TABS */}
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
                ? 'bg-gray-100 text-blue-600 dark:bg-neutral-800 dark:text-blue-500 shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 dark:text-neutral-400 dark:hover:bg-neutral-800'
            }`}
          >
            <tab.icon className="size-4" />
            {tab.label}
          </button>
        ))}
      </nav>

      {/* 3. CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-6">
          {activeTab === 'posts' && (
            <div className="space-y-6">
              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-10 text-center text-gray-500">
                  No published posts yet.
                </div>
              )}
            </div>
          )}
          {activeTab === 'comments' && (
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-10 text-center text-gray-500">
              No comments to show.
            </div>
          )}
        </div>

        <div className="md:col-span-4 space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 dark:text-neutral-200 mb-4 text-sm uppercase tracking-wider">
              Socials
            </h3>
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-x-3 text-gray-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-500 transition">
                <LuGithub className="size-5" />
                <span className="text-sm font-medium">GitHub</span>
              </a>
              <a href="#" className="flex items-center gap-x-3 text-gray-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-500 transition">
                <LuTwitter className="size-5" />
                <span className="text-sm font-medium">Twitter</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
