"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ArrowRight } from "lucide-react"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push("/dashboard")
    }
  }, [session, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-slate-400 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-slate-300 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-green-900 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-12">
          <p className="text-gray-100 text-2xl font-bold mb-2">Shorten URLs with confidence</p>
          <p className="text-gray-200 text-sm">Create, track, and manage your shortened links in one place</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-lg border border-slate-700/50">
              <div className="w-10 h-10 bg-slate-700/50 rounded-lg flex items-center justify-center">
                <span className="text-lg">🔐</span>
              </div>
              <div>
                <p className="text-sm text-slate-400">Secure Login</p>
                <p className="text-xs text-slate-500">Google OAuth 2.0</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center cursor-pointer gap-3 px-6 py-3 bg-green-700 hover:from-green-900 hover:to-teal-600 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
