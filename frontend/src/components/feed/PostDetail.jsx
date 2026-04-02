'use client';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import {
  LuBadgeCheck,
  LuBookmark,
  LuEllipsis,
  LuHeart,
  LuMessageCircle,
  LuSend,
  LuShare2,
  LuX,
} from 'react-icons/lu';

export default function PostDetail({ post, onClose }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef(null);

  const handleScroll = () => {
    const element = scrollContainerRef.current;
    if (element) {
      const totalHeight = element.scrollHeight - element.clientHeight;
      const currentScroll = element.scrollTop;
      const progress = (currentScroll / totalHeight) * 100;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    // Re-initialize Preline for components in modal
    if (typeof window !== 'undefined' && window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, [post]);

  if (!post) return null;

  const {
    author_profile,
    author,
    images,
    likes_count,
    comments_count,
    comments,
    title,
    content,
    created_at,
  } = post;

  const postImage = images?.[0]?.image_url;
  const defaultAvatar = 'https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?auto=format&fit=facearea&facepad=2&w=300&h=300&q=80';

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl h-[95vh] bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* --- 1. THE GRADIENT PROGRESS BAR --- */}
        <div className="absolute top-0 left-0 w-full h-1.5 z-[120] bg-gray-100 dark:bg-neutral-800">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 transition-all duration-75 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-[110] p-2 rounded-full bg-white/10 hover:bg-white/20 dark:hover:bg-neutral-800 text-gray-500 dark:text-neutral-400"
        >
          <LuX className="size-6" />
        </button>

        {/* --- 2. THE SCROLLABLE CONTAINER --- */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar scroll-smooth"
        >
          {/* Header Section */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-x-3">
              <div className="relative size-11">
                <Image
                  className="rounded-full object-cover"
                  src={author_profile?.profile_picture_url || defaultAvatar}
                  alt="Avatar"
                  fill
                />
              </div>
              <div>
                <div className="flex items-center gap-x-1.5">
                  <span className="text-sm font-bold text-gray-800 dark:text-neutral-200">
                    {author_profile?.first_name} {author_profile?.last_name}
                  </span>
                  <LuBadgeCheck className="size-3.5 text-blue-500" />
                </div>
                <p className="text-xs text-gray-500">
                  @{author} · {new Date(created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Title & Body */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {title}
            </h2>

            {postImage && (
              <div className="rounded-2xl overflow-hidden aspect-video border border-gray-100 dark:border-neutral-800 relative">
                <Image
                  src={postImage}
                  alt="Post"
                  className="object-cover"
                  fill
                />
              </div>
            )}

            <p className="text-lg text-gray-800 dark:text-neutral-300 leading-relaxed max-w-4xl">
              {content}
            </p>
          </div>

          {/* Engagement Bar */}
          <div className="flex items-center justify-between py-6 border-y border-gray-100 dark:border-neutral-800">
            <div className="flex gap-x-6">
              <button className="flex items-center gap-x-2 text-gray-500 hover:text-red-500">
                <LuHeart className="size-5" /> <span>{likes_count}</span>
              </button>
              <button className="flex items-center gap-x-2 text-gray-500 hover:text-blue-500">
                <LuMessageCircle className="size-5" />{' '}
                <span>{comments_count}</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="pb-10 space-y-8">
            <h3 className="text-xl font-bold dark:text-white">Discussion</h3>
            {comments?.map((comment) => (
              <div key={comment.id} className="flex gap-x-4">
                <div className="relative size-9 mt-1 flex-shrink-0">
                  <Image
                    className="rounded-full object-cover"
                    src={comment.author_profile?.profile_picture_url || defaultAvatar}
                    alt="User"
                    fill
                  />
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-2xl">
                  <p className="text-sm font-bold dark:text-neutral-200">
                    {comment.author_username}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
