export type Service = {
  slug: string
  name: string
  category: string
  tagline: string
  image: string
  priceFrom: number
  badge?: string
}

export type ServiceCategory = {
  id: string
  name: string
  desc: string
  image: string
  items: Service[]
}

export const services: Service[] = [
  {
    slug: "pergola-jakas",
    name: "Pergola jakaś",
    category: "Pergole",
    tagline: "Regulowane lamele, sterowanie, integracja LED",
    image: "/images/realizacje/pergola_1.jpg",
    priceFrom: 18900,
    badge: "Bestseller",
  },
  {
    slug: "zadaszenie-tarasu",
    name: "Zadaszenie tarasu",
    category: "Zadaszenia",
    tagline: "Dach szklany lub poliwęglan, profile aluminiowe",
    image: "/images/realizacje/488655500_1126441062830835_5031387055032388197_n.jpg",
    priceFrom: 9900,
  },
  {
    slug: "carport-aluminiowy",
    name: "Carport aluminiowy",
    category: "Zadaszenia",
    tagline: "Wiata garażowa na 1 lub 2 auta",
    image: "/images/realizacje/482226742_24050357164552101_8477336106844271148_n.jpg",
    priceFrom: 12400,
  },
  {
    slug: "stolarka-aluminiowa",
    name: "Stolarka aluminiowa",
    category: "Stolarka aluminiowa",
    tagline: "Aluminium + szkło hartowane, montaż boczny lub górny",
    image: "/images/realizacje/488553771_1126441446164130_2024784539956719473_n.jpg",
    priceFrom: 690,
    badge: "Cena za mb",
  },
  {
    slug: "ogrodzenie-aluminiowe",
    name: "Ogrodzenie aluminiowe",
    category: "Stolarka aluminiowa",
    tagline: "Przęsła palisadowe i lamelowe, bramy automatyczne",
    image: "/images/realizacje/488258654_1126441406164134_6665082610192588027_n.jpg",
    priceFrom: 540,
    badge: "Cena za mb",
  },
]

export const serviceCategories: ServiceCategory[] = [
  {
    id: "pergole",
    name: "Pergole",
    desc: "Nowoczesne pergole bioklimatyczne z regulowanymi lamelami, sterowaniem i oświetleniem LED",
    image: "/images/realizacje/pergola_1.jpg",
    items: services.filter((s) => s.category === "Pergole"),
  },
  {
    id: "zadaszenia",
    name: "Zadaszenia",
    desc: "Zadaszenia tarasów i carporty aluminiowe — lekkie, trwałe i odporne na warunki atmosferyczne",
    image: "/images/realizacje/482226742_24050357164552101_8477336106844271148_n.jpg",
    items: services.filter((s) => s.category === "Zadaszenia"),
  },
  {
    id: "stolarka",
    name: "Stolarka aluminiowa",
    desc: "Balustrady szklane i ogrodzenia aluminiowe — nowoczesne wykończenie tarasu i posesji",
    image: "/images/realizacje/488553771_1126441446164130_2024784539956719473_n.jpg",
    items: services.filter((s) => s.category === "Stolarka aluminiowa"),
  },
]

export const colors = [
  // KOLORY RAL STANDARDOWE
  { id: "antracyt", name: "Antracyt RAL 7016", group: "standard", swatch: "oklch(0.32 0.008 255)", priceMod: 0 },
  { id: "czarny", name: "Czarny mat RAL 9005", group: "standard", swatch: "oklch(0.2 0 0)", priceMod: 600 },
  { id: "bialy", name: "Biały RAL 9016", group: "standard", swatch: "oklch(0.97 0 0)", priceMod: 0 },
  { id: "srebrny", name: "Srebrny RAL 9006", group: "standard", swatch: "oklch(0.78 0.006 255)", priceMod: 350 },
  // KOLORY NIESTANDARDOWE
  { id: "braz", name: "Brąz RAL 8017", group: "nonstandard", swatch: "oklch(0.35 0.04 55)", priceMod: 900 },
  { id: "zielony", name: "Zielony RAL 6005", group: "nonstandard", swatch: "oklch(0.35 0.05 145)", priceMod: 900 },
  { id: "grafit", name: "Grafit RAL 7024", group: "nonstandard", swatch: "oklch(0.3 0.005 255)", priceMod: 900 },
  // DEKORY I INNE
  { id: "zloty-dab", name: "Złoty dąb", group: "decor", swatch: "oklch(0.6 0.08 70)", priceMod: 1800 },
  { id: "orzech", name: "Orzech", group: "decor", swatch: "oklch(0.45 0.06 60)", priceMod: 1800 },
  { id: "bialy-polysk", name: "Biały połysk", group: "decor", swatch: "oklch(0.9 0.01 90)", priceMod: 1200 },
]

export const sizes = [
  { id: "s", name: "3 × 3 m", area: 9, priceMod: 0 },
  { id: "m", name: "4 × 3 m", area: 12, priceMod: 4200 },
  { id: "l", name: "5 × 4 m", area: 20, priceMod: 9800 },
  { id: "xl", name: "6 × 4 m", area: 24, priceMod: 14200 },
]

export const roofTypes = [
  { id: "przyścienna", name: "Przyścienna", desc: "Montaż do elewacji budynku", priceMod: 0 },
  { id: "wolnostojąca", name: "Wolnostojąca", desc: "Samonośna konstrukcja na słupach", priceMod: 3200 },
  { id: "opaska-betonowa", name: "Opaska betonowa", desc: "Montaż na opasce betonowej", priceMod: 1800 },
]

export type Addon = {
  id: string
  name: string
  desc: string
  price: number
}

export const addons: Addon[] = [
  { id: "rain-sensor", name: "Czujnik deszczu", desc: "Automatyczne zamykanie lameli przy deszczu", price: 980 },
  { id: "wind-sensor", name: "Czujnik wiatru", desc: "Automatyczne zamykanie lameli przy wietrze", price: 980 },
  { id: "heater", name: "Promiennik ciepła", desc: "Ogrzewanie tarasu 2 kW", price: 1290 },
]

export function formatPLN(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(value)
}
