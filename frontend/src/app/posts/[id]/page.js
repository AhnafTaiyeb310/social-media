"use client";

import { usePost } from "@/features/posts/hooks/usePosts";
import { PostCard } from "@/features/posts/components/post-card";
import { CommentSection } from "@/features/posts/components/comment-section";
import { Navbar } from "@/components/layout/navbar";
import { LeftSidebar } from "@/components/layout/sidebar-left";
import { RightSidebar } from "@/components/layout/sidebar-right";
import { useParams, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import ProtectedRoute from "@/features/auth/components/protectedRoutes";

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: post, isLoading, error } = usePost(id);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-black transition-colors">
        <Navbar />
        
        <main className="container mx-auto px-4 py-6">
          <div className="flex justify-center gap-6">
            <LeftSidebar />

            <div className="flex-1 max-w-[680px]">
              <div className="mb-4">
                <Button 
                    variant="ghost" 
                    onClick={() => router.back()}
                    className="gap-2 text-zinc-500 hover:text-blue-600 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                </Button>
              </div>

              {isLoading ? (
                <div className="space-y-6">
                  <Skeleton className="h-[400px] w-full rounded-2xl" />
                  <Skeleton className="h-[200px] w-full rounded-2xl" />
                </div>
              ) : error ? (
                <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-red-500 font-bold">Failed to load post.</p>
                  <Button onClick={() => router.push("/")} className="mt-4">Go Home</Button>
                </div>
              ) : post ? (
                <div className="space-y-6">
                  <PostCard post={post} full={true} />
                  <CommentSection postId={post.id} />
                </div>
              ) : (
                <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                  <p className="text-zinc-500">Post not found.</p>
                </div>
              )}
            </div>

            <RightSidebar />
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
