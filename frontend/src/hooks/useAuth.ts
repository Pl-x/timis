import { useMutation } from '@tanstack/react-query';
import { useAuthStore, UserRole } from '@/stores/authStore';
import { API_URL } from '@/lib/constants';

async function postAuth(path: string, body: object) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json()).message ?? 'Request failed');
  return res.json();
}

export function useAuth() {
  const { token, user, setAuth, clear } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (creds: { email: string; password: string }) => postAuth('/auth/login', creds),
    onSuccess: (data) => setAuth(data.token, data.user),
  });

  const registerMutation = useMutation({
    mutationFn: (body: { name: string; email: string; phone: string; password: string; role: string }) =>
      postAuth('/auth/register', body),
    onSuccess: (data) => setAuth(data.token, data.user),
  });

  const logout = () => {
    clear();
    if (typeof window !== 'undefined') localStorage.removeItem('timis_token');
  };

  const hasRole = (role: UserRole) => user?.role === role;

  return {
    user,
    token,
    isAuthenticated: !!token,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout,
    hasRole,
    isLoading: loginMutation.isPending || registerMutation.isPending,
  };
}
