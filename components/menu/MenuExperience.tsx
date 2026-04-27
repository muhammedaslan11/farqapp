"use client"

import { useEffect, useMemo, useState } from "react"

import { MenuCategory, MenuItem, MenuValues } from "@/lib/menu"
import { classNames, formatCurrency, getMenuPalette } from "@/lib/utils"

import { BottomDrawer } from "@/components/ui/BottomDrawer"

interface OrderItem {
  item: MenuItem
  quantity: number
  notes?: string
}

interface MenuExperienceProps {
  restaurantName: string
  menu: MenuValues
  currency: string
  themeColor: string
}

const fallbackImage =
  "https://images.unsplash.com/photo-1478145046317-39f10e56b5e9?auto=format&fit=crop&w=800&q=80"

const placeholderImage = "/placeholder.jpg"

export function MenuExperience({
  restaurantName,
  menu,
  currency,
  themeColor,
}: MenuExperienceProps) {
  const palette = getMenuPalette(themeColor)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [sheet, setSheet] = useState<"info" | "item" | "cart" | null>(null)
  const [activeCategoryId, setActiveCategoryId] = useState(
    menu.categories[0]?.id
  )
  const [isLoading, setIsLoading] = useState(true)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [itemQuantity, setItemQuantity] = useState(1)
  const [itemNotes, setItemNotes] = useState("")

  const heroImage = menu.media?.hero ?? fallbackImage
  const logoImage = menu.media?.logo
  const info = menu.info ?? {}
  const heroBadges = info.heroBadges ?? ["wifi", "coffee", "dessert"]

  const featuredItems = useMemo(() => {
    const featuredIds = new Set(menu.featuredItemIds ?? [])
    const allItems: MenuItem[] = []
    menu.categories.forEach((category) => {
      category.items.forEach((item) => {
        if (featuredIds.has(item.id)) {
          allItems.push(item)
        }
      })
    })
    if (allItems.length > 0) return allItems
    return menu.categories.flatMap((category) => category.items).slice(0, 5)
  }, [menu])

  // Collect all images
  const allImages = useMemo(() => {
    const images: string[] = []
    if (heroImage) images.push(heroImage)
    if (logoImage) images.push(logoImage)
    featuredItems.forEach((item) => {
      if (item.image) images.push(item.image)
    })
    menu.categories.forEach((category) => {
      if (category.image) images.push(category.image)
      category.items.forEach((item) => {
        if (item.image) images.push(item.image)
      })
    })
    return [...new Set(images)] // Remove duplicates
  }, [heroImage, logoImage, featuredItems, menu.categories])

  // Preload all images
  useEffect(() => {
    if (allImages.length === 0) {
      setIsLoading(false)
      return
    }

    let loadedCount = 0
    const imagesToLoad = allImages.length

    allImages.forEach((src) => {
      const img = new window.Image()
      img.onload = img.onerror = () => {
        loadedCount++
        if (loadedCount === imagesToLoad) {
          setIsLoading(false)
        }
      }
      img.src = src
    })
  }, [allImages])

  const activeCategory: MenuCategory | undefined =
    menu.categories.find((category) => category.id === activeCategoryId) ??
    menu.categories[0]

  const openItemDetails = (item: MenuItem) => {
    setSelectedItem(item)
    setItemQuantity(1)
    setItemNotes("")
    setSheet("item")
  }

  const closeSheet = () => {
    setSheet(null)
    setSelectedItem(null)
  }

  const addToOrder = () => {
    if (!selectedItem) return

    const existingIndex = orderItems.findIndex(
      (orderItem) => orderItem.item.id === selectedItem.id
    )

    if (existingIndex >= 0) {
      const updatedItems = [...orderItems]
      updatedItems[existingIndex].quantity += itemQuantity
      if (itemNotes) {
        updatedItems[existingIndex].notes = itemNotes
      }
      setOrderItems(updatedItems)
    } else {
      setOrderItems([
        ...orderItems,
        { item: selectedItem, quantity: itemQuantity, notes: itemNotes },
      ])
    }

    closeSheet()
  }

  const removeFromOrder = (itemId: string) => {
    setOrderItems(
      orderItems.filter((orderItem) => orderItem.item.id !== itemId)
    )
  }

  const updateOrderQuantity = (itemId: string, delta: number) => {
    setOrderItems(
      orderItems
        .map((orderItem) =>
          orderItem.item.id === itemId
            ? { ...orderItem, quantity: orderItem.quantity + delta }
            : orderItem
        )
        .filter((orderItem) => orderItem.quantity > 0)
    )
  }

  const totalAmount = orderItems.reduce(
    (sum, orderItem) => sum + orderItem.item.price * orderItem.quantity,
    0
  )

  const infoFields = [
    { label: "Adres", value: info.address },
    { label: "Telefon", value: info.phone },
    { label: "WhatsApp", value: info.whatsapp },
    { label: "Çalışma Saatleri", value: info.hours },
    { label: "Instagram", value: info.instagram },
    { label: "Notlar", value: info.notes },
  ].filter((field) => Boolean(field.value))

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: palette.device }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-neutral-200"></div>
            <div
              className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: themeColor, borderTopColor: "transparent" }}
            ></div>
          </div>
          <p className="text-sm font-medium text-neutral-600">
            Menü yükleniyor...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-neutral-100 px-4 py-6 flex justify-center"
      style={{ background: palette.device }}
    >
      <div className="relative flex w-full max-w-md flex-col gap-6 pb-24">
        <section className="relative overflow-hidden rounded-sm">
          <div className="relative h-64 rounded-sm overflow-hidden">
            <picture>
              <img
                src={heroImage}
                alt="Hero"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </picture>
            <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/50 to-black/80" />
            <div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
              <div className="flex justify-end">
                <button
                  onClick={() => setSheet("info")}
                  className="rounded-sm bg-white/80 px-4 py-2 text-xs font-semibold text-neutral-900"
                >
                  Menü & Bilgiler
                </button>
              </div>
              <div className="space-y-3 text-center">
                <div className="mx-auto h-16 w-16 overflow-hidden rounded-full border border-white/40 bg-white/10">
                  {logoImage ? (
                    <picture>
                      <img
                        src={logoImage}
                        alt="Logo"
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </picture>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm font-semibold uppercase tracking-widest">
                      LOGO
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-white/70 font-bold">
                    {info.hours ?? "Hoş geldiniz"}
                  </p>
                  <h1 className="text-3xl font-semibold">{restaurantName}</h1>
                  <div className="my-3 flex items-center justify-center gap-3">
                    {info.instagram && (
                      <a
                        href={`https://instagram.com/${info.instagram}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white/80 hover:text-white transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                    )}
                    {info.tiktok && (
                      <a
                        href={`https://tiktok.com/@${info.tiktok}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white/80 hover:text-white transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                        </svg>
                      </a>
                    )}
                    {info.youtube && (
                      <a
                        href={`https://youtube.com/@${info.youtube}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white/80 hover:text-white transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-3 text-xs">
                {heroBadges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-sm bg-white/20 px-3 py-1 uppercase tracking-widest"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-sm bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">
                Favoriler
              </p>
              <h2 className="text-xl font-semibold text-neutral-900">
                En Çok Tercih Edilenler
              </h2>
            </div>
            <span className="text-xs text-neutral-500">
              {featuredItems.length} ürün
            </span>
          </div>
          <div className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-2">
            {featuredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => openItemDetails(item)}
                className="w-44 shrink-0 text-left"
              >
                <div className="relative h-28 w-full overflow-hidden rounded-sm">
                  <picture>
                    <img
                      src={item.image ?? placeholderImage}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </picture>
                  {item.badges && item.badges.length > 0 && (
                    <div className="absolute left-2 top-2 rounded-sm bg-white/90 px-2 py-1 text-xs font-semibold text-neutral-800">
                      {item.badges[0]}
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm font-semibold text-neutral-900">
                  {item.name}
                </p>
                {item.description && (
                  <p className="text-xs text-neutral-500 line-clamp-2">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-neutral-700">
                    {formatCurrency(item.price, currency)}
                  </p>
                  {item.prepTime && (
                    <span className="flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700">
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {item.prepTime} dk
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-sm bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.4em] text-neutral-400">
                Kategoriler
              </p>
              <div className="flex items-center gap-1 text-xs text-neutral-400">
                <svg
                  className="h-4 w-4 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                Kaydır
              </div>
            </div>
            <div className="no-scrollbar relative flex gap-3 overflow-x-auto pb-2">
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-white to-transparent pointer-events-none z-10" />
              {menu.categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategoryId(category.id)}
                  className={classNames(
                    "w-32 shrink-0 rounded-sm border text-left transition-all",
                    activeCategory?.id === category.id
                      ? "border-neutral-900 ring-2 ring-neutral-900/20"
                      : "border-neutral-200 hover:border-neutral-300"
                  )}
                >
                  <div className="relative h-24 w-full overflow-hidden rounded-sm">
                    <picture>
                      <img
                        src={category.image ?? placeholderImage}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </picture>
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                    <p className="absolute inset-x-2 bottom-2 text-sm font-semibold text-white">
                      {category.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {activeCategory && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">
                    {activeCategory.name}
                  </p>
                  {activeCategory.description && (
                    <p className="text-sm text-neutral-500">
                      {activeCategory.description}
                    </p>
                  )}
                </div>
                <span className="text-xs text-neutral-500">
                  {activeCategory.items.length} ürün
                </span>
              </div>
              {activeCategory.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => openItemDetails(item)}
                  className="flex w-full items-center gap-3 rounded-sm border border-neutral-100 bg-neutral-50/60 p-3 text-left"
                >
                  <div className="relative h-20 w-20 overflow-hidden rounded-sm">
                    <picture>
                      <img
                        src={item.image ?? placeholderImage}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </picture>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-neutral-900">
                        {item.name}
                      </p>
                      {item.isSignature && (
                        <span className="rounded-sm bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                          Şefin önerisi
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-sm text-neutral-500 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    {item.prepTime && (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                        <svg
                          className="h-3 w-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {item.prepTime} dk
                      </span>
                    )}
                  </div>
                  <p className="font-semibold text-neutral-900">
                    {formatCurrency(item.price, currency)}
                  </p>
                </button>
              ))}
              {activeCategory.items.length === 0 && (
                <p className="rounded-sm border border-dashed border-neutral-200 p-4 text-center text-sm text-neutral-500">
                  Bu kategoriye ürün ekleyin.
                </p>
              )}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="rounded-sm bg-white p-4 shadow-sm text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <a
              href="https://alphaslan.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <picture>
                <img
                  src="/alphaslan-dark.svg"
                  alt="Alphaslan Media"
                  width={80}
                  className="max-h-7 object-cover"
                />
              </picture>
            </a>
          </div>

          <p className="text-xs text-neutral-400">
            Dijital menü çözümleri için{" "}
            <a
              href="https://farqapp.com"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-600 hover:text-neutral-900 font-medium underline"
            >
              farqapp.com
            </a>
          </p>
        </footer>

        {/* Sepet - Alt Ortada Sabit */}
        {orderItems.length > 0 && (
          <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4">
            <button
              onClick={() => setSheet("cart")}
              className="w-full max-w-md rounded-full bg-black shadow-2xl px-6 py-4 flex items-center justify-between text-white transition-all hover:scale-105 active:scale-95"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                    {orderItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                <span className="text-sm font-semibold">Sepetim</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">
                  {formatCurrency(totalAmount, currency)}
                </span>
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          </div>
        )}
      </div>

      <BottomDrawer
        open={sheet === "info"}
        onClose={closeSheet}
        title="Restoran Bilgileri"
      >
        {infoFields.length === 0 && (
          <p className="text-sm text-neutral-500">
            Panelden adres ve iletişim bilgilerini ekleyin.
          </p>
        )}
        <div className="space-y-3">
          {infoFields.map((field) => (
            <div key={field.label}>
              <p className="text-xs uppercase tracking-widest text-neutral-400">
                {field.label}
              </p>
              {field.label === "Telefon" && field.value ? (
                <a
                  href={`tel:${field.value}`}
                  className="text-sm font-medium text-neutral-800 hover:text-black underline"
                >
                  {field.value}
                </a>
              ) : field.label === "WhatsApp" && field.value ? (
                <a
                  href={`https://wa.me/${field.value.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-neutral-800 hover:text-black underline"
                >
                  {field.value}
                </a>
              ) : field.label === "Instagram" && field.value ? (
                <a
                  href={`https://instagram.com/${field.value}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-neutral-800 hover:text-black underline"
                >
                  @{field.value}
                </a>
              ) : (
                <p className="text-sm font-medium text-neutral-800">
                  {field.value}
                </p>
              )}
            </div>
          ))}
          {info.mapsUrl && (
            <a
              href={info.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900"
            >
              Haritada aç
              <span aria-hidden>↗</span>
            </a>
          )}
        </div>
      </BottomDrawer>
      <BottomDrawer
        open={sheet === "item" && Boolean(selectedItem)}
        onClose={closeSheet}
        title={selectedItem ? selectedItem.name : "Ürün detayı"}
      >
        {selectedItem && (
          <div className="space-y-4">
            <div className="relative h-48 w-full overflow-hidden rounded-sm">
              <picture>
                <img
                  src={selectedItem.image ?? placeholderImage}
                  alt={selectedItem.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </picture>
            </div>
            {selectedItem.badges && selectedItem.badges.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedItem.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-sm bg-neutral-900/5 px-3 py-1 text-xs font-medium text-neutral-700"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
            {selectedItem.description && (
              <p className="text-sm text-neutral-600">
                {selectedItem.description}
              </p>
            )}
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-neutral-900">
                {formatCurrency(selectedItem.price, currency)}
              </p>
              {selectedItem.prepTime && (
                <div className="flex items-center gap-1.5 rounded-sm bg-neutral-100 px-3 py-1.5 text-sm text-neutral-700">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-medium">
                    {selectedItem.prepTime} dakika
                  </span>
                </div>
              )}
            </div>

            {/* Miktar Seçici */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-neutral-400">
                Miktar
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-sm border border-neutral-300 text-lg font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  -
                </button>
                <span className="flex-1 text-center text-lg font-semibold">
                  {itemQuantity}
                </span>
                <button
                  onClick={() => setItemQuantity(itemQuantity + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-sm border border-neutral-300 text-lg font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Sipariş Notu */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-neutral-400">
                Sipariş Notu (Opsiyonel)
              </label>
              <textarea
                value={itemNotes}
                onChange={(e) => setItemNotes(e.target.value)}
                placeholder="Özel istekleriniz..."
                className="w-full rounded-sm border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none"
                rows={3}
              />
            </div>

            {/* Sepete Ekle Butonu */}
            <button
              onClick={addToOrder}
              className="w-full rounded-sm bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              Sepete Ekle -{" "}
              {formatCurrency(selectedItem.price * itemQuantity, currency)}
            </button>
          </div>
        )}
      </BottomDrawer>

      {/* Sepet Drawer */}
      <BottomDrawer
        open={sheet === "cart"}
        onClose={closeSheet}
        title="Siparişiniz"
      >
        {orderItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-neutral-500">
              Sepetinizde ürün bulunmuyor
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Sipariş Listesi */}
            <div className="space-y-3">
              {orderItems.map((orderItem) => (
                <div
                  key={orderItem.item.id}
                  className="flex items-start gap-3 rounded-sm border border-neutral-100 bg-neutral-50/60 p-3"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-sm">
                    <picture>
                      <img
                        src={orderItem.item.image ?? placeholderImage}
                        alt={orderItem.item.name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </picture>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-900">
                      {orderItem.item.name}
                    </p>
                    {orderItem.notes && (
                      <p className="text-xs text-neutral-500 italic">
                        Not: {orderItem.notes}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateOrderQuantity(orderItem.item.id, -1)
                        }
                        className="flex h-6 w-6 items-center justify-center rounded-sm border border-neutral-300 text-sm font-semibold hover:bg-neutral-100"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium">
                        {orderItem.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateOrderQuantity(orderItem.item.id, 1)
                        }
                        className="flex h-6 w-6 items-center justify-center rounded-sm border border-neutral-300 text-sm font-semibold hover:bg-neutral-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-semibold text-neutral-900">
                      {formatCurrency(
                        orderItem.item.price * orderItem.quantity,
                        currency
                      )}
                    </p>
                    <button
                      onClick={() => removeFromOrder(orderItem.item.id)}
                      className="rounded-sm px-3 py-1.5 text-xs font-semibold text-white bg-black border border-neutral-700 hover:bg-neutral-900 hover:border-neutral-600 transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Toplam */}
            <div className="border-t border-neutral-200 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-neutral-900">Toplam</p>
                <p className="text-xl font-bold text-neutral-900">
                  {formatCurrency(totalAmount, currency)}
                </p>
              </div>
            </div>
          </div>
        )}
      </BottomDrawer>
    </div>
  )
}
