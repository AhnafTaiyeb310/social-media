"use client";

import { useParams } from "next/navigation";
import { useProfile } from "@/features/auth/hooks/useProfile";
import { usePosts } from "@/features/posts/hooks/usePosts";
import { PostCard } from "@/features/posts/components/post-card";
import { Navbar } from "@/components/layout/navbar";
import { LeftSidebar } from "@/components/layout/sidebar-left";
import { RightSidebar } from "@/components/layout/sidebar-right";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { Calendar, MapPin, Link as LinkIcon, Edit3 } from "lucide-react";
import { format } from "date-fns";
import ProtectedRoute from "@/features/auth/components/protectedRoutes";

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser } = useAuthStore();
  const { data: profile, isLoading: isProfileLoading } = useProfile(username);
  
  // Fetch user's posts using username instead of user_id for immediate filtering
  const { data: postsData, isLoading: isPostsLoading } = usePosts({ username });
  const posts = postsData?.results || [];

  const isOwnProfile = currentUser?.username === username;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-black transition-colors">
        <Navbar />
        
        <main className="container mx-auto px-4 py-6">
          <div className="flex justify-center gap-6">
            <LeftSidebar />

            <div className="flex-1 max-w-[680px]">
              {/* Profile Header */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden mb-6 shadow-sm">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />
                <div className="px-6 pb-6">
                  <div className="relative flex justify-between items-end -mt-12 mb-4">
                    <Avatar className="h-24 w-24 border-4 border-white dark:border-zinc-900 shadow-xl">
                      <AvatarImage src={profile?.profile_picture_url} />
                      <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">
                        {username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isOwnProfile && (
                      <Button variant="outline" size="sm" className="rounded-full gap-2 font-semibold">
                        <Edit3 className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                      {profile?.first_name} {profile?.last_name}
                    </h1>
                    <p className="text-zinc-500 font-medium">@{username}</p>
                  </div>

                  {profile?.bio && (
                    <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {profile.bio}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 mt-4 text-sm text-zinc-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {profile?.date_joined ? format(new Date(profile.date_joined), 'MMMM yyyy') : 'Recently'}</span>
                    </div>
                    {profile?.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-6 mt-6 pt-6 border-t border-zinc-50 dark:border-zinc-800">
                    <div className="text-center">
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">{posts.length}</p>
                      <p className="text-xs text-zinc-500 font-medium">Posts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">{profile?.followers_count || 0}</p>
                      <p className="text-xs text-zinc-500 font-medium">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">{profile?.following_count || 0}</p>
                      <p className="text-xs text-zinc-500 font-medium">Following</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* User's Posts */}
              <div className="space-y-6">
                <h2 className="text-lg font-bold px-2">Posts</h2>
                {isPostsLoading ? (
                  <>
                    <Skeleton className="h-[200px] w-full rounded-2xl" />
                    <Skeleton className="h-[300px] w-full rounded-2xl" />
                  </>
                ) : posts.length > 0 ? (
                  posts.map(post => <PostCard key={post.id} post={post} />)
                ) : (
                  <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-zinc-500 italic">
                    No posts shared yet.
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
