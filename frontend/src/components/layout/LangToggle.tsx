'use client';
import { useState } from 'react';

export default function LangToggle() {
  const [lang, setLang] = useState<'EN' | 'SW'>('EN');

  return (
    <button
      onClick={() => setLang(lang === 'EN' ? 'SW' : 'EN')}
      className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
      aria-label="Toggle language"
    >
      {lang}
    </button>
  );
}
