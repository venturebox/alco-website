"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

const items = [
  { src: "/images/realizacje/489526881_1132551812219760_6664591478644318928_n.jpg" },
  { src: "/images/realizacje/490013003_1132912688850339_4764355139454733489_n.jpg" },
  { src: "/images/realizacje/472693685_9915081605172894_6706778101377318686_n.jpg" },
  { src: "/images/realizacje/476193332_10069628386384881_7682148875562555677_n.jpg" },
  { src: "/images/realizacje/489643806_1132912618850346_6966480659598589489_n.jpg" },
  { src: "/images/realizacje/489732116_1132562885551986_2650128699495795711_n.jpg" },
  { src: "/images/realizacje/488273740_24208592182061931_8720771628866697928_n.jpg" },
  { src: "/images/realizacje/488655500_1126441062830835_5031387055032388197_n.jpg" },
  { src: "/images/realizacje/488258654_1126441406164134_6665082610192588027_n.jpg" },
  { src: "/images/realizacje/488553771_1126441446164130_2024784539956719473_n.jpg" },
  { src: "/images/realizacje/479732673_1088277706647171_50449326428642925_n.jpg" },
  { src: "/images/realizacje/487780620_1126441422830799_8174740503370319431_n.jpg" },
  { src: "/images/realizacje/482226742_24050357164552101_8477336106844271148_n.jpg" },
  { src: "/images/realizacje/489290631_1132912682183673_6023384948808879899_n.jpg" },
  { src: "/images/realizacje/475778289_10055520791128974_5462314667427128958_n.jpg" },
  { src: "/images/realizacje/pergola_1.jpg" },
  { src: "/images/realizacje/477714108_1086425523499056_3788069046120798046_n.jpg" },
  { src: "/images/realizacje/ogród-zimowy.jpg" },
]

export function Realizations() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  const prev = useCallback(() => {
    setActiveIdx((idx) => (idx !== null ? (idx - 1 + items.length) % items.length : null))
  }, [])

  const next = useCallback(() => {
    setActiveIdx((idx) => (idx !== null ? (idx + 1) % items.length : null))
  }, [])

  useEffect(() => {
    if (activeIdx === null) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActiveIdx(null)
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    document.addEventListener("keydown", handleKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handleKey)
      document.body.style.overflow = ""
    }
  }, [activeIdx, prev, next])

  return (
    <section id="realizacje" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wide text-[#DD3333]">
              Realizacje
            </span>
            <h2 className="mt-2 text-balance font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Wybrane projekty naszych klientów
            </h2>
          </div>
        </div>

        <div className="mt-12 grid auto-rows-[220px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <button
              key={it.src}
              onClick={() => setActiveIdx(i)}
              className="group relative overflow-hidden rounded-xl text-left"
            >
              <Image
                src={it.src || "/placeholder.svg"}
                alt={`Realizacja ${i + 1}`}
                fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
          ))}
        </div>
      </div>

      {activeIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setActiveIdx(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setActiveIdx(null) }}
            className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
            aria-label="Zamknij"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
            aria-label="Poprzednie"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
            aria-label="Następne"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div
            className="relative flex max-h-[85vh] max-w-[90vw] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={items[activeIdx].src || "/placeholder.svg"}
              alt={`Realizacja ${activeIdx + 1}`}
              width={1200}
              height={800}
              className="max-h-[85vh] w-auto rounded-xl object-contain"
              priority
            />
          </div>

          <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-center text-white">
            <p className="text-sm text-white/50">
              {activeIdx + 1} / {items.length}
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
