import { Phone, Mail, MapPin } from "lucide-react"

export function SiteFooter() {
  return (
    <footer id="kontakt" className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">

        <div>
          <h4 className="font-heading text-sm font-bold uppercase tracking-wide">Kontakt</h4>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/70">
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-accent" />
              <a href="tel:+48600725999" className="hover:text-accent">+48 600 725 999</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-accent" />
              <a href="mailto:exalco@exalco.pl" className="hover:text-accent">exalco@exalco.pl</a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a href="https://share.google/bV2EIAlPebLAsTuvv" target="_blank" rel="noopener noreferrer" className="hover:text-accent">ul. Łąkowa 30<br />05-300 Mińsk Mazowiecki</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-primary-foreground/50 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Exalco. Wszelkie prawa zastrzeżone.</p>
          <a href="https://venturebox.pl" target="_blank" rel="noopener noreferrer" style={{ color: "#7c3aed" }} className="hover:underline">made by: venturebox.pl</a>
        </div>
      </div>
    </footer>
  )
}
