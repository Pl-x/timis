import React from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  type?: ToastType;
  message: string;
  onClose?: () => void;
}

const styles: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-400 text-green-800',
  error: 'bg-red-50 border-red-400 text-red-800',
  info: 'bg-blue-50 border-blue-400 text-blue-800',
};

export function Toast({ type = 'info', message, onClose }: ToastProps) {
  return (
    <div className={`flex items-center justify-between rounded border-l-4 px-4 py-3 shadow ${styles[type]}`}>
      <span className="text-sm">{message}</span>
      {onClose && <button onClick={onClose} className="ml-4 text-lg leading-none opacity-60 hover:opacity-100">✕</button>}
    </div>
  );
}
