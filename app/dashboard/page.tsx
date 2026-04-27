"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { CategoryList } from "@/components/CategoryList"
import { defaultMenu } from "@/lib/menu"
import { RESTAURANT_COLLECTION, pb } from "@/lib/pocketbase"
import { classNames } from "@/lib/utils"
import { useAuthStore } from "@/store/authStore"
import { useMenuStore } from "@/store/menuStore"

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { menu, themeColor, currency, getMenuValues } = useMenuStore()

  const [isSaving, setIsSaving] = useState(false)
  const [origin, setOrigin] = useState("https://your-qr.menu")

  useEffect(() => {
    if (!user) {
      router.replace("/auth/sign-in")
      return
    }
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin)
    }
  }, [router, user])

  const menuUrl = useMemo(() => {
    if (!user?.slug) return "--"
    return `${origin}/menu/${user.slug}`
  }, [origin, user?.slug])
  const qrImageUrl = useMemo(() => {
    if (menuUrl === "--") return null
    const encoded = encodeURIComponent(menuUrl)
    return `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encoded}`
  }, [menuUrl])

  const handleSave = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      await pb.collection(RESTAURANT_COLLECTION).update(user.id, {
        values: getMenuValues(),
        theme_color: themeColor,
        currency,
      })
      toast.success("Menü güncellendi")
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Menü kaydedilirken bir hata oluştu"
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopyUrl = async () => {
    if (!user?.slug) return
    try {
      await navigator.clipboard.writeText(menuUrl)
      toast.success("Bağlantı kopyalandı")
    } catch {
      toast.error("Bağlantı kopyalanamadı")
    }
  }

  if (!user) {
    return null
  }

  const totalCategories = menu.categories.length
  const totalItems = menu.categories.reduce(
    (acc, category) => acc + category.items.length,
    0
  )
  const lastUpdated = new Date(user.updated).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
  })

  return (
    <div className="space-y-6">
      <section className="rounded-sm bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-6 items-start justify-between">
          <div className="flex-1 space-y-4 text-left min-w-0">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">
                Kontrol Paneli
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                {user.name} menüsü hazır.
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                QR menünüzü kaydedin, paylaşın ve menüyü saniyeler içinde açın.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3 text-sm">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={classNames(
                  "cursor-pointer rounded-sm bg-black px-5 py-3 font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed",
                  isSaving && "opacity-70"
                )}
              >
                {isSaving ? "Kaydediliyor..." : "Menüyü Kaydet"}
              </button>
              <button
                onClick={handleCopyUrl}
                className="cursor-pointer rounded-sm border border-neutral-200 px-5 py-3 font-semibold text-neutral-800 transition hover:border-neutral-300 hover:bg-neutral-50"
              >
                Bağlantıyı Kopyala
              </button>
              <Link
                href={`/menu/${user.slug}`}
                target="_blank"
                className="cursor-pointer rounded-sm border border-neutral-200 px-5 py-3 font-semibold text-neutral-800 transition hover:border-neutral-300 hover:bg-neutral-50"
              >
                Canlı Menüyü Aç
              </Link>
              <Link
                href="/dashboard/settings"
                className="cursor-pointer rounded-sm border border-neutral-200 px-5 py-3 font-semibold text-neutral-800 transition hover:border-neutral-300 hover:bg-neutral-50"
              >
                Ayarlar
              </Link>
            </div>
          </div>
          <div className="flex flex-col w-full items-center shrink-0 rounded-sm border border-dashed border-neutral-200 p-4 text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">
              QR Kodu
            </p>
            {qrImageUrl ? (
              <picture>
                <img
                  src={qrImageUrl}
                  alt="Restoran menü QR kodu"
                  className="mt-3 h-60 w-60 rounded-sm border border-neutral-100 p-1"
                />
              </picture>
            ) : (
              <p className="mt-3 text-xs text-neutral-500">Hazırlanıyor...</p>
            )}
            {qrImageUrl && (
              <a
                href={qrImageUrl}
                download={`qr-${user.slug}.png`}
                className="mt-3 inline-flex cursor-pointer items-center justify-center rounded-sm border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
              >
                İndir
              </a>
            )}
          </div>
        </div>
        <div className="mt-6 grid gap-3 grid-cols-3">
          {[
            {
              label: "Kategoriler",
              value: totalCategories,
            },
            {
              label: "Ürünler",
              value: totalItems,
            },
            {
              label: "Son Güncelleme",
              value: lastUpdated,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-sm border border-neutral-200 px-4 py-3 text-left"
            >
              <p className="text-xs uppercase tracking-widest text-neutral-400">
                {stat.label}
              </p>
              <p className="text-2xl font-semibold text-neutral-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-sm bg-white/90 p-5 shadow-sm ring-1 ring-black/5">
        <div className="mb-5 flex flex-col gap-3 text-left sm:flex-row sm:items-start sm:justify-between">
          <div className="text-left">
            <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">
              Menü Tasarımcısı
            </p>
            <h2 className="text-2xl font-semibold text-neutral-900">
              Kategorilerinizi düzenleyin
            </h2>
            <p className="text-sm text-neutral-500">
              Sürükleyin, ürün ekleyin ve tasarımı canlı olarak takip edin.
            </p>
          </div>
        </div>
        <CategoryList />
      </section>
      <section className="rounded-sm border border-dashed border-neutral-200 bg-white/70 p-6 text-sm text-neutral-600">
        Misafirleriniz menünüzü{" "}
        <Link
          href={`/menu/${user.slug}`}
          className="font-medium text-neutral-900 underline"
        >
          /menu/{user.slug}
        </Link>{" "}
        adresinden görüntüler. QR kodu oluştururken bu linki kullanın.
      </section>
    </div>
  )
}
