'use client'
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import {baseURL} from "@/../next.config";

interface Conversation {
    id: number;
    from_id: string;
    to_id: string;
    message: string;
    created_at: string;
    from: User;
    to: User;
}

interface User {
    id: number;
    name: string;
    email: string;
    account_id: string;
}

interface Message {
    id: number;
    from_id: string;
    to_id: string;
    message: string;
    created_at: string;
}

const Messages: React.FC = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    
    // Get current user details from Redux store
    const { token, userId } = useSelector((state: any) => ({
        token: state.agent.token,
        userId: state.agent.userId
    }));

    // Configure axios with authentication
    const api = axios.create({
        baseURL: baseURL,
        headers: { Authorization: `Bearer ${token}` }
    });

    // Fetch all conversations
    const fetchConversations = async () => {
        try {
            const response = await api.get('/conversations');
            setConversations(response.data.data);
        } catch (error) {
            //console.error('Error fetching conversations:', error);
        }
    };

    // Fetch messages for a specific conversation
    const fetchMessages = async (userId: number) => {
        try {
            const response = await api.get(`/conversation/${userId}`);
            setMessages(response.data.data);
            setSelectedUser(userId);
        } catch (error) {
            //console.error('Error fetching messages:', error);
        }
    };

    // Agent sending new message to recipients
    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser || !newMessage.trim()) return;

        try {
            await api.post(`/conversation`, {
                from_id: userId,
                message: newMessage,
                to_id: selectedUser
            });

            fetchMessages(selectedUser);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchConversations();
        }
    }, [token]);

    return (
        <div className="w-full flex h-[calc(100vh-75px)]">

            {/* --- WEB VERSION --- */}
            <div className='hidden md:flex w-full h-full'>
                {/* Conversations Sidebar */}
                <div className="w-1/3 border-r p-4 overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4">Messages</h2>
                    {conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
                                selectedUser === (parseInt(conversation.from_id) === userId 
                                    ? parseInt(conversation.to_id) 
                                    : parseInt(conversation.from_id)) 
                                ? 'bg-gray-100' 
                                : ''
                            }`}
                            onClick={() => fetchMessages(parseInt(conversation.from_id) === userId 
                                ? parseInt(conversation.to_id) 
                                : parseInt(conversation.from_id))}
                        >
                            <div className="font-semibold">
                                {parseInt(conversation.from_id) === userId 
                                    ? conversation.to.name 
                                    : conversation.from.name}
                            </div>
                            <div className="text-sm text-gray-600">{conversation.message}</div>
                            <div className="text-xs text-gray-400">
                                {new Date(conversation.created_at).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Messages Area */}
                <div className="w-full flex-1 flex flex-col">
                    {selectedUser ? (
                        <>
                            <div className="flex-1 p-4 overflow-y-auto">
                                {messages.map((message:any,index:number) => (
                                    <div
                                        key={index}
                                        className={`mb-4 ${
                                            parseInt(message.from_id) === userId 
                                                ? 'text-right' 
                                                : 'text-left'
                                        }`}
                                    >
                                        <div
                                            className={`inline-block p-3 rounded-lg ${
                                                parseInt(message.from_id) === userId
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200'
                                            }`}
                                        >
                                            {message.message}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {new Date(message.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Message Input */}
                            <form onSubmit={sendMessage} className="p-4 border-t">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-1 p-2 border rounded bg-white text-black"
                                        placeholder="Type your message..."
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                                        disabled={!newMessage.trim()}
                                    >
                                        Send
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Select a conversation to start messaging
                        </div>
                    )}
                </div>
            </div>


            {/* --- MOBILE VERSION --- */}
            <Dialog>
                <div className='flex md:hidden w-full h-full'>
                    {/* Conversations Sidebar */}
                    <div className="w-full p-4 overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Messages</h2>
                        {conversations.map((conversation) => (
                            <DialogTrigger
                                key={conversation.id}
                                className={`w-full text-left p-4 border-b cursor-pointer hover:bg-gray-100 ${
                                    selectedUser === (parseInt(conversation.from_id) === userId 
                                        ? parseInt(conversation.to_id) 
                                        : parseInt(conversation.from_id)) 
                                    ? 'bg-gray-100' 
                                    : ''
                                }`}
                                onClick={() => fetchMessages(parseInt(conversation.from_id) === userId 
                                    ? parseInt(conversation.to_id) 
                                    : parseInt(conversation.from_id))}
                            >
                                <div className="font-semibold capitalize">
                                    {parseInt(conversation.from_id) === userId 
                                        ? conversation.to.name 
                                        : conversation.from.name}
                                </div>
                                <div className="text-sm text-gray-600">{conversation.message}</div>
                                <div className="text-xs text-gray-400">
                                    {new Date(conversation.created_at).toLocaleString()}
                                </div>
                            </DialogTrigger>
                        ))}
                    </div>

                    {/* Messages Area */}
                    <DialogContent className="w-full h-[500px] flex flex-col p-1">
                        {selectedUser && (
                            <>
                                <div className="w-full h-full p-2 overflow-y-auto">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`mb-4 ${
                                                parseInt(message.from_id) === userId 
                                                    ? 'text-right' 
                                                    : 'text-left'
                                            }`}
                                        >
                                            <div
                                                className={`inline-block p-3 rounded-lg ${
                                                    parseInt(message.from_id) === userId
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-200'
                                                }`}
                                            >
                                                {message.message}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                {new Date(message.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Message Input */}
                                <form onSubmit={sendMessage} className="w-full py-2 border-t">
                                    <div className="w-full flex gap-2">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            className="flex-1 p-2 border rounded text-sm bg-white text-black"
                                            placeholder="Type your message..."
                                        />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm"
                                            disabled={!newMessage.trim()}
                                        >
                                            Send
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </DialogContent>
                </div>
            </Dialog>
        </div>
    );
};

export default Messages;