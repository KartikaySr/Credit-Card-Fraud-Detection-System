'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Cpu, MessageSquare } from 'lucide-react';

export default function CopilotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: "Hello. I am the Nexus AI Copilot. I monitor your ML pipelines and can analyze specific transactions. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/copilot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.body) throw new Error('No readable stream');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        
        buffer = events.pop() || '';
        
        for (const event of events) {
          if (event.startsWith('data: ')) {
            const dataStr = event.substring(6);
            if (dataStr === '[DONE]') {
              setIsTyping(false);
              break;
            }
            try {
              const data = JSON.parse(dataStr);
              setMessages(prev => {
                const newMessages = [...prev];
                const lastIdx = newMessages.length - 1;
                newMessages[lastIdx].content += data.chunk;
                return newMessages;
              });
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Neural link severed. Unable to contact the Co-processor.' }]);
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-50 p-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_rgba(147,51,234,0.7)] hover:scale-105 transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <div className="relative">
          <Sparkles className="text-white w-6 h-6 animate-pulse" />
          <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
        </div>
      </button>

      {/* Copilot Interface */}
      <div className={`fixed bottom-8 right-8 z-50 w-96 h-[600px] flex flex-col bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-500 origin-bottom-right tutorial-copilot ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)] relative">
              <Cpu className="text-white w-4 h-4" />
              {isTyping && <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>}
            </div>
            <div>
              <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">Nexus Copilot</h3>
              <p className="text-xs text-indigo-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                Astra-Core Active
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-sm'
                : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
              }`}>
                {msg.role === 'assistant' && <Sparkles className="w-3 h-3 text-indigo-400 inline-block mr-2 mb-1" />}
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
          <button onClick={() => setInput("Show me recent anomalies")} className="shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap">
            Recent anomalies
          </button>
          <button onClick={() => setInput("Explain the last flagged transaction")} className="shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap">
            Explain transaction
          </button>
          <button onClick={() => setInput("System health status")} className="shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors whitespace-nowrap">
            System health
          </button>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-black/40 rounded-b-2xl">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <MessageSquare className="absolute left-3 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Nexus anything..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              <Send className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
