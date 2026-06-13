'use client';
import { useState } from 'react';
import { formatKES, formatPhone } from '@/lib/formatters';

interface MpesaPayButtonProps {
  phone: string;
  amount: number;
  invoiceId: string;
  onSuccess?: () => void;
}

export function MpesaPayButton({ phone, amount, invoiceId, onSuccess }: MpesaPayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'failed'>('idle');

  const handlePay = async () => {
    setLoading(true);
    setStatus('pending');
    try {
      const res = await fetch('/api/v1/mpesa/stk-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('timis_token')}` },
        body: JSON.stringify({ phone: formatPhone(phone), amount, invoice_id: invoiceId }),
      });
      if (res.ok) {
        setStatus('pending');
        // Poll or wait for WebSocket confirmation
      } else {
        setStatus('failed');
      }
    } catch {
      setStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          <>
            <img src="/icons/mpesa.svg" alt="M-Pesa" className="h-5" />
            Pay {formatKES(amount)} via M-Pesa
          </>
        )}
      </button>
      {status === 'pending' && <p className="text-sm text-amber-600">Check your phone for the M-Pesa prompt...</p>}
      {status === 'failed' && <p className="text-sm text-red-600">Payment failed. Please try again.</p>}
    </div>
  );
}
