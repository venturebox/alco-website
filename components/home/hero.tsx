import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShieldCheck, Wrench, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GoogleReviews } from "@/components/home/google-reviews"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground min-h-[85vh] flex items-center">
      <div className="absolute inset-0">
        <Image
          src="/images/pergola-aluminiu-exalco-2.webp"
          alt="Nowoczesna pergola bioklimatyczna z aluminium"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/10" />
      </div>

      <div className="relative w-full mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-8 items-center">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
              Producent konstrukcji aluminiowych
            </span>
            <h1 className="mt-6 text-balance font-heading text-4xl font-extrabold leading-[1.03] tracking-tight text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.55)] sm:text-5xl lg:text-6xl">
              Pergole, zadaszenia i balustrady{" "}
              <span className="text-[#DD3333] [text-shadow:0_0_24px_rgba(221,51,51,0.4)]">z aluminium</span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/85 sm:text-lg">
              Projektujemy i montujemy trwałe konstrukcje na wymiar. Skonfiguruj
              swoją pergolę online — wybierz rozmiar, kolor i wyposażenie, a my
              bezpłatnie wycenimy Twoją konfigurację.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-[#DD3333] text-white hover:bg-[#DD3333]/90">
                <Link href="/#uslugi">
                  Skonfiguruj projekt
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
              >
                <Link href="/#realizacje">Zobacz realizacje</Link>
              </Button>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-5 border-t border-white/15 pt-8 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, label: "5 lat gwarancji", sub: "na konstrukcję" },
                { icon: Wrench, label: "Montaż w całej PL", sub: "własne ekipy" },
                { icon: Clock, label: "Wycena w 24h", sub: "online" },
              ].map((f) => (
                <div key={f.label} className="flex items-center gap-3">
                  <f.icon className="h-6 w-6 shrink-0 text-[#DD3333]" />
                  <div>
                    <p className="text-sm font-semibold text-white">{f.label}</p>
                    <p className="text-xs text-white/65">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="hidden lg:block justify-self-end w-full max-w-sm">
            <GoogleReviews />
          </div>
        </div>
        <div className="mt-12 lg:hidden w-full max-w-sm mx-auto">
          <GoogleReviews />
        </div>
      </div>
    </section>
  )
}
