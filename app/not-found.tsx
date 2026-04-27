import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5f4f0] p-6 text-center">
      <p className="text-xs uppercase tracking-widest text-neutral-500">404</p>
      <h1 className="text-3xl font-semibold text-neutral-900">
        Aradığınız sayfa bulunamadı
      </h1>
      <p className="text-neutral-500">
        Bağlantı yanlış olabilir veya içerik kaldırılmış olabilir.
      </p>
      <Link
        href="/"
        className="rounded-sm bg-black px-6 py-3 font-medium text-white"
      >
        Ana sayfaya dön
      </Link>
    </div>
  )
}
