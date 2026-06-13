import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'tenant' | 'landlord' | 'agent' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  orgId?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  orgId: string | null;
  setAuth: (token: string, user: User) => void;
  setOrg: (orgId: string) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      orgId: null,
      setAuth: (token, user) => set({ token, user, orgId: user.orgId ?? null }),
      setOrg: (orgId) => set({ orgId }),
      clear: () => set({ token: null, user: null, orgId: null }),
    }),
    { name: 'timis_auth' }
  )
);
