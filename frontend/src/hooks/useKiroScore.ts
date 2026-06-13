import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/lib/constants';
import { useAuthStore } from '@/stores/authStore';

interface ScoreBreakdown {
  category: string;
  points: number;
}

interface TimisScoreData {
  score: number;
  breakdown: ScoreBreakdown[];
  updatedAt: string;
}

async function fetchScore(tenantId: string, token: string | null): Promise<TimisScoreData> {
  const res = await fetch(`${API_URL}/tenants/${tenantId}/score`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch score');
  return res.json();
}

export function useTimisScore(tenantId: string) {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ['timisScore', tenantId],
    queryFn: () => fetchScore(tenantId, token),
    enabled: !!tenantId && !!token,
    staleTime: 5 * 60 * 1000, // cache for 5 min
  });
}
