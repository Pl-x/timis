'use client';
import {
  HomeIcon,
  CreditCardIcon,
  WrenchScrewdriverIcon,
  ChatBubbleLeftIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const items = [
  { name: 'Home', icon: HomeIcon, href: '/' },
  { name: 'Pay', icon: CreditCardIcon, href: '/pay' },
  { name: 'Maintenance', icon: WrenchScrewdriverIcon, href: '/maintenance' },
  { name: 'Messages', icon: ChatBubbleLeftIcon, href: '/messages' },
  { name: 'Profile', icon: UserIcon, href: '/profile' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700 z-50">
      <div className="flex justify-around py-2">
        {items.map(({ name, icon: Icon, href }) => (
          <a key={name} href={href} className="flex flex-col items-center gap-0.5 text-gray-600 dark:text-gray-300 hover:text-blue-600">
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{name}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
