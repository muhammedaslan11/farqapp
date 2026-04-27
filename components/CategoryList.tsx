"use client"

import { useState } from "react"
import { toast } from "sonner"

import type { MenuItem } from "@/lib/menu"
import { classNames, formatCurrency } from "@/lib/utils"
import { useMenuStore } from "@/store/menuStore"
import { useAuthStore } from "@/store/authStore"
import { RESTAURANT_COLLECTION, pb } from "@/lib/pocketbase"

import { ImageUploader } from "./ImageUploader"
import { ProductEditorModal } from "./ProductEditorModal"

const iconProps = {
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
}

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...iconProps}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...iconProps}>
    <path d="M3 6h18M8 6l1-2h6l1 2M10 11v6M14 11v6M5 6l1 13h12l1-13" />
  </svg>
)

const DragIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...iconProps}>
    <path d="M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01" />
  </svg>
)

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...iconProps}>
    <path d="M12 4l2.3 4.67 5.18.75-3.75 3.65.89 5.19L12 16.9 7.38 18.26l.89-5.19L4.5 9.42l5.2-.75z" />
  </svg>
)

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" {...iconProps}>
    <path d="M12 20h9M4 20h4l10-10a2.828 2.828 0 0 0-4-4L4 16v4z" />
  </svg>
)

