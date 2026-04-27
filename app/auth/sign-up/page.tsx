"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { useAuthStore } from "@/store/authStore"
import { RestaurantData } from "@/lib/pocketbase"
import { CurrencySelector } from "@/components/CurrencySelector"
import { ThemeColorPicker } from "@/components/ThemeColorPicker"
import { defaultMenu } from "@/lib/menu"
import { slugify } from "@/lib/utils"

export default function SignUpPage() {
  const router = useRouter()
  const { signUp, isLoading } = useAuthStore()

  const [slugTouched, setSlugTouched] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    passwordConfirm: "",
    name: "",
    slug: "",
    theme_color: "#111827",
    currency: "TRY",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }))
  }

  const handleSlugChange = (value: string) => {
    setSlugTouched(true)
    setFormData((prev) => ({
      ...prev,
      slug: slugify(value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.passwordConfirm) {
      toast.error("Şifreler eşleşmiyor!")
      return
    }

    if (formData.password.length < 8) {
      toast.error("Şifre en az 8 karakter olmalıdır!")
      return
    }

    try {
      const data: RestaurantData = {
        ...formData,
        slug: formData.slug || slugify(formData.name || formData.username),
        emailVisibility: true,
        values: defaultMenu,
      }

      await signUp(data)
      toast.success("Kayıt başarılı!")

      setTimeout(() => router.push("/"), 2000)
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Kayıt sırasında bir hata oluştu!"
      toast.error(errorMessage)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-black">
          Hesabınızı Oluşturun
        </h1>
        <p className="text-black/50 text-sm">
          Restoran panelinizi açın ve menünüzü saniyeler içinde yönetin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              E-posta Adresi
            </label>
            <input
              id="email"
              className="input-black"
              type="email"
              placeholder="ornek@email.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
              Telefon
            </label>
            <input
              id="phone"
              className="input-black"
              type="tel"
              placeholder="+90 555 123 45 67"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1.5"
            >
              Kullanıcı Adı
            </label>
            <input
              id="username"
              className="input-black"
              type="text"
              placeholder="kullaniciadi"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1.5">
              Restoran Adı
            </label>
            <input
              id="name"
              className="input-black"
              type="text"
              placeholder="Restoranım"
              name="name"
              value={formData.name}
              onChange={(event) => handleNameChange(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="slug" className="block text-sm font-medium mb-1.5">
              Menü Slug
            </label>
            <input
              id="slug"
              className="input-black"
              type="text"
              placeholder="restoran"
              name="slug"
              value={formData.slug}
              onChange={(event) => handleSlugChange(event.target.value)}
            />
            <p className="mt-1 text-xs text-black/40">
              /menu/{formData.slug || "slug"}
            </p>
          </div>
          <div>
            <label
              htmlFor="theme_color"
              className="block text-sm font-medium mb-1.5"
            >
              Tema Rengi
            </label>
            <ThemeColorPicker
              showPresets={false}
              value={formData.theme_color}
              onChange={(color) =>
                setFormData((prev) => ({ ...prev, theme_color: color }))
              }
            />
          </div>
          <div>
            <label
              htmlFor="currency"
              className="block text-sm font-medium mb-1.5"
            >
              Para Birimi
            </label>
            <CurrencySelector
              value={formData.currency}
              onChange={(currency) =>
                setFormData((prev) => ({ ...prev, currency }))
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1.5"
            >
              Şifre
            </label>
            <input
              id="password"
              className="input-black"
              type="password"
              placeholder="••••••••"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>
          <div>
            <label
              htmlFor="passwordConfirm"
              className="block text-sm font-medium mb-1.5"
            >
              Şifre Tekrar
            </label>
            <input
              id="passwordConfirm"
              className="input-black"
              type="password"
              placeholder="••••••••"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-red-600/20"
        >
          {isLoading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
        </button>
      </form>

      <p className="text-sm text-black/50 text-center">
        Zaten hesabınız var mı?{" "}
        <Link
          href="/auth/sign-in"
          className="font-semibold text-red-600 hover:text-red-700"
        >
          Giriş Yap
        </Link>
      </p>
    </div>
  )
}
