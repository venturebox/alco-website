import { NextResponse } from "next/server"

export const revalidate = 3600 // Cache for 1 hour

const MOCK_REVIEWS = [
  {
    author_name: "Michał K.",
    rating: 5,
    text: "Pełen profesjonalizm! Zadaszenie tarasu wykonane perfekcyjnie, bardzo solidnie i terminowo. Zdecydowanie polecam każdemu współpracę z Exalco.",
    profile_photo_url: "",
    relative_time_description: "tydzień temu"
  },
  {
    author_name: "Anna Nowak",
    rating: 5,
    text: "Firma spisała się na medal. Konstrukcja aluminiowa wygląda niezwykle nowocześnie, a ekipa montażowa bardzo dbała o porządek po zakończonej pracy.",
    profile_photo_url: "",
    relative_time_description: "miesiąc temu"
  },
  {
    author_name: "Piotr Wiśniewski",
    rating: 4,
    text: "Bardzo dobry kontakt i świetne wykonanie. Pergola prezentuje się rewelacyjnie na żywo. Obsługa od A do Z na bardzo wysokim poziomie.",
    profile_photo_url: "",
    relative_time_description: "2 miesiące temu"
  }
]

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID

  if (!apiKey || !placeId) {
    return NextResponse.json({ reviews: MOCK_REVIEWS })
  }

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews&key=${apiKey}&language=pl`,
      { next: { revalidate: 3600 } }
    )
    
    if (!res.ok) {
      throw new Error(`Google API error: ${res.statusText}`)
    }

    const data = await res.json()
    const reviews = data.result?.reviews || []
    
    // Filter out reviews below 4 stars
    const positiveReviews = reviews.filter((r: any) => r.rating >= 4)
    
    return NextResponse.json({ reviews: positiveReviews })
  } catch (error) {
    console.error("Błąd pobierania opinii Google:", error)
    return NextResponse.json(
      { error: "Wystąpił błąd podczas pobierania opinii." },
      { status: 500 }
    )
  }
}
