import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaBand() {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-12 text-primary-foreground sm:px-12 sm:py-16">
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-balance font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                Gotowy na nową przestrzeń na tarasie?
              </h2>
              <p className="mt-3 text-pretty text-primary-foreground/75">
                Skonfiguruj swoją konstrukcję online i otrzymaj wstępną wycenę w
                kilka minut — bez zobowiązań.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link href="/konfigurator/pergola-bioklimatyczna">
                Otwórz konfigurator
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
