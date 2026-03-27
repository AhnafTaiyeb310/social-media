"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Navbar } from "@/components/layout/navbar";
import { LeftSidebar } from "@/components/layout/sidebar-left";
import { RightSidebar } from "@/components/layout/sidebar-right";
import { CreatePost } from "@/features/posts/components/create-post";
import { PostCard } from "@/features/posts/components/post-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProtectedRoute from "@/features/auth/components/protectedRoutes";
import { useFeed } from "@/features/posts/hooks/usePosts";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { user } = useAuthStore();
  const { data, isLoading, error } = useFeed();

  const posts = data?.results || [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-black transition-colors">
        <Navbar />
        
        <main className="container mx-auto px-4 py-6">
          <div className="flex justify-center gap-6">
            {/* Left Sidebar - Navigation & Tags */}
            <LeftSidebar />

            {/* Main Feed */}
            <div className="flex-1 max-w-[680px]">
              <CreatePost />

              <div className="mb-6 flex items-center justify-between">
                <Tabs defaultValue="relevant" className="w-full">
                  <TabsList className="grid w-full max-w-[400px] grid-cols-3 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <TabsTrigger value="relevant" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">Relevant</TabsTrigger>
                    <TabsTrigger value="latest" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">Latest</TabsTrigger>
                    <TabsTrigger value="top" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">Top</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="space-y-6">
                {isLoading ? (
                  <>
                    <Skeleton className="h-[200px] w-full rounded-2xl" />
                    <Skeleton className="h-[400px] w-full rounded-2xl" />
                    <Skeleton className="h-[300px] w-full rounded-2xl" />
                  </>
                ) : error ? (
                  <div className="text-center py-10 text-red-500 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30">
                    Failed to load posts. Please try again later.
                  </div>
                ) : posts.length > 0 ? (
                  posts.map(post => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <div className="text-center py-20 text-zinc-500 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    No posts yet. Follow some people or create your own!
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar - Suggestions & Trending */}
            <RightSidebar />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
