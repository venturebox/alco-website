import Link from "next/link"
import { Phone } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/images/new_LOGO.png"
            alt="Exalco"
            className="h-7 w-auto"
          />
        </Link>

        <div className="flex items-center gap-3">
          <a
            href="tel:+48600725999"
            className="flex items-center gap-2 text-sm font-semibold text-foreground"
          >
            <Phone className="h-4 w-4 text-[#DD3333]" />
            600 725 999
          </a>
          <a
            href="https://pl-pl.facebook.com/exalcopolska"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DD3333] text-white transition-colors hover:bg-[#DD3333]/80"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.988h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  )
}
