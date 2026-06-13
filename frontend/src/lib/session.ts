// Auth storage helpers — single source of truth for session data

export interface SessionUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  org_id: string;
  org_name: string;
  plan: string;
}

export function saveSession(token: string, user: SessionUser) {
  localStorage.setItem('timis_token', token);
  localStorage.setItem('timis_user', JSON.stringify(user));
  localStorage.setItem('timis_org', user.org_id);
  localStorage.setItem('timis_plan', user.plan || 'free');
}

export function getSession(): SessionUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('timis_user');
  return raw ? JSON.parse(raw) : null;
}

export function getToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('timis_token') || '';
}

export function getInitials(user: SessionUser | null): string {
  if (!user) return '??';
  return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || '??';
}

export function clearSession() {
  localStorage.removeItem('timis_token');
  localStorage.removeItem('timis_user');
  localStorage.removeItem('timis_org');
  localStorage.removeItem('timis_plan');
}
