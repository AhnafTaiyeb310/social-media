"use client";

import Link from "next/link";
import { 
  Home, 
  Hash, 
  Video, 
  BookMarked, 
  List, 
  Users, 
  ShieldCheck,
  TrendingUp,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: Home, label: "Home", href: "/", color: "text-blue-600" },
  { icon: Hash, label: "Explore", href: "/explore", color: "text-purple-600" },
  { icon: Video, label: "Reels", href: "/reels", color: "text-pink-600" },
  { icon: BookMarked, label: "Bookmarks", href: "/bookmarks", color: "text-orange-600" },
  { icon: List, label: "Lists", href: "/lists", color: "text-emerald-600" },
  { icon: Users, label: "Groups", href: "/groups", color: "text-cyan-600" },
];

const tags = [
  "javascript", "react", "nextjs", "tailwindcss", "python", "django", "webdev", "saas"
];

export function LeftSidebar() {
  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] w-64 flex-col gap-6 overflow-y-auto pr-4 lg:flex">
      {/* Navigation */}
      <div className="space-y-1">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href}>
            <span className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800",
              item.label === "Home" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20" : "text-zinc-600 dark:text-zinc-400"
            )}>
              <item.icon className={cn("h-5 w-5", item.color)} />
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Popular Tags */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-orange-500" />
            Popular Tags
          </h3>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link key={tag} href={`/search?tag=${encodeURIComponent(tag)}`}>
              <span className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:bg-zinc-800 dark:text-zinc-400">
                #{tag}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Pro Badge/Ad */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-lg">
        <ShieldCheck className="absolute -right-4 -top-4 h-24 w-24 opacity-10 rotate-12" />
        <h4 className="relative z-10 font-bold">SocialAura Pro</h4>
        <p className="relative z-10 mt-1 text-xs text-blue-100">
          Get verified, advanced analytics, and no ads.
        </p>
        <Button size="sm" className="relative z-10 mt-4 w-full bg-white text-blue-600 hover:bg-blue-50">
          Upgrade Now
        </Button>
      </div>
    </aside>
  );
}
