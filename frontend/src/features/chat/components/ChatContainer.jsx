'use client';
import { useChatStore } from '@/store/useChatStore';
import ChatModal from './ChatModal';

export default function ChatContainer() {
  const { isChatOpen, activeConversation, closeChat } = useChatStore();

  if (!isChatOpen) return null;

  return (
    <ChatModal 
      conversation={activeConversation} 
      onClose={closeChat} 
    />
  );
}
