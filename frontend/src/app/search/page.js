"use client";

import { useSearchParams } from "next/navigation";
import { usePosts } from "@/features/posts/hooks/usePosts";
import { PostCard } from "@/features/posts/components/post-card";
import { Navbar } from "@/components/layout/navbar";
import { LeftSidebar } from "@/components/layout/sidebar-left";
import { RightSidebar } from "@/components/layout/sidebar-right";
import { Skeleton } from "@/components/ui/skeleton";
import ProtectedRoute from "@/features/auth/components/protectedRoutes";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const tagName = searchParams.get("tag") || "";
  
  const { data, isLoading, error } = usePosts({ search: query, tag: tagName });
  const posts = data?.results || [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-black transition-colors">
        <Navbar />
        
        <main className="container mx-auto px-4 py-6">
          <div className="flex justify-center gap-6">
            <LeftSidebar />

            <div className="flex-1 max-w-[680px]">
              <div className="mb-6">
                {query ? (
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                        Search results for: <span className="text-blue-600">&quot;{query}&quot;</span>
                    </h1>
                ) : tagName ? (
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                        Posts tagged with: <span className="text-blue-600">#{tagName}</span>
                    </h1>
                ) : (
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                        Search
                    </h1>
                )}
                <p className="text-zinc-500 text-sm mt-1">
                  Found {data?.count || 0} results
                </p>
              </div>

              <div className="space-y-6">
                {isLoading ? (
                  <>
                    <Skeleton className="h-[200px] w-full rounded-2xl" />
                    <Skeleton className="h-[400px] w-full rounded-2xl" />
                  </>
                ) : error ? (
                  <div className="text-center py-10 text-red-500 bg-red-50 dark:bg-red-950/20 rounded-2xl border border-red-100 dark:border-red-900/30">
                    An error occurred while searching. Please try again.
                  </div>
                ) : posts.length > 0 ? (
                  posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))
                ) : (
                  <div className="text-center py-20 text-zinc-500 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    No posts matched your search.
                  </div>
                )}
              </div>
            </div>

            <RightSidebar />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
