"use client"

import { useState } from "react"
import { UploadButton } from "@uploadthing/react"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

interface ImageUploaderProps {
  label: string
  description?: string
  value?: string
  onChange: (value?: string) => void
  className?: string
}

export function ImageUploader({
  label,
  description,
  value,
  onChange,
  className,
}: ImageUploaderProps) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-700">{label}</p>
          {description && (
            <p className="text-xs text-neutral-500">{description}</p>
          )}
        </div>
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="cursor-pointer rounded-sm px-2 py-1 text-xs font-medium text-red-500 transition hover:bg-red-50"
          >
            Kaldır
          </button>
        )}
      </div>
      <div className="mt-3 rounded-sm border border-dashed border-neutral-300 p-3 text-center">
        {value ? (
          <div
            className="relative h-48 w-full overflow-hidden rounded-sm"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <picture>
              <img
                src={value}
                alt={label}
                className="absolute inset-0 w-full h-full object-cover"
                sizes="100vw"
              />
            </picture>
            {isHovering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-medium text-white">
                Yeniden yüklemek için tıklayın
              </div>
            )}
            <UploadButton<OurFileRouter, "menuImageUploader">
              appearance={{
                container: "absolute inset-0 opacity-0 cursor-pointer",
                button: "w-full h-full",
                allowedContent: "hidden",
              }}
              endpoint="menuImageUploader"
              onClientUploadComplete={(res) => {
                const url = res?.[0]?.url
                if (url) onChange(url)
              }}
              onUploadError={(error: Error) =>
                alert(`Yükleme başarısız: ${error.message}`)
              }
            />
          </div>
        ) : (
          <UploadButton<OurFileRouter, "menuImageUploader">
            endpoint="menuImageUploader"
            appearance={{
              container: "flex flex-col items-center justify-center gap-3 py-8",
              button:
                "rounded-sm bg-black border border-black px-6 py-3 text-sm font-semibold text-white hover:bg-black/90 transition-all shadow-sm hover:shadow-md cursor-pointer",
              allowedContent: "text-xs text-neutral-500 mt-2",
            }}
            content={{
              button: "📁 Dosya Seç",
              allowedContent: "Menünün hızlı açılabilmesi için max 2MB",
            }}
            onClientUploadComplete={(res) => {
              const url = res?.[0]?.url
              if (url) onChange(url)
            }}
            onUploadError={(error: Error) =>
              alert(`Yükleme başarısız: ${error.message}`)
            }
          />
        )}
      </div>
    </div>
  )
}
