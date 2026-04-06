'use client';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import PostDetail from './PostDetail';
import { useFeed } from '@/features/post/hooks/usePost';

export default function Feed() {
  const [activePost, setActivePost] = useState(null);
  const { 
    data, 
    isLoading, 
    isFetchingNextPage, 
    hasNextPage, 
    fetchNextPage, 
    isError 
  } = useFeed();
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '200px',
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage, isLoading]);

  const posts = data?.pages.flatMap(page => page.results) || [];

  if (isLoading && !isFetchingNextPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse">Loading your feed...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-layer min-h-screen">
      <div className="md:hidden mb-4">
        {/* Mobile Search Placeholder */}
      </div>

      <CreatePost />

      <div className="space-y-6">
        {posts?.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onClick={() => setActivePost(post)}
          />
        ))}
      </div>

      {/* Sentinel for infinite scroll */}
      <div ref={ref} className="py-10 flex items-center justify-center min-h-[100px]">
        {isFetchingNextPage ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="flex space-x-2">
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" />
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Loading more posts...</p>
          </div>
        ) : hasNextPage ? (
          <div className="h-4" /> 
        ) : posts.length > 0 ? (
          <p className="text-sm text-muted-foreground italic text-center">You&apos;ve reached the end of the universe 🌌</p>
        ) : !isLoading && (
          <p className="text-sm text-muted-foreground italic text-center">No posts found.</p>
        )}
      </div>

      {activePost && (
        <PostDetail post={activePost} onClose={() => setActivePost(null)} />
      )}
    </div>
  );
}
