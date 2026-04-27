"use client"

import { useMemo, useState } from "react"

import type { MenuItem } from "@/lib/menu"
import { formatCurrency } from "@/lib/utils"
import { useMenuStore } from "@/store/menuStore"
import { ImageUploader } from "./ImageUploader"

interface ProductEditorModalProps {
  open: boolean
  currency: string
  initialData?: MenuItem | null
  onClose: () => void
  onSubmit: (payload: Omit<MenuItem, "id">) => void
}

const CloseIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 6l12 12M6 18L18 6" />
  </svg>
)

export function ProductEditorModal({
  open,
  currency,
  initialData,
  onClose,
  onSubmit,
}: ProductEditorModalProps) {
  const themeColor = useMenuStore((state) => state.themeColor) ?? "#0f172a"

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative z-10 w-full max-w-2xl rounded-sm bg-white p-6 shadow-xl sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <ModalContent
          key={initialData?.id ?? "new"}
          currency={currency}
          initialData={initialData}
          onClose={onClose}
          onSubmit={onSubmit}
          themeColor={themeColor}
        />
      </div>
    </div>
  )
}

type ModalContentProps = Omit<ProductEditorModalProps, "open"> & {
  themeColor: string
}

function ModalContent({
  currency,
  initialData,
  onClose,
  onSubmit,
  themeColor,
}: ModalContentProps) {
  const [name, setName] = useState(initialData?.name ?? "")
  const [description, setDescription] = useState(initialData?.description ?? "")
  const [price, setPrice] = useState(
    initialData ? initialData.price.toString() : "0"
  )
  const [image, setImage] = useState(initialData?.image)
  const [badges, setBadges] = useState(initialData?.badges?.join(", ") ?? "")
  const [isSignature, setIsSignature] = useState(
    Boolean(initialData?.isSignature)
  )
  const [prepTime, setPrepTime] = useState(
    initialData?.prepTime ? initialData.prepTime.toString() : ""
  )

  const accentStyle = useMemo(
    () => ({ backgroundColor: themeColor, borderColor: themeColor }),
    [themeColor]
  )

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const parsedBadges = badges
      .split(",")
      .map((badge) => badge.trim())
      .filter(Boolean)
    onSubmit({
      name,
      description: description || undefined,
      price: Number(price),
      image,
      badges: parsedBadges.length ? parsedBadges : undefined,
      isSignature,
      prepTime: prepTime ? Number(prepTime) : undefined,
    })
    onClose()
  }

  return (
    <>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-neutral-400">
            {initialData ? "Ürünü Güncelle" : "Yeni Ürün"}
          </p>
          <h2 className="text-2xl font-semibold text-neutral-900">
            {initialData ? initialData.name : "Ürün bilgileri"}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm border border-neutral-200 text-neutral-600 transition hover:bg-neutral-100"
          aria-label="Kapat"
        >
          <CloseIcon />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
          <ImageUploader
            label="Ürün fotoğrafı"
            description="Önerilen boyut 4:3"
            value={image}
            onChange={setImage}
            className="h-full"
          />
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-600">
                Ürün Adı
              </label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Örn. Adana Kebap"
                required
                className="input-black h-11"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-600">
                Açıklama
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Opsiyonel açıklama"
                className="input-black min-h-24"
              />
            </div>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-600">
              Fiyat
            </label>
            <div className="space-y-1">
              <input
                type="number"
                min="0"
                step="0.5"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="input-black h-11"
              />
              <p className="text-xs text-neutral-500">
                {formatCurrency(Number(price) || 0, currency)}
              </p>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-600">
              Hazırlanma Süresi
            </label>
            <div className="space-y-1">
              <input
                type="number"
                min="0"
                step="1"
                value={prepTime}
                onChange={(event) => setPrepTime(event.target.value)}
                placeholder="Dakika"
                className="input-black h-11"
              />
              <p className="text-xs text-neutral-500">
                {prepTime ? `${prepTime} dakika` : "Opsiyonel"}
              </p>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-600">
              Rozetler
            </label>
            <input
              value={badges}
              onChange={(event) => setBadges(event.target.value)}
              placeholder="Örn: Yeni, En çok tercih edilen"
              className="input-black h-11"
            />
            <p className="mt-1 text-xs text-neutral-500">
              Virgülle ayırarak birden fazla rozet ekleyin.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-sm border border-neutral-200 px-4 py-3">
          <input
            id="signature"
            type="checkbox"
            checked={isSignature}
            onChange={(event) => setIsSignature(event.target.checked)}
            className="h-4 w-4"
          />
          <label htmlFor="signature" className="text-sm text-neutral-600">
            Şefin önerisi olarak işaretle
          </label>
        </div>
        <button
          type="submit"
          style={accentStyle}
          className="w-full cursor-pointer rounded-sm py-3 font-semibold text-white transition hover:opacity-90"
        >
          {initialData ? "Güncelle" : "Ekle"}
        </button>
      </form>
    </>
  )
}
