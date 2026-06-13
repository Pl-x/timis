import { useMutation, useQuery } from '@tanstack/react-query';
import { API_URL } from '@/lib/constants';
import { useAuthStore } from '@/stores/authStore';
import { useState } from 'react';

interface StkPushRequest {
  phone: string;
  amount: number;
  leaseId: string;
}

interface StkPushResponse {
  checkoutRequestId: string;
  merchantRequestId: string;
}

export function useMpesa() {
  const token = useAuthStore((s) => s.token);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const stkPush = useMutation({
    mutationFn: async (req: StkPushRequest): Promise<StkPushResponse> => {
      const res = await fetch(`${API_URL}/payments/mpesa/stk-push`, {
        method: 'POST', headers, body: JSON.stringify(req),
      });
      if (!res.ok) throw new Error('STK Push failed');
      return res.json();
    },
    onSuccess: (data) => setCheckoutId(data.checkoutRequestId),
  });

  const pollStatus = useQuery({
    queryKey: ['mpesa-status', checkoutId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/payments/mpesa/status/${checkoutId}`, { headers });
      if (!res.ok) throw new Error('Status check failed');
      return res.json() as Promise<{ status: 'pending' | 'success' | 'failed'; mpesaRef?: string }>;
    },
    enabled: !!checkoutId,
    refetchInterval: (query) =>
      query.state.data?.status === 'pending' ? 3000 : false,
  });

  return {
    initiate: stkPush.mutateAsync,
    isInitiating: stkPush.isPending,
    pollStatus: pollStatus.data,
    isPollLoading: pollStatus.isLoading,
    reset: () => setCheckoutId(null),
  };
}
