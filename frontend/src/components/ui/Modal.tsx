import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function Modal({ open, onClose, title, children, actions }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" aria-label="Close">✕</button>
        {title && <h2 className="mb-4 text-lg font-semibold">{title}</h2>}
        <div>{children}</div>
        {actions && <div className="mt-4 flex justify-end gap-2">{actions}</div>}
      </div>
    </div>
  );
}
