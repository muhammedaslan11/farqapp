import Link from "next/link"

const clients = [
  "Copper Mug Coffee",
  "Kuum Hotel & Spa",
  "Jass Kitchen",
  "Chocolabs",
  "Sheraton Istanbul",
  "Marriott Ankara",
  "Le Méridien",
  "Nusr-Et",
  "Zuma Istanbul",
  "Nopa Kitchen",
]

const tickerItems = [
  "QR Menü",
  "Anlık Güncellemeler",
  "Sürükle & Bırak",
  "Özel URL",
  "Sipariş Sepeti",
  "Ücretsiz Deneyin",
  "Kolay Kurulum",
  "Mobil Uyumlu",
]

const features = [
  {
    title: "Sürükle & Bırak Yönetim",
    description:
      "Kategorileri ve ürünleri kolayca sıralayın. Hiçbir teknik bilgiye gerek yok.",
  },
  {
    title: "Anlık Güncellemeler",
    description:
      "Değişiklikleriniz anında yayınlanır. Müşteriler her zaman güncel menüyü görür.",
  },
  {
    title: "QR Kod & Özel URL",
    description:
      "Benzersiz QR kodunuz ve özel URL'nizle menünüzü anında paylaşın.",
  },
  {
    title: "Özelleştirilebilir Tasarım",
    description:
      "Markanıza özel renkler, görseller ve düzenlemeler yapın.",
  },
  {
    title: "Hazırlanma Süreleri",
    description:
      "Müşterilerinize ürünlerin hazırlanma sürelerini gösterin.",
  },
  {
    title: "Sipariş Sepeti",
    description:
      "Müşteriler seçimlerini yapıp garsona kolayca gösterebilir.",
  },
]

const steps = [
  {
    number: "01",
    title: "Hesap Oluşturun",
    description: "Ücretsiz hesabınızı oluşturun ve hemen başlayın.",
  },
  {
    number: "02",
    title: "Menünüzü Ekleyin",
    description: "Kategoriler ve ürünlerinizi sürükle-bırak ile düzenleyin.",
  },
  {
    number: "03",
    title: "QR Kod Alın",
    description: "Menünüzü paylaşmaya hazır, QR kodunuzu indirin.",
  },
]

