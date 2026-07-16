import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, MessageSquare, Loader2, ArrowRight } from 'lucide-react';
import { ChatMessage } from '../types';

export default function LiveChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I am your One Call AI Assistant, powered by Groq Llama 3.1. How can I help you manage your home today? You can ask me about custom quotes, any of our 28 core service categories, or 24/7 emergencies!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    if (!textToSend) setInputValue('');

    const newUserMessage: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Proxy call to server-side `/api/chat` route (which calls Groq API securely)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, newUserMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from chat assistant');
      }

      const data = await response.json();
      const assistantText = data.choices[0]?.message?.content || "I am currently unable to provide a response. Please try again shortly!";

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: assistantText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Oops! I ran into an issue connecting to the secure Groq backend. Please double check that the server is active, or try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetQuery = (query: string) => {
    handleSendMessage(query);
  };

  const presetQueries = [
    "What is included in Deep House Cleaning?",
    "Do you offer 24/7 Emergency Plumbing?",
    "How does the Platinum AMC work?",
    "Can you estimate the price of a 2BHK wall painting?"
  ];

  return (
    <>
      {/* Mini Toggle Floating Button (Bottom Right) */}
      {!isOpen && (
        <button
          id="chat-toggle-btn"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-900 hover:bg-blue-800 text-white rounded-full p-4 shadow-2xl transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer border border-blue-700"
        >
          <MessageSquare className="w-6 h-6 text-amber-400 animate-pulse" />
          <span className="text-sm font-semibold pr-1 font-display">24/7 AI Chatbot</span>
        </button>
      )}

      {/* Main Chat Overlay Window */}
      {isOpen && (
        <div id="ai-chat-window" className="fixed bottom-6 right-6 z-50 w-full max-w-md h-[550px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden font-sans backdrop-blur-lg">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-950 to-slate-900 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                <Bot className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold font-display text-white">One Call AI Assistant</h4>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-[10px] text-slate-400 font-mono">GROQ LLaMA-3.1 ACTIVE</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors text-xl font-bold cursor-pointer"
            >
              &times;
            </button>
          </div>

          {/* Messages log */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/40">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  m.role === 'user' 
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`rounded-2xl p-3 shadow-sm text-sm ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-800 text-slate-100 rounded-tl-none'
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  <span className={`block text-[9px] mt-1.5 text-right ${m.role === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 animate-bounce" />
                </div>
                <div className="bg-slate-800 text-slate-300 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                  <span className="text-xs font-mono">Thinking via Groq...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Preset trigger prompts */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Quick Prompts:</span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {presetQueries.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handlePresetQuery(q)}
                    className="text-xs bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg text-left transition-all cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message input */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything about home care..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
              className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-slate-500"
            />
            <button
              id="send-chat-btn"
              onClick={() => handleSendMessage()}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold p-2.5 rounded-xl transition-colors cursor-pointer shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </>
  );
}
