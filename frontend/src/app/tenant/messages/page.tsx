'use client';

import { useState } from 'react';

const threads = [
  { id: 1, name: 'Property Manager', lastMsg: 'Your repair has been scheduled', time: '2h ago', unread: true },
  { id: 2, name: 'Caretaker', lastMsg: 'Water will be off 8-10am tomorrow', time: '1d ago', unread: false },
  { id: 3, name: 'Timis Support', lastMsg: 'Welcome to Timis! How can we help?', time: '3d ago', unread: false },
];

export default function MessagesPage() {
  const [activeThread, setActiveThread] = useState<number | null>(null);
  const [msg, setMsg] = useState('');

  if (activeThread !== null) {
    const thread = threads.find((t) => t.id === activeThread)!;
    return (
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex items-center gap-3 pb-3 border-b">
          <button onClick={() => setActiveThread(null)} className="min-w-[44px] min-h-[44px] flex items-center justify-center">←</button>
          <h2 className="font-semibold">{thread.name}</h2>
        </div>
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          <div className="bg-gray-100 rounded-xl p-3 max-w-[80%] text-sm">{thread.lastMsg}</div>
        </div>
        <div className="flex gap-2 pt-2 border-t">
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-xl p-3 min-h-[48px] text-base"
          />
          <button className="bg-blue-600 text-white px-4 rounded-xl min-h-[48px] min-w-[48px]">Send</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-bold mb-4">Messages</h1>
      {threads.map((t) => (
        <button
          key={t.id}
          onClick={() => setActiveThread(t.id)}
          className="w-full flex items-center gap-3 bg-timis-card dark:bg-timis-dark-card p-4 rounded-xl border text-left min-h-[64px]"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold">
            {t.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between">
              <span className={`text-sm ${t.unread ? 'font-bold' : ''}`}>{t.name}</span>
              <span className="text-xs text-gray-400">{t.time}</span>
            </div>
            <p className="text-xs text-timis-muted truncate">{t.lastMsg}</p>
          </div>
          {t.unread && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
        </button>
      ))}
    </div>
  );
}
