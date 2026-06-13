'use client';
import { useState, useEffect } from 'react';
import { TimisButton } from '@/components/timis';
import { CheckCircle, Smartphone, Download, Share2 } from 'lucide-react';

export default function PayRentPage() {
  const [step, setStep] = useState(1);
  const [countdown, setCountdown] = useState(60);
  const [amount, setAmount] = useState(18500);

  useEffect(() => {
    if (step === 3) {
      const timer = setInterval(() => setCountdown((c) => { if (c <= 1) { setStep(4); return 60; } return c - 1; }), 1000);
      const auto = setTimeout(() => setStep(4), 5000);
      return () => { clearInterval(timer); clearTimeout(auto); };
    }
  }, [step]);

  if (step === 1) return (
    <div className="px-5 pt-8">
      <h1 className="font-display text-xl font-bold">Pay Rent</h1>
      <div className="timis-card mt-6 space-y-3">
        <div className="flex justify-between text-sm"><span>Rent</span><span className="font-money">KES 15,000</span></div>
        <div className="flex justify-between text-sm"><span>Water</span><span className="font-money">KES 2,500</span></div>
        <div className="flex justify-between text-sm"><span>Electricity</span><span className="font-money">KES 1,000</span></div>
        <div className="border-t border-timis-border dark:border-timis-dark-border pt-3 flex justify-between font-semibold">
          <span>Total</span><span className="font-money text-lg">KES {amount.toLocaleString()}</span>
        </div>
        <div className="pt-2">
          <label className="text-xs text-timis-muted uppercase tracking-wider">Amount to pay</label>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-timis-muted">KES</span>
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="font-money text-xl font-bold bg-transparent border-b-2 border-timis-accent focus:outline-none w-full py-1" />
          </div>
        </div>
        <TimisButton variant="primary" size="lg" className="w-full mt-4" onClick={() => setStep(2)}>Continue</TimisButton>
      </div>
    </div>
  );

  if (step === 2) return (
    <div className="px-5 pt-8">
      <h1 className="font-display text-xl font-bold">Payment Method</h1>
      <div className="mt-8 space-y-4">
        <p className="text-sm text-timis-muted">Paying <span className="font-money font-semibold text-white">KES {amount.toLocaleString()}</span> to Unit 3A</p>
        <p className="text-sm text-timis-muted">Phone: 0712***678</p>
        <TimisButton variant="primary" size="lg" className="w-full" onClick={() => { setCountdown(60); setStep(3); }}>Pay via M-Pesa STK Push</TimisButton>
        <TimisButton variant="ghost" size="md" className="w-full">I've already paid — enter reference</TimisButton>
      </div>
    </div>
  );

  if (step === 3) return (
    <div className="px-5 pt-16 flex flex-col items-center text-center">
      <div className="relative">
        <Smartphone className="w-16 h-16 text-timis-accent" />
        <div className="absolute inset-0 rounded-full border-2 border-timis-accent animate-pulse-ring" />
      </div>
      <p className="font-display text-lg font-semibold mt-6">Check your phone</p>
      <p className="text-timis-muted text-sm mt-2">Enter your M-Pesa PIN to complete payment</p>
      <p className="font-money text-3xl font-bold text-timis-accent mt-6">{countdown}s</p>
      <TimisButton variant="ghost" size="sm" className="mt-8" onClick={() => setStep(1)}>Cancel</TimisButton>
    </div>
  );

  return (
    <div className="px-5 pt-12 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-full bg-timis-success flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-white" />
      </div>
      <p className="font-display text-xl font-bold mt-4">Rent Received ✓</p>
      <div className="timis-card mt-6 w-full text-left space-y-2">
        <div className="flex justify-between text-sm"><span className="text-timis-muted">Amount</span><span className="font-money font-semibold">KES {amount.toLocaleString()}</span></div>
        <div className="flex justify-between text-sm"><span className="text-timis-muted">Date</span><span>11 Jun 2026</span></div>
        <div className="flex justify-between text-sm"><span className="text-timis-muted">M-Pesa Ref</span><span className="font-money">QH12AB45XY</span></div>
        <div className="flex justify-between text-sm"><span className="text-timis-muted">Unit</span><span>3A, Greenview Apartments</span></div>
      </div>
      <div className="mt-6 w-full space-y-3">
        <TimisButton variant="secondary" size="md" className="w-full"><Download className="w-4 h-4 mr-2" />Download Receipt PDF</TimisButton>
        <TimisButton variant="ghost" size="md" className="w-full"><Share2 className="w-4 h-4 mr-2" />Share via WhatsApp</TimisButton>
      </div>
      <a href="/tenant" className="text-timis-accent text-sm font-medium mt-6 hover:underline">Back to Home</a>
    </div>
  );
}
