'use client';
import { useQuery } from '@tanstack/react-query';
import { getConversations } from '../api/chatApi';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import { LuMessageSquare } from 'react-icons/lu';
import Image from 'next/image';
import { DEFAULT_AVATAR } from '@/lib/constants';

export default function MessagesDropdown() {
  const { user: currentUser } = useAuthStore();
  const { openChat } = useChatStore();
  
  const { data: conversationsData, isLoading } = useQuery({
    queryKey: ['chat', 'conversations'],
    queryFn: getConversations,
    enabled: !!currentUser,
    refetchInterval: 30000, // Refetch every 30s
  });

  const conversations = conversationsData?.results || conversationsData || [];

  return (
    <div className="hs-dropdown [--placement:bottom-right] relative inline-flex">
      <button
        id="hs-dropdown-messages"
        type="button"
        className="size-9.5 relative inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-foreground hover:bg-muted-hover focus:outline-hidden focus:bg-muted-focus"
        aria-haspopup="menu"
        aria-expanded="false"
        aria-label="Messages"
      >
        <LuMessageSquare className="shrink-0 size-4" />
        {conversations.some(c => c.unread_count > 0) && (
          <span className="absolute top-0 right-0 size-2 bg-red-500 rounded-full border-2 border-white dark:border-neutral-900"></span>
        )}
      </button>

      <div
        className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-80 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-xl rounded-2xl mt-2 overflow-hidden z-50"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="hs-dropdown-messages"
      >
        <div className="px-4 py-3 border-b border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800/50">
          <h3 className="text-sm font-bold text-gray-800 dark:text-neutral-200">Messages</h3>
        </div>
        
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="p-4 text-center text-xs text-gray-500">Loading conversations...</div>
          ) : conversations.length > 0 ? (
            conversations.map((conv) => {
              const otherUser = conv.participants.find(p => p.id !== currentUser?.id);
              const lastMsg = conv.last_message;
              
              return (
                <button
                  key={conv.id}
                  onClick={() => openChat(conv)}
                  className="w-full flex items-center gap-x-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-left border-b border-gray-50 dark:border-neutral-800 last:border-0"
                >
                  <div className="relative size-10 flex-shrink-0">
                    <Image
                      src={otherUser?.avatar || DEFAULT_AVATAR}
                      alt={otherUser?.username}
                      fill
                      className="rounded-full object-cover"
                    />
                    {conv.unread_count > 0 && (
                      <span className="absolute -top-1 -right-1 size-3 bg-blue-600 rounded-full border-2 border-white dark:border-neutral-900"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="text-sm font-bold text-gray-800 dark:text-neutral-200 truncate">
                        {otherUser?.first_name} {otherUser?.last_name || otherUser?.username}
                      </span>
                      {lastMsg && (
                        <span className="text-[10px] text-gray-400">
                          {new Date(lastMsg.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs truncate ${conv.unread_count > 0 ? 'text-blue-600 font-semibold dark:text-blue-400' : 'text-gray-500'}`}>
                      {lastMsg ? lastMsg.text : 'No messages yet'}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-10 text-center">
              <LuMessageSquare className="size-10 text-gray-200 dark:text-neutral-700 mx-auto mb-2" />
              <p className="text-xs text-gray-500">No conversations yet</p>
            </div>
          )}
        </div>
        
        <div className="px-4 py-2 border-t border-gray-100 dark:border-neutral-800 text-center">
          <button className="text-xs font-bold text-blue-600 hover:text-blue-700">View all messages</button>
        </div>
      </div>
    </div>
  );
}
