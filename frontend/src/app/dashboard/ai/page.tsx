'use client';
import { useState, useRef, useEffect } from 'react';
import { TimisButton } from '@/components/timis';
import { Send, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Habari! I'm Timis Intelligence — your AI assistant for Kenyan tenancy law, lease analysis, dispute guidance, and property management. Ask me anything.\n\nExamples:\n• \"Can my tenant refuse a rent increase?\"\n• \"Generate a demand letter for unpaid rent\"\n• \"What are the 2025 Finance Act tax rates?\"\n• \"Analyze this lease clause...\"" },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/ai/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('timis_token') || ''}`,
        },
        body: JSON.stringify({ feature: 'legal_assistant', query: userMsg, context: {} }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((m) => [...m, { role: 'assistant', content: data.content + (data.disclaimer ? `\n\n⚠️ ${data.disclaimer}` : '') }]);
      } else {
        setMessages((m) => [...m, { role: 'assistant', content: 'Sorry, I couldn\'t process that request. Please check the backend is running and Claude API key is configured.' }]);
      }
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Cannot reach the TIMIS API. Make sure the backend is running on port 8080.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-timis-accent/20 flex items-center justify-center">
          <Bot className="w-5 h-5 text-timis-accent" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold">Timis Intelligence™</h1>
          <p className="text-xs text-timis-muted">AI-powered legal assistant, lease analyzer, and dispute advisor</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-timis-accent/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-timis-accent" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-timis-accent text-timis-primary' : 'timis-card'}`}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-timis-primary dark:bg-timis-accent/10 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white dark:text-timis-accent" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-timis-accent/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-timis-accent animate-pulse" />
            </div>
            <div className="timis-card px-4 py-3 text-sm text-timis-muted">Thinking...</div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 pt-4 border-t border-timis-border dark:border-timis-dark-border">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Ask about Kenyan tenancy law, lease terms, disputes..."
          className="flex-1 px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent outline-none text-sm"
        />
        <TimisButton variant="primary" onClick={sendMessage} disabled={loading || !input.trim()}>
          <Send className="w-4 h-4" />
        </TimisButton>
      </div>
    </div>
  );
}
