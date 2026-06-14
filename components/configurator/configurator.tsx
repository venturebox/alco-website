"use client"

import { useState, useRef, type DragEvent, type ChangeEvent } from "react"
import Image from "next/image"
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  X,
} from "lucide-react"
import {
  type Service,
  colors,
  roofTypes,
  addons,
  formatPLN,
} from "@/lib/products"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const gallery = [
  "/images/realizacje/477714108_1086425523499056_3788069046120798046_n.jpg",
  "/images/realizacje/pergola_1.jpg",
  "/images/realizacje/489290631_1132912682183673_6023384948808879899_n.jpg",
  "/images/realizacje/476193332_10069628386384881_7682148875562555677_n.jpg",
]

const colorImageMap: Record<string, string> = {
  bialy: "/images/realizacje/476193332_10069628386384881_7682148875562555677_n.jpg",
  antracyt: "/images/realizacje/477714108_1086425523499056_3788069046120798046_n.jpg",
}

export function Configurator({ service }: { service: Service }) {
  const [structureColor, setStructureColor] = useState(colors[0].id)
  const [roofColor, setRoofColor] = useState(colors[0].id)
  const [width, setWidth] = useState(400)
  const [depth, setDepth] = useState(300)
  const [height, setHeight] = useState(250)
  const [roofId, setRoofId] = useState(roofTypes[0].id)
  const [selectedAddons, setSelectedAddons] = useState<string[]>(["rain-sensor"])
  const [activeImg, setActiveImg] = useState(0)

  const roof = roofTypes.find((r) => r.id === roofId)!

  const mainImage = colorImageMap[structureColor] ?? gallery[activeImg]

  function toggleAddon(id: string) {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    )
  }

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Strona główna</span>
          <ChevronRight className="h-3 w-3" />
          <span>{service.category}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{service.name}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          {/* gallery */}
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-secondary">
              <Image
                src={mainImage || "/placeholder.svg"}
                alt={service.name}
                fill
                priority
                className="object-cover"
              />
            </div>

            <div className="mt-3 grid grid-cols-4 gap-3">
              {gallery.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActiveImg(i)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                    mainImage === src ? "border-[#DD3333]" : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <Image src={src || "/placeholder.svg"} alt={`Widok ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>

            {/* desktop info accordion */}
            <div className="mt-8 hidden lg:block">
              <ProductInfo />
            </div>
          </div>

          {/* configurator panel */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {service.category}
              </p>
              <h1 className="mt-1 font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                {service.name}
              </h1>

              <Separator className="my-5" />

              {/* roof type */}
              <ConfigGroup label="Rodzaj pergoli" value={roof.name}>
                <div className="flex flex-col gap-2.5">
                  {roofTypes.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRoofId(r.id)}
                      className={`flex items-center justify-between rounded-lg border-2 p-3 text-left transition-colors ${
                        roofId === r.id ? "border-[#DD3333] bg-[#DD3333]/5" : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-foreground">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </ConfigGroup>

              {/* structure color */}
              <GroupedColorGroup
                label="Kolor konstrukcji"
                colors={colors}
                value={structureColor}
                onChange={setStructureColor}
              />

              {/* roof color */}
              <GroupedColorGroup
                label="Kolor dachu"
                colors={colors}
                value={roofColor}
                onChange={setRoofColor}
              />

              {/* dimensions */}
              <ConfigGroup label="Wymiar konstrukcji" value={`${(width / 100).toFixed(2)} × ${(depth / 100).toFixed(2)} × ${(height / 100).toFixed(2)} m`}>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground">Szerokość</label>
                    <div className="relative mt-1">
                      <input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm text-foreground outline-none transition-colors focus:border-[#DD3333] focus:ring-1 focus:ring-[#DD3333]/30"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">cm</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground">Wysięg</label>
                    <div className="relative mt-1">
                      <input
                        type="number"
                        value={depth}
                        onChange={(e) => setDepth(Number(e.target.value))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm text-foreground outline-none transition-colors focus:border-[#DD3333] focus:ring-1 focus:ring-[#DD3333]/30"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">cm</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-medium text-muted-foreground">Wysokość</label>
                    <div className="relative mt-1">
                      <input
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(Number(e.target.value))}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm text-foreground outline-none transition-colors focus:border-[#DD3333] focus:ring-1 focus:ring-[#DD3333]/30"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">cm</span>
                    </div>
                  </div>
                </div>
              </ConfigGroup>

              {/* addons */}
              <ConfigGroup label="Wyposażenie dodatkowe" value={`${selectedAddons.length} wybrane`}>
                <div className="flex flex-col gap-2.5">
                  {addons.map((a) => {
                    const active = selectedAddons.includes(a.id)
                    return (
                      <button
                        key={a.id}
                        onClick={() => toggleAddon(a.id)}
                        className={`flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-colors ${
                          active ? "border-[#DD3333] bg-[#DD3333]/5" : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
                            active ? "border-[#DD3333] bg-[#DD3333] text-white" : "border-muted-foreground/40"
                          }`}
                        >
                          {active && <Check className="h-3.5 w-3.5" />}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-foreground">{a.name}</p>
                          <p className="text-xs text-muted-foreground">{a.desc}</p>
                        </div>
                        <span className="shrink-0 text-sm font-medium text-foreground">
                          +{formatPLN(a.price)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </ConfigGroup>
            </div>

            {/* quote form */}
            <div className="mt-4 rounded-xl border border-border bg-card p-5 sm:p-6">
              <div className="space-y-4">
                <p className="font-heading text-base font-bold text-foreground">Bezpłatna wycena</p>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Imię i nazwisko</label>
                    <input
                      type="text"
                      placeholder="Jan Kowalski"
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-[#DD3333] focus:ring-1 focus:ring-[#DD3333]/30"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">E-mail</label>
                      <input
                        type="email"
                        placeholder="jan@example.com"
                        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-[#DD3333] focus:ring-1 focus:ring-[#DD3333]/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Telefon</label>
                      <input
                        type="tel"
                        placeholder="+48 600 725 999"
                        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-[#DD3333] focus:ring-1 focus:ring-[#DD3333]/30"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Wiadomość (opcjonalnie)</label>
                    <textarea
                      rows={2}
                      placeholder="Dodatkowe pytania lub uwagi..."
                      className="mt-1 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-[#DD3333] focus:ring-1 focus:ring-[#DD3333]/30"
                    />
                  </div>

                  <FileUpload />
                </div>

                <Button size="lg" className="w-full bg-[#DD3333] text-white hover:bg-[#DD3333]/90">
                  Wyślij zapytanie
                </Button>
              </div>
            </div>

            {/* mobile info */}
            <div className="mt-8 lg:hidden">
              <ProductInfo />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ConfigGroup({
  label,
  value,
  children,
}: {
  label: string
  value: string
  children: React.ReactNode
}) {
  return (
    <div className="py-4 first:pt-0">
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-foreground">{label}</h3>
        <span className="text-xs font-medium text-muted-foreground">{value}</span>
      </div>
      {children}
    </div>
  )
}

function ColorGroup({
  label,
  colors,
  value,
  onChange,
}: {
  label: string
  colors: { id: string; name: string; swatch: string }[]
  value: string
  onChange: (id: string) => void
}) {
  return (
    <div className="py-3 first:pt-0">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-bold text-foreground">{label}</h3>
        <span className="text-xs font-medium text-muted-foreground">
          {colors.find((c) => c.id === value)?.name}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {colors.map((c) => (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            aria-label={c.name}
            className={`relative h-9 w-9 rounded-full border-2 transition-all ${
              value === c.id ? "border-[#DD3333] ring-2 ring-[#DD3333]/30" : "border-border"
            }`}
            style={{ backgroundColor: c.swatch }}
          >
            {value === c.id && (
              <Check
                className={`absolute inset-0 m-auto h-3.5 w-3.5 ${
                  c.id === "bialy" || c.id === "srebrny" ? "text-primary" : "text-primary-foreground"
                }`}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

const groupLabels: Record<string, string> = {
  standard: "KOLORY RAL STANDARDOWE",
  nonstandard: "KOLORY NIESTANDARDOWE",
  decor: "DEKORY I INNE",
}

const groupOrder = ["standard", "nonstandard", "decor"]

function GroupedColorGroup({
  label,
  colors,
  value,
  onChange,
}: {
  label: string
  colors: { id: string; name: string; swatch: string; group: string }[]
  value: string
  onChange: (id: string) => void
}) {
  const [activeGroup, setActiveGroup] = useState<string | null>(null)

  const grouped = groupOrder
    .map((g) => ({
      group: g,
      label: groupLabels[g],
      items: colors.filter((c) => c.group === g),
    }))
    .filter((g) => g.items.length > 0)

  const selectedColor = colors.find((c) => c.id === value)
  const currentGroup = grouped.find((g) => g.group === activeGroup)

  if (activeGroup === null) {
    return (
      <div className="py-3 first:pt-0">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-bold text-foreground">{label}</h3>
          <span className="text-xs font-medium text-muted-foreground">
            {selectedColor?.name}
          </span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {grouped.map((g) => (
            <button
              key={g.group}
              onClick={() => setActiveGroup(g.group)}
              className="flex-shrink-0 flex items-center justify-center rounded border border-border px-3 py-1.5 text-center transition-colors hover:border-[#DD3333]"
            >
              <span className="text-[10px] font-medium text-foreground whitespace-nowrap">{g.label}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="py-3 first:pt-0">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveGroup(null)}
            className="flex items-center gap-1 text-sm font-bold text-foreground hover:text-[#DD3333]"
          >
            <ChevronLeft className="h-4 w-4" />
            {label}
          </button>
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          {selectedColor?.name}
        </span>
      </div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {currentGroup?.label}
      </p>
      <div className="flex flex-wrap gap-2">
        {currentGroup?.items.map((c) => (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            aria-label={c.name}
            className={`relative h-9 w-9 rounded-full border-2 transition-all ${
              value === c.id ? "border-[#DD3333] ring-2 ring-[#DD3333]/30" : "border-border"
            }`}
            style={{ backgroundColor: c.swatch }}
          >
            {value === c.id && (
              <Check
                className={`absolute inset-0 m-auto h-3.5 w-3.5 ${
                  c.id === "bialy" || c.id === "srebrny" ? "text-primary" : "text-primary-foreground"
                }`}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function OptionTile({
  active,
  onClick,
  title,
  sub,
}: {
  active: boolean
  onClick: () => void
  title: string
  sub: string
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border-2 p-2.5 text-center transition-colors ${
        active ? "border-[#DD3333] bg-[#DD3333]/5" : "border-border hover:border-muted-foreground"
      }`}
    >
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </button>
  )
}

function ProductInfo() {
  return (
    <div className="rounded-xl border border-border bg-card px-5">
      <div className="py-4">
        <h3 className="font-heading font-bold">Opis produktu</h3>
        <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Pergola bioklimatyczna o konstrukcji z profili aluminiowych malowanych
          proszkowo. Regulowane lamele dachowe pozwalają sterować nasłonecznieniem
          i wentylacją, a wbudowane rynny odprowadzają wodę deszczową w słupach
          nośnych. Idealna jako zadaszenie tarasu, strefy wypoczynku lub ogrodu
          zimowego.
        </div>
      </div>

      <div className="border-t border-border py-4">
        <h3 className="font-heading font-bold">Specyfikacja techniczna</h3>
        <dl className="mt-2 divide-y divide-border text-sm">
          {[
            ["Materiał", "Aluminium EN AW-6063, lakier proszkowy"],
            ["Maks. rozpiętość", "do 6 m bez podpory pośredniej"],
            ["Obciążenie śniegiem", "do 150 kg/m²"],
            ["Sterowanie", "Pilot / aplikacja / przełącznik ścienny"],
            ["Odporność na wiatr", "klasa 6 (Beaufort)"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-2.5">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="text-right font-medium text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="border-t border-border py-4">
        <h3 className="font-heading font-bold">Dostawa i montaż</h3>
        <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Realizacja zamówienia wynosi 4–6 tygodni. Montaż wykonują nasze
          certyfikowane ekipy na terenie całej Polski. Po złożeniu zamówienia
          umawiamy bezpłatny pomiar, a następnie ustalamy termin montażu.
        </div>
      </div>
    </div>
  )
}

function FileUpload() {
  const [files, setFiles] = useState<File[]>([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    const dropped = Array.from(e.dataTransfer.files)
    setFiles((prev) => [...prev, ...dropped].slice(0, 5))
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || [])
    setFiles((prev) => [...prev, ...selected].slice(0, 5))
  }

  function removeFile(i: number) {
    setFiles((prev) => prev.filter((_, idx) => idx !== i))
  }

  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">Załączniki (opcjonalnie)</label>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`mt-1 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-5 transition-colors ${
          dragging ? "border-[#DD3333] bg-[#DD3333]/5" : "border-border hover:border-muted-foreground"
        }`}
      >
        <Upload className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Przeciągnij pliki lub kliknij, aby dodać
        </p>
        <p className="text-xs text-muted-foreground/60">PNG, JPG, PDF — max 5 plików</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={handleChange}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center justify-between rounded-lg bg-secondary px-3 py-1.5 text-sm">
              <span className="truncate text-muted-foreground">{f.name}</span>
              <button onClick={() => removeFile(i)} aria-label="Usuń plik">
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
