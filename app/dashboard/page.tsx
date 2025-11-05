"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Navbar from "../../components/Navbar"
import LinkForm from "../../components/dashboard/LinkForm"
import LinkList from "../../components/dashboard/LinkList"
import { Plus, Zap, TrendingUp } from "lucide-react"
import Loader from "../../components/Loader"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  if (status === "loading") {
    return <Loader/>
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 via-green-900 to-slate-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Header */}
        <div className="mb-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Welcome back, {session?.user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-slate-400 text-lg">Manage and track your shortened links</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <LinkForm onSuccess={() => setRefreshTrigger((prev) => prev + 1)} />
          </div>

          {/* Links List Section */}
          <div className="lg:col-span-2">
            <LinkList refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </main>
    </div>
  )
}
