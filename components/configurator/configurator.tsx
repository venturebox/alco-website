"use client"

import { Fragment, useState, useEffect, useRef, type DragEvent, type ChangeEvent, type ReactNode } from "react"
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

// ─── Main Configurator ───────────────────────────────────────────────────────

export function Configurator({ service }: { service: Service }) {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [activeImg, setActiveImg] = useState<number | null>(null)
  const [dynamicGallery, setDynamicGallery] = useState<string[]>(gallery)

  useEffect(() => {
    fetch("https://woozy-gnat-639.eu-west-1.convex.site/api/gallery/Pergola")
      .then(res => res.json())
      .then(data => {
        if (data && data.images) {
          const sorted = data.images
            .sort((a: any, b: any) => a.order - b.order)
            .map((img: any) => img.url)
          if (sorted.length > 0) {
            setDynamicGallery(sorted)
          }
        }
      })
      .catch(err => console.error("Błąd pobierania galerii:", err))
  }, [])

  // Step 1
  const [roofId, setRoofId] = useState(roofTypes[0].id)
  const [orientationId, setOrientationId] = useState(orientations[0].id)
  const [width, setWidth] = useState(400)
  const [depth, setDepth] = useState(300)
  const [height, setHeight] = useState(250)
  const [structureColor, setStructureColor] = useState(colors[0].id)
  const [roofColor, setRoofColor] = useState(colors[0].id)

  // Step 2: lightingTypeId → subOptionId
  const [lighting, setLighting] = useState<Record<string, string>>({})

  // Step 3
  const [enclosureTypeId, setEnclosureTypeId] = useState<string | null>(null)
  const [enclosureVariantId, setEnclosureVariantId] = useState<string | null>(null)

  // Step 4
  const [selectedAddons, setSelectedAddons] = useState<string[]>([])

  // Contact Form & CRM Integration States
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [successCode, setSuccessCode] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const mainImage = activeImg !== null ? dynamicGallery[activeImg] : (colorImageMap[structureColor] ?? dynamicGallery[0])

  async function handleLeadSubmit() {
    setFormErrors({})
    setSubmitError(null)

    // Client-side validation
    const errors: Record<string, string> = {}
    if (!name.trim()) {
      errors.name = "Imię i nazwisko jest wymagane."
    } else if (name.trim().length < 2) {
      errors.name = "Imię i nazwisko musi mieć co najmniej 2 znaki."
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      errors.email = "Adres e-mail jest wymagany."
    } else if (!emailRegex.test(email.trim())) {
      errors.email = "Wprowadź poprawny adres e-mail."
    }

    const phoneRegex = /^[+]?[0-9\s-]{9,20}$/
    if (!phone.trim()) {
      errors.phone = "Numer telefonu jest wymagany."
    } else if (!phoneRegex.test(phone.trim())) {
      errors.phone = "Wprowadź poprawny numer telefonu (minimum 9 cyfr)."
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setIsSubmitting(true)
    try {
      const selectedRoof = roofTypes.find((r) => r.id === roofId)
      const selectedOrientation = orientations.find((o) => o.id === orientationId)
      const selectedStructureColor = colors.find((c) => c.id === structureColor)
      const selectedRoofColor = colors.find((c) => c.id === roofColor)
      const selectedEnclosureType = sideEnclosures.find((e) => e.id === enclosureTypeId)
      const selectedEnclosureVariant = selectedEnclosureType?.variants.find((v) => v.id === enclosureVariantId)

      const configuration = {
        type: "pergola",
        rodzajPergoli: selectedRoof?.name ?? roofId,
        orientacja: selectedOrientation?.name ?? orientationId,
        wymiary: { szerokosc: width, wysieg: depth, wysokosc: height },
        kolorKonstrukcji: selectedStructureColor?.name ?? structureColor,
        kolorDachu: selectedRoofColor?.name ?? roofColor,
        oswietlenie: Object.fromEntries(
          lightingOptions.map((type) => {
            const subId = lighting[type.id]
            const subName = subId ? type.subOptions.find((s) => s.id === subId)?.name ?? null : null
            return [type.id, subName]
          })
        ),
        zabudowyBoczne: {
          typ: selectedEnclosureType?.name ?? null,
          wariant: selectedEnclosureVariant?.name ?? null,
        },
        dodatki: addons
          .filter((a) => selectedAddons.includes(a.id))
          .map((a) => a.name),
      }

      const response = await fetch("/api/lead/pergola", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          description: message.trim() || undefined,
          configuration,
        }),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Błąd podczas przesyłania zapytania.")
      }

      setSuccessCode(data.code || data.quoteId || null)

      // Przesyłanie załączników
      if (files.length > 0) {
        const quoteId = data.quoteId
        const uploadToken = data.uploadToken

        for (const file of files) {
          setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }))

          const sessionRes = await fetch("/api/lead/upload-session", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              quoteId,
              uploadToken,
              fileName: file.name,
              fileSize: file.size,
            }),
          })

          const sessionData = await sessionRes.json()
          if (!sessionRes.ok || !sessionData.success) {
            throw new Error(`Nie udało się przygotować wysyłki dla pliku ${file.name}: ${sessionData.error}`)
          }

          const uploadUrl = sessionData.uploadUrl

          // Wysyłanie pliku bezpośrednio na SharePoint URL (PUT)
          await new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.open("PUT", uploadUrl, true)
            xhr.setRequestHeader("Content-Range", `bytes 0-${file.size - 1}/${file.size}`)
            xhr.setRequestHeader("Content-Length", `${file.size}`)

            xhr.upload.onprogress = (event) => {
              if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100)
                setUploadProgress((prev) => ({ ...prev, [file.name]: percent }))
              }
            }

            xhr.onload = () => {
              if (xhr.status >= 200 && xhr.status < 300) {
                resolve()
              } else {
                reject(new Error(`Błąd wysyłania ${file.name}: status ${xhr.status}`))
              }
            }

            xhr.onerror = () => reject(new Error(`Błąd połączenia dla pliku ${file.name}`))
            xhr.send(file)
          })
        }
      }

      setSubmitted(true)
    } catch (err: any) {
      setSubmitError(err.message || "Błąd połączenia z serwerem. Spróbuj ponownie.")
    } finally {
      setIsSubmitting(false)
    }
  }

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
              {dynamicGallery.map((src, i) => (
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
                <StepIndicator current={submitted ? 6 : step} onStepClick={submitted ? undefined : setStep} />
              </div>
            </div>

            {/* Scrollable step content */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
              {submitted ? (
                <SuccessView
                  code={successCode || undefined}
                  onReset={() => {
                    setSubmitted(false)
                    setStep(1)
                    setName("")
                    setEmail("")
                    setPhone("")
                    setMessage("")
                    setFiles([])
                    setUploadProgress({})
                    setSuccessCode(null)
                    setSubmitError(null)
                    setFormErrors({})
                  }}
                />
              ) : (
                <>
                  {step === 1 && (
                    <Step1
                      roofId={roofId}
                      setRoofId={setRoofId}
                      orientationId={orientationId}
                      setOrientationId={setOrientationId}
                      width={width}
                      setWidth={setWidth}
                      depth={depth}
                      setDepth={setDepth}
                      height={height}
                      setHeight={setHeight}
                      structureColor={structureColor}
                      setStructureColor={(id) => {
                        setStructureColor(id)
                        setActiveImg(null)
                      }}
                      roofColor={roofColor}
                      setRoofColor={setRoofColor}
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
                  {step === 5 && (
                    <Step5Form
                      name={name}
                      setName={setName}
                      email={email}
                      setEmail={setEmail}
                      phone={phone}
                      setPhone={setPhone}
                      message={message}
                      setMessage={setMessage}
                      errors={formErrors}
                      submitError={submitError}
                      files={files}
                      setFiles={setFiles}
                      uploadProgress={uploadProgress}
                    />
                  )}
                </>
              )}
            </div>

            {/* Fixed navigation */}
            {!submitted && (
              <div className="shrink-0 border-t border-border px-5 py-3">
                <div className="flex gap-3">
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
                      onClick={handleLeadSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Wysyłanie..." : "Wyślij zapytanie"}
                    </Button>
                  )}
                </div>
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

function StepIndicator({ current, onStepClick }: { current: number; onStepClick?: (step: number) => void }) {
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
              <button
                onClick={() => onStepClick?.(num)}
                disabled={!onStepClick}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                  done
                    ? "bg-[#DD3333] text-white"
                    : active
                    ? "border-2 border-[#DD3333] text-[#DD3333]"
                    : "border-2 border-border text-muted-foreground"
                } ${onStepClick ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
              >
                {done ? <Check className="h-3 w-3" /> : num}
              </button>
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

// ─── Step 1: Basic configuration ─────────────────────────────────────────────

function Step1({
  roofId, setRoofId,
  orientationId, setOrientationId,
  width, setWidth,
  depth, setDepth,
  height, setHeight,
  structureColor, setStructureColor,
  roofColor, setRoofColor,
}: {
  roofId: string; setRoofId: (v: string) => void
  orientationId: string; setOrientationId: (v: string) => void
  width: number; setWidth: (v: number) => void
  depth: number; setDepth: (v: number) => void
  height: number; setHeight: (v: number) => void
  structureColor: string; setStructureColor: (v: string) => void
  roofColor: string; setRoofColor: (v: string) => void
}) {
  const roof = roofTypes.find((r) => r.id === roofId)!
  const orientation = orientations.find((o) => o.id === orientationId)!

  return (
    <div className="space-y-3">
      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <h3 className="text-xs font-bold text-foreground">Rodzaj pergoli</h3>
          <span className="text-[10px] text-muted-foreground">{roof.name}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {roofTypes.map((r) => (
            <button
              key={r.id}
              onClick={() => setRoofId(r.id)}
              className={`rounded-lg border-2 px-2.5 py-1 text-xs font-semibold transition-colors ${
                roofId === r.id
                  ? "border-[#DD3333] bg-[#DD3333]/5 text-foreground"
                  : "border-border text-muted-foreground hover:border-muted-foreground"
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <h3 className="text-xs font-bold text-foreground">Orientacja</h3>
          <span className="text-[10px] text-muted-foreground">{orientation.name}</span>
        </div>
        <div className="flex gap-1.5">
          {orientations.map((o) => (
            <button
              key={o.id}
              onClick={() => setOrientationId(o.id)}
              className={`rounded-lg border-2 px-2.5 py-1 text-xs font-semibold transition-colors ${
                orientationId === o.id
                  ? "border-[#DD3333] bg-[#DD3333]/5 text-foreground"
                  : "border-border text-muted-foreground hover:border-muted-foreground"
              }`}
            >
              {o.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <h3 className="text-xs font-bold text-foreground">Wymiar konstrukcji</h3>
          <span className="text-[10px] text-muted-foreground">
            {(width / 100).toFixed(2)} × {(depth / 100).toFixed(2)} × {(height / 100).toFixed(2)} m
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ["Szerokość", width, setWidth],
              ["Wysięg", depth, setDepth],
              ["Wysokość", height, setHeight],
            ] as [string, number, (v: number) => void][]
          ).map(([lbl, val, onChange]) => (
            <div key={lbl}>
              <label className="text-[10px] font-medium text-muted-foreground">{lbl}</label>
              <div className="relative mt-0.5">
                <input
                  type="number"
                  step="50"
                  value={val}
                  onChange={(e) => onChange(Number(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key !== "ArrowUp" && e.key !== "ArrowDown" && e.key !== "Tab") {
                      e.preventDefault()
                    }
                  }}
                  className="w-full rounded-lg border border-border bg-background px-2.5 py-3.5 pr-7 text-xs text-foreground outline-none transition-colors focus:border-[#DD3333] focus:ring-1 focus:ring-[#DD3333]/30"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">cm</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <GroupedColorGroup compact label="Kolor konstrukcji" colors={colors} value={structureColor} onChange={setStructureColor} />
      <GroupedColorGroup compact label="Kolor dachu" colors={colors} value={roofColor} onChange={setRoofColor} />
    </div>
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
      {lightingOptions.map((type) => {
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
      {addons.map((addon) => {
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

function SuccessView({ onReset, code }: { onReset: () => void; code?: string }) {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#DD3333]/10">
        <Check className="h-8 w-8 text-[#DD3333]" />
      </div>
      <h2 className="mt-4 font-heading text-xl font-extrabold text-foreground">
        Zapytanie wysłane!
      </h2>
      {code && (
        <div className="mt-2 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-[#DD3333] border border-[#DD3333]/20">
          Numer wyceny: {code}
        </div>
      )}
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

interface Step5FormProps {
  name: string
  setName: (v: string) => void
  email: string
  setEmail: (v: string) => void
  phone: string
  setPhone: (v: string) => void
  message: string
  setMessage: (v: string) => void
  errors: Record<string, string>
  submitError: string | null
  files: File[]
  setFiles: (files: File[]) => void
  uploadProgress: Record<string, number>
}

function Step5Form({
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  message,
  setMessage,
  errors,
  submitError,
  files,
  setFiles,
  uploadProgress,
}: Step5FormProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="font-heading text-base font-bold text-foreground">Bezpłatna wycena</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Wyślij zapytanie, a nasz doradca skontaktuje się z Tobą w ciągu 24 godzin.
        </p>
      </div>

      {submitError && (
        <div className="rounded-lg bg-destructive/15 p-3 text-xs text-destructive border border-destructive/20 font-medium">
          {submitError}
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Imię i nazwisko</label>
          <input
            type="text"
            placeholder="Jan Kowalski"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:ring-1 ${
              errors.name
                ? "border-destructive focus:border-destructive focus:ring-destructive/30"
                : "border-border focus:border-[#DD3333] focus:ring-[#DD3333]/30"
            }`}
          />
          {errors.name && <p className="mt-1 text-[10px] text-destructive font-medium">{errors.name}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">E-mail</label>
            <input
              type="email"
              placeholder="jan@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:ring-1 ${
                errors.email
                  ? "border-destructive focus:border-destructive focus:ring-destructive/30"
                  : "border-border focus:border-[#DD3333] focus:ring-[#DD3333]/30"
              }`}
            />
            {errors.email && <p className="mt-1 text-[10px] text-destructive font-medium">{errors.email}</p>}
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Telefon</label>
            <input
              type="tel"
              placeholder="+48 600 725 999"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:ring-1 ${
                errors.phone
                  ? "border-destructive focus:border-destructive focus:ring-destructive/30"
                  : "border-border focus:border-[#DD3333] focus:ring-[#DD3333]/30"
              }`}
            />
            {errors.phone && <p className="mt-1 text-[10px] text-destructive font-medium">{errors.phone}</p>}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Wiadomość (opcjonalnie)</label>
          <textarea
            rows={2}
            placeholder="Dodatkowe pytania lub uwagi..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-[#DD3333] focus:ring-1 focus:ring-[#DD3333]/30"
          />
        </div>
        <FileUpload
          files={files}
          onChange={setFiles}
          uploadProgress={uploadProgress}
        />
      </div>
    </div>
  )
}

// ─── File Upload Component ───────────────────────────────────────────────────

interface FileUploadProps {
  files: File[]
  onChange: (files: File[]) => void
  uploadProgress?: Record<string, number>
}

function FileUpload({ files, onChange, uploadProgress }: FileUploadProps) {
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const allowedExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "png", "jpg", "jpeg", "zip", "rar", "dxf"]
  const maxSizeBytes = 20 * 1024 * 1024 // 20 MB

  function validateAndFilterFiles(incoming: File[]): File[] {
    setError(null)
    const valid: File[] = []
    
    for (const f of incoming) {
      const ext = f.name.slice(f.name.lastIndexOf(".") + 1).toLowerCase()
      if (!allowedExtensions.includes(ext)) {
        setError(`Niedozwolony format: .${ext}. Dozwolone: ${allowedExtensions.join(", ")}`)
        continue
      }
      if (f.size > maxSizeBytes) {
        setError(`Plik jest za duży: ${f.name} (maks. 20 MB)`)
        continue
      }
      valid.push(f)
    }
    return valid
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    const dropped = Array.from(e.dataTransfer.files)
    const valid = validateAndFilterFiles(dropped)
    onChange([...files, ...valid].slice(0, 5))
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || [])
    const valid = validateAndFilterFiles(selected)
    onChange([...files, ...valid].slice(0, 5))
  }

  function removeFile(i: number) {
    onChange(files.filter((_, idx) => idx !== i))
  }

  return (
    <div>
      <div className="flex justify-between items-baseline">
        <label className="text-xs font-medium text-muted-foreground">Załączniki (opcjonalnie)</label>
        {error && <span className="text-[10px] text-destructive font-medium">{error}</span>}
      </div>
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
          <p className="text-[10px] text-muted-foreground/60">PDF, JPG, PNG, DOC, XLS, ZIP, DXF — max 5 plików (maks. 20MB)</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,.dxf"
          onChange={handleChange}
          className="hidden"
        />
      </div>
      {files.length > 0 && (
        <ul className="mt-2 space-y-1.5">
          {files.map((f, i) => {
            const progress = uploadProgress?.[f.name]
            return (
              <li key={`${f.name}-${i}`} className="flex flex-col gap-1 rounded-lg bg-secondary px-3 py-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="truncate text-muted-foreground">{f.name}</span>
                  {progress === undefined ? (
                    <button type="button" onClick={() => removeFile(i)} aria-label="Usuń plik">
                      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-[#DD3333] font-semibold">
                      {progress === 100 ? "Przesłano" : `Wysyłanie: ${progress}%`}
                    </span>
                  )}
                </div>
                {progress !== undefined && progress < 100 && (
                  <div className="h-1 w-full bg-border rounded-full overflow-hidden mt-1">
                    <div className="bg-[#DD3333] h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
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
  compact = false,
}: {
  label: string
  colors: { id: string; name: string; swatch: string; group: string }[]
  value: string
  onChange: (id: string) => void
  compact?: boolean
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
      <div className={compact ? "py-1.5" : "py-3 first:pt-0"}>
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-bold text-foreground">{label}</h3>
          <span className="text-xs font-medium text-muted-foreground">{selectedColor?.name}</span>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {grouped.map((g) => (
            <button
              key={g.group}
              onClick={() => setActiveGroup(g.group)}
              className="rounded-lg border-2 border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:border-muted-foreground whitespace-nowrap"
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={compact ? "py-1.5" : "py-3 first:pt-0"}>
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
