"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, MoreHorizontal, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSuggestions } from "@/features/auth/hooks/useSuggestions";
import { useFollow } from "@/features/auth/hooks/useFollow";

const trending = [
  { id: 1, topic: "React 19", posts: "45.2K", category: "Technology" },
  { id: 2, topic: "#OpenAI", posts: "128K", category: "AI" },
  { id: 3, topic: "Next.js Conf", posts: "12.4K", category: "Development" },
  { id: 4, topic: "#TailwindCSS", posts: "8.1K", category: "Design" },
];

export function RightSidebar() {
  const { data: suggestions, isLoading } = useSuggestions();
  const followMutation = useFollow();

  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] w-80 flex-col gap-6 overflow-y-auto pl-4 xl:flex">
      {/* Who to Follow */}
      <Card className="rounded-2xl border-none shadow-sm dark:bg-zinc-900">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-bold">Who to follow</CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : suggestions?.length > 0 ? (
            suggestions.map((person) => (
              <div key={person.id} className="flex items-center justify-between gap-3 group">
                <Link href={`/profile/${person.username}`} className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-white transition-transform group-hover:scale-105">
                    <AvatarImage src={person.profile_picture_url} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                      {person.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {person.username}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {person.first_name} {person.last_name}
                    </span>
                  </div>
                </Link>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
                  onClick={() => followMutation.mutate(person.id)}
                  disabled={followMutation.isPending}
                >
                  <UserPlus className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-xs text-center text-zinc-500 py-4">No suggestions found.</p>
          )}
          <Button variant="ghost" className="w-full text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            Show more
          </Button>
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card className="rounded-2xl border-none shadow-sm dark:bg-zinc-900">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold flex items-center justify-between">
            Trending for you
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {trending.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
                <span>{item.category} • Trending</span>
                <MoreHorizontal className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors">
                {item.topic}
              </h4>
              <p className="text-[10px] text-zinc-500 mt-0.5">{item.posts} Posts</p>
            </div>
          ))}
          <Button variant="ghost" className="w-full text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            Explore more
          </Button>
        </CardContent>
      </Card>

      {/* Footer Links */}
      <div className="px-2 text-[10px] text-zinc-500 flex flex-wrap gap-x-3 gap-y-2">
        <Link href="#" className="hover:underline">Terms of Service</Link>
        <Link href="#" className="hover:underline">Privacy Policy</Link>
        <Link href="#" className="hover:underline">Cookie Policy</Link>
        <Link href="#" className="hover:underline">Accessibility</Link>
        <Link href="#" className="hover:underline">Ads info</Link>
        <span>© 2026 SocialAura Corp.</span>
      </div>
    </aside>
  );
}
