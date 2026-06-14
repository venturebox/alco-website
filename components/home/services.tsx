import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { serviceCategories } from "@/lib/products"

export function Services() {
  return (
    <section id="uslugi" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wide text-[#DD3333]">
              Nasze usługi
            </span>
            <h2 className="mt-2 text-balance font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Konstrukcje aluminiowe na wymiar
            </h2>
          </div>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serviceCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/konfigurator/${cat.items[0].slug}`}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={cat.image || "/placeholder.svg"}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h3 className="font-heading text-xl font-bold text-foreground">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map((item) => (
                      <span
                        key={item.slug}
                        className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground"
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-colors group-hover:bg-[#DD3333] group-hover:text-white">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
