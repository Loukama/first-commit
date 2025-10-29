
import React, { useState, useRef, useEffect } from 'react';
import { startChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import { SendIcon, UserIcon, SparklesIcon as ModelIcon } from './icons';
import type { Chat } from '@google/genai';

const ChatConsultant: React.FC = () => {
  const chatRef = useRef<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: "Hello! I'm your AI Fashion Consultant. How can I help you style your look today?",
    },
  ]);
  const [userInput, setUserInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = startChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userInput.trim() || !chatRef.current) return;

    const userMessage: ChatMessage = { role: 'user', content: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
        const response = await chatRef.current.sendMessage({ message: userInput });
        const modelMessage: ChatMessage = { role: 'model', content: response.text };
        setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I'm having trouble connecting. Please try again later." };
        setMessages((prev) => [...prev, errorMessage]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-xl shadow-2xl flex flex-col" style={{height: '70vh'}}>
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && (
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-pink-500 flex items-center justify-center">
                <ModelIcon className="h-5 w-5 text-white" />
              </div>
            )}
            <div className={`max-w-md px-4 py-2 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-700 text-gray-200 rounded-bl-none'
            }`}>
              <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br />') }} />
            </div>
             {msg.role === 'user' && (
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-3">
                 <div className="flex-shrink-0 h-8 w-8 rounded-full bg-pink-500 flex items-center justify-center">
                    <ModelIcon className="h-5 w-5 text-white" />
                 </div>
                 <div className="max-w-md px-4 py-3 bg-gray-700 rounded-2xl rounded-bl-none">
                     <div className="flex items-center justify-center space-x-1">
                        <span className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="h-1.5 w-1.5 bg-gray-300 rounded-full animate-bounce"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
        <div className="relative">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask for fashion advice..."
            className="w-full bg-gray-700 border-2 border-gray-600 rounded-full py-3 pl-5 pr-14 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            <SendIcon className="h-5 w-5 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatConsultant;
