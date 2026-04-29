'use client';
import { LuChevronLeft, LuChevronRight, LuUsers, LuPlus, LuCheck } from 'react-icons/lu';
import Image from 'next/image';
import { useSuggestions, useFollowUser } from '@/features/auth/hooks/useLogin';
import { DEFAULT_AVATAR } from '@/lib/constants';
import Link from 'next/link';

export default function AuthorsFollow() {
  const { data: suggestions, isLoading } = useSuggestions();
  const { mutate: follow, isPending: isFollowing } = useFollowUser();

  if (isLoading) {
    return (
      <div className="flex flex-col bg-white border border-gray-200 rounded-xl p-5 dark:bg-neutral-900 dark:border-neutral-800 shadow-sm animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/2 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 dark:bg-neutral-800 rounded-xl"></div>)}
        </div>
      </div>
    );
  }

  const authors = suggestions || [];

  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-xl p-5 dark:bg-neutral-900 dark:border-neutral-800 shadow-sm">
      <div className="flex items-center gap-x-3 mb-6">
        <div className="inline-flex justify-center items-center size-8 bg-blue-50 rounded-lg dark:bg-blue-900/30">
          <LuUsers className="size-4 text-blue-600 dark:text-blue-500" />
        </div>
        <h3 className="font-bold text-gray-800 dark:text-neutral-200">
          Authors worth following
        </h3>
      </div>

      <div className="flex flex-col gap-y-6">
        {authors.length > 0 ? (
          authors.map((author) => (
            <div key={author.id} className="flex items-start justify-between gap-x-3">
              <Link href={`/profile/${author.username}`} className="flex gap-x-3 flex-1 min-w-0 group">
                <div className="relative size-10 flex-shrink-0">
                  <Image
                    className="rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-500/30 transition-all"
                    src={author.profile_picture_url || DEFAULT_AVATAR}
                    alt={author.username}
                    fill
                    sizes="40px"
                  />
                </div>
                <div className="flex flex-col gap-y-0.5 min-w-0">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-neutral-200 hover:text-blue-600 truncate transition">
                    {author.first_name} {author.last_name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-neutral-500 truncate">
                    @{author.username}
                  </p>
                </div>
              </Link>
              
              <button 
                onClick={() => follow(author.username)} // Backend uses username/ID as lookup
                disabled={isFollowing}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-neutral-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-all disabled:opacity-50"
              >
                <LuPlus className="size-4" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-500 text-center py-4 italic">No suggestions at the moment.</p>
        )}
      </div>

      <div className="mt-8 pt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between text-xs text-gray-500">
        <span className="font-medium text-gray-400">Discover more authors</span>
        <Link href="/search?type=users" className="text-blue-600 hover:underline font-bold">
          See all
        </Link>
      </div>
    </div>
  );
}
