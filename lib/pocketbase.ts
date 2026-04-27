import PocketBase from "pocketbase"

import type { MenuValues } from "@/lib/menu"
import { POCKETBASE_URL, RESTAURANT_COLLECTION } from "@/lib/config"

export { POCKETBASE_URL, RESTAURANT_COLLECTION }

// PocketBase constructor accesses browser-only `location` global.
// Only instantiate on the client to avoid SSR/SSG build errors.
export const pb = (
  typeof window !== "undefined"
    ? (() => {
        const client = new PocketBase(POCKETBASE_URL)
        client.autoCancellation(false)
        return client
      })()
    : null
) as PocketBase

export interface RestaurantData {
  username: string
  email: string
  emailVisibility: boolean
  password: string
  passwordConfirm: string
  name: string
  slug: string
  theme_color: string
  currency: string
  values: MenuValues
  phone?: string
}

export interface RestaurantRecord {
  id: string
  created: string
  updated: string
  username: string
  email: string
  emailVisibility: boolean
  name: string
  slug: string
  theme_color: string
  currency: string
  values: MenuValues | string | null
  verified: boolean
  phone?: string
}

export const createPocketBaseServerClient = () => {
  const client = new PocketBase(POCKETBASE_URL)
  client.autoCancellation(false)
  return client
}
