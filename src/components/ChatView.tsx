import React, { useState, useEffect } from 'react';
import { Match, Message } from '../types';
import { ArrowLeft, Send, Star, Info } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { supabase } from '../utils/supabase-client';
import * as api from '../utils/api';

interface ChatViewProps {
  match: Match;
  onBack: () => void;
  onViewProfile: () => void;
}

export function ChatView({ match, onBack, onViewProfile }: ChatViewProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    loadMessages();
  }, [match.chatId]);

  async function loadMessages() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        setAccessToken(session.access_token);
        
        const { data: { user } } = await supabase.auth.getUser(session.access_token);
        setCurrentUserId(user?.id || null);
        
        const messagesData = await api.getMessages(session.access_token, match.chatId);
        const formattedMessages = messagesData.map((m: any) => ({
          id: m.id,
          senderId: m.senderId,
          text: m.text,
          timestamp: new Date(m.timestamp),
          read: m.read
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  }

  const handleSend = async () => {
    if (message.trim() && accessToken) {
      try {
        const sentMessage = await api.sendMessage(accessToken, match.chatId, message);
        const newMessage: Message = {
          id: sentMessage.id,
          senderId: sentMessage.senderId,
          text: sentMessage.text,
          timestamp: new Date(sentMessage.timestamp),
          read: sentMessage.read
        };
        setMessages([...messages, newMessage]);
        setMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const compatibilityPercentage = Math.round((match.compatibility.total / match.compatibility.maxPoints) * 100);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <ImageWithFallback 
          src={match.user.photos[0]} 
          alt={match.user.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        
        <div className="flex-1 min-w-0">
          <div>{match.user.name}</div>
          <div className="text-gray-600 flex items-center gap-1">
            <Star className="w-3 h-3" />
            <span>{compatibilityPercentage}% Match</span>
          </div>
        </div>
        
        <button onClick={onViewProfile} className="p-2 hover:bg-gray-100 rounded-lg">
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Compatibility banner */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <Star className="w-4 h-4 fill-current" />
          <span>Excellent Kundali Match • {match.compatibility.total}/{match.compatibility.maxPoints} Gun Milan</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>Start the conversation!</p>
            <p className="mt-2">You have a {Math.round((match.compatibility.total / match.compatibility.maxPoints) * 100)}% Kundali match 🌟</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  msg.senderId === currentUserId 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-none' 
                    : 'bg-white shadow-sm rounded-bl-none'
                }`}
              >
                <p>{msg.text}</p>
                <div className={`mt-1 ${msg.senderId === currentUserId ? 'text-white/70' : 'text-gray-500'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="flex gap-2">
          <input 
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-pink-500"
          />
          <button 
            onClick={handleSend}
            className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full flex items-center justify-center hover:shadow-lg transition-shadow"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
