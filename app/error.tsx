"use client"

import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 bg-gradient-to-br from-green-700 via-green-900 to-slate-900">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-white mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-white mb-2">Server Error</h2>
        <p className="text-white mb-2">Something went wrong on our end.</p>
        <p className="text-white text-sm mb-8">Error ID: {error.digest}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="w-full py-3 px-4 bg-green-700 hover:from-green-900 hover:to-teal-600 text-white cursor-pointer disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100  disabled:shadow-none"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
