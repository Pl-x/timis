'use client';
import { useState } from 'react';
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function TopBar({ orgName = 'Timis', unreadCount = 0 }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
      <span className="font-semibold text-lg text-gray-800 dark:text-white">{orgName}</span>

      <div className="hidden sm:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <BellIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <div className="relative">
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="w-8 h-8 rounded-full bg-blue-500 text-white text-sm font-bold flex items-center justify-center">
            U
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg z-50">
              <a href="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">Profile</a>
              <a href="/logout" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">Logout</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
