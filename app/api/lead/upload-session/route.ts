import { NextResponse } from "next/server"

export async function POST(request: Request) {
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
    const { quoteId, uploadToken, fileName, fileSize } = body

    if (!quoteId || !uploadToken || !fileName || fileSize === undefined) {
      return NextResponse.json(
        { error: "Brakujące wymagane pola: quoteId, uploadToken, fileName, fileSize" },
        { status: 400 }
      )
    }

    let retries = 5
    let uploadUrl = ""
    let lastError = ""
    let lastStatus = 400

    while (retries > 0) {
      console.log(`Pobieranie sesji uploadu (próba ${6 - retries}/5)...`)
      const response = await fetch(`${apiUrl}/api/lead/upload-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          quoteId,
          token: uploadToken,
          fileName,
          fileSize,
        }),
      })

      const data = await response.json()
      lastStatus = response.status

      if (response.ok && data.success) {
        uploadUrl = data.uploadUrl
        break
      } else {
        lastError = data.error || "Błąd podczas generowania sesji uploadu."
        
        // Jeśli folder SharePoint nie jest jeszcze gotowy (status 400 z błędem o folderze), czekamy sekundę i ponawiamy
        const isFolderNotReady = lastError.includes("Folder") || lastError.includes("nie jest gotowy")
        if (isFolderNotReady && retries > 1) {
          retries--
          await new Promise((resolve) => setTimeout(resolve, 1000))
          continue
        }
        break
      }
    }

    if (!uploadUrl) {
      return NextResponse.json(
        { error: lastError },
        { status: lastStatus }
      )
    }

    return NextResponse.json({ success: true, uploadUrl })
  } catch (error) {
    console.error("Błąd generowania sesji uploadu:", error)
    return NextResponse.json(
      { error: "Wystąpił nieoczekiwany błąd serwera." },
      { status: 500 }
    )
  }
}
