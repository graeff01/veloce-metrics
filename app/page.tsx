'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { storageManager } from '@/lib/storage';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = storageManager.getUser();
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
          <span className="text-white font-bold text-3xl">V</span>
        </div>
      </div>
    </div>
  );
}