const repeated = [...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems]

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-xl font-black tracking-tight text-red-600">
            Farq<span className="text-black/25">.app</span>
          </span>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-black/60 hover:text-black transition-colors">
              Özellikler
            </a>
            <a href="#how" className="text-sm text-black/60 hover:text-black transition-colors">
              Nasıl Çalışır?
            </a>
            <a href="#clients" className="text-sm text-black/60 hover:text-black transition-colors">
              Referanslar
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/sign-in"
              className="text-sm font-medium text-black/60 hover:text-black transition-colors px-4 py-2 hidden sm:block"
            >
              Giriş Yap
            </Link>
            <Link
              href="/auth/demand-form"
              className="text-sm font-semibold bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors shadow-sm shadow-red-600/30"
            >
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-black leading-[0.95] max-w-4xl">
              Restoranınız için{" "}
              <span className="text-red-600">modern</span>
              <br />
              QR menü çözümü
            </h1>

            <p className="text-lg text-black/50 leading-relaxed max-w-xl">
              Menünüzü dakikalar içinde oluşturun, QR kod ile paylaşın.
              Hiçbir teknik bilgiye gerek yok.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/auth/demand-form"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-8 py-4 font-semibold text-white hover:bg-red-700 transition-all shadow-lg shadow-red-600/25 hover:shadow-xl hover:shadow-red-600/30 hover:-translate-y-0.5"
              >
                Ücretsiz Başlayın
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/auth/sign-in"
                className="inline-flex items-center justify-center rounded-xl border-2 border-black/10 px-8 py-4 font-semibold text-black hover:bg-black/5 hover:border-black/20 transition-all"
              >
                Panele Giriş
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-12 pt-16 mt-4 border-t border-black/5 w-full max-w-lg">
              {[
                { value: "2dk", label: "Kurulum" },
                { value: "2K+", label: "Restoran" },
                { value: "∞", label: "Güncelleme" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl md:text-4xl font-black text-black">{s.value}</p>
                  <p className="text-xs text-black/40 uppercase tracking-widest mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Scrolling Ticker */}
      <div className="bg-black py-4 overflow-hidden border-y border-black">
        <div className="animate-marquee">
          {repeated.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 px-6">
              <span className="text-sm font-semibold uppercase tracking-widest text-white whitespace-nowrap">
                {item}
              </span>
              <span className="text-red-500 text-lg">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Clients */}
      <section id="clients" className="py-20 bg-white border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-black/40 uppercase tracking-widest font-medium mb-12">
            2.000+ restoran Farq.app ile dijital menüye geçti
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px bg-black/5">
            {clients.map((name) => (
              <div
                key={name}
                className="bg-white flex items-center justify-center px-6 py-8 text-center"
              >
                <span className="text-sm font-semibold text-black/30 hover:text-black/60 transition-colors">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 md:py-36 bg-[#f8f8f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-600 mb-3">
              Özellikler
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-black leading-tight">
              Her şey burada, ekstra ücret yok
            </h2>
            <p className="mt-4 text-lg text-black/50">
              İşletmenizi bir adım öne taşıyacak modern menü yönetimi araçları
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`rounded-2xl p-8 border transition-all hover:-translate-y-0.5 hover:shadow-lg ${i === 0
                    ? "bg-red-600 border-red-600 text-white"
                    : "bg-white border-black/10 text-black hover:shadow-black/10"
                  }`}
              >
                <div className={`text-xs font-bold uppercase tracking-widest mb-5 ${i === 0 ? "text-red-200" : "text-black/25"}`}>
                  0{i + 1}
                </div>
                <h3 className={`text-lg font-bold mb-2 ${i === 0 ? "text-white" : "text-black"}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm leading-relaxed ${i === 0 ? "text-red-100" : "text-black/50"}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24 md:py-36 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-600 mb-3">
              Nasıl Çalışır?
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-black">
              3 adımda hazır
            </h2>
            <p className="mt-4 text-lg text-black/50 max-w-lg mx-auto">
              Üç basit adımda menünüzü oluşturun ve misafirlerinizle paylaşın
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="rounded-2xl border border-black/10 bg-[#f8f8f8] p-8 hover:shadow-lg hover:shadow-black/5 transition-all hover:-translate-y-0.5">
                  <div className="text-6xl font-black text-red-600/15 leading-none mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2">{step.title}</h3>
                  <p className="text-sm text-black/50 leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 text-black/15 text-xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contributors / Trust */}
      <section className="py-20 bg-[#f8f8f8] border-y border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
            <div className="md:col-span-1 text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-widest text-black/30 mb-2">
                Destekçiler
              </p>
              <p className="text-2xl font-black text-black">Güvenilir ortaklar</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-8 items-center">
              {["Techstars '24", "ITÜ ARI Teknokent", "Endeavor", "Innogate"].map((name) => (
                <div key={name} className="text-center">
                  <span className="text-sm font-bold text-black/30 hover:text-black/60 transition-colors">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-36 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-red-200">
            Hemen Başlayın
          </p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
            Farq<span className="text-red-300/60">.app</span>
          </h2>
          <p className="text-lg text-red-100 max-w-xl mx-auto">
            Ücretsiz hesabınızı oluşturun, modern menü deneyimini keşfedin.
            Kredi kartı gerekmez.
          </p>
          <div className="pt-2">
            <Link
              href="/auth/demand-form"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-5 font-bold text-red-600 hover:bg-red-50 transition-all shadow-2xl hover:-translate-y-0.5"
            >
              Ücretsiz Deneyin →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-xl font-black tracking-tight text-white">
            Farq<span className="text-white/25">.app</span>
          </span>
          <div className="flex items-center gap-8">
            <a href="#features" className="text-sm text-white/40 hover:text-white transition-colors">Özellikler</a>
            <a href="#how" className="text-sm text-white/40 hover:text-white transition-colors">Nasıl Çalışır?</a>
            <Link href="/auth/sign-in" className="text-sm text-white/40 hover:text-white transition-colors">Giriş</Link>
          </div>
          <p className="text-sm text-white/25">
            © {new Date().getFullYear()} Farq.app
          </p>
        </div>
      </footer>
    </div>
  )
}
