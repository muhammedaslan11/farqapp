"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import PocketBase from "pocketbase"

const pb = new PocketBase("https://aslan.pockethost.io")

export default function DemandFormPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    customer: "",
    name: "",
    surname: "",
    email: "",
    phone: "",
    note: "",
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      const data = {
        customer: formData.customer,
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        phone: formData.phone,
        status: "Pending",
        note: formData.note,
      }

      await pb.collection("AA_qr_demands").create(data)
      toast.success("Talebiniz başarıyla oluşturuldu")
      router.push("/auth/sign-in")
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Talep oluşturulurken bir hata oluştu"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-black tracking-tight text-black">
          Talep Formu
        </h1>
        <p className="text-black/50 text-sm">
          Bilgilerinizi doldurun, sizinle iletişime geçelim.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Müşteri Adı
          </label>
          <input
            className="input-black"
            name="customer"
            value={formData.customer}
            onChange={handleChange}
            placeholder="Şirket veya işletme adı"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Ad</label>
            <input
              className="input-black"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Adınız"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Soyad</label>
            <input
              className="input-black"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder="Soyadınız"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">E-posta</label>
          <input
            className="input-black"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="ornek@email.com"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">Telefon</label>
          <input
            className="input-black"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+90 555 123 4567"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Not{" "}
            <span className="text-black/30 font-normal">(opsiyonel)</span>
          </label>
          <textarea
            className="input-black min-h-[100px]"
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Ek bilgiler veya talepleriniz..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-red-600/20"
        >
          {isLoading ? "Gönderiliyor..." : "Talep Oluştur"}
        </button>
      </form>

      <p className="text-sm text-black/50 text-center">
        Hesabınız var mı?{" "}
        <Link
          href="/auth/sign-in"
          className="font-semibold text-red-600 hover:text-red-700"
        >
          Giriş yapın
        </Link>
      </p>
    </div>
  )
}
