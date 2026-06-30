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

  const mainImage = gallery[activeImg]

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
      const response = await fetch("/api/lead/stolarka", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          description: message.trim() || undefined,
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
                <SuccessView
                  code={successCode || undefined}
                  onReset={() => {
                    setSubmitted(false)
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
            </div>

            {/* Fixed footer */}
            {!submitted && (
              <div className="shrink-0 border-t border-border px-5 py-3">
                <Button
                  className="w-full bg-[#DD3333] text-white hover:bg-[#DD3333]/90"
                  onClick={handleLeadSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Wysyłanie..." : "Wyślij zapytanie"}
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
        Złóż nowe zapytanie
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
