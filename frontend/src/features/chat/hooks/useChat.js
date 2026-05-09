import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMessages } from '../api/chatApi';

export const useChat = (conversationId) => {
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const { data: messageData, isLoading } = useQuery({
    queryKey: ['chat', conversationId, 'messages'],
    queryFn: () => getMessages(conversationId),
    enabled: !!conversationId,
  });

  const messages = messageData?.results || messageData || [];

  useEffect(() => {
    if (!conversationId) return;

    // In a real app, use environment variables for the WS host
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.NEXT_PUBLIC_WS_URL || (process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('http', 'ws') : 'ws://localhost:8000');
    const wsUrl = `${host}/ws/chat/${conversationId}/`;
    console.log('Connecting to WebSocket:', wsUrl);
    
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Chat WebSocket connected successfully');
      setIsConnected(true);
    };

    ws.onerror = (error) => {
      console.error('Chat WebSocket error occurred:', error);
    };

    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      
      // Update messages cache
      queryClient.setQueryData(['chat', conversationId, 'messages'], (old) => {
        if (!old) return { results: [newMessage] };
        
        // Handle both paginated and non-paginated structures
        if (Array.isArray(old)) {
          return [...old, newMessage];
        }
        
        return {
          ...old,
          results: [...(old.results || []), newMessage],
        };
      });
    };

    ws.onclose = () => {
      console.log('Chat WebSocket disconnected');
      setIsConnected(false);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [conversationId, queryClient]);

  const sendMessage = (text) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ message: text }));
    } else {
      console.error('WebSocket is not connected');
    }
  };

  return { messages, isLoading, sendMessage, isConnected };
};
