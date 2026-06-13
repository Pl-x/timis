'use client';
import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, MessageCircle } from 'lucide-react';

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant'; content: string}[]>([
    { role: 'assistant', content: "Habari! I'm Timis Intelligence. Ask me about Kenyan tenancy law, lease analysis, or dispute guidance." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user' as const, content: q }]);
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/ai/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('timis_token') || ''}` },
        body: JSON.stringify({ feature: 'legal_assistant', query: q, context: {} }),
      });
      const data = res.ok ? await res.json() : null;
      setMessages((m) => [...m, { role: 'assistant' as const, content: data?.content || 'Could not get a response. Check backend and Claude API key.' }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant' as const, content: 'Cannot reach TIMIS API.' }]);
    } finally { setLoading(false); }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-timis-accent text-timis-primary shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition md:bottom-8 md:right-8">
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-4 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-6rem)] flex flex-col rounded-2xl shadow-2xl border border-timis-border dark:border-timis-dark-border bg-timis-card dark:bg-timis-dark-card overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-timis-border dark:border-timis-dark-border bg-timis-primary dark:bg-[#0D2B4E]">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-timis-accent" />
              <span className="font-display font-semibold text-white text-sm">Timis Intelligence</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-timis-accent text-timis-primary' : 'bg-timis-surface dark:bg-timis-dark-surface text-inherit'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-timis-muted animate-pulse">Thinking...</div>}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-timis-border dark:border-timis-dark-border flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Ask about tenancy law..."
              className="flex-1 px-3 py-2 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border text-sm focus:ring-2 focus:ring-timis-accent outline-none"
            />
            <button onClick={send} disabled={loading || !input.trim()} className="p-2 rounded-lg bg-timis-accent text-timis-primary disabled:opacity-50 hover:bg-timis-accent/90 transition">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
