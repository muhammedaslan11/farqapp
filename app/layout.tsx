import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"

import "./globals.css"
import "@uploadthing/react/styles.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: "Farq.app — Restoranınız için modern QR menü",
  description:
    "Restoranlar için drag & drop QR menü deneyimi. Menünüzü saniyeler içinde oluşturun ve QR kod ile paylaşın.",
  openGraph: {
    title: "Farq.app — Restoranınız için modern QR menü",
    description: "Restoranlar için drag & drop QR menü deneyimi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Farq.app — Restoranınız için modern QR menü",
    description: "Restoranlar için drag & drop QR menü deneyimi",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster position="bottom-right" richColors />
        {children}
      </body>
    </html>
  )
}
