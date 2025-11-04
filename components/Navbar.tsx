'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">🔗</span>
            <span className="text-xl font-bold text-gray-800">ShortLink</span>
          </Link>

          {session && (
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm text-gray-700">
                  {session.user?.name}
                </span>
                <button
                  onClick={() => signOut()}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium transition"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}