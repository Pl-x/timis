import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/lib/constants';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore, Notification } from '@/stores/notificationStore';
import { useEffect } from 'react';

export function useNotifications() {
  const token = useAuthStore((s) => s.token);
  const store = useNotificationStore();

  const query = useQuery({
    queryKey: ['notifications'],
    queryFn: async (): Promise<Notification[]> => {
      const res = await fetch(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch notifications');
      return res.json();
    },
    enabled: !!token,
    refetchInterval: 30_000,
  });

  useEffect(() => {
    if (query.data) store.set(query.data);
  }, [query.data]);

  return {
    items: store.items,
    unreadCount: store.unreadCount,
    markRead: store.markRead,
    markAllRead: store.markAllRead,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}