export function CategoryList() {
  const { user } = useAuthStore()
  const categories = useMenuStore((state) => state.menu.categories)
  const featuredItemIds = useMenuStore(
    (state) => state.menu.featuredItemIds ?? []
  )
  const currency = useMenuStore((state) => state.currency)
  const themeColor = useMenuStore((state) => state.themeColor) ?? "#0f172a"
  const getMenuValues = useMenuStore((state) => state.getMenuValues)
  const addCategory = useMenuStore((state) => state.addCategory)
  const updateCategoryName = useMenuStore((state) => state.updateCategoryName)
  const updateCategoryDetails = useMenuStore(
    (state) => state.updateCategoryDetails
  )
  const removeCategory = useMenuStore((state) => state.removeCategory)
  const reorderCategories = useMenuStore((state) => state.reorderCategories)
  const addItem = useMenuStore((state) => state.addItem)
  const updateItem = useMenuStore((state) => state.updateItem)
  const removeItem = useMenuStore((state) => state.removeItem)
  const reorderItems = useMenuStore((state) => state.reorderItems)
  const toggleFeaturedItem = useMenuStore((state) => state.toggleFeaturedItem)

  const [newCategoryName, setNewCategoryName] = useState("")
  const [modalCategoryId, setModalCategoryId] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [categoryDragIndex, setCategoryDragIndex] = useState<number | null>(
    null
  )
  const [itemDragState, setItemDragState] = useState<{
    categoryId: string | null
    index: number | null
  }>({ categoryId: null, index: null })
  const [activeTabId, setActiveTabId] = useState<string | null>(
    categories.length > 0 ? categories[0].id : null
  )

  const openModal = (categoryId: string, item?: MenuItem) => {
    setModalCategoryId(categoryId)
    setEditingItem(item ?? null)
    setIsModalOpen(true)
  }

  const handleModalSubmit = (payload: Omit<MenuItem, "id">) => {
    if (!modalCategoryId) return
    if (editingItem) {
      updateItem(modalCategoryId, { ...editingItem, ...payload })
    } else {
      addItem(modalCategoryId, payload)
    }
  }

  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim()
    if (!trimmed) {
      toast.warning("Kategori adı gerekli")
      return
    }
    addCategory(trimmed)
    setNewCategoryName("")
    // Set new category as active after a short delay
    setTimeout(() => {
      const newCategories = useMenuStore.getState().menu.categories
      const newCategory = newCategories[newCategories.length - 1]
      if (newCategory) setActiveTabId(newCategory.id)
    }, 0)
  }

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

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border border-neutral-200 bg-white/95 p-6 shadow-sm text-left">
        <p className="text-xs uppercase tracking-[0.35em] text-neutral-400">
          Kategoriler
        </p>
        <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold text-neutral-900">
            {categories.length} kategori
          </h2>
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <input
              className="input-black h-11 w-full"
              placeholder="Yeni kategori adı"
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
            />
            <button
              onClick={handleAddCategory}
              className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-sm bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              <PlusIcon />
              Ekle
            </button>
          </div>
        </div>
      </div>

      {/* Kategori Tab'ları */}
      {categories.length > 0 && (
        <div className="rounded-3xl border border-neutral-200 bg-white/95 p-4 shadow-sm">
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTabId(category.id)}
                className={classNames(
                  "shrink-0 rounded-sm px-6 py-3 text-sm font-semibold transition-all",
                  activeTabId === category.id
                    ? "bg-black text-white shadow-sm"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                )}
              >
                {category.name}
                <span className="ml-2 text-xs opacity-70">
                  ({category.items.length})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {categories
          .filter((category) => category.id === activeTabId)
          .map((category, categoryIndex) => (
            <article
              key={category.id}
              draggable
              onDragStart={() => setCategoryDragIndex(categoryIndex)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault()
                if (categoryDragIndex === null) return
                reorderCategories(categoryDragIndex, categoryIndex)
                setCategoryDragIndex(null)
              }}
              className="rounded-3xl border border-neutral-100 bg-white/95 p-6 shadow-sm"
            >
              <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
                <ImageUploader
                  label="Kategori görseli"
                  description="Menü kartında gösterilecek"
                  value={category.image}
                  onChange={(url) =>
                    updateCategoryDetails(category.id, { image: url })
                  }
                  className="h-full"
                />
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      <button className="flex h-10 cursor-grab items-center gap-2 rounded-sm border border-dashed border-neutral-300 px-4 text-xs font-semibold uppercase tracking-widest text-neutral-500">
                        <DragIcon />
                        Sürükle
                      </button>
                      <button
                        onClick={() => removeCategory(category.id)}
                        className="flex h-10 cursor-pointer items-center gap-2 rounded-sm border border-red-200 px-4 text-xs font-semibold uppercase tracking-widest text-red-600 transition hover:bg-red-50"
                      >
                        <TrashIcon />
                        Sil
                      </button>
                    </div>
                    <button
                      onClick={() => openModal(category.id)}
                      className="flex h-11 cursor-pointer items-center gap-2 rounded-sm border border-black/10 bg-black/5 px-5 text-sm font-semibold text-black transition hover:bg-black/10"
                    >
                      <PlusIcon />
                      Ürün ekle
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-neutral-600">
                        Başlık
                      </label>
                      <input
                        value={category.name}
                        onChange={(event) =>
                          updateCategoryName(category.id, event.target.value)
                        }
                        className="input-black h-11"
                        placeholder="Kategori adı"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-neutral-600">
                        Açıklama
                      </label>
                      <textarea
                        className="input-black min-h-28"
                        placeholder="Bu kategori hakkında kısa açıklama"
                        value={category.description ?? ""}
                        onChange={(event) =>
                          updateCategoryDetails(category.id, {
                            description: event.target.value || undefined,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <ul className="mt-6 space-y-3">
                {category.items.map((item, index) => (
                  <li
                    key={item.id}
                    draggable
                    onDragStart={() =>
                      setItemDragState({ categoryId: category.id, index })
                    }
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault()
                      if (
                        itemDragState.categoryId === category.id &&
                        itemDragState.index !== null
                      ) {
                        reorderItems(category.id, itemDragState.index, index)
                      }
                      setItemDragState({ categoryId: null, index: null })
                    }}
                    className="rounded-2xl border border-neutral-100 bg-neutral-50/80 p-4"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex flex-1 items-start gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-neutral-200 bg-white">
                          {item.image ? (
                            <picture>
                              <img
                                src={item.image}
                                alt={item.name}
                                sizes="64px"
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            </picture>
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                              Görsel yok
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold text-neutral-900">
                            {item.name}
                          </p>
                          {item.description && (
                            <p className="text-sm text-neutral-500">
                              {item.description}
                            </p>
                          )}
                          {item.badges && item.badges.length > 0 && (
                            <p className="text-xs text-neutral-500">
                              Rozetler: {item.badges.join(", ")}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => toggleFeaturedItem(item.id)}
                          className={classNames(
                            "flex h-9 cursor-pointer items-center gap-1 rounded-sm border px-3 text-xs font-semibold transition",
                            featuredItemIds.includes(item.id)
                              ? "border-amber-400 bg-amber-50 text-amber-800"
                              : "border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-white"
                          )}
                        >
                          <StarIcon />
                          {featuredItemIds.includes(item.id)
                            ? "Favori"
                            : "Favori ekle"}
                        </button>
                        <p className="font-semibold text-neutral-900">
                          {formatCurrency(item.price, currency)}
                        </p>
                        {item.prepTime && (
                          <span className="flex items-center gap-1 rounded-sm bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600">
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
                        <button
                          onClick={() => openModal(category.id, item)}
                          className="flex h-9 cursor-pointer items-center gap-1 rounded-sm border border-neutral-200 px-3 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-100"
                        >
                          <EditIcon />
                          Düzenle
                        </button>
                        <button
                          onClick={() => removeItem(category.id, item.id)}
                          className="flex h-9 cursor-pointer items-center gap-1 rounded-sm border border-red-100 px-3 text-xs font-semibold text-red-500 transition hover:bg-red-50"
                        >
                          <TrashIcon />
                          Sil
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
                {category.items.length === 0 && (
                  <li className="rounded-2xl border border-dashed border-neutral-200 px-4 py-6 text-center text-sm text-neutral-500">
                    Bu kategoriye ürün ekleyin.
                  </li>
                )}
              </ul>
            </article>
          ))}
        {categories.length === 0 && (
          <div className="rounded-sm border border-dashed border-black/20 bg-white/50 p-8 text-center text-neutral-500">
            Henüz kategori yok. Yukarıdan ilk kategoriyi ekleyin.
          </div>
        )}
        {categories.length > 0 && !activeTabId && (
          <div className="rounded-sm border border-dashed border-black/20 bg-white/50 p-8 text-center text-neutral-500">
            Lütfen düzenlemek için bir kategori seçin.
          </div>
        )}
      </div>

      {categories.length > 0 && (
        <div className="rounded-3xl border border-neutral-200 bg-white/95 p-6 shadow-sm">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={classNames(
              "w-full cursor-pointer rounded-sm bg-black px-6 py-4 text-base font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed",
              isSaving && "opacity-70"
            )}
          >
            {isSaving ? "Kaydediliyor..." : "Menü Değişikliklerini Kaydet"}
          </button>
        </div>
      )}

      <ProductEditorModal
        open={isModalOpen}
        currency={currency}
        initialData={editingItem}
        onClose={() => {
          setIsModalOpen(false)
          setEditingItem(null)
          setModalCategoryId(null)
        }}
        onSubmit={handleModalSubmit}
      />
    </section>
  )
}
