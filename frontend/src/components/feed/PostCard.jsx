'use client';
import { useLikePost } from '@/features/post/hooks/usePost';
import Image from 'next/image';
import {
  LuBadgeCheck,
  LuBookmark,
  LuEllipsis,
  LuHeart,
  LuMessageCircle,
  LuShare2,
} from 'react-icons/lu';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';

export default function PostCard({ post, onClick }) {
  const { mutate: toggleLike, isPending: isLiking } = useLikePost();

  // Destructuring based on your Django model
  const {
    id,
    author,
    author_profile,
    content,
    title,
    display_category,
    images,
    likes_count,
    comments_count,
    is_liked,
  } = post || {};

  const handleLike = (e) => {
    e.stopPropagation(); // Prevent opening PostDetail
    toggleLike(id);
  };



  return (
    <div
      onClick={onClick}
      className="flex flex-col bg-white border border-gray-200 rounded-xl hover:shadow-sm transition dark:bg-neutral-900 dark:border-neutral-800"
    >
      {/* 1. Header: Author Info & Options */}
      <div className="p-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-x-3">
          <div className="relative inline-block">
            <Image
              className="inline-block size-10 rounded-full ring-2 ring-white dark:ring-neutral-900"
              src={
                author_profile?.profile_picture_url || 
                'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
              }
              alt="Author Avatar"
              width={40}
              height={40}
            />
            <span className="absolute bottom-0 end-0 block size-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-neutral-900"></span>
          </div>
          <div>
            <div className="flex items-center gap-x-1">
              <h3 className="font-semibold text-gray-800 dark:text-neutral-200">
                {author_profile?.first_name} {author_profile?.last_name}
              </h3>
              <LuBadgeCheck className="size-3.5 text-blue-500 fill-blue-500/10" />
              <span className="text-xs text-gray-400 dark:text-neutral-500">
                · 2h
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-neutral-500">
              @{author || 'user'}
            </p>
          </div>
        </div>

        {/* Preline Dropdown for Post Actions */}
        <div className="hs-dropdown relative inline-flex">
          <button
            id="hs-post-menu"
            type="button"
            className="hs-dropdown-toggle p-2 inline-flex justify-center items-center gap-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
          >
            <LuEllipsis className="size-5" />
          </button>
          <div
            className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden z-10 mt-2 min-w-40 bg-white shadow-md rounded-lg p-2 dark:bg-neutral-800 dark:border dark:border-neutral-700"
            aria-labelledby="hs-post-menu"
          >
            <button className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 w-full dark:text-neutral-400 dark:hover:bg-neutral-700">
              Follow User
            </button>
            <button className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-red-600 hover:bg-red-50 w-full dark:text-red-500 dark:hover:bg-red-900/20">
              Report Post
            </button>
          </div>
        </div>
      </div>

      {/* 2. Content Body */}
      <div className="px-4 py-2">
        {title && (
          <h2 className="mb-2 text-lg font-bold text-gray-800 dark:text-neutral-200">
            {title}
          </h2>
        )}
        <p className="text-gray-800 dark:text-neutral-300 leading-relaxed">
          {content || 'No content provided.'}
        </p>

        {/* Category Badge */}
        {display_category && (
          <span className="mt-3 inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500">
            {display_category}
          </span>
        )}
      </div>

      {/* 3. Media Section (Only if images exist) */}
      {images && images[0] && (
        <div className="px-4 py-2">
          <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-neutral-800 relative min-h-[200px]">
            <Image
              className="w-full h-auto object-cover max-h-96"
              src={images[0].image_url}
              alt="Post content"
              width={800}
              height={450}
            />
          </div>
        </div>
      )}

      {/* 4. Footer: Engagement Actions */}
      <div className="p-4 pt-2 border-t border-gray-100 dark:border-neutral-800 mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-5">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-x-1.5 transition-colors group ${
                is_liked
                  ? 'text-red-600 dark:text-red-500'
                  : 'text-gray-500 hover:text-red-600 dark:text-neutral-500 dark:hover:text-red-500'
              }`}
            >
              {is_liked ? (
                <FaHeart className="size-5" />
              ) : (
                <FaRegHeart className="size-5 group-hover:text-red-600" />
              )}
              <span className="text-sm font-medium">{likes_count}</span>
            </button>
            <button className="flex items-center gap-x-1.5 text-gray-500 hover:text-blue-600 transition-colors group dark:text-neutral-500 dark:hover:text-blue-400">
              <LuMessageCircle className="size-5" />
              <span className="text-sm font-medium">{comments_count}</span>
            </button>
            <button className="flex items-center gap-x-1.5 text-gray-500 hover:text-green-600 transition-colors group dark:text-neutral-500 dark:hover:text-green-400">
              <LuShare2 className="size-5" />
            </button>
          </div>

          <button className="text-gray-500 hover:text-blue-600 dark:text-neutral-500 dark:hover:text-blue-400">
            <LuBookmark className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
