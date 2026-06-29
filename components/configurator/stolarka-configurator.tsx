"use client"

import { Fragment, useState, useRef, type DragEvent, type ChangeEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, ChevronRight, Mail, Phone, Upload, X } from "lucide-react"
import { type Service } from "@/lib/products"
import { Button } from "@/components/ui/button"

const gallery = [
  "/images/realizacje/477714108_1086425523499056_3788069046120798046_n.jpg",
  "/images/realizacje/pergola_1.jpg",
  "/images/realizacje/489290631_1132912682183673_6023384948808879899_n.jpg",
  "/images/realizacje/476193332_10069628386384881_7682148875562555677_n.jpg",
]

const STEP_LABELS = ["Konfiguracja", "Oświetlenie", "Zabudowy boczne", "Dodatki", "Wycena"]

// ─── Main Configurator ───────────────────────────────────────────────────────

export function StolarkaConfigurator({ service }: { service: Service }) {
  const [submitted, setSubmitted] = useState(false)
  const [activeImg, setActiveImg] = useState(0)

  const mainImage = gallery[activeImg]

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Strona główna</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{service.name}</span>
        </nav>

        <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:items-stretch">
          {/* Gallery — natural height sets the row height */}
          <div className="lg:w-[52.5%] lg:shrink-0">
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
          </div>

          {/* Configurator — flex-1 fills remaining width; stretch makes it gallery-height */}
          <div className="flex flex-1 flex-col rounded-xl border border-border bg-card overflow-hidden">
            {/* Fixed header */}
            <div className="shrink-0 px-5 py-4 border-b border-border">
              <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                {service.name}
              </h1>
              <div className="mt-3">
                <StepIndicator current={submitted ? 6 : 5} />
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
              {submitted ? (
                <SuccessView onReset={() => setSubmitted(false)} />
              ) : (
                <Step5Form />
              )}
            </div>

            {/* Fixed footer */}
            {!submitted && (
              <div className="shrink-0 border-t border-border px-5 py-3">
                <Button
                  className="w-full bg-[#DD3333] text-white hover:bg-[#DD3333]/90"
                  onClick={() => setSubmitted(true)}
                >
                  Wyślij zapytanie
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <ProductInfo />
        </div>
      </div>
    </div>
  )
}

// ─── Step Indicator ──────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  const currentLabel = STEP_LABELS[Math.min(current - 1, STEP_LABELS.length - 1)]
  return (
    <div>
      <div className="flex items-center">
        {STEP_LABELS.map((_, i) => {
          const num = i + 1
          const done = num < current
          const active = num === current
          return (
            <Fragment key={num}>
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors cursor-default ${
                  done
                    ? "bg-[#DD3333] text-white"
                    : active
                    ? "border-2 border-[#DD3333] text-[#DD3333]"
                    : "border-2 border-border text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-3 w-3" /> : num}
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div
                  className={`h-px flex-1 mx-1.5 transition-colors ${
                    done ? "bg-[#DD3333]" : "bg-border"
                  }`}
                />
              )}
            </Fragment>
          )
        })}
      </div>
      <p className="mt-1.5 text-[11px] text-muted-foreground">
        <span className="font-semibold text-foreground">{currentLabel}</span>
        {" "}&mdash; krok {Math.min(current, 5)} z 5
      </p>
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
        Złóż nowe zapytanie
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

// ─── Product Info ─────────────────────────────────────────────────────────────

function ProductInfo() {
  return (
    <div className="rounded-xl border border-border bg-card px-5">
      <div className="py-4">
        <h3 className="font-heading font-bold">Opis produktu</h3>
        <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Stolarka aluminiowa — balustrady, drzwi i ogrodzenia z profili aluminiowych malowanych
          proszkowo z wypełnieniem ze szkła hartowanego. Trwałe, nowoczesne i odporne na warunki
          atmosferyczne rozwiązania do tarasu i posesji.
        </div>
      </div>

      <div className="border-t border-border py-4">
        <h3 className="font-heading font-bold">Specyfikacja techniczna</h3>
        <dl className="mt-2 divide-y divide-border text-sm">
          {[
            ["Materiał", "Aluminium EN AW-6063, lakier proszkowy"],
            ["Szkło", "Hartowane ESG 8–12 mm"],
            ["Montaż", "Boczny lub górny"],
            ["Gwarancja", "10 lat na konstrukcję"],
            ["Realizacja", "3–5 tygodni"],
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
          Realizacja zamówienia wynosi 3–5 tygodni. Montaż wykonują nasze
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
        className={`mt-1 flex cursor-pointer items-center justify-center gap-2.5 rounded-lg border-2 border-dashed px-3 py-2.5 transition-colors ${
          dragging ? "border-[#DD3333] bg-[#DD3333]/5" : "border-border hover:border-muted-foreground"
        }`}
      >
        <Upload className="h-4 w-4 shrink-0 text-muted-foreground" />
        <div>
          <p className="text-xs text-muted-foreground">Przeciągnij pliki lub kliknij</p>
          <p className="text-[10px] text-muted-foreground/60">PNG, JPG, PDF — max 5 plików</p>
        </div>
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
