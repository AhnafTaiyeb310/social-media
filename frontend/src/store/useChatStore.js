import { create } from 'zustand';

export const useChatStore = create((set) => ({
  activeConversation: null,
  isChatOpen: false,
  
  openChat: (conversation) => set({ 
    activeConversation: conversation, 
    isChatOpen: true 
  }),
  
  closeChat: () => set({ 
    activeConversation: null, 
    isChatOpen: false 
  }),
}));
