"use client"

import { useEffect, useState } from "react"
import type { Link as LinkType } from "../../types"
import { Copy, Check, Trash2, Edit2, Eye, TrendingUp, Calendar } from "lucide-react"
import toast from "react-hot-toast"

interface LinkItemProps {
  link: LinkType
  onUpdate: () => void
  onDelete: () => void
}

export default function LinkItem({ link, onUpdate, onDelete }: LinkItemProps) {
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [editUrl, setEditUrl] = useState(link.originalUrl)
  const [editAlias, setEditAlias] = useState(link.customAlias || "")
  const [loading, setLoading] = useState(false)

  const [localClickCount, setLocalClickCount] = useState(link.clickCount);

  const displayCode = link.customAlias || link.shortCode
  const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${displayCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/links/${link._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalUrl: editUrl,
          customAlias: editAlias,
        }),
      })

      if (res.ok) {
        setIsEditing(false)
        onUpdate()
        toast.success("Link updated successfully!")
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to update link")
      }
    } catch (error) {
      toast.error("Error updating link")
    } finally {
      setLoading(false)
    }
  }

  const doDelete = async () => {
    try {
      const res = await fetch(`/api/links/${link._id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Link deleted successfully!")
        onDelete()
      } else {
        toast.error("Failed to delete link")
      }
    } catch (error) {
      toast.error("Error deleting link")
    }
  }

  const handleDelete = () => {
    toast(
      (t) => (
        <div className="flex flex-col sm:flex-row items-center gap-3 ">
          <span>Are you sure you want to delete this link?</span>
          <div className="flex gap-2 ">
            <button
              className="px-3 py-2 bg-red-600  cursor-pointer  text-white rounded-xl hover:bg-red-700 transition"
              onClick={() => {
                toast.dismiss(t.id)
                doDelete()
              }}
            >
              Yes
            </button>
            <button
              className="px-3 py-2 bg-gray-600 text-white rounded-xl  cursor-pointer  hover:bg-gray-700 transition"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  useEffect(() => {
    setEditUrl(link.originalUrl)
    setEditAlias(link.customAlias || "")
  }, [link._id, link.originalUrl, link.customAlias])

  useEffect(() => {
    setLocalClickCount(link.clickCount);
  }, [link.clickCount]);

  useEffect(() => {
    const handleFocus = () => {
      onUpdate();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [onUpdate]);

  // Responsive EDIT MODE
  if (isEditing) {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-3 sm:p-6 backdrop-blur-xl">
        <h3 className="font-semibold text-white mb-3 sm:mb-4 text-base sm:text-lg">Edit Link</h3>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1 sm:mb-2">Original URL</label>
            <input
              type="url"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 bg-slate-700/40 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1 sm:mb-2">Custom Alias</label>
            <input
              type="text"
              value={editAlias}
              onChange={(e) => setEditAlias(e.target.value)}
              placeholder="my-custom-link"
              className="w-full px-3 sm:px-4 py-2 bg-slate-700/40 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm"
            />
          </div>
          <div className="flex flex-col xs:flex-row gap-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-4 py-2 bg-emerald-500/20 cursor-pointer hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 rounded-lg transition text-sm sm:text-base disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-slate-700/30 cursor-pointer hover:bg-slate-700/50 text-slate-300 border border-slate-600/50 rounded-lg transition text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Responsive VIEW MODE
  return (
    <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-xl p-3 sm:p-6 backdrop-blur-xl hover:border-slate-600/50 transition-all duration-200">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
        {/* Main Content */}
        <div className="flex-1 min-w-0 w-full">
          {/* Short URL and Copy */}
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 overflow-x-auto">
            <div className="flex-1 min-w-0">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 font-mono font-semibold text-base sm:text-lg hover:text-emerald-300 transition break-all"
              >
                {shortUrl}
              </a>
            </div>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 p-2 cursor-pointer bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 hover:text-emerald-400 rounded-lg transition"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>

          {/* Original URL */}
          <p className="text-xs sm:text-sm text-slate-400 truncate mb-2 sm:mb-4 break-all">→ {link.originalUrl}</p>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-1 sm:gap-2 text-slate-300">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">{link.clickCount}</span>
              <span className="text-slate-500">clicks</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400">{formatDate(link.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0 mt-2 sm:mt-0">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="p-2 bg-slate-700/30 cursor-pointer hover:bg-blue-500/20 text-slate-300 hover:text-blue-400 rounded-lg transition"
          >
            <TrendingUp className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 bg-slate-700/30 cursor-pointer hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 rounded-lg transition"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-slate-700/30 cursor-pointer hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-lg transition"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Analytics Section */}
      {showAnalytics && (
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-700/50 w-full">
          <AnalyticsView shortCode={link.shortCode} />
        </div>
      )}
    </div>
  )
}

function AnalyticsView({ shortCode }: { shortCode: string }) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const fetchAnalytics = async () => {
    if (loaded) return
    setLoading(true)
    try {
      const res = await fetch(`/api/analytics/${shortCode}`)
      if (res.ok) {
        const data = await res.json()
        setAnalytics(data)
        setLoaded(true)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loaded && !loading) fetchAnalytics()
  }, [])

  if (loading) {
    return <p className="text-xs sm:text-sm text-slate-400">Loading analytics...</p>
  }

  if (!analytics || analytics.totalClicks === 0) {
    return <p className="text-xs sm:text-sm text-slate-400">No clicks yet</p>
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 sm:p-4">
          <p className="text-xs font-semibold text-emerald-400 mb-1 sm:mb-2">Total Clicks</p>
          <p className="text-xl sm:text-2xl font-bold text-emerald-300">{analytics.totalClicks}</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 sm:p-4">
          <p className="text-xs font-semibold text-blue-400 mb-1 sm:mb-2">Devices</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-300">{Object.keys(analytics.deviceStats || {}).length || 0}</p>
        </div>
      </div>

      {Object.entries(analytics.browserStats || {}).length > 0 && (
        <div className="bg-slate-700/20 rounded-lg p-3 sm:p-4">
          <p className="text-xs font-semibold text-slate-300 mb-2 sm:mb-3">Browsers</p>
          <div className="space-y-1 sm:space-y-2">
            {Object.entries(analytics.browserStats).map(([browser, count]: any) => (
              <div key={browser} className="flex justify-between items-center">
                <span className="text-xs text-slate-400">{browser}</span>
                <span className="text-xs font-semibold text-slate-300">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {analytics.recentClicks && analytics.recentClicks.length > 0 && (
        <div className="bg-slate-700/20 rounded-lg p-3 sm:p-4">
          <p className="text-xs font-semibold text-slate-300 mb-2 sm:mb-3">Recent Clicks</p>
          <div className="space-y-1 sm:space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
            {analytics.recentClicks.slice(0, 5).map((click: any) => (
              <div key={click._id} className="text-xs text-slate-400 bg-slate-700/30 rounded p-2">
                <span className="font-medium">{click.browser || 'Unknown'}</span> on{" "}
                <span className="font-medium">{click.device || 'Unknown'}</span>
                {" • "}
                {new Date(click.timestamp).toLocaleString()}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
