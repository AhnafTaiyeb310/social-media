'use client';
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import PostDetail from './PostDetail';
import { useFeed, useDeletePost } from '@/features/post/hooks/usePost';
import { LuInfo } from 'react-icons/lu';
import { toast } from 'sonner';

export default function Feed() {
  const [activePost, setActivePost] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  
  const { 
    data, 
    isLoading, 
    isFetchingNextPage, 
    hasNextPage, 
    fetchNextPage, 
    isError 
  } = useFeed();

  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
  
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
  
  // Re-initialize Preline components when posts data changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, [posts]);

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
            onSelectForDelete={() => setPostToDelete(post)}
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

      {/* DELETE CONFIRMATION MODAL */}
      <div id="hs-delete-post-modal" className="hs-overlay hidden size-full fixed top-0 start-0 z-[100] overflow-x-hidden overflow-y-auto pointer-events-none flex items-center justify-center">
        <div className="hs-overlay-open:opacity-100 hs-overlay-open:duration-500 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
          <div className="relative flex flex-col bg-white border shadow-sm rounded-2xl dark:bg-neutral-900 dark:border-neutral-800 pointer-events-auto">
            <div className="p-4 sm:p-10 text-center">
              <span className="mb-4 inline-flex justify-center items-center size-16 rounded-full border-4 border-red-50 bg-red-100 text-red-500 dark:bg-red-700 dark:border-red-600 dark:text-red-100">
                <LuInfo className="size-8" />
              </span>
              <h3 className="mb-2 text-2xl font-bold text-gray-800 dark:text-neutral-200">
                Delete Post?
              </h3>
              <p className="text-gray-500 dark:text-neutral-500">
                Are you sure you want to delete <span className="font-bold text-gray-800 dark:text-neutral-200">&quot;{postToDelete?.title || "this post"}&quot;</span>? 
                This action cannot be undone.
              </p>
              <div className="mt-8 flex justify-center gap-x-3">
                <button 
                  type="button" 
                  className="py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-xl border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-neutral-900 dark:border-neutral-800 dark:text-white dark:hover:bg-neutral-800" 
                  data-hs-overlay="#hs-delete-post-modal"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    if (!postToDelete) return;
                    deletePost(postToDelete.id, {
                      onSuccess: () => {
                        toast.success('Post deleted');
                        if (window.HSOverlay) window.HSOverlay.close('#hs-delete-post-modal');
                        setPostToDelete(null);
                      },
                      onError: () => {
                        toast.error('Failed to delete post');
                      }
                    });
                  }} 
                  disabled={isDeleting || !postToDelete} 
                  className="py-2.5 px-4 inline-flex items-center gap-x-2 text-sm font-bold rounded-xl border border-transparent bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 shadow-lg shadow-red-500/20"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
