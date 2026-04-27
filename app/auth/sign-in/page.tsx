"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { useAuthStore } from "@/store/authStore"

export default function SignInPage() {
  const router = useRouter()
  const { signIn, isLoading } = useAuthStore()
  const [identifier, setIdentifier] = useState("aslanmuhammed2534@gmail.com")
  const [password, setPassword] = useState("12345678")

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      await signIn(identifier, password)
      toast.success("Tekrar hoş geldiniz")
      router.push("/dashboard")
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Giriş sırasında bir hata"
      toast.error(message)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-black">
          Panelinize giriş yapın
        </h1>
        <p className="text-black/50 text-sm">
          Menünüzü dilediğiniz zaman güncelleyin.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-black">
            E-posta veya kullanıcı adı
          </label>
          <input
            className="input-black"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            placeholder="ornek@email.com"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-black">
            Şifre
          </label>
          <input
            className="input-black"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-red-600/20"
        >
          {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      <p className="text-sm text-black/50 text-center">
        Hesabınız yok mu?{" "}
        <Link
          href="/auth/demand-form"
          className="font-semibold text-red-600 hover:text-red-700"
        >
          Talep oluşturun
        </Link>
      </p>
    </div>
  )
}
