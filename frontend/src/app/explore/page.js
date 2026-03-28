"use client";

import { useState } from "react";
import { useProfiles } from "@/features/auth/hooks/useProfile";
import { useFollow } from "@/features/auth/hooks/useFollow";
import { Navbar } from "@/components/layout/navbar";
import { LeftSidebar } from "@/components/layout/sidebar-left";
import { RightSidebar } from "@/components/layout/sidebar-right";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/useAuthStore";
import { UserPlus, UserMinus, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/features/auth/components/protectedRoutes";

function UserCard({ profile }) {
  const { user: currentUser } = useAuthStore();
  const followMutation = useFollow();
  const isOwnProfile = currentUser?.username === profile.username;

  return (
    <Card className="overflow-hidden rounded-2xl border-none shadow-sm hover:shadow-md transition-all duration-300 dark:bg-zinc-900 group">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-4">
          <Link href={`/profile/${profile.username}`} className="flex items-center gap-4 flex-1">
            <Avatar className="h-14 w-14 ring-2 ring-blue-500/10 transition-transform group-hover:scale-105">
              <AvatarImage src={profile.profile_picture_url} />
              <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
                {profile.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-zinc-900 dark:text-white truncate hover:text-blue-600 transition-colors">
                  {profile.first_name} {profile.last_name}
                </span>
                {profile.is_verified && (
                  <span className="h-2 w-2 rounded-full bg-blue-500" title="Verified" />
                )}
              </div>
              <span className="text-sm text-zinc-500 font-medium">@{profile.username}</span>
              {profile.bio && (
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-1">
                  {profile.bio}
                </p>
              )}
            </div>
          </Link>

          {!isOwnProfile && (
            <Button
              size="sm"
              variant={profile.is_following ? "outline" : "default"}
              className={cn(
                "rounded-full px-5 font-semibold transition-all",
                profile.is_following 
                  ? "border-zinc-200 text-zinc-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200" 
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20"
              )}
              onClick={() => followMutation.mutate(profile.id)}
              disabled={followMutation.isPending}
            >
              {followMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : profile.is_following ? (
                <>
                  <UserMinus className="h-4 w-4 mr-2" />
                  Unfollow
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Follow
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

import { cn } from "@/lib/utils";

export default function ExplorePage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = useProfiles({ page });
  const profiles = data?.results || [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-black transition-colors">
        <Navbar />
        
        <main className="container mx-auto px-4 py-6">
          <div className="flex justify-center gap-6">
            <LeftSidebar />

            <div className="flex-1 max-w-[680px]">
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Explore People</h1>
                <div className="text-sm text-zinc-500 font-medium">
                  Showing {profiles.length} users
                </div>
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  <>
                    <Skeleton className="h-24 w-full rounded-2xl" />
                    <Skeleton className="h-24 w-full rounded-2xl" />
                    <Skeleton className="h-24 w-full rounded-2xl" />
                    <Skeleton className="h-24 w-full rounded-2xl" />
                  </>
                ) : error ? (
                  <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                    <p className="text-red-500 font-bold">Failed to load profiles.</p>
                  </div>
                ) : profiles.length > 0 ? (
                  <>
                    {profiles.map(profile => (
                      <UserCard key={profile.id} profile={profile} />
                    ))}
                    
                    {/* Pagination */}
                    {(data.next || data.previous) && (
                      <div className="flex justify-center gap-4 mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        <Button
                          variant="outline"
                          disabled={!data.previous}
                          onClick={() => setPage(p => p - 1)}
                          className="rounded-full"
                        >
                          Previous
                        </Button>
                        <div className="flex items-center text-sm font-bold text-zinc-500">
                          Page {page}
                        </div>
                        <Button
                          variant="outline"
                          disabled={!data.next}
                          onClick={() => setPage(p => p + 1)}
                          className="rounded-full"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 text-zinc-500 italic">
                    No users found to explore.
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
