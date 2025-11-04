'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import LinkList from '../../components/dashboard/LinkList';
import LinkForm from '../../components/dashboard/LinkForm';


export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {session.user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Manage your short links and view analytics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <LinkForm onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
          </div>

          <div className="lg:col-span-2">
            <LinkList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
}