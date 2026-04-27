"use client"

import { create } from "zustand"
import {
  MenuCategory,
  MenuItem,
  MenuValues,
  MenuInfo,
  MenuMedia,
  generateId,
  parseMenuValues,
  defaultMenu,
} from "@/lib/menu"

interface MenuState {
  menu: MenuValues
  themeColor: string
  currency: string
  setInitialData: (payload: {
    values?: MenuValues | string | null
    themeColor?: string
    currency?: string
  }) => void
  setThemeColor: (color: string) => void
  setCurrency: (currency: string) => void
  addCategory: (name: string) => void
  updateCategoryName: (id: string, name: string) => void
  updateCategoryDetails: (
    id: string,
    payload: Partial<Omit<MenuCategory, "id" | "items">>
  ) => void
  removeCategory: (id: string) => void
  reorderCategories: (source: number, destination: number) => void
  addItem: (categoryId: string, item: Omit<MenuItem, "id">) => void
  updateItem: (categoryId: string, item: MenuItem) => void
  removeItem: (categoryId: string, itemId: string) => void
  reorderItems: (
    categoryId: string,
    source: number,
    destination: number
  ) => void
  toggleFeaturedItem: (itemId: string) => void
  updateInfo: (info: Partial<MenuInfo>) => void
  updateMedia: (media: Partial<MenuMedia>) => void
  updateHeroBadges: (badges: string[]) => void
  getMenuValues: () => MenuValues
}

const move = <T>(list: T[], source: number, destination: number) => {
  if (
    source === destination ||
    source < 0 ||
    destination < 0 ||
    source >= list.length ||
    destination >= list.length
  ) {
    return list
  }

  const updated = [...list]
  const [removed] = updated.splice(source, 1)
  if (!removed) {
    return list
  }
  updated.splice(destination, 0, removed)
  return updated
}

export const useMenuStore = create<MenuState>((set, get) => ({
  menu: defaultMenu,
  themeColor: "#000000",
  currency: "TRY",

  setInitialData: ({ values, themeColor, currency }) => {
    set(() => ({
      menu: values ? parseMenuValues(values) : defaultMenu,
      themeColor: themeColor ?? "#000000",
      currency: currency ?? "TRY",
    }))
  },

  setThemeColor: (color) => set({ themeColor: color }),
  setCurrency: (currency) => set({ currency }),

  addCategory: (name) =>
    set((state) => ({
      menu: {
        ...state.menu,
        categories: [
          ...state.menu.categories,
          { id: generateId(), name, items: [] },
        ],
      },
    })),

  updateCategoryName: (id, name) =>
    set((state) => ({
      menu: {
        ...state.menu,
        categories: state.menu.categories.map((category) =>
          category.id === id ? { ...category, name } : category
        ),
      },
    })),

  updateCategoryDetails: (id, payload) =>
    set((state) => ({
      menu: {
        ...state.menu,
        categories: state.menu.categories.map((category) =>
          category.id === id ? { ...category, ...payload } : category
        ),
      },
    })),

  removeCategory: (id) =>
    set((state) => ({
      menu: {
        ...state.menu,
        categories: state.menu.categories.filter(
          (category) => category.id !== id
        ),
      },
    })),

  reorderCategories: (source, destination) => {
    set((state) => ({
      menu: {
        ...state.menu,
        categories: move(state.menu.categories, source, destination),
      },
    }))
  },

  addItem: (categoryId, item) =>
    set((state) => ({
      menu: {
        ...state.menu,
        categories: state.menu.categories.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                items: [...category.items, { id: generateId(), ...item }],
              }
            : category
        ),
      },
    })),

  updateItem: (categoryId, item) =>
    set((state) => ({
      menu: {
        ...state.menu,
        categories: state.menu.categories.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                items: category.items.map((existing) =>
                  existing.id === item.id ? item : existing
                ),
              }
            : category
        ),
      },
    })),

  removeItem: (categoryId, itemId) =>
    set((state) => ({
      menu: {
        ...state.menu,
        categories: state.menu.categories.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                items: category.items.filter((item) => item.id !== itemId),
              }
            : category
        ),
      },
    })),

  reorderItems: (categoryId, source, destination) =>
    set((state) => ({
      menu: {
        ...state.menu,
        categories: state.menu.categories.map((category) =>
          category.id === categoryId
            ? { ...category, items: move(category.items, source, destination) }
            : category
        ),
      },
    })),

  toggleFeaturedItem: (itemId) =>
    set((state) => {
      const featured = state.menu.featuredItemIds ?? []
      const exists = featured.includes(itemId)
      return {
        menu: {
          ...state.menu,
          featuredItemIds: exists
            ? featured.filter((id) => id !== itemId)
            : [...featured, itemId],
        },
      }
    }),

  updateInfo: (info) =>
    set((state) => ({
      menu: {
        ...state.menu,
        info: { ...(state.menu.info ?? {}), ...info },
      },
    })),

  updateMedia: (media) =>
    set((state) => ({
      menu: {
        ...state.menu,
        media: { ...(state.menu.media ?? {}), ...media },
      },
    })),

  updateHeroBadges: (badges) =>
    set((state) => ({
      menu: {
        ...state.menu,
        info: { ...(state.menu.info ?? {}), heroBadges: badges.slice(0, 3) },
      },
    })),

  getMenuValues: () => get().menu,
}))
