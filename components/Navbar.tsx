"use client"

import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { Home, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src={"/logonew.png"}
              alt="logo"
              width={32}
              height={32}
              className="w-full h-full"
            />
            <span className="text-xl font-bold text-white">LinkVault</span>
          </Link>

          {session ? (
            <>
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-8">

                <div className="flex items-center gap-4 pl-8 border-l border-slate-700 ">
                  {session.user?.image && (
                    <Image
                      src={session.user.image || "/placeholder.svg"}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full border-2 border-emerald-500/50"
                    />
                  )}

                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">{session.user?.name}</span>
                    <span className="text-xs text-slate-500">{session.user?.email}</span>
                  </div>

                  <Link href="/dashboard" className="text-slate-300 hover:text-emerald-500 font-medium transition-colors">
                    <Home />
                  </Link>

                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 text-sm cursor-pointer font-medium text-slate-300 hover:text-red-400 transition-colors"
                  >

                    <LogOut />
                  </button>
                  <div>

                  </div>
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-300 hover:text-white">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </>
          ) : null}
        </div>

        {/* Mobile Menu */}
        {isOpen && session && (
          <div className="md:hidden pb-4 space-y-3 border-t border-slate-700">
            <Link
              href="/dashboard"
              className="block text-slate-300 hover:text-emerald-500 font-medium py-2 transition-colors"
            >
              Dashboard
            </Link>
            <button
              onClick={() => signOut()}
              className="block w-full cursor-pointer text-left text-slate-300 hover:text-red-400 font-medium py-2 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
