"use client"

import type React from "react"
import { useState } from "react"
import { Check, AlertCircle, Sparkles } from "lucide-react"
import toast from 'react-hot-toast';

export default function LinkForm({ onSuccess }: { onSuccess: () => void }) {
  const [originalUrl, setOriginalUrl] = useState("")
  const [customAlias, setCustomAlias] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalUrl,
          customAlias: customAlias || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to create link")
      }

      toast.success(`Link created! ${data.shortUrl}`)
      setOriginalUrl("")
      setCustomAlias("")

      setTimeout(() => {
        onSuccess()
        setSuccess("")
      }, 2000)
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lg:sticky lg:top-20">
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">Create Short Link</h2>
          <p className="text-sm text-slate-400">Transform your long URLs instantly</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Original URL Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">Original URL *</label>
          <input
            type="url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="https://example.com/very/long/url"
            required
            className="w-full px-4 py-3 bg-slate-700/40 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
          />
          <p className="text-xs text-slate-400 mt-2">Paste the URL you want to shorten</p>
        </div>

        {/* Custom Alias Input */}
        <div>
          <label className="block text-sm font-semibold text-slate-200 mb-2">
            Custom Alias <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              placeholder="my-awesome-link"
              className="flex-1 px-4 py-3 bg-slate-700/40 border border-slate-600/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">Letters, numbers, hyphens, underscores (3-50 chars)</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p className="text-sm text-emerald-300">{success}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-700 hover:from-green-900 hover:to-teal-600 text-white cursor-pointer disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100  disabled:shadow-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating...
            </span>
          ) : (
            "Create Short Link"
          )}
        </button>
      </form>
    </div>
    </div>
  )
}
