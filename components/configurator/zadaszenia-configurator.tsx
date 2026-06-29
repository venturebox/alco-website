"use client"

import { Fragment, useState, useRef, type DragEvent, type ChangeEvent, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, ChevronLeft, ChevronRight, Mail, Phone, Upload, X } from "lucide-react"
import {
  type Service,
  colors,
  roofTypes,
  orientations,
  lightingOptions,
  sideEnclosures,
  addons,
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

const STEP_LABELS = ["Konfiguracja", "Oświetlenie", "Zabudowy boczne", "Dodatki", "Wycena"]

const rodzajeZadaszen = [
  { id: "przyscienne", name: "Przyścienne" },
  { id: "wolnostojace", name: "Wolnostojące" },
]

const rodzajeDachu = [
  { id: "szklo", name: "Szkło" },
  { id: "poliweglan", name: "Poliwęglan" },
  { id: "panel-nieprzezierny", name: "Panel nieprzezierny" },
  { id: "inne", name: "Inne" },
]

const oswietlenieZadaszenia = [
  {
    id: "liniowe-krokwie",
    name: "Liniowe w krokwiach",
    subOptions: [
      { id: "biale-zimny", name: "Białe – zimny" },
      { id: "biale-neutralny", name: "Białe – neutralny" },
      { id: "biale-cieply", name: "Białe – ciepły" },
      { id: "rgb", name: "RGB" },
    ],
  },
  {
    id: "punktowe-krokwie",
    name: "Punktowe w krokwiach",
    subOptions: [
      { id: "biale-zimny", name: "Białe – zimny" },
      { id: "biale-neutralny", name: "Białe – neutralny" },
      { id: "biale-cieply", name: "Białe – ciepły" },
    ],
  },
]

const dodatkiZadaszenia = [
  { id: "promiennik-ciepla", name: "Promiennik ciepła", desc: "Ogrzewanie tarasu 2 kW" },
  { id: "costam1", name: "COŚTAM1", desc: "Opcjonalny dodatek 1" },
  { id: "costam2", name: "COŚTAM2", desc: "Opcjonalny dodatek 2" },
]

// ─── Main Configurator ───────────────────────────────────────────────────────

export function ZadaszeniaConfigurator({ service }: { service: Service }) {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [activeImg, setActiveImg] = useState<number | null>(null)

  // Step 1
  const [rodzajId, setRodzajId] = useState(rodzajeZadaszen[0].id)
  const [width, setWidth] = useState(400)
  const [depth, setDepth] = useState(300)
  const [height1, setHeight1] = useState(250)
  const [height2, setHeight2] = useState(220)
  const [dachId, setDachId] = useState(rodzajeDachu[0].id)
  const [structureColor, setStructureColor] = useState(colors[0].id)

  // Step 2: lightingTypeId → subOptionId
  const [lighting, setLighting] = useState<Record<string, string>>({})

  // Step 3
  const [enclosureTypeId, setEnclosureTypeId] = useState<string | null>(null)
  const [enclosureVariantId, setEnclosureVariantId] = useState<string | null>(null)

  // Step 4
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])

  const mainImage = activeImg !== null ? gallery[activeImg] : (colorImageMap[structureColor] ?? gallery[0])

  function toggleLighting(typeId: string, subId: string) {
    setLighting((prev) => {
      if (prev[typeId] === subId) {
        const next = { ...prev }
        delete next[typeId]
        return next
      }
      return { ...prev, [typeId]: subId }
    })
  }

  function selectEnclosureType(typeId: string) {
    setEnclosureTypeId((prev) => (prev === typeId ? null : typeId))
    setEnclosureVariantId(null)
  }

  function toggleAddon(id: string) {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    )
  }

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Strona główna</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{service.name}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          {/* Gallery */}
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
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors cursor-pointer ${
                    mainImage === src
                      ? "border-[#DD3333]"
                      : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <Image
                    src={src || "/placeholder.svg"}
                    alt={`Widok ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
            <div className="mt-8 hidden lg:block">
              <ProductInfo />
            </div>
          </div>

          {/* Configurator panel */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
              <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                {service.name}
              </h1>

              <Separator className="my-4" />

              <StepIndicator current={submitted ? 6 : step} onStepClick={submitted ? undefined : setStep} />

              <Separator className="my-4" />

              {submitted ? (
                <SuccessView
                  onReset={() => {
                    setSubmitted(false)
                    setStep(1)
                  }}
                />
              ) : (
                <>
                  {step === 1 && (
                    <Step1
                      rodzajId={rodzajId}
                      setRodzajId={setRodzajId}
                      width={width}
                      setWidth={setWidth}
                      depth={depth}
                      setDepth={setDepth}
                      height1={height1}
                      setHeight1={setHeight1}
                      height2={height2}
                      setHeight2={setHeight2}
                      dachId={dachId}
                      setDachId={setDachId}
                      structureColor={structureColor}
                      setStructureColor={(id) => {
                        setStructureColor(id)
                        setActiveImg(null)
                      }}
                    />
                  )}
                  {step === 2 && (
                    <Step2Lighting lighting={lighting} onToggle={toggleLighting} />
                  )}
                  {step === 3 && (
                    <Step3Enclosure
                      enclosureTypeId={enclosureTypeId}
                      enclosureVariantId={enclosureVariantId}
                      onTypeSelect={selectEnclosureType}
                      onVariantSelect={setEnclosureVariantId}
                    />
                  )}
                  {step === 4 && (
                    <Step4Addons selectedAddons={selectedAddons} onToggle={toggleAddon} />
                  )}
                  {step === 5 && <Step5Form />}

                  {/* Navigation */}
                  <div className="mt-6 flex gap-3">
                    {step > 1 && (
                      <Button
                        variant="outline"
                        onClick={() => setStep((s) => s - 1)}
                        className="flex items-center gap-1.5"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Wstecz
                      </Button>
                    )}
                    {step < 5 ? (
                      <Button
                        className="flex-1 bg-[#DD3333] text-white hover:bg-[#DD3333]/90"
                        onClick={() => setStep((s) => s + 1)}
                      >
                        {step === 4 ? "Przejdź do wyceny" : "Dalej"}
                        {step < 4 && <ChevronRight className="ml-1.5 h-4 w-4" />}
                      </Button>
                    ) : (
                      <Button
                        className="flex-1 bg-[#DD3333] text-white hover:bg-[#DD3333]/90"
                        onClick={() => setSubmitted(true)}
                      >
                        Wyślij zapytanie
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 lg:hidden">
              <ProductInfo />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Step Indicator ──────────────────────────────────────────────────────────

function StepIndicator({ current, onStepClick }: { current: number; onStepClick?: (step: number) => void }) {
  return (
    <div className="flex items-start">
      {STEP_LABELS.map((label, i) => {
        const num = i + 1
        const done = num < current
        const active = num === current
        return (
          <Fragment key={num}>
            <div 
              className={`flex min-w-0 flex-col items-center gap-2 ${onStepClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
              onClick={() => onStepClick?.(num)}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  done
                    ? "bg-[#DD3333] text-white"
                    : active
                    ? "border-2 border-[#DD3333] text-[#DD3333]"
                    : "border-2 border-border text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : num}
              </div>
              <span
                className={`max-w-[52px] text-center text-[10px] font-medium leading-tight transition-colors ${
                  active
                    ? "font-bold text-[#DD3333]"
                    : done
                    ? "text-foreground/70"
                    : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={`mx-1 mt-4 h-px flex-1 transition-colors ${
                  done ? "bg-[#DD3333]" : "bg-border"
                }`}
              />
            )}
          </Fragment>
        )
      })}
    </div>
  )
}

// ─── Step 1: Basic configuration ─────────────────────────────────────────────

function Step1({
  rodzajId, setRodzajId,
  width, setWidth,
  depth, setDepth,
  height1, setHeight1,
  height2, setHeight2,
  dachId, setDachId,
  structureColor, setStructureColor,
}: {
  rodzajId: string; setRodzajId: (v: string) => void
  width: number; setWidth: (v: number) => void
  depth: number; setDepth: (v: number) => void
  height1: number; setHeight1: (v: number) => void
  height2: number; setHeight2: (v: number) => void
  dachId: string; setDachId: (v: string) => void
  structureColor: string; setStructureColor: (v: string) => void
}) {
  const rodzaj = rodzajeZadaszen.find((r) => r.id === rodzajId)!
  const dach = rodzajeDachu.find((d) => d.id === dachId)!

  return (
    <>
      <ConfigGroup label="Rodzaj zadaszenia" value={rodzaj.name}>
        <div className="flex gap-2.5">
          {rodzajeZadaszen.map((r) => (
            <button
              key={r.id}
              onClick={() => setRodzajId(r.id)}
              className={`flex-1 rounded-lg border-2 p-3 text-center transition-colors ${
                rodzajId === r.id
                  ? "border-[#DD3333] bg-[#DD3333]/5"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <p className="text-sm font-semibold text-foreground">{r.name}</p>
            </button>
          ))}
        </div>
      </ConfigGroup>

      <ConfigGroup
        label="Wymiary"
        value={`${(width / 100).toFixed(2)} × ${(depth / 100).toFixed(2)} m`}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(
            [
              ["Szerokość", width, setWidth],
              ["Wysięg", depth, setDepth],
              ["Wysokość 1 (wyższa)", height1, setHeight1],
              ["Wysokość 2 (niższa)", height2, setHeight2],
            ] as [string, number, (v: number) => void][]
          ).map(([lbl, val, onChange]) => (
            <div key={lbl}>
              <label className="text-[10px] font-medium text-muted-foreground">{lbl}</label>
              <div className="relative mt-1">
                <input
                  type="number"
                  step="50"
                  value={val}
                  onChange={(e) => onChange(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-8 text-sm text-foreground outline-none transition-colors focus:border-[#DD3333] focus:ring-1 focus:ring-[#DD3333]/30"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  cm
                </span>
              </div>
            </div>
          ))}
        </div>
      </ConfigGroup>

      <ConfigGroup label="Dach" value={dach.name}>
        <div className="grid grid-cols-2 gap-2.5">
          {rodzajeDachu.map((d) => (
            <button
              key={d.id}
              onClick={() => setDachId(d.id)}
              className={`rounded-lg border-2 p-3 text-center transition-colors ${
                dachId === d.id
                  ? "border-[#DD3333] bg-[#DD3333]/5"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <p className="text-sm font-semibold text-foreground">{d.name}</p>
            </button>
          ))}
        </div>
      </ConfigGroup>

      <GroupedColorGroup
        label="Kolor konstrukcji"
        colors={colors}
        value={structureColor}
        onChange={setStructureColor}
      />
    </>
  )
}

// ─── Step 2: Lighting ─────────────────────────────────────────────────────────

function Step2Lighting({
  lighting,
  onToggle,
}: {
  lighting: Record<string, string>
  onToggle: (typeId: string, subId: string) => void
}) {
  return (
    <div className="space-y-5">
      <p className="text-xs text-muted-foreground">
        Wybierz rodzaj oświetlenia.
      </p>
      {oswietlenieZadaszenia.map((type) => {
        const selected = lighting[type.id]
        return (
          <div key={type.id}>
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <h3 className="text-sm font-bold text-foreground">{type.name}</h3>
              {selected && (
                <span className="text-xs text-[#DD3333]">
                  {type.subOptions.find((s) => s.id === selected)?.name}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {type.subOptions.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => onToggle(type.id, sub.id)}
                  className={`rounded-lg border-2 px-3 py-1.5 text-xs font-medium transition-colors ${
                    selected === sub.id
                      ? "border-[#DD3333] bg-[#DD3333]/5 text-foreground"
                      : "border-border text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 3: Side Enclosures ──────────────────────────────────────────────────

function Step3Enclosure({
  enclosureTypeId,
  enclosureVariantId,
  onTypeSelect,
  onVariantSelect,
}: {
  enclosureTypeId: string | null
  enclosureVariantId: string | null
  onTypeSelect: (id: string) => void
  onVariantSelect: (id: string | null) => void
}) {
  const selectedType = sideEnclosures.find((e) => e.id === enclosureTypeId)

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Wybierz rodzaj zabudowy bocznej pergoli.
      </p>
      <div className="grid grid-cols-2 gap-2.5">
        {sideEnclosures.map((enc) => (
          <button
            key={enc.id}
            onClick={() => onTypeSelect(enc.id)}
            className={`rounded-lg border-2 p-3 text-left transition-colors ${
              enclosureTypeId === enc.id
                ? "border-[#DD3333] bg-[#DD3333]/5"
                : "border-border hover:border-muted-foreground"
            }`}
          >
            <p className="text-sm font-semibold text-foreground">{enc.name}</p>
          </button>
        ))}
      </div>

      {selectedType && (
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Wariant — {selectedType.name}
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedType.variants.map((v) => (
              <button
                key={v.id}
                onClick={() =>
                  onVariantSelect(enclosureVariantId === v.id ? null : v.id)
                }
                className={`rounded-lg border-2 px-3 py-1.5 text-xs font-medium transition-colors ${
                  enclosureVariantId === v.id
                    ? "border-[#DD3333] bg-[#DD3333]/5 text-foreground"
                    : "border-border text-muted-foreground hover:border-muted-foreground"
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Step 4: Addons ───────────────────────────────────────────────────────────

function Step4Addons({
  selectedAddons,
  onToggle,
}: {
  selectedAddons: string[]
  onToggle: (id: string) => void
}) {
  return (
    <div className="space-y-3">
      {dodatkiZadaszenia.map((addon) => {
        const active = selectedAddons.includes(addon.id)
        return (
          <button
            key={addon.id}
            onClick={() => onToggle(addon.id)}
            className={`flex w-full items-center justify-between rounded-lg border-2 p-3 text-left transition-colors ${
              active
                ? "border-[#DD3333] bg-[#DD3333]/5"
                : "border-border hover:border-muted-foreground"
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-foreground">{addon.name}</p>
              <p className="text-xs text-muted-foreground">{addon.desc}</p>
            </div>
            {active && <Check className="h-4 w-4 shrink-0 text-[#DD3333]" />}
          </button>
        )
      })}
    </div>
  )
}

// ─── Success View ─────────────────────────────────────────────────────────────

function SuccessView({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#DD3333]/10">
        <Check className="h-8 w-8 text-[#DD3333]" />
      </div>
      <h2 className="mt-4 font-heading text-xl font-extrabold text-foreground">
        Zapytanie wysłane!
      </h2>
      <p className="mt-2 max-w-[260px] text-sm leading-relaxed text-muted-foreground">
        Dziękujemy. Skontaktujemy się z Tobą w ciągu 24 godzin roboczych.
      </p>

      <div className="mt-5 flex flex-col items-center gap-2.5 text-sm">
        <a
          href="tel:+48600725999"
          className="flex items-center gap-2 text-foreground transition-colors hover:text-[#DD3333]"
        >
          <Phone className="h-4 w-4 text-[#DD3333]" />
          +48 600 725 999
        </a>
        <a
          href="mailto:kontakt@exalco.pl"
          className="flex items-center gap-2 text-foreground transition-colors hover:text-[#DD3333]"
        >
          <Mail className="h-4 w-4 text-[#DD3333]" />
          kontakt@exalco.pl
        </a>
      </div>

      <Button variant="outline" className="mt-6" onClick={onReset}>
        Skonfiguruj nową pergolę
      </Button>
    </div>
  )
}

// ─── Step 5: Contact Form ─────────────────────────────────────────────────────

function Step5Form() {
  return (
    <div className="space-y-4">
      <div>
        <p className="font-heading text-base font-bold text-foreground">Bezpłatna wycena</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Wyślij zapytanie, a nasz doradca skontaktuje się z Tobą w ciągu 24 godzin.
        </p>
      </div>
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
    </div>
  )
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function ConfigGroup({
  label,
  value,
  children,
}: {
  label: string
  value: string
  children: ReactNode
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
          <span className="text-xs font-medium text-muted-foreground">{selectedColor?.name}</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {grouped.map((g) => (
            <button
              key={g.group}
              onClick={() => setActiveGroup(g.group)}
              className="flex shrink-0 items-center justify-center rounded border border-border px-3 py-1.5 transition-colors hover:border-[#DD3333]"
            >
              <span className="whitespace-nowrap text-[10px] font-medium text-foreground">{g.label}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="py-3 first:pt-0">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <button
          onClick={() => setActiveGroup(null)}
          className="flex items-center gap-1 text-sm font-bold text-foreground hover:text-[#DD3333]"
        >
          <ChevronLeft className="h-4 w-4" />
          {label}
        </button>
        <span className="text-xs font-medium text-muted-foreground">{selectedColor?.name}</span>
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
        <p className="text-sm text-muted-foreground">Przeciągnij pliki lub kliknij, aby dodać</p>
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
