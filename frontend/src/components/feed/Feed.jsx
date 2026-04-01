'use client'
import React from 'react';
import CreatePost from './CreatePost';
import PostCard from './PostCard';

const MOCK_POSTS = [
  {
    id: 1,
    author: "Zustand Fan",
    handle: "state_king",
    content: "Transitioned Sync to the Sleek design system! The new aesthetic feels much more modern and lighter. Clean architecture really helps with these design shifts. #SyncNetwork #CleanCode",
    time: "2h",
    likes: 42,
    comments: 12,
    reposts: 5,
  },
  {
    id: 2,
    author: "Minimalist Designer",
    handle: "less_is_more",
    content: "Minimalism is not about what you remove, it's about what you keep. The intentional use of white space and subtle interactions creates a much better UX in Sync.",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&auto=format&fit=crop&q=60",
    time: "5h",
    likes: 128,
    comments: 24,
    reposts: 18,
  }
];

export default function Feed() {
  return (
    <div className="space-y-6">
      <div className="md:hidden mb-4">
        <div className="relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors text-sm">🔍</span>
          <input 
            type="text" 
            placeholder="Search Sync..." 
            className="w-full bg-white border border-gray-100 rounded-2xl pl-10 pr-4 py-3 font-medium text-sm shadow-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none"
          />
        </div>
      </div>
      
      <CreatePost />
      
      <div className="space-y-6 pb-12">
        {MOCK_POSTS.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
