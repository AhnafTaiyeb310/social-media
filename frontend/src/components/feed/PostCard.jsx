'use client'
import React from 'react';
import Image from 'next/image';
import { SleekCard } from '../ui/SleekElements';

export default function PostCard({ post }) {
  return (
    <SleekCard className="p-6 border-none shadow-sleek hover:shadow-sleek-md transition-all group relative overflow-hidden mb-6">
      {post.likes > 100 && (
        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/40"></div>
      )}
      
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary font-black shrink-0 border border-secondary/10 group-hover:scale-105 transition-transform">
          {post.author[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3">
            <div className="min-w-0">
              <span className="font-bold text-gray-900 mr-2 hover:text-primary cursor-pointer transition-colors leading-none truncate block sm:inline">
                {post.author}
              </span>
              <span className="text-gray-400 font-medium text-xs">
                @{post.handle} · {post.time}
              </span>
            </div>
            <button className="text-gray-300 hover:text-gray-900 p-2 rounded-xl hover:bg-gray-50 transition-all">···</button>
          </div>
          
          <p className="text-gray-600 text-[17px] leading-relaxed mb-5 whitespace-pre-wrap font-medium">
            {post.content}
          </p>

          {post.image && (
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-gray-100 shadow-sm mb-5 group-hover:shadow-md transition-shadow">
              <Image 
                src={post.image} 
                alt="Sync post content" 
                fill 
                className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                unoptimized
              />
            </div>
          )}

          <div className="flex items-center justify-between max-w-md pt-2">
            <button className="flex items-center gap-2.5 text-gray-400 font-bold hover:text-primary hover:bg-primary/5 px-3 py-2 rounded-xl transition-all text-xs group/btn">
              <span className="text-lg group-hover/btn:scale-110 transition-transform">💬</span>
              <span>{post.comments}</span>
            </button>
            <button className="flex items-center gap-2.5 text-gray-400 font-bold hover:text-secondary hover:bg-secondary/5 px-3 py-2 rounded-xl transition-all text-xs group/btn">
              <span className="text-lg group-hover/btn:scale-110 transition-transform">🔄</span>
              <span>{post.reposts}</span>
            </button>
            <button className="flex items-center gap-2.5 text-gray-400 font-bold hover:text-danger hover:bg-danger/5 px-3 py-2 rounded-xl transition-all text-xs group/btn">
              <span className="text-lg group-hover/btn:scale-110 transition-transform">❤️</span>
              <span>{post.likes}</span>
            </button>
            <button className="p-2 text-gray-300 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-all">
              📤
            </button>
          </div>
        </div>
      </div>
    </SleekCard>
  );
}
