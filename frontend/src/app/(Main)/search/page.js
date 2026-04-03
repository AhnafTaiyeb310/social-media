'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LuSearch, LuUser, LuHash, LuFileText, LuInbox } from 'react-icons/lu';
import { useGlobalSearch } from '@/features/search/hooks/useSearch';
import PostCard from '@/components/feed/PostCard';
import Image from 'next/image';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || 'posts';
  
  const [activeTab, setActiveTab] = useState(initialType);
  const { data, isLoading } = useGlobalSearch(query);

  const tabs = [
    { id: 'posts', label: 'Posts', icon: LuFileText },
    { id: 'users', label: 'People', icon: LuUser },
    { id: 'tags', label: 'Tags', icon: LuHash },
  ];

  return (
    <div className="min-h-screen bg-layer py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Search Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-x-3">
            <LuSearch className="text-muted-foreground" />
            <span>Search results for "{query}"</span>
          </h1>
          <p className="text-muted-foreground-1 text-sm">
            Found results across articles, authors, and topics.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-navbar-line">
          <nav className="flex gap-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 inline-flex items-center gap-x-2 border-b-2 font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
              >
                <tab.icon className="size-4" />
                {tab.label}
                <span className="ms-1 py-0.5 px-1.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400">
                  {data ? data[tab.id]?.length || 0 : 0}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Results Content */}
        <div className="py-6">
          {isLoading ? (
            <div className="text-center py-20 animate-pulse text-gray-400">Searching the universe...</div>
          ) : (
            <div className="space-y-6">
              
              {/* POSTS TAB */}
              {activeTab === 'posts' && (
                <div className="space-y-6">
                  {data?.posts?.length > 0 ? (
                    data.posts.map(post => (
                      <PostCard key={post.id} post={post} />
                    ))
                  ) : (
                    <EmptyState message={`No articles found for "${query}"`} />
                  )}
                </div>
              )}

              {/* USERS TAB */}
              {activeTab === 'users' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data?.users?.length > 0 ? (
                    data.users.map(user => (
                      <Link 
                        key={user.id} href={`/profile/${user.username}`}
                        className="flex items-center gap-x-4 p-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl hover:shadow-md transition-all"
                      >
                        <div className="relative size-14">
                          <Image 
                            src={user.profile_picture_url || 'https://i.pravatar.cc/150'} 
                            alt={user.username} fill className="rounded-full object-cover" 
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">{user.first_name} {user.last_name}</h3>
                          <p className="text-sm text-muted-foreground-1">@{user.username}</p>
                          <p className="text-xs text-blue-600 mt-1">{user.followers_count || 0} followers</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full">
                      <EmptyState message={`No authors found matching "${query}"`} />
                    </div>
                  )}
                </div>
              )}

              {/* TAGS TAB */}
              {activeTab === 'tags' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {data?.tags?.length > 0 ? (
                    data.tags.map(tag => (
                      <Link 
                        key={tag.id} href={`/search?q=${tag.tag}&type=posts`}
                        className="flex items-center gap-x-3 p-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl hover:border-blue-500/50 transition-all group"
                      >
                        <div className="size-10 flex items-center justify-center bg-gray-50 dark:bg-neutral-800 rounded-xl text-gray-400 group-hover:text-blue-600 transition-colors">
                          <LuHash className="size-5" />
                        </div>
                        <span className="font-bold text-foreground">#{tag.tag}</span>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full">
                      <EmptyState message={`No tags found for "${query}"`} />
                    </div>
                  )}
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-20 bg-gray-50 dark:bg-neutral-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-neutral-800">
      <LuInbox className="size-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 dark:text-neutral-400 font-medium">{message}</p>
      <p className="text-gray-400 dark:text-neutral-500 text-sm mt-1">Try checking your spelling or use more general terms.</p>
    </div>
  );
}
