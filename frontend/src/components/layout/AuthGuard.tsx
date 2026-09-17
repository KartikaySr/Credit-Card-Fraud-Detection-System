'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  useEffect(() => {
    const sessionRaw = localStorage.getItem('nexus_session');
    if (!sessionRaw) {
      router.replace('/');
      return;
    }
    try {
      const session = JSON.parse(sessionRaw);
      if (Date.now() > session.expires) {
        localStorage.removeItem('nexus_session');
        router.replace('/');
      }
    } catch {
      localStorage.removeItem('nexus_session');
      router.replace('/');
    }
  }, [router]);

  return <>{children}</>;
}
