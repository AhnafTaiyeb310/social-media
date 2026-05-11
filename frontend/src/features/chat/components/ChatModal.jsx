'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Send, Loader2 } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { useAuthStore } from '@/store/useAuthStore';
import { DEFAULT_AVATAR } from '@/lib/constants';

export default function ChatModal({ conversation, onClose }) {
  const { user } = useAuthStore();
  const [text, setText] = useState('');
  const { messages, isLoading, sendMessage, isConnected } = useChat(conversation?.id);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (text.trim()) {
      sendMessage(text);
      setText('');
    }
  };

  if (!conversation) return null;

  const otherParticipant = conversation.participants.length === 1 
    ? conversation.participants[0] 
    : conversation.participants.find(p => 
        p.username?.toLowerCase() !== user?.username?.toLowerCase() && 
        p.id != user?.id
      ) || conversation.participants[0];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-lg h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-neutral-800">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between bg-white dark:bg-neutral-900 sticky top-0 z-10">
          <div className="flex items-center gap-x-3">
            <div className="relative size-10 flex-shrink-0">
              <Image
                src={otherParticipant?.avatar || DEFAULT_AVATAR}
                alt={otherParticipant?.username}
                fill
                className="rounded-full object-cover"
              />
              {isConnected && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white dark:border-neutral-900 rounded-full"></span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 dark:text-neutral-200">
                {otherParticipant?.first_name} {otherParticipant?.last_name || otherParticipant?.username}
              </h3>
              <p className="text-xs text-gray-500">
                {isConnected ? 'Online' : 'Connecting...'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-gray-500"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-neutral-950/50">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="size-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {messages.map((msg, index) => {
                const isMe = 
                  msg.sender == user?.id || 
                  msg.sender_id == user?.id || 
                  msg.sender === user?.username ||
                  msg.sender_username === user?.username;
                return (
                  <div key={msg.id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-x-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className="relative size-8 flex-shrink-0 mt-auto">
                        <Image
                          src={(isMe ? user?.profile?.profile_picture_url : otherParticipant?.avatar) || DEFAULT_AVATAR}
                          alt="Avatar"
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div className={`p-3 rounded-2xl text-sm ${
                        isMe 
                          ? 'bg-blue-600 text-white rounded-br-none shadow-blue-500/20 shadow-lg' 
                          : 'bg-white dark:bg-neutral-800 text-gray-800 dark:text-neutral-200 border border-gray-200 dark:border-neutral-700 rounded-bl-none shadow-sm'
                      }`}>
                        {msg.text || msg.message}
                        <div className={`text-[10px] mt-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Footer / Input */}
        <div className="p-4 bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800">
          <form onSubmit={handleSend} className="flex gap-x-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-neutral-800 border-transparent rounded-full text-sm focus:bg-white dark:focus:bg-neutral-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all dark:text-neutral-200"
            />
            <button
              type="submit"
              disabled={!text.trim() || !isConnected}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all disabled:opacity-50 shadow-lg shadow-blue-500/30 active:scale-95"
            >
              <Send className="size-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
