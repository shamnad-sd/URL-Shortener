import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 bg-gradient-to-br from-green-700 via-green-900 to-slate-900">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white  mb-2">Page Not Found</h2>
        <p className="text-gray-200 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        <Link
          href="/"
          className="w-full py-3 px-4 bg-green-700 hover:from-green-900 hover:to-teal-600 text-white cursor-pointer disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100  disabled:shadow-none"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
