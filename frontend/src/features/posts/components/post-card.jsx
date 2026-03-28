"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Clock,
  ExternalLink,
  Edit2,
  Trash2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { likePost } from "../api/posts";
import { useDeletePost } from "../hooks/usePostMutations";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { CreatePost } from "./create-post";

import { useRouter } from "next/navigation";

export function PostCard({ post, full = false }) {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);

  const deleteMutation = useDeletePost();

  const isOwner = currentUser?.username === post.author;

  const author = post.author_profile || { username: post.author };
  const createdAt = post.created_at ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true }) : "recently";

  const handleNavigateToDetail = () => {
    if (!full) router.push(`/posts/${post.id}`);
  };

  const likeMutation = useMutation({
    mutationFn: () => likePost(post.id),
    onSuccess: (data) => {
      setIsLiked(data.liked);
      setLikesCount(data.total_likes);
    },
    onError: () => {
      // Revert state on error
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    }
  });

  const toggleLike = () => {
    // Optimistic update
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    likeMutation.mutate();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate(post.id);
    }
  };

  if (isEditing) {
    return <CreatePost postToEdit={post} onCancel={() => setIsEditing(false)} />;
  }

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden rounded-2xl border-none shadow-sm hover:shadow-md transition-all duration-300 dark:bg-zinc-900 group">
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-blue-500/10">
              <AvatarImage src={author.profile_picture_url} />
              <AvatarFallback className="bg-blue-600 text-white font-bold">
                {author.username?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 transition-colors cursor-pointer">
                  {author.username}
                </span>
                {author.is_verified && (
                  <Badge variant="secondary" className="h-4 px-1 bg-blue-50 text-blue-600 border-none text-[10px]">
                    PRO
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                <Clock className="h-3 w-3" />
                <span>{createdAt}</span>
                {post.display_category && (
                  <>
                    <span>•</span>
                    <span>{post.display_category}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {isOwner && (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Post
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                        variant="destructive" 
                        onClick={handleDelete}
                        className="text-red-600 focus:text-red-600"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Post
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>

        <CardContent className="p-4 pt-2">
          <h3 
            onClick={handleNavigateToDetail}
            className={cn(
                "mb-2 text-lg font-bold leading-tight text-zinc-900 dark:text-white transition-colors",
                !full && "hover:text-blue-600 cursor-pointer"
            )}
          >
            {post.title}
          </h3>
          <div 
            onClick={handleNavigateToDetail}
            className={cn(
                "text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap",
                !full ? "line-clamp-3 cursor-pointer" : ""
            )}
          >
            {post.content}
          </div>
          
          {/* Multiple Images Grid */}
          {post.images && post.images.length > 0 && (
            <div className={cn(
              "mt-4 overflow-hidden rounded-xl border border-zinc-100 dark:border-zinc-800 grid gap-1 cursor-pointer",
              post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
            )}>
              {post.images.slice(0, 4).map((img, index) => (
                <div 
                  key={img.id} 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageUrl(img.image_url);
                  }}
                  className={cn(
                    "relative bg-zinc-100 dark:bg-zinc-800 overflow-hidden",
                    post.images.length === 1 ? "aspect-video" : 
                    post.images.length === 3 && index === 0 ? "row-span-2 aspect-auto" : "aspect-square"
                  )}
                >
                  {img.image_url ? (
                    <>
                      <Image 
                        src={img.image_url} 
                        alt={`Post content ${index + 1}`} 
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                      {index === 3 && post.images.length > 4 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                          <span className="text-white text-xl font-bold">+{post.images.length - 4}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags?.map((tagName, idx) => (
              <span 
                key={idx} 
                onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/search?tag=${encodeURIComponent(tagName)}`);
                }}
                className="text-xs text-blue-600 hover:underline cursor-pointer"
              >
                #{tagName}
              </span>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-zinc-50 p-2 px-4 dark:border-zinc-800/50">
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "gap-2 rounded-full h-9 px-3 transition-colors",
                isLiked ? "text-red-500 bg-red-50 dark:bg-red-950/20" : "text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
              )}
              onClick={toggleLike}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
              <span className="text-xs font-semibold">{likesCount}</span>
            </Button>
            
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleNavigateToDetail}
                className="gap-2 rounded-full h-9 px-3 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs font-semibold">{post.comments_count || 0}</span>
            </Button>

            <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 text-zinc-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20">
            <Bookmark className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>

    {/* Image Lightbox */}
    <AnimatePresence>
      {selectedImageUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-10 h-screen w-screen overflow-hidden"
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
          onClick={() => setSelectedImageUrl(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative max-h-full max-w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-12 right-0 text-white hover:bg-white/20 rounded-full h-10 w-10 z-[110]"
              onClick={() => setSelectedImageUrl(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="relative overflow-hidden rounded-lg shadow-2xl">
                <Image
                src={selectedImageUrl}
                alt="Full preview"
                width={1200}
                height={800}
                unoptimized
                className="max-h-[85vh] w-auto h-auto object-contain"
                />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

