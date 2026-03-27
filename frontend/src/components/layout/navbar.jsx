"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  Search, 
  Bell, 
  MessageSquare, 
  PlusCircle, 
  User, 
  LogOut, 
  Settings,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/logout/");
    } catch (err) {
      console.warn("Logout failed", err);
    } finally {
      logout();
      router.push("/login");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-zinc-900/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
            <Flame className="text-white h-6 w-6" fill="currentColor" />
          </div>
          <span className="hidden text-xl font-bold tracking-tight text-zinc-900 dark:text-white sm:block">
            Social<span className="text-blue-600">Aura</span>
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden flex-1 px-8 md:block max-w-2xl">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-blue-500" />
            <Input
              placeholder="Search posts, people, or tags..."
              className="h-10 w-full rounded-full bg-zinc-100 pl-10 pr-4 outline-none border-transparent focus:bg-white focus:border-blue-500 transition-all dark:bg-zinc-800"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative text-zinc-600 hover:text-blue-600">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </Button>
              <Button variant="ghost" size="icon" className="hidden text-zinc-600 hover:text-blue-600 sm:flex">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button className="hidden gap-2 rounded-full bg-blue-600 hover:bg-blue-700 sm:flex">
                <PlusCircle className="h-4 w-4" />
                <span>Create Post</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-offset-2 ring-blue-500/10">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profile_picture_url} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-bold">
                        {user.username?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.username}</p>
                      <p className="text-xs leading-none text-zinc-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/profile/me")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-50 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => router.push("/login")}>Sign In</Button>
              <Button onClick={() => router.push("/register")} className="bg-blue-600 hover:bg-blue-700 rounded-full px-6">Join SocialAura</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
