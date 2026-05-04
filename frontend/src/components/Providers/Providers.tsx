'use client';
 
import { useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
 
function AuthInitializer() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const initialized = useRef(false);
 
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      fetchMe();
    }
  }, [fetchMe]);
 
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
 