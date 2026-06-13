import { create } from 'zustand';

export interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  type: 'payment' | 'lease' | 'maintenance' | 'score' | 'system';
}

interface NotificationState {
  items: Notification[];
  unreadCount: number;
  add: (n: Notification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  set: (items: Notification[]) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  items: [],
  unreadCount: 0,
  add: (n) => set((s) => ({ items: [n, ...s.items], unreadCount: s.unreadCount + 1 })),
  markRead: (id) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, read: true } : i)),
      unreadCount: Math.max(0, s.unreadCount - 1),
    })),
  markAllRead: () =>
    set((s) => ({ items: s.items.map((i) => ({ ...i, read: true })), unreadCount: 0 })),
  set: (items) => set({ items, unreadCount: items.filter((i) => !i.read).length }),
}));
