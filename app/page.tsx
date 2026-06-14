import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/home/hero"
import { Services } from "@/components/home/services"
import { WhyUs } from "@/components/home/why-us"
import { Process } from "@/components/home/process"
import { Realizations } from "@/components/home/realizations"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Services />
        <WhyUs />
        <Realizations />
        <Process />
      </main>
      <SiteFooter />
    </div>
  )
}
