import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  serverExternalPackages: ["pocketbase"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "uploadthing-prod.*",
      },
    ],
  },
}

export default nextConfig
