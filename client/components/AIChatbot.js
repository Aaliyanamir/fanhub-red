'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, RefreshCw } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const INITIAL_MESSAGES = [
  {
    sender: 'bot',
    text: "Welcome to Fan Hub Plus Guide. Ask me about fandom categories, merchandise showcase, or upcoming conventions.",
  },
];

const SUGGESTIONS = [
  'Tell me about Anime Fandom',
  'How to find merchandise?',
  'Show upcoming conventions',
  'How to submit fan articles?',
];

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (customText = null) => {
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/features/chatbot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();
      const botReply = data.data?.reply || "I am here to guide you across all 8 fandom categories on Fan Hub Plus.";
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Offline guide active. Explore our Fandom Hub categories, Merchandise showcase, or Event Discovery pages.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-8 right-6 z-50 p-4 rounded-full bg-[#E50914] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-2 font-bold text-sm shadow-red-950/50 ring-4 ring-red-900/30"
        title="Fandom Assistant"
      >
        <Bot size={22} />
        <span className="hidden md:inline font-heading">Fandom Guide</span>
      </button>

      {/* Chat Window Popover */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-8 z-[260] w-[90vw] max-w-sm md:max-w-md h-[500px] rounded-3xl border border-gray-800 bg-gray-900 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#E50914] to-red-900 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold font-heading">Fandom AI Assistant</h3>
                <p className="text-[10px] text-white/80 flex items-center gap-1">
                  <Sparkles size={10} /> Live Guide Active
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-950">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-red-900/40 text-[#E50914] flex items-center justify-center text-xs font-bold shrink-0 mt-1 border border-red-800/40">
                    <Bot size={14} />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-[#E50914] text-white font-medium rounded-br-none'
                      : 'bg-gray-900 text-gray-100 border border-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <RefreshCw size={14} className="animate-spin text-[#E50914]" /> Processing...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Suggestions */}
          <div className="p-2.5 bg-gray-900 border-t border-gray-800 flex overflow-x-auto gap-1.5 scrollbar-hide">
            {SUGGESTIONS.map((sug) => (
              <button
                key={sug}
                onClick={() => handleSend(sug)}
                className="px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-[10px] font-semibold text-gray-300 hover:border-[#E50914] hover:text-white shrink-0 transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-gray-900 border-t border-gray-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 px-4 py-2.5 rounded-full bg-gray-950 border border-gray-800 text-xs text-white outline-none focus:ring-2 focus:ring-[#E50914]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-full bg-[#E50914] text-white disabled:opacity-50 shadow-md shadow-red-950/40 hover:scale-105 active:scale-95 transition-all"
            >
              <Send size={14} />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
