'use client';
import {
  LuPlus,
  LuTrendingUp,
  LuUsers,
  LuMessageSquare,
  LuBadgeCheck,
  LuHash,
  LuFileText,
} from 'react-icons/lu';
import AuthorsFollow from './AuthorsFollow';
import { useTags, useFeed } from '@/features/post/hooks/usePost';
import Link from 'next/link';

export default function RightSidebar() {
  const { data: tagsData, isLoading: isLoadingTags } = useTags();
  const { data: feedData, isLoading: isLoadingFeed } = useFeed();

  const tags = tagsData || [];
  const trendingPosts = feedData?.results?.slice(0, 3) || [];

  return (
    <aside className="space-y-6">
      {/* 1. Authors worth following */}
      <AuthorsFollow />

      {/* 2. Trending Articles */}
      <div className="flex flex-col bg-white border border-gray-200 rounded-xl p-5 dark:bg-neutral-900 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center gap-x-3 mb-5">
          <div className="inline-flex justify-center items-center size-8 bg-orange-50 rounded-lg dark:bg-orange-900/30">
            <LuTrendingUp className="size-4 text-orange-600 dark:text-orange-500" />
          </div>
          <h3 className="font-bold text-gray-800 dark:text-neutral-200">
            Trending Articles
          </h3>
        </div>

        <div className="space-y-5">
          {isLoadingFeed ? (
            [1, 2].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-neutral-800 rounded-xl animate-pulse"></div>)
          ) : trendingPosts.length > 0 ? (
            trendingPosts.map((post) => (
              <div key={post.id} className="group cursor-pointer">
                <Link href={`/search?q=${post.title}`} className="space-y-1 block">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-x-2 text-[11px] text-gray-500 dark:text-neutral-500 font-medium">
                    <span>{post.author_profile?.first_name || post.author}</span>
                    <span>•</span>
                    <span>{post.comments_count} comments</span>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500 italic">Nothing trending right now.</p>
          )}
        </div>
      </div>

      {/* 3. Popular Tags */}
      <div className="flex flex-col bg-white border border-gray-200 rounded-xl p-5 dark:bg-neutral-900 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center gap-x-3 mb-5">
          <div className="inline-flex justify-center items-center size-8 bg-green-50 rounded-lg dark:bg-green-900/30">
            <LuHash className="size-4 text-green-600 dark:text-green-500" />
          </div>
          <h3 className="font-bold text-gray-800 dark:text-neutral-200">
            Popular Topics
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {isLoadingTags ? (
            <div className="flex flex-wrap gap-2 w-full">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-7 w-16 bg-gray-100 dark:bg-neutral-800 rounded-lg animate-pulse"></div>)}
            </div>
          ) : tags.length > 0 ? (
            tags.slice(0, 10).map((tag) => (
              <Link
                key={tag.id}
                href={`/search?q=${tag.tag}&type=tags`}
                className="py-1.5 px-3 bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 rounded-lg text-xs font-bold transition-all border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
              >
                #{tag.tag}
              </Link>
            ))
          ) : (
            <p className="text-xs text-gray-500 italic">No topics found.</p>
          )}
        </div>
      </div>

      {/* 4. Footer Links */}
      <div className="px-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-400 dark:text-neutral-600 font-medium">
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <a href="#" className="hover:underline">
            Terms
          </a>
          <a href="#" className="hover:underline">
            Cookies
          </a>
          <span>© 2026 Aura Inc.</span>
        </div>
      </div>
    </aside>
  );
}
