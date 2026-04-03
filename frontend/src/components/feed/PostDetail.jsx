'use client';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import {
  LuBadgeCheck,
  LuBookmark,
  LuEllipsis,
  LuHeart,
  LuMessageCircle,
  LuSend,
  LuShare2,
  LuX,
} from 'react-icons/lu';
import { FaHeart, FaRegHeart } from 'react-icons/fa6';
import { useLikePost } from '@/features/post/hooks/usePost';
import { useCreateComment, useComments, useLikeComment } from '@/features/comment/hooks/useComment';
import { useAuthStore } from '@/store/useAuthStore';

// RECURSIVE COMMENT COMPONENT
function Comment({ comment, postId, defaultAvatar, onReply }) {
  const { mutate: toggleLike, isPending: isLiking } = useLikeComment(postId);
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="flex gap-x-4">
      <div className="relative size-9 mt-1 flex-shrink-0">
        <Image
          className="rounded-full object-cover"
          src={comment.author_profile?.profile_picture_url || defaultAvatar}
          alt="User"
          fill
        />
      </div>
      <div className="flex-1 space-y-2">
        <div className="bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-neutral-700 transition-all">
          <p className="text-sm font-bold dark:text-neutral-200">
            {comment.author_username}
          </p>
          <p className="text-sm text-gray-600 dark:text-neutral-400 mt-1 leading-relaxed">
            {comment.content}
          </p>
        </div>
        
        <div className="flex items-center gap-x-4 px-2">
          <button 
            onClick={() => toggleLike(comment.id)}
            disabled={isLiking}
            className={`flex items-center gap-x-1 text-xs font-medium transition-colors ${comment.is_liked ? 'text-red-600' : 'text-gray-500 hover:text-red-500'}`}
          >
            {comment.is_liked ? <FaHeart className="size-3" /> : <FaRegHeart className="size-3" />}
            <span>{comment.likes_count || 0}</span>
          </button>
          
          <button 
            onClick={() => onReply(comment)}
            className="text-xs font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            Reply
          </button>

          <span className="text-[10px] text-gray-400">
            {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* NESTED REPLIES */}
        {comment.replies?.length > 0 && (
          <div className="space-y-4 pt-2">
            {!showReplies ? (
              <button 
                onClick={() => setShowReplies(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-x-2 group"
              >
                <span className="w-8 h-px bg-blue-200 group-hover:bg-blue-400 transition-colors"></span>
                View {comment.replies.length} replies
              </button>
            ) : (
              <div className="pl-4 border-l-2 border-gray-100 dark:border-neutral-800 space-y-6">
                {comment.replies.map((reply) => (
                  <Comment 
                    key={reply.id} 
                    comment={reply} 
                    postId={postId} 
                    defaultAvatar={defaultAvatar}
                    onReply={onReply}
                  />
                ))}
                <button 
                  onClick={() => setShowReplies(false)}
                  className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-neutral-300 hover:underline"
                >
                  Hide replies
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// MAIN POST DETAIL COMPONENT
export default function PostDetail({ post, onClose }) {
  const { user } = useAuthStore();
  const { mutate: toggleLike, isPending: isLiking } = useLikePost();
  
  const [commentContent, setCommentContent] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  
  const { mutate: addComment, isPending: isCommenting } = useCreateComment(post?.id);
  const { data: commentsData, isLoading: isLoadingComments } = useComments(post?.id);

  const scrollContainerRef = useRef(null);
  const commentInputRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    const element = scrollContainerRef.current;
    if (element) {
      const totalHeight = element.scrollHeight - element.clientHeight;
      const currentScroll = element.scrollTop;
      const progress = (currentScroll / totalHeight) * 100;
      setScrollProgress(progress);
    }
  };

  const handleReplyClick = (targetComment) => {
    setReplyTo(targetComment);
    commentInputRef.current?.focus();
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    
    const payload = { content: commentContent };
    if (replyTo) payload.parent = replyTo.id;

    addComment(payload, {
      onSuccess: () => {
        setCommentContent('');
        setReplyTo(null);
      }
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && window.HSStaticMethods) {
      window.HSStaticMethods.autoInit();
    }
  }, [post]);

  if (!post) return null;

  const {
    id,
    author_profile,
    author,
    images,
    likes_count,
    comments_count,
    title,
    content,
    created_at,
    is_liked,
  } = post;

  const postImage = images?.[0]?.image_url;
  const defaultAvatar = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
  const displayComments = commentsData?.results || post.comments || [];

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl h-[95vh] bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 z-[120] bg-gray-100 dark:bg-neutral-800">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 transition-all duration-75 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-[110] p-2 rounded-full bg-white/10 hover:bg-white/20 dark:hover:bg-neutral-800 text-gray-500 dark:text-neutral-400 transition-colors"
        >
          <LuX className="size-6" />
        </button>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar scroll-smooth"
        >
          {/* Post Header */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-x-3">
              <div className="relative size-11">
                <Image
                  className="rounded-full object-cover"
                  src={author_profile?.profile_picture_url || defaultAvatar}
                  alt="Avatar"
                  fill
                />
              </div>
              <div>
                <div className="flex items-center gap-x-1.5">
                  <span className="text-sm font-bold text-gray-800 dark:text-neutral-200">
                    {author_profile?.first_name} {author_profile?.last_name}
                  </span>
                  <LuBadgeCheck className="size-3.5 text-blue-500" />
                </div>
                <p className="text-xs text-gray-500">
                  @{author} · {new Date(created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </p>
              </div>
            </div>
          </div>

          {/* Post Body */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-neutral-100">
              {title}
            </h2>

            {postImage && (
              <div className="rounded-2xl overflow-hidden aspect-video border border-gray-100 dark:border-neutral-800 relative">
                <Image src={postImage} alt="Post" className="object-cover" fill />
              </div>
            )}

            <p className="text-lg text-gray-800 dark:text-neutral-300 leading-relaxed max-w-4xl whitespace-pre-wrap">
              {content}
            </p>
          </div>

          {/* Post Stats & Actions */}
          <div className="flex items-center justify-between py-6 border-y border-gray-100 dark:border-neutral-800">
            <div className="flex gap-x-6">
              <button
                onClick={() => toggleLike(id)}
                disabled={isLiking}
                className={`flex items-center gap-x-2 transition-colors ${is_liked ? 'text-red-600' : 'text-gray-500 hover:text-red-500'}`}
              >
                {is_liked ? <FaHeart className="size-5" /> : <FaRegHeart className="size-5" />}
                <span className="font-medium">{likes_count}</span>
              </button>
              <button className="flex items-center gap-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                <LuMessageCircle className="size-5" /> 
                <span className="font-medium">{comments_count}</span>
              </button>
            </div>
            <button className="text-gray-500 hover:text-gray-700 dark:hover:text-neutral-300 transition-colors">
              <LuShare2 className="size-5" />
            </button>
          </div>

          {/* Discussion Section */}
          <div className="pb-10 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold dark:text-white">Discussion</h3>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                {displayComments.length} Comments
              </span>
            </div>

            {/* Comment/Reply Input Form */}
            <div className="space-y-3 bg-gray-50/50 dark:bg-neutral-800/30 p-4 rounded-3xl border border-gray-100 dark:border-neutral-800">
              {replyTo && (
                <div className="flex items-center justify-between bg-blue-100/50 dark:bg-blue-900/20 px-4 py-2 rounded-xl text-xs text-blue-700 dark:text-blue-400 font-medium">
                  <span>Replying to <span className="font-bold">@{replyTo.author_username}</span></span>
                  <button onClick={() => setReplyTo(null)} className="p-1 hover:bg-white/50 dark:hover:bg-black/20 rounded-full transition-colors">
                    <LuX className="size-3"/>
                  </button>
                </div>
              )}
              <form onSubmit={handleCommentSubmit} className="flex gap-x-4">
                <div className="relative size-10 flex-shrink-0">
                  <Image
                    className="rounded-full object-cover ring-2 ring-white dark:ring-neutral-900"
                    src={user?.profile?.profile_picture_url || defaultAvatar}
                    alt="My Avatar"
                    fill
                  />
                </div>
                <div className="flex-1 relative">
                  <input
                    ref={commentInputRef}
                    type="text"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder={replyTo ? "Write a reply..." : "Add to the discussion..."}
                    className="w-full py-3 px-5 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 rounded-full text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all dark:text-neutral-200 shadow-sm"
                  />
                  <button
                    type="submit"
                    disabled={isCommenting || !commentContent.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white bg-blue-600 hover:bg-blue-700 rounded-full disabled:opacity-50 disabled:bg-gray-300 dark:disabled:bg-neutral-700 shadow-sm transition-all"
                  >
                    <LuSend className="size-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Comments List */}
            <div className="space-y-8">
              {displayComments.length > 0 ? (
                displayComments.map((comment) => (
                  <Comment 
                    key={comment.id} 
                    comment={comment} 
                    postId={id} 
                    defaultAvatar={defaultAvatar} 
                    onReply={handleReplyClick}
                  />
                ))
              ) : (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center size-16 bg-gray-50 dark:bg-neutral-800 rounded-full mb-4">
                    <LuMessageCircle className="size-8 text-gray-300" />
                  </div>
                  <p className="text-gray-500 dark:text-neutral-500 text-sm italic">
                    No comments yet. Be the first to start the conversation!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
