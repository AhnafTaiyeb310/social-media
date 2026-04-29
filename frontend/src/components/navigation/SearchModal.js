'use client';
import { DEFAULT_AVATAR } from '@/lib/constants';
import { useState, useEffect } from 'react';
import { LuSearch, LuUser, LuHash, LuFileText, LuX, LuArrowRight, LuCommand } from 'react-icons/lu';
import { useGlobalSearch } from '@/features/search/hooks/useSearch';
import { useDebounce } from '@/hooks/useDebounce';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SearchModal() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  const debouncedQuery = useDebounce(query, 300);
  const { data, isLoading } = useGlobalSearch(debouncedQuery);

  // Keyboard shortcuts (Ctrl + K) and Custom Event
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-aura-search', handleOpen);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-aura-search', handleOpen);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-start justify-center pt-[10vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[70vh]">
        
        {/* Search Input Header */}
        <div className="relative p-4 border-b border-gray-100 dark:border-neutral-800 flex items-center gap-x-3">
          <LuSearch className="size-5 text-gray-400" />
          <input
            autoFocus
            type="text"
            className="flex-1 bg-transparent border-none focus:ring-0 text-lg dark:text-neutral-200 placeholder:text-gray-400"
            placeholder="Search for posts, tags, or people..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleSearchSubmit}
          />
          <div className="flex items-center gap-x-1.5 px-2 py-1 bg-gray-100 dark:bg-neutral-800 rounded-md text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <LuCommand className="size-3" /> <span>Enter</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg text-gray-400 transition-colors">
            <LuX className="size-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {!debouncedQuery ? (
            <div className="p-10 text-center space-y-2">
              <p className="text-gray-400 dark:text-neutral-500 text-sm">Type at least 2 characters to start searching...</p>
            </div>
          ) : isLoading ? (
            <div className="p-10 text-center animate-pulse text-gray-400">Searching Aura...</div>
          ) : (
            <div className="space-y-6 pb-4">
              
              {/* --- TAGS SECTION --- */}
              {data?.tags?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tags</h4>
                  <div className="grid grid-cols-2 gap-1 px-2">
                    {data.tags.map(tag => (
                      <Link 
                        key={tag.id} href={`/search?q=${tag.tag}&type=tags`} onClick={() => setIsOpen(false)}
                        className="flex items-center gap-x-3 p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 group transition-all"
                      >
                        <div className="size-8 flex items-center justify-center bg-gray-100 dark:bg-neutral-800 rounded-lg text-gray-500 group-hover:text-blue-600 transition-colors">
                          <LuHash className="size-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-neutral-300 group-hover:text-blue-600">#{tag.tag}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* --- USERS SECTION --- */}
              {data?.users?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">People</h4>
                  <div className="space-y-1 px-2">
                    {data.users.map(user => (
                      <Link 
                        key={user.id} href={`/profile/${user.username}`} onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800/50 group transition-all"
                      >
                        <div className="flex items-center gap-x-3">
                          <div className="relative size-9">
                            <Image 
                              src={user.profile_picture_url || DEFAULT_AVATAR} 
                              alt={user.username} fill className="rounded-full object-cover" 
                            />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800 dark:text-neutral-200">{user.first_name} {user.last_name}</p>
                            <p className="text-xs text-gray-500">@{user.username}</p>
                          </div>
                        </div>
                        <LuArrowRight className="size-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* --- POSTS SECTION --- */}
              {data?.posts?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Articles</h4>
                  <div className="space-y-1 px-2">
                    {data.posts.map(post => (
                      <Link 
                        key={post.id} href={`/search?q=${post.title}`} onClick={() => setIsOpen(false)}
                        className="flex items-start gap-x-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-800/50 group transition-all"
                      >
                        <div className="size-10 flex-shrink-0 bg-gray-100 dark:bg-neutral-800 rounded-lg flex items-center justify-center text-gray-400">
                          <LuFileText className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-800 dark:text-neutral-200 truncate group-hover:text-blue-600 transition-colors">{post.title}</p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">{post.content}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results Fallback */}
              {data && data.posts.length === 0 && data.users.length === 0 && data.tags.length === 0 && (
                <div className="p-10 text-center">
                  <p className="text-gray-500 dark:text-neutral-500 text-sm italic">No results found for "{debouncedQuery}"</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="p-3 bg-gray-50 dark:bg-neutral-800/50 border-t border-gray-100 dark:border-neutral-800 flex justify-between items-center text-[10px] font-medium text-gray-400">
          <div className="flex gap-x-4">
            <span className="flex items-center gap-x-1.5"><kbd className="px-1 py-0.5 bg-white dark:bg-neutral-700 border rounded shadow-sm">Esc</kbd> to close</span>
            <span className="flex items-center gap-x-1.5"><kbd className="px-1 py-0.5 bg-white dark:bg-neutral-700 border rounded shadow-sm">↵</kbd> for deep search</span>
          </div>
          <span className="text-blue-600 dark:text-blue-400">Aura Search v1.0</span>
        </div>
      </div>
    </div>
  );
}
