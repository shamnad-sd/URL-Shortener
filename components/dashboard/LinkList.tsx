"use client"

import { useEffect, useState } from "react"
import type { Link } from "../../types"
import LinkItem from "./LinkItem"
import { BarChart3, Zap } from "lucide-react"

interface LinkListProps {
  refreshTrigger: number
}

export default function LinkList({ refreshTrigger }: LinkListProps) {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"newest" | "popular">("newest")

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/links")
      if (res.ok) {
        const data = await res.json()
        setLinks(data.links)
      }
    } catch (error) {
      console.error("Error fetching links:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [refreshTrigger])

  const sortedLinks = [...links].sort((a, b) => {
    if (sortBy === "popular") {
      return b.clickCount - a.clickCount
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-12 backdrop-blur-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-slate-400 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Loading your links...</p>
        </div>
      </div>
    )
  }

  if (links.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-12 backdrop-blur-xl text-center">
        <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No links yet</h3>
        <p className="text-slate-400 max-w-sm mx-auto">
          Create your first short link to start tracking clicks and analytics!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with sorting */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Your Links <span className="text-sm font-normal text-slate-400 ml-2">({links.length})</span>
          </h2>
        </div>
      </div>

      {/* Links Grid */}
      <div className="grid gap-4">
        {sortedLinks.map((link) => (
          <LinkItem key={link._id} link={link} onUpdate={fetchLinks} onDelete={fetchLinks} />
        ))}
      </div>
    </div>
  )
}
