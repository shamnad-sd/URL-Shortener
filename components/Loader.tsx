import React from 'react'

const Loader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-slate-400 border-t-emerald-500 rounded-full animate-spin"></div>
            <p className="text-slate-300">Loading...</p>
          </div>
        </div>
      </div>
  )
}

export default Loader
