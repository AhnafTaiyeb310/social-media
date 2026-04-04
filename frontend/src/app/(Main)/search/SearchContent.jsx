'use client';

import PostCard from '@/components/feed/PostCard';
import { useGlobalSearch } from '@/features/search/hooks/useSearch';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LuFileText, LuHash, LuInbox, LuSearch, LuUser } from 'react-icons/lu';

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams?.get('q') ?? '';
  const type = searchParams?.get('type') ?? 'posts';

  const [activeTab, setActiveTab] = useState(type);

  const { data, isLoading } = useGlobalSearch(query);

  useEffect(() => {
    setActiveTab(type);
  }, [type]);

  const handleTabChange = (tab) => {
    const params = new URLSearchParams(searchParams);
    params.set('type', tab);

    router.push(`${pathname}?${params.toString()}`);
  };

  const tabs = [
    { id: 'posts', label: 'Posts', icon: LuFileText },
    { id: 'users', label: 'People', icon: LuUser },
    { id: 'tags', label: 'Tags', icon: LuHash },
  ];

  return (
    <div className="min-h-screen bg-layer py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-x-3">
            <LuSearch className="text-muted-foreground" />
            <span>Search results for {query}</span>
          </h1>
        </div>

        {/* Tabs */}
        <div className="border-b border-navbar-line">
          <nav className="flex gap-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`py-4 px-1 flex items-center gap-x-2 border-b-2 text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500'
                }`}
              >
                <tab.icon className="size-4" />
                {tab.label}
                <span className="text-xs bg-gray-100 px-2 rounded-full">
                  {data ? data[tab.id]?.length || 0 : 0}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="py-6">
          {isLoading ? (
            <div className="text-center py-20 animate-pulse text-gray-400">
              Searching...
            </div>
          ) : (
            <>
              {/* POSTS */}
              {activeTab === 'posts' && (
                <div className="space-y-6">
                  {data?.posts?.length > 0 ? (
                    data.posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))
                  ) : (
                    <EmptyState message={`No posts for "${query}"`} />
                  )}
                </div>
              )}

              {/* USERS */}
              {activeTab === 'users' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data?.users?.length > 0 ? (
                    data.users.map((user) => (
                      <Link
                        key={user.id}
                        href={`/profile/${user.username}`}
                        className="flex gap-4 p-4 border rounded-2xl"
                      >
                        <div className="relative size-14">
                          <Image
                            src={
                              user.profile_picture_url ||
                              'https://i.pravatar.cc/150'
                            }
                            alt={user.username}
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-bold">
                            {user.first_name} {user.last_name}
                          </h3>
                          <p>@{user.username}</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <EmptyState message={`No users found`} />
                  )}
                </div>
              )}

              {/* TAGS */}
              {activeTab === 'tags' && (
                <div className="grid grid-cols-2 gap-3">
                  {data?.tags?.length > 0 ? (
                    data.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/search?q=${tag.tag}&type=posts`}
                        className="p-4 border rounded-2xl flex gap-2"
                      >
                        <LuHash />#{tag.tag}
                      </Link>
                    ))
                  ) : (
                    <EmptyState message={`No tags found`} />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="text-center py-20 border-dashed border rounded-2xl">
      <LuInbox className="mx-auto mb-4 text-gray-300" size={40} />
      <p>{message}</p>
    </div>
  );
}
