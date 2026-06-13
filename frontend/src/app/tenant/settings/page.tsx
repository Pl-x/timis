'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [lang, setLang] = useState('en');
  const [notifications, setNotifications] = useState({ rent: true, maintenance: true, messages: true });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Settings</h1>

      <div className="timis-card-xl p-4 shadow-sm border space-y-3">
        <h2 className="font-semibold text-sm">Profile</h2>
        <div className="space-y-3">
          <input type="text" defaultValue="John Mwangi" placeholder="Full Name" className="w-full border rounded-xl p-3 min-h-[48px] text-base" />
          <input type="tel" defaultValue="+254712345678" placeholder="Phone" className="w-full border rounded-xl p-3 min-h-[48px] text-base" />
          <input type="email" defaultValue="john@example.com" placeholder="Email" className="w-full border rounded-xl p-3 min-h-[48px] text-base" />
        </div>
      </div>

      <div className="timis-card-xl p-4 shadow-sm border">
        <h2 className="font-semibold text-sm mb-3">Language</h2>
        <div className="flex gap-2">
          {[{ code: 'en', label: 'English' }, { code: 'sw', label: 'Kiswahili' }].map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className={`flex-1 py-3 rounded-xl text-sm min-h-[48px] border ${lang === l.code ? 'bg-blue-600 text-white border-blue-600' : 'bg-timis-card dark:bg-timis-dark-card text-inherit'}`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="timis-card-xl p-4 shadow-sm border space-y-3">
        <h2 className="font-semibold text-sm">Notifications</h2>
        {Object.entries(notifications).map(([key, val]) => (
          <label key={key} className="flex items-center justify-between min-h-[44px]">
            <span className="text-sm capitalize">{key} reminders</span>
            <input
              type="checkbox"
              checked={val}
              onChange={() => setNotifications({ ...notifications, [key]: !val })}
              className="w-5 h-5"
            />
          </label>
        ))}
      </div>

      <button className="w-full bg-blue-600 text-white py-4 rounded-xl text-base font-medium min-h-[56px]">
        Save Changes
      </button>
    </div>
  );
}
