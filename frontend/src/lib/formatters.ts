/** Format KES currency */
export function formatKES(amount: number): string {
  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 0 })}`;
}

/** Format Kenyan phone: 0712... or +254712... */
export function formatPhone(phone: string): string {
  if (phone.startsWith('+254')) return phone;
  if (phone.startsWith('254')) return `+${phone}`;
  if (phone.startsWith('0')) return `+254${phone.slice(1)}`;
  return phone;
}

/** Format date for Kenyan locale */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-KE', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

/** Timis Score band label and color */
export function scoreBand(score: number): { label: string; color: string } {
  if (score >= 750) return { label: 'Excellent', color: '#10B981' };
  if (score >= 650) return { label: 'Good', color: '#3B82F6' };
  if (score >= 500) return { label: 'Fair', color: '#F59E0B' };
  if (score >= 350) return { label: 'Poor', color: '#F97316' };
  return { label: 'Very Poor', color: '#EF4444' };
}
