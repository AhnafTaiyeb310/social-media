'use client';
import { useState } from 'react';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import PostDetail from './PostDetail';
import { useFeed } from '@/features/post/hooks/usePost';



export default function Feed() {
  const [activePost, setActivePost] = useState(null);
  const {data, isLoading, error} = useFeed();
  const posts = data?.results || [];
  console.log(posts)
  return (
    <div className="space-y-6 bg-layer">
      <div className="md:hidden mb-4">
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search Sync..."
            className="w-full bg-white border border-gray-100 rounded-2xl pl-10 pr-4 py-3 font-medium text-sm shadow-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none"
          />
        </div>
      </div>

      <CreatePost />

      <div className="space-y-6 pb-12">
        {posts?.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onClick={() => setActivePost(post)}
          />
        ))}
      </div>

      {activePost && (
        <PostDetail post={activePost} onClose={() => setActivePost(null)} />
      )}
    </div>
  );
}
