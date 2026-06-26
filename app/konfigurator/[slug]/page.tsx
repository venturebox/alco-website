import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Configurator } from "@/components/configurator/configurator"
import { ZadaszeniaConfigurator } from "@/components/configurator/zadaszenia-configurator"
import { StolarkaConfigurator } from "@/components/configurator/stolarka-configurator"
import { services } from "@/lib/products"

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }))
}

export default async function ConfiguratorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = services.find((s) => s.slug === slug)
  if (!service) notFound()

  return (
    <div className="dark flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1">
        {service.category === "Pergole" && <Configurator service={service} />}
        {service.category === "Zadaszenia" && <ZadaszeniaConfigurator service={service} />}
        {service.category === "Stolarka aluminiowa" && <StolarkaConfigurator service={service} />}
      </main>
      <SiteFooter />
    </div>
  )
}
