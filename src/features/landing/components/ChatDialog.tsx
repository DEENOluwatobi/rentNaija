'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageSquare, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {baseURL} from "@/../next.config";
import {ChatDialogProps, Message, RootState} from "@/types/chats";


const ChatDialog: React.FC<ChatDialogProps> = ({ agentId, agentName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [initialFetchDone, setInitialFetchDone] = useState<boolean>(false);
  const { isLoggedIn, token, userId } = useSelector((state: RootState) => state.user);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollInterval = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
    };
  }, []);

  const startConversation = async (): Promise<number | null> => {
    if (!isLoggedIn || !token || typeof userId === 'undefined') {
      return null;
    }

    try {
      const payload = {
        from_id: userId,
        to_id: agentId,
        message: newMessage.trim() || "Hello, I'm interested in this property",
      };

      const response = await fetch(baseURL+'/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to start conversation');
      }

      const data = await response.json();
      setConversationId(data.id);
      return data.id;
    } catch (error) {
      //console.error('Error starting conversation:', error);
      return null;
    }
  };

  const fetchMessages = async (isInitialFetch: boolean = false): Promise<void> => {
    if (!token || !agentId) return;

    try {
      if (isInitialFetch) {
        setInitialFetchDone(false);
      }

      const url = conversationId 
        ? baseURL+`/conversation/${conversationId}`
        : baseURL+`/conversation/${agentId}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setMessages(data.data);
        } else if (Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      }
    } catch (error) {
      //console.error('Error fetching messages:', error);
    } finally {
      if (isInitialFetch) {
        setInitialFetchDone(true);
      }
    }
  };

  const handleSendMessage = async (): Promise<void> => {
    if (!newMessage.trim() || !isLoggedIn || !token || typeof userId === 'undefined') {
      return;
    }

    setIsLoading(true);
    try {
      let currentConversationId = conversationId;
      if (!currentConversationId) {
        currentConversationId = await startConversation();
        if (!currentConversationId) {
          throw new Error('Failed to create conversation');
        }
        setConversationId(currentConversationId);
      }

      const messagePayload = {
        from_id: userId,
        to_id: agentId,
        message: newMessage.trim(),
      };

      const response = await fetch(baseURL+`/conversation/${currentConversationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(messagePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }

      setNewMessage('');
      await fetchMessages();
    } catch (error) {
      //console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogOpen = (open: boolean): void => {
    if (open && isLoggedIn) {
      fetchMessages(true);
      pollInterval.current = setInterval(() => fetchMessages(false), 5000);
    } else {
      if (pollInterval.current) {
        clearInterval(pollInterval.current);
      }
      setInitialFetchDone(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatMessageDate = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-2">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      <p className="text-gray-500">Loading messages...</p>
    </div>
  );

  return (
    <Dialog onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <MessageSquare className="w-4 h-4 mr-2" />
          Chat with Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chat with {agentName}</DialogTitle>
        </DialogHeader>
        
        {!isLoggedIn ? (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              Please log in to chat with the agent.
            </p>
            <Button 
              onClick={() => router.push('/login')}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Go to Login
            </Button>
          </div>
        ) : (
          <>
            <div className="h-[292px] overflow-y-auto p-4 space-y-4 border rounded-lg">
              {!initialFetchDone ? (
                <LoadingSpinner />
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.from_id === userId?.toString() ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg text-base ${
                          message.from_id === userId?.toString()
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div>{message.message}</div>
                        <div className="text-xs mt-1 opacity-70">
                          {formatMessageDate(message.created_at)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyPress={handleKeyPress}
                className="flex-1 bg-white text-black"
                disabled={!initialFetchDone}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !newMessage.trim() || !initialFetchDone}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;