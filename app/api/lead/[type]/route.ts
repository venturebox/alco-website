import { NextResponse } from "next/server"

const VALID_TYPES = ["pergola", "zadaszenia", "stolarka"]

// Basic email regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Phone regex: optional plus, digits, spaces, dashes, length between 9 and 20
const PHONE_REGEX = /^[+]?[0-9\s-]{9,20}$/

export async function POST(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params

  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json(
      { error: "Nieprawidłowy typ konfiguratora." },
      { status: 400 }
    )
  }

  const apiKey = process.env.CRM_API_KEY
  const apiUrl = process.env.CRM_API_URL

  if (!apiKey || !apiUrl) {
    console.error("Brak konfiguracji zmiennych środowiskowych CRM.")
    return NextResponse.json(
      { error: "Błąd konfiguracji serwera." },
      { status: 500 }
    )
  }

  try {
    const body = await request.json()
    const { name, email, phone } = body

    const errors: Record<string, string> = {}

    // Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      errors.name = "Imię i nazwisko musi mieć co najmniej 2 znaki."
    }

    if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
      errors.email = "Wprowadź poprawny adres e-mail."
    }

    if (!phone || typeof phone !== "string" || !PHONE_REGEX.test(phone.trim())) {
      errors.phone = "Wprowadź poprawny numer telefonu (minimum 9 cyfr)."
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "Błąd walidacji danych.", errors },
        { status: 400 }
      )
    }

    // Call external CRM API
    const crmEndpoint = `${apiUrl}/api/lead/${type}`
    const response = await fetch(crmEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim().replace(/\s+/g, ""), // send clean phone number
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`CRM API error status ${response.status}:`, errorText)

      // Spróbuj wyciągnąć czytelny błąd z odpowiedzi Convex
      try {
        const errorJson = JSON.parse(errorText)
        if (errorJson && errorJson.error) {
          return NextResponse.json(
            { error: errorJson.error },
            { status: response.status }
          )
        }
      } catch {
        // Ignoruj błąd parsowania
      }

      return NextResponse.json(
        { error: "Błąd połączenia z systemem CRM." },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Błąd podczas przetwarzania zapytania:", error)
    return NextResponse.json(
      { error: "Wystąpił nieoczekiwany błąd serwera." },
      { status: 500 }
    )
  }
}
