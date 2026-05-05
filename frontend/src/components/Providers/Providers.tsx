'use client';
 
import { useEffect} from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore, useHasHydrated } from '@/store/authStore';
 
function AuthInitializer() {
  const hasHydrated = useHasHydrated()
  const fetchMe = useAuthStore((s) => s.fetchMe);
  
  useEffect(() => {
    if (hasHydrated) {
      fetchMe();
      
    }
  }, [hasHydrated]);
 
  return null;
}
 
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 30,
    },
  },
});
 
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      {children}
    </QueryClientProvider>
  );
}
 