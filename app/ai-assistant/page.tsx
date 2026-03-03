"use client";

import React, { useState } from 'react';
import { Send, Bot, User, ArrowRight, Sparkles } from 'lucide-react';

export default function AIAssistant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([
    {
      role: 'assistant',
      text: 'مرحباً بك في عسير فالي. كيف يمكنني مساعدتك اليوم؟'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text?: string) => {
    const message = text || input;
    if (!message.trim() || loading) return;

    setMessages(prev => [...prev, { role: 'user', text: message }]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        opportunityContext: 'مساعد عام لمنصة عسير فالي'
      })
    });

    const data = await res.json();

    setMessages(prev => [
      ...prev,
      { role: 'assistant', text: data.reply || 'حدث خطأ.' }
    ]);

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col">

      <header className="bg-navy p-6 text-white border-b-4 border-gold">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gold p-2 text-navy">
              <Bot size={24} />
            </div>
            <h1 className="font-black text-xl">المساعد الذكي</h1>
          </div>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`p-2 ${msg.role === 'user' ? 'bg-gold text-navy' : 'bg-navy text-gold'}`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`p-4 max-w-[80%] ${msg.role === 'user' ? 'bg-navy text-white' : 'bg-white border'}`}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && <div className="text-sm text-gray-400">جاري التحليل...</div>}
        </div>
      </section>

      <footer className="p-6 bg-white border-t">
        <div className="max-w-4xl mx-auto relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="اسأل عن أي فرصة..."
            className="w-full bg-slate-50 border pr-6 pl-16 py-5 text-right"
          />
          <button
            onClick={() => sendMessage()}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-navy text-gold p-3"
          >
            <Send size={18} className="rotate-180" />
          </button>
        </div>
      </footer>
    </main>
  );
}