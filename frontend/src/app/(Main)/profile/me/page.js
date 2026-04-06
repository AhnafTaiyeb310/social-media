'use client';
import { useState, useEffect } from 'react';
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
  LuGlobe,
  LuPencil,
} from 'react-icons/lu';
import { useMe } from '@/features/auth/hooks/useLogin';
import { useUpdateMe } from '@/features/auth/hooks/useUpdateMe';
import { usePosts } from '@/features/post/hooks/usePost';
import PostCard from '@/components/feed/PostCard';
import Image from 'next/image';
import EditProfileModal from '@/components/profile/EditProfileModal';

export default function MyProfilePage() {
  const { data: profile, isLoading: isProfileLoading } = useMe();
  const { data: postsData } = usePosts();
  const { mutate: updateMe, isPending: isUpdating } = useUpdateMe();
  
  const [activeTab, setActiveTab] = useState('posts');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined' && window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, []);

  useEffect(() => {
    if (isMounted && profile && typeof window !== 'undefined' && window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, [isMounted, profile]);

  const handleUpdate = (formData) => {
    updateMe(formData, {
      onSuccess: () => {
        if (window.HSOverlay) {
          window.HSOverlay.close('#hs-edit-profile-modal');
        }
      }
    });
  };

  if (!isMounted) return null;

  if (isProfileLoading) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center animate-pulse text-gray-400">
        Loading your profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-5xl mx-auto py-20 text-center text-gray-500">
        Could not load your profile. Please ensure you are logged in.
      </div>
    );
  }

  const userPosts = postsData?.results?.filter(
    (p) => p.author === profile.username && p.status === 'published'
  ) || [];

  const defaultAvatar = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 px-4 pt-6">
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
                sizes="(max-width: 768px) 96px, 128px"
              />
            </div>

            <div className="flex gap-x-2">
              <button className="p-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 transition">
                <LuShare2 className="size-5 text-gray-600 dark:text-neutral-400" />
              </button>
              <button 
                data-hs-overlay="#hs-edit-profile-modal"
                className="py-2.5 px-5 inline-flex items-center gap-x-2 text-sm font-semibold rounded-xl border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 transition"
              >
                <LuPencil className="size-4" /> Edit Profile
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-x-3">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-100">
                {profile.first_name} {profile.last_name}
              </h1>
              {profile.is_verified && <LuSettings className="size-4 text-blue-500 fill-blue-500/10" />}
            </div>
            <p className="text-gray-500 dark:text-neutral-400 font-medium">
              @{profile.username} <span className="mx-2 text-gray-300">•</span> <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-neutral-800 rounded-md">{profile.role}</span>
            </p>

            <p className="text-sm text-gray-700 dark:text-neutral-300 max-w-2xl leading-relaxed whitespace-pre-wrap">
              {profile.bio || "Manage your profile settings to add a bio."}
            </p>

            <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs font-medium text-gray-500 dark:text-neutral-500">
              <span className="flex items-center gap-x-1.5">
                <LuGlobe className="size-4" /> {profile.location || 'Everywhere'}
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
          { id: 'posts', label: 'My Posts', icon: LuLayoutGrid },
          { id: 'comments', label: 'My Comments', icon: LuMessageSquare },
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
                  You haven&apos;t published any posts yet.
                </div>
              )}
            </div>
          )}
          {activeTab === 'comments' && (
            <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-10 text-center text-gray-500">
              No comments yet.
            </div>
          )}
        </div>

        <div className="md:col-span-4 space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 dark:text-neutral-200 mb-4 text-sm uppercase tracking-wider">
              Social Links
            </h3>
            <div className="space-y-3">
              {profile.github_url && (
                <a href={profile.github_url} target="_blank" className="flex items-center gap-x-3 text-gray-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-500 transition">
                  <LuGithub className="size-5" />
                  <span className="text-sm font-medium">GitHub</span>
                </a>
              )}
              {profile.twitter_url && (
                <a href={profile.twitter_url} target="_blank" className="flex items-center gap-x-3 text-gray-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-500 transition">
                  <LuTwitter className="size-5" />
                  <span className="text-sm font-medium">Twitter</span>
                </a>
              )}
              {profile.website_url && (
                <a href={profile.website_url} target="_blank" className="flex items-center gap-x-3 text-gray-600 hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-500 transition">
                  <LuLink className="size-5" />
                  <span className="text-sm font-medium">Website</span>
                </a>
              )}
              {!profile.github_url && !profile.twitter_url && !profile.website_url && (
                <p className="text-xs text-gray-500 italic">No social links added.</p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl">
            <h3 className="font-bold mb-2">Profile Customization</h3>
            <p className="text-xs text-blue-100 mb-6 leading-relaxed">
              Update your bio, role, and social links to help the community know you better.
            </p>
            <button 
              data-hs-overlay="#hs-edit-profile-modal"
              className="w-full py-3 bg-white text-blue-600 rounded-2xl text-sm font-bold hover:bg-gray-50 transition shadow-sm"
            >
              Edit Settings
            </button>
          </div>
        </div>
      </div>

      <EditProfileModal 
        profile={profile} 
        onSave={handleUpdate} 
        isPending={isUpdating} 
      />
    </div>
  );
}
