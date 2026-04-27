"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ReactNode, useEffect, useRef, useState } from "react"

import { defaultMenu } from "@/lib/menu"
import { classNames } from "@/lib/utils"
import { useAuthStore } from "@/store/authStore"
import { useMenuStore } from "@/store/menuStore"

const navigation = [
  { href: "/dashboard", label: "Menü Tasarımcısı" },
  { href: "/dashboard/settings", label: "Restoran Ayarları" },
  {
    href: (user?: { slug?: string }) => `/menu/${user?.slug ?? ""}`,
    label: "Canlı Menü",
  },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuthStore()
  const { setInitialData } = useMenuStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) {
      router.replace("/auth/sign-in")
      return
    }
    // Initialize menu data once in layout
    setInitialData({
      values: user.values ?? defaultMenu,
      themeColor: user.theme_color,
      currency: user.currency,
    })
  }, [router, setInitialData, user])

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener("click", handler)
    return () => document.removeEventListener("click", handler)
  }, [])

  if (!user) {
    return null
  }

  const resolvedNavigation = navigation.map((item) => ({
    href: typeof item.href === "function" ? item.href(user) : item.href,
    label: item.label,
  }))

  const initials = user.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-sm sm:text-lg lg:text-xl uppercase tracking-[0.2em] sm:tracking-[0.35em] font-bold">
              FARQ APP
            </p>
          </div>
          <div className="hidden lg:block">
            <DashboardNav
              links={resolvedNavigation}
              pathname={pathname}
              orientation="horizontal"
            />
          </div>
          <div
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="relative flex items-center gap-3 cursor-pointer"
            ref={menuRef}
          >
            <div className="text-right">
              <p className="text-sm font-semibold text-neutral-900">
                {user.name}
              </p>
              <p className="text-xs text-neutral-500">{user.email}</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white font-semibold text-sm transition hover:bg-neutral-800">
              {initials}
            </div>
            {isMenuOpen && (
              <div className="absolute right-0 top-14 w-56 rounded-lg border border-neutral-200 bg-white shadow-lg overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-neutral-100">
                  <p className="text-sm font-semibold text-neutral-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-neutral-500">{user.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Restoran Ayarları
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      signOut()
                      router.replace("/auth/sign-in")
                    }}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Çıkış Yap
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="px-4 pb-4 lg:hidden">
          <DashboardNav
            links={resolvedNavigation}
            pathname={pathname}
            orientation="horizontal"
          />
        </div>
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <div className="space-y-6">{children}</div>
      </main>
    </div>
  )
}

interface DashboardNavProps {
  links: Array<{ href: string; label: string }>
  pathname: string
  orientation?: "vertical" | "horizontal"
}

function DashboardNav({
  links,
  pathname,
  orientation = "vertical",
}: DashboardNavProps) {
  return (
    <div
      className={classNames(
        orientation === "vertical"
          ? "flex flex-col gap-2"
          : "flex items-center gap-4 overflow-x-auto"
      )}
    >
      {links.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={classNames(
              "cursor-pointer rounded-sm px-3 py-2 text-sm font-medium transition",
              isActive
                ? "bg-black text-white shadow"
                : "text-neutral-500 hover:text-black"
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
