import { Metadata } from "next"
import { notFound } from "next/navigation"

import { MenuExperience } from "@/components/menu/MenuExperience"
import { parseMenuValues } from "@/lib/menu"
import {
  RESTAURANT_COLLECTION,
  RestaurantRecord,
  createPocketBaseServerClient,
} from "@/lib/pocketbase"

interface MenuPageProps {
  params: Promise<{ slug: string }>
}

const getRestaurant = async (slug: string) => {
  const escapedSlug = slug.replace(/"/g, '\\"')
  const serverClient = createPocketBaseServerClient()
  try {
    const record = await serverClient
      .collection(RESTAURANT_COLLECTION)
      .getFirstListItem<RestaurantRecord>(`slug = "${escapedSlug}"`)
    return record
  } catch (error) {
    console.error("Menu fetch failed", error)
    return null
  }
}

export async function generateMetadata({
  params,
}: MenuPageProps): Promise<Metadata> {
  const { slug } = await params
  const restaurant = await getRestaurant(slug)

  if (!restaurant) {
    return {
      title: "Menü Bulunamadı",
      description: "Aradığınız menü bulunamadı",
    }
  }

  const menuValues = parseMenuValues(restaurant.values)
  const restaurantName = restaurant.name
  const logoUrl = menuValues.media?.logo || "/alphaslan-favicon.svg"
  const description = `${restaurantName} menüsünü görüntüleyin. ${
    menuValues.categories.length
  } kategori, ${menuValues.categories.reduce(
    (acc, cat) => acc + cat.items.length,
    0
  )} ürün.`

  return {
    title: `${restaurantName} | Menü`,
    description,
    icons: {
      icon: logoUrl,
      apple: logoUrl,
    },
    openGraph: {
      title: `${restaurantName} | Menü`,
      description,
      type: "website",
      images: [
        {
          url: menuValues.media?.hero || logoUrl,
          width: 1200,
          height: 630,
          alt: `${restaurantName} Menü`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${restaurantName} | Menü`,
      description,
      images: [menuValues.media?.hero || logoUrl],
    },
  }
}

export default async function MenuPage({ params }: MenuPageProps) {
  const { slug } = await params
  const restaurant = await getRestaurant(slug)

  if (!restaurant) {
    notFound()
  }

  const menuValues = parseMenuValues(restaurant.values)

  return (
    <MenuExperience
      restaurantName={restaurant.name}
      menu={menuValues}
      currency={restaurant.currency}
      themeColor={restaurant.theme_color}
    />
  )
}
