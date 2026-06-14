import { Factory, PenTool, Truck, Award } from "lucide-react"

const reasons = [
  {
    icon: PenTool,
    title: "Projekt indywidualny",
    desc: "Doradca techniczny i wizualizacja 3D dopasowane do Twojej architektury.",
  },
  {
    icon: Factory,
    title: "Własna produkcja",
    desc: "Profile aluminiowe cięte i malowane proszkowo w naszym zakładzie w Mińsku Mazowieckim.",
  },
  {
    icon: Truck,
    title: "Montaż w całej Polsce",
    desc: "Doświadczone ekipy montażowe i transport własny konstrukcji wielkogabarytowych.",
  },
  {
    icon: Award,
    title: "5 lat gwarancji",
    desc: "Komponenty premium, lakier odporny na UV i korozję. Serwis pogwarancyjny.",
  },
]

export function WhyUs() {
  return (
    <section id="dlaczego" className="bg-secondary py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent">
            Dlaczego my
          </span>
          <h2 className="mt-2 text-balance font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Od projektu po montaż — wszystko w jednych rękach
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="rounded-xl border border-border bg-card p-6"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <r.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
                {r.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
