'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ManagerPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to my-classes by default
    router.replace('/manager/my-classes');
  }, [router]);

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-lg text-gray-600">Redirecting...</div>
    </div>
  );
}