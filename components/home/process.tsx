const steps = [
  { n: "01", title: "Konsultacja i wycena", desc: "Skonfiguruj produkt online lub umów bezpłatny pomiar u doradcy." },
  { n: "02", title: "Projekt i wizualizacja 3D", desc: "Przygotowujemy projekt techniczny i wizualizację dopasowaną do posesji." },
  { n: "03", title: "Produkcja", desc: "Wykonujemy konstrukcję z profili aluminiowych malowanych proszkowo." },
  { n: "04", title: "Montaż i odbiór", desc: "Nasza ekipa montuje konstrukcję i przekazuje gotową realizację z gwarancją." },
]

export function Process() {
  return (
    <section id="proces" className="bg-secondary py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
            <span className="text-sm font-semibold uppercase tracking-wide text-[#DD3333]">
            Jak pracujemy
          </span>
          <h2 className="mt-2 text-balance font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Proces realizacji w 4 krokach
          </h2>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="bg-card p-7">
              <span className="font-heading text-4xl font-extrabold text-[#DD3333]">
                {s.n}
              </span>
              <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
