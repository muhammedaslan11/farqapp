"use client"

import { ReactNode, useEffect } from "react"

import { useMenuStore } from "@/store/menuStore"

interface BottomDrawerProps {
  open: boolean
  title?: string
  onClose: () => void
  children: ReactNode
}

const CloseIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 6l12 12M6 18L18 6" />
  </svg>
)

export function BottomDrawer({
  open,
  title,
  onClose,
  children,
}: BottomDrawerProps) {
  const themeColor = useMenuStore((state) => state.themeColor) ?? "#0f172a"

  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY
      document.body.style.overflow = "hidden"
      document.body.style.position = "fixed"
      document.body.style.width = "100%"
      document.body.style.top = `-${scrollY}px`

      return () => {
        document.body.style.overflow = ""
        document.body.style.position = ""
        document.body.style.width = ""
        document.body.style.top = ""
        window.scrollTo(0, scrollY)
      }
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        <div className="rounded-t-3xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh] pb-10">
          <div className="shrink-0 p-6 pb-4 border-b border-neutral-100">
            <div className="flex items-center justify-between">
              <p className="text-base font-semibold text-neutral-900">
                {title}
              </p>
              <button
                type="button"
                onClick={onClose}
                style={{ color: themeColor }}
                className="flex cursor-pointer items-center gap-2 rounded-sm border border-neutral-100 px-3 py-1.5 text-sm font-semibold transition hover:bg-neutral-100"
              >
                <CloseIcon />
                Kapat
              </button>
            </div>
          </div>
          <div
            className="overflow-y-auto p-6 pb-8"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 2rem)" }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
