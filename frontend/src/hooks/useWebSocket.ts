import { useEffect, useRef, useCallback, useState } from 'react';
import { WS_URL } from '@/lib/constants';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';

type WSStatus = 'connecting' | 'open' | 'closed';

export function useWebSocket() {
  const token = useAuthStore((s) => s.token);
  const addNotification = useNotificationStore((s) => s.add);
  const wsRef = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState<WSStatus>('closed');

  const connect = useCallback(() => {
    if (!token) return;
    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    wsRef.current = ws;
    setStatus('connecting');

    ws.onopen = () => setStatus('open');
    ws.onclose = () => {
      setStatus('closed');
      setTimeout(connect, 5000); // reconnect
    };
    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'notification') addNotification(msg.payload);
      } catch {}
    };
  }, [token, addNotification]);

  useEffect(() => {
    connect();
    return () => { wsRef.current?.close(); };
  }, [connect]);

  const send = useCallback((data: object) => {
    wsRef.current?.send(JSON.stringify(data));
  }, []);

  return { status, send };
}
