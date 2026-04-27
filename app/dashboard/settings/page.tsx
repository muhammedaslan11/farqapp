"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { CurrencySelector } from "@/components/CurrencySelector"
import { ImageUploader } from "@/components/ImageUploader"
import { ThemeColorPicker } from "@/components/ThemeColorPicker"
import { defaultMenu } from "@/lib/menu"
import { RESTAURANT_COLLECTION, pb } from "@/lib/pocketbase"
import { classNames } from "@/lib/utils"
import { useAuthStore } from "@/store/authStore"
import { useMenuStore } from "@/store/menuStore"

export default function DashboardSettingsPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const {
    menu,
    themeColor,
    currency,
    setThemeColor,
    setCurrency,
    getMenuValues,
    updateInfo,
    updateMedia,
    updateHeroBadges,
  } = useMenuStore()

  const [isSaving, setIsSaving] = useState(false)
  const [badge1, setBadge1] = useState("")
  const [badge2, setBadge2] = useState("")
  const [badge3, setBadge3] = useState("")

  useEffect(() => {
    if (!user) {
      router.replace("/auth/sign-in")
      return
    }
  }, [router, user])

  useEffect(() => {
    const badges = menu.info?.heroBadges ?? []
    setBadge1(badges[0] ?? "")
    setBadge2(badges[1] ?? "")
    setBadge3(badges[2] ?? "")
  }, [menu.info?.heroBadges])

  if (!user) {
    return null
  }

  const info = menu.info ?? {}
  const media = menu.media ?? {}

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      // Update hero badges
      const badges = [badge1, badge2, badge3].filter((b) => b.trim())
      updateHeroBadges(badges)

      // Get updated menu values synchronously after state update
      const updatedMenu = getMenuValues()

      await pb.collection(RESTAURANT_COLLECTION).update(user.id, {
        values: updatedMenu,
        theme_color: themeColor,
        currency,
      })
      toast.success("Ayarlar kaydedildi")
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Ayarlar kaydedilirken bir hata oluştu"
      toast.error(message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-sm border border-neutral-200 bg-white/95 p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="space-y-2 text-left">
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">
              Ayarlar
            </p>
            <h1 className="text-3xl font-semibold text-neutral-900">
              {user.name} ayarları
            </h1>
            <p className="text-sm text-neutral-500">
              Tema, para birimi ve restoran bilgilerinizi buradan yönetin.
            </p>
          </div>
          <div className="flex flex-row gap-2 sm:ml-auto">
            <Link
              href="/dashboard"
              className="flex h-11 cursor-pointer items-center justify-center rounded-sm border border-neutral-200 px-5 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50"
            >
              Dashboard&apos;a dön
            </Link>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={classNames(
                "flex h-11 cursor-pointer items-center justify-center rounded-sm bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed",
                isSaving && "opacity-70"
              )}
            >
              {isSaving ? "Kaydediliyor" : "Kaydet"}
            </button>
          </div>
        </div>
      </section>

      <div className="space-y-6">
        <section className="rounded-sm border border-neutral-200 bg-white/95 p-6 shadow-sm">
          <div className="space-y-2 text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
              Hesap Bilgileri
            </p>
            <h3 className="text-2xl font-semibold text-neutral-900">
              Kullanıcı & İşletme Bilgileri
            </h3>
            <p className="text-sm text-neutral-500">
              Bu bilgiler sistem tarafından yönetilmektedir.
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-600">
                İşletme Adı
              </label>
              <input
                className="input-black h-12 opacity-60 cursor-not-allowed"
                value={user.name ?? ""}
                disabled
                readOnly
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-600">
                Menü URL
              </label>
              <input
                className="input-black h-12 opacity-60 cursor-not-allowed"
                value={user.slug ?? ""}
                disabled
                readOnly
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-600">
                E-posta
              </label>
              <input
                className="input-black h-12 opacity-60 cursor-not-allowed"
                value={user.email ?? ""}
                disabled
                readOnly
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-600">
                Kayıt Tarihi
              </label>
              <input
                className="input-black h-12 opacity-60 cursor-not-allowed"
                value={new Date(user.created).toLocaleDateString("tr-TR")}
                disabled
                readOnly
              />
            </div>
          </div>
        </section>

        <section className="rounded-sm border border-neutral-200 bg-white/95 p-6 shadow-sm">
          <div className="space-y-2 text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
              Medya
            </p>
            <h3 className="text-2xl font-semibold text-neutral-900">
              Logo & Kapak Görseli
            </h3>
            <p className="text-sm text-neutral-500">
              Menünüzün görsel kimliğini oluşturun.
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <ImageUploader
              label="Logo"
              description="Kare / yuvarlak önerilir."
              value={media.logo}
              onChange={(value) => updateMedia({ logo: value })}
            />
            <ImageUploader
              label="Kapak görseli"
              description="Menü sayfası hero alanında gösterilir."
              value={media.hero}
              onChange={(value) => updateMedia({ hero: value })}
            />
          </div>
        </section>

        <section className="rounded-sm border border-neutral-200 bg-white/95 p-6 shadow-sm">
          <div className="space-y-2 text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
              Tema & Para Birimi
            </p>
            <h3 className="text-2xl font-semibold text-neutral-900">
              Marka detayları
            </h3>
            <p className="text-sm text-neutral-500">
              Renk ve para birimini belirleyerek tüm ekranlarda tutarlılık
              sağlayın.
            </p>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-600">Tema rengi</p>
              <ThemeColorPicker value={themeColor} onChange={setThemeColor} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-600">
                Para birimi
              </p>
              <CurrencySelector value={currency} onChange={setCurrency} />
            </div>
          </div>
        </section>

        <section className="rounded-sm border border-neutral-200 bg-white/95 p-6 shadow-sm">
          <div className="space-y-2 text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
              Hero Rozetleri
            </p>
            <h3 className="text-2xl font-semibold text-neutral-900">
              Menü kapağı rozetleri
            </h3>
            <p className="text-sm text-neutral-500">
              Menü kapağında gösterilecek en fazla 3 rozet ekleyin (wifi,
              coffee, vegan vb.)
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <input
              className="input-black h-12"
              placeholder="Rozet 1 (örn: wifi)"
              value={badge1}
              onChange={(e) => setBadge1(e.target.value)}
              maxLength={15}
            />
            <input
              className="input-black h-12"
              placeholder="Rozet 2 (örn: coffee)"
              value={badge2}
              onChange={(e) => setBadge2(e.target.value)}
              maxLength={15}
            />
            <input
              className="input-black h-12"
              placeholder="Rozet 3 (örn: dessert)"
              value={badge3}
              onChange={(e) => setBadge3(e.target.value)}
              maxLength={15}
            />
          </div>
        </section>

        <section className="rounded-sm border border-neutral-200 bg-white/95 p-6 shadow-sm">
          <div className="space-y-2 text-left">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
              Genel Bilgiler
            </p>
            <h3 className="text-2xl font-semibold text-neutral-900">
              Adres & İletişim
            </h3>
            <p className="text-sm text-neutral-500">
              Ziyaretçileriniz için gerekli tüm iletişim detaylarını doldurun.
            </p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <input
              className="input-black h-12"
              placeholder="Adres"
              value={info.address ?? ""}
              onChange={(event) =>
                updateInfo({ address: event.target.value || undefined })
              }
            />
            <input
              className="input-black h-12"
              placeholder="Çalışma saatleri"
              value={info.hours ?? ""}
              onChange={(event) =>
                updateInfo({ hours: event.target.value || undefined })
              }
            />
            <input
              className="input-black h-12"
              placeholder="Telefon"
              value={info.phone ?? ""}
              onChange={(event) =>
                updateInfo({ phone: event.target.value || undefined })
              }
            />
            <input
              className="input-black h-12"
              placeholder="WhatsApp"
              value={info.whatsapp ?? ""}
              onChange={(event) =>
                updateInfo({ whatsapp: event.target.value || undefined })
              }
            />
            <input
              className="input-black h-12"
              placeholder="Instagram"
              value={info.instagram ?? ""}
              onChange={(event) =>
                updateInfo({ instagram: event.target.value || undefined })
              }
            />
            <input
              className="input-black h-12"
              placeholder="TikTok"
              value={info.tiktok ?? ""}
              onChange={(event) =>
                updateInfo({ tiktok: event.target.value || undefined })
              }
            />
            <input
              className="input-black h-12"
              placeholder="YouTube"
              value={info.youtube ?? ""}
              onChange={(event) =>
                updateInfo({ youtube: event.target.value || undefined })
              }
            />
            <input
              className="input-black h-12"
              placeholder="Google Maps bağlantısı"
              value={info.mapsUrl ?? ""}
              onChange={(event) =>
                updateInfo({ mapsUrl: event.target.value || undefined })
              }
            />
            <textarea
              className="input-black min-h-24 md:col-span-2"
              placeholder="Notlar / servis detayları"
              value={info.notes ?? ""}
              onChange={(event) =>
                updateInfo({ notes: event.target.value || undefined })
              }
            />
          </div>
        </section>
      </div>
    </div>
  )
}
