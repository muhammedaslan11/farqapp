"use client"

import { create } from "zustand"
import {
  RESTAURANT_COLLECTION,
  RestaurantData,
  RestaurantRecord,
  pb,
} from "@/lib/pocketbase"

interface AuthState {
  user: RestaurantRecord | null
  isLoading: boolean
  error: string | null
  signUp: (data: RestaurantData) => Promise<void>
  signIn: (identifier: string, password: string) => Promise<void>
  hydrateFromPocketBase: () => void
  updateUser: (data: Partial<RestaurantRecord>) => void
  signOut: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: (pb?.authStore?.model as unknown as RestaurantRecord) ?? null,
  isLoading: false,
  error: null,

  signUp: async (data: RestaurantData) => {
    set({ isLoading: true, error: null })
    try {
      const record = await pb
        .collection(RESTAURANT_COLLECTION)
        .create<RestaurantRecord>(data)

      await pb.collection(RESTAURANT_COLLECTION).requestVerification(data.email)

      set({ user: record, isLoading: false })
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Kayıt sırasında bir hata oluştu"
      set({
        error: errorMessage,
        isLoading: false,
      })
      throw error
    }
  },

  signIn: async (identifier: string, password: string) => {
    set({ isLoading: true, error: null })
    try {
      const authResponse = await pb
        .collection(RESTAURANT_COLLECTION)
        .authWithPassword<RestaurantRecord>(identifier, password)

      set({ user: authResponse.record, isLoading: false })
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Giriş sırasında bir hata oluştu"

      set({ error: errorMessage, isLoading: false })
      throw error
    }
  },

  hydrateFromPocketBase: () => {
    const record = pb.authStore.model as unknown as RestaurantRecord | null
    if (record) {
      set({ user: record })
    }
  },

  updateUser: (data) =>
    set((state) =>
      state.user
        ? {
            user: { ...state.user, ...data },
          }
        : state
    ),

  signOut: () => {
    pb.authStore.clear()
    set({ user: null })
  },

  clearError: () => set({ error: null }),
}))
