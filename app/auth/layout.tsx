"use client"

import Link from "next/link"
import { ReactNode } from "react"

export default function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-black/5">
        <Link href="/">
          <span className="text-xl font-black tracking-tight text-red-600">
            Farq<span className="text-black/25">.app</span>
          </span>
        </Link>
        <Link
          href="/"
          className="text-sm text-black/40 hover:text-black transition-colors"
        >
          ← Ana Sayfa
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        {children}
      </main>
    </div>
  )
}
