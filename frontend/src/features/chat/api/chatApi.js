import api from '@/lib/axios';

export const getConversations = async () => {
  const res = await api.get('/chat/conversations/');
  return res.data;
};

export const getOrCreateConversation = async (userId) => {
  const res = await api.post('/chat/conversations/get_or_create/', { user_id: userId });
  return res.data;
};

export const getMessages = async (conversationId) => {
  const res = await api.get(`/chat/conversations/${conversationId}/messages/`);
  return res.data;
};
