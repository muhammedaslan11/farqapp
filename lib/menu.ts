export interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  badges?: string[]
  isSignature?: boolean
  prepTime?: number // Dakika cinsinden hazırlanma süresi
}

export interface MenuCategory {
  id: string
  name: string
  description?: string
  image?: string
  items: MenuItem[]
}

export interface MenuInfo {
  address?: string
  phone?: string
  whatsapp?: string
  hours?: string
  instagram?: string
  tiktok?: string
  youtube?: string
  mapsUrl?: string
  notes?: string
  heroBadges?: string[]
}

export interface MenuMedia {
  hero?: string
  logo?: string
}

export interface MenuValues {
  categories: MenuCategory[]
  featuredItemIds?: string[]
  info?: MenuInfo
  media?: MenuMedia
}

const sampleImage = (query: string) =>
  `https://images.unsplash.com/${query}?auto=format&fit=crop&w=800&q=80`

export const defaultMenu: MenuValues = {
  categories: [
    {
      id: "cat-breakfast",
      name: "Güne Başlarken",
      image: sampleImage("photo-1473093226795-af9932fe5856"),
      items: [
        {
          id: "item-menemen",
          name: "Şef Menemen",
          description: "Tereyağlı, köy yumurtalı",
          price: 165,
          image: sampleImage("photo-1504754524776-8f4f37790ca0"),
          badges: ["Yeni"],
          isSignature: true,
        },
        {
          id: "item-kahvalti",
          name: "Mini Kahvaltı",
          description: "2 kişilik serpme tadında",
          price: 420,
          image: sampleImage("photo-1466978913421-dad2ebd01d17"),
        },
      ],
    },
    {
      id: "cat-main",
      name: "Ana Yemekler",
      image: sampleImage("photo-1478145046317-39f10e56b5e9"),
      items: [
        {
          id: "item-iskender",
          name: "İskender Kebap",
          description: "Tereyağlı, taş fırın pideli",
          price: 380,
          image: sampleImage("photo-1504674900247-0877df9cc836"),
          isSignature: true,
        },
        {
          id: "item-bal",
          name: "Özel Baklava",
          description: "74 kat baklava hamuru",
          price: 210,
          image: sampleImage("photo-1504754524776-8f4f37790ca0"),
        },
      ],
    },
  ],
  featuredItemIds: ["item-menemen", "item-iskender", "item-bal"],
  info: {
    address: "Bağdat Caddesi No:42, Kadıköy / İstanbul",
    phone: "+90 212 000 00 00",
    whatsapp: "+90 530 000 00 00",
    instagram: "alphaslan.cafe",
    hours: "09:00 - 24:00",
    mapsUrl: "https://maps.app.goo.gl/example",
  },
  media: {
    hero: sampleImage("photo-1445019980597-93fa8acb246c"),
    logo: sampleImage("photo-1466978913421-dad2ebd01d17"),
  },
}

export const emptyMenu = (): MenuValues => ({
  categories: [],
  featuredItemIds: [],
  info: {},
  media: {},
})

const normalizeMenu = (input?: Partial<MenuValues> | null): MenuValues => {
  if (!input) return emptyMenu()

  const categories = Array.isArray(input.categories)
    ? input.categories.map((category) => {
        const items = Array.isArray(category?.items)
          ? category.items.map((item) => ({
              id: item?.id ?? generateId(),
              name: item?.name ?? "Ürün",
              description: item?.description,
              price:
                typeof item?.price === "number"
                  ? item.price
                  : Number(item?.price) || 0,
              image: item?.image,
              badges: Array.isArray(item?.badges)
                ? item.badges.filter(
                    (badge): badge is string => typeof badge === "string"
                  )
                : undefined,
              isSignature: Boolean(item?.isSignature),
              prepTime: typeof item?.prepTime === "number" ? item.prepTime : undefined,
            }))
          : []
        return {
          id: category?.id ?? generateId(),
          name: category?.name ?? "Kategori",
          description: category?.description,
          image: category?.image,
          items,
        }
      })
    : []

  const info: MenuInfo | undefined = input.info
    ? {
        address: input.info.address,
        phone: input.info.phone,
        whatsapp: input.info.whatsapp,
        hours: input.info.hours,
        instagram: input.info.instagram,
        tiktok: input.info.tiktok,
        youtube: input.info.youtube,
        mapsUrl: input.info.mapsUrl,
        notes: input.info.notes,
        heroBadges: Array.isArray(input.info.heroBadges)
          ? input.info.heroBadges.filter(
              (badge): badge is string => typeof badge === "string"
            )
          : undefined,
      }
    : undefined

  const media: MenuMedia | undefined = input.media
    ? {
        hero: input.media.hero,
        logo: input.media.logo,
      }
    : undefined

  const featuredIds = Array.isArray(input.featuredItemIds)
    ? input.featuredItemIds.filter((id): id is string => typeof id === "string")
    : []

  return {
    categories,
    featuredItemIds: featuredIds,
    info,
    media,
  }
}

export const parseMenuValues = (
  values?: string | MenuValues | null
): MenuValues => {
  if (!values) return emptyMenu()
  if (typeof values === "string") {
    try {
      return normalizeMenu(JSON.parse(values) as MenuValues)
    } catch (error) {
      console.warn("Failed to parse menu values", error)
      return emptyMenu()
    }
  }

  return normalizeMenu(values)
}

export const generateId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)
