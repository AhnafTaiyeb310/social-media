"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Heart, 
  MessageSquare, 
  MoreHorizontal,
  Send,
  X,
  Edit2,
  Trash2,
  CornerDownRight
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { 
    useComments, 
    useCreateComment, 
    useUpdateComment, 
    useDeleteComment, 
    useLikeComment 
} from "../hooks/useComments";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

function CommentItem({ comment, postId, isReply = false }) {
  const { user: currentUser } = useAuthStore();
  const [isReplying, setIsReplyMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [editContent, setEditContent] = useState(comment.content);

  const createMutation = useCreateComment(postId);
  const updateMutation = useUpdateComment(postId);
  const deleteMutation = useDeleteComment(postId);
  const likeMutation = useLikeComment(postId);

  const isOwner = currentUser?.username === comment.author_username;
  const author = comment.author_profile || { username: comment.author_username };
  const createdAt = comment.created_at ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true }) : "just now";

  const handleLike = () => likeMutation.mutate(comment.id);
  
  const handleReply = () => {
    if (!replyContent.trim()) return;
    createMutation.mutate({ content: replyContent, parent: comment.id }, {
        onSuccess: () => {
            setReplyContent("");
            setIsReplyMode(false);
        }
    });
  };

  const handleUpdate = () => {
    if (!editContent.trim()) return;
    updateMutation.mutate({ commentId: comment.id, data: { content: editContent } }, {
        onSuccess: () => setIsEditing(false)
    });
  };

  const handleDelete = () => {
    if (window.confirm("Delete this comment?")) {
        deleteMutation.mutate(comment.id);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", isReply ? "ml-10 mt-2" : "mt-4")}>
      <div className="flex gap-3">
        <Link href={`/profile/${author.username}`}>
            <Avatar className={cn("ring-2 ring-blue-500/5 cursor-pointer transition-transform hover:scale-105", isReply ? "h-7 w-7" : "h-9 w-9")}>
            <AvatarImage src={author.profile_picture_url} />
            <AvatarFallback className="bg-zinc-100 text-[10px] font-bold">
                {author.username?.[0]?.toUpperCase()}
            </AvatarFallback>
            </Avatar>
        </Link>
        
        <div className="flex-1">
          <div className="group relative inline-block max-w-full">
            <div className="rounded-2xl bg-zinc-100 dark:bg-zinc-800 px-4 py-2">
              <div className="flex items-center gap-2">
                <Link href={`/profile/${author.username}`} className="text-xs font-bold text-zinc-900 dark:text-white hover:text-blue-600 transition-colors">
                  {author.username}
                </Link>
                {comment.author_profile?.is_verified && (
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                )}
              </div>
              
              {isEditing ? (
                <div className="mt-2 flex flex-col gap-2">
                    <textarea 
                        className="w-full bg-white dark:bg-zinc-900 rounded-lg p-2 text-sm outline-none border border-zinc-200 dark:border-zinc-700 min-h-[60px]"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="h-7 text-[10px]">Cancel</Button>
                        <Button size="sm" onClick={handleUpdate} className="h-7 text-[10px] bg-blue-600">Save</Button>
                    </div>
                </div>
              ) : (
                <p className="text-sm text-zinc-700 dark:text-zinc-300 break-words">
                  {comment.content}
                </p>
              )}
            </div>

            {isOwner && !isEditing && (
              <div className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-zinc-400">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit2 className="h-3 w-3 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                      <Trash2 className="h-3 w-3 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          <div className="mt-1 flex items-center gap-4 px-2 text-[10px] font-bold text-zinc-500">
            <button 
                onClick={handleLike}
                className={cn("hover:text-blue-600 transition-colors", comment.is_liked && "text-blue-600")}
            >
              Like{comment.likes_count > 0 && ` (${comment.likes_count})`}
            </button>
            <button 
                onClick={() => setIsReplyMode(!isReplying)}
                className="hover:text-blue-600 transition-colors"
            >
              Reply
            </button>
            <span className="font-normal">{createdAt}</span>
          </div>

          {isReplying && (
            <div className="mt-2 flex gap-2 animate-in fade-in slide-in-from-left-2">
                <CornerDownRight className="h-4 w-4 text-zinc-300 mt-2" />
                <div className="flex-1 flex gap-2">
                    <input 
                        placeholder={`Reply to ${author.username}...`}
                        className="flex-1 bg-zinc-100 dark:bg-zinc-800 rounded-full px-4 py-1.5 text-xs outline-none"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleReply()}
                    />
                    <Button 
                        size="icon" 
                        onClick={handleReply}
                        disabled={!replyContent.trim() || createMutation.isPending}
                        className="h-8 w-8 rounded-full bg-blue-600"
                    >
                        <Send className="h-3 w-3 text-white" />
                    </Button>
                </div>
            </div>
          )}
        </div>
      </div>

      {/* Recursive Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} postId={postId} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentSection({ postId }) {
  const { user: currentUser } = useAuthStore();
  const [content, setContent] = useState("");
  const { data, isLoading } = useComments(postId);
  const createMutation = useCreateComment(postId);

  // Handle both paginated and non-paginated responses
  const comments = Array.isArray(data) ? data : (data?.results || []);
  const commentCount = Array.isArray(data) ? data.length : (data?.count || 0);

  const handleSubmit = () => {
    if (!content.trim()) return;
    createMutation.mutate({ content }, {
        onSuccess: () => setContent("")
    });
  };

  if (!postId) return null;

  return (
    <div className="mt-6 border-t border-zinc-100 dark:border-zinc-800 pt-6">
      <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        Comments {commentCount > 0 && `(${commentCount})`}
      </h4>

      {/* Comment Input */}
      {currentUser && (
        <div className="flex gap-3 mb-8">
          <Avatar className="h-9 w-9">
            <AvatarImage src={currentUser.profile_picture_url} />
            <AvatarFallback className="bg-blue-600 text-white font-bold text-xs">
              {currentUser.username?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex gap-2">
            <textarea
              placeholder="Write a comment..."
              className="flex-1 resize-none bg-zinc-100 dark:bg-zinc-800 rounded-2xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[40px] max-h-[120px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                }
              }}
            />
            <Button 
                size="icon" 
                onClick={handleSubmit}
                disabled={!content.trim() || createMutation.isPending}
                className="h-10 w-10 self-end rounded-full bg-blue-600 shadow-md shadow-blue-500/20"
            >
              {createMutation.isPending ? (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Send className="h-4 w-4 text-white" />
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Comment List */}
      <div className="space-y-1">
        {isLoading ? (
          <div className="py-10 text-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600 mx-auto" />
          </div>
        ) : comments?.length > 0 ? (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} postId={postId} />
          ))
        ) : (
          <div className="py-10 text-center text-zinc-500 text-sm italic">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  );
}
