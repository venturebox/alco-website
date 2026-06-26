"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"

type Review = {
  author_name: string
  rating: number
  text: string
  profile_photo_url: string
  relative_time_description: string
}

export function GoogleReviews() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews")
        if (res.ok) {
          const data = await res.json()
          if (data.reviews && data.reviews.length > 0) {
            setReviews(data.reviews)
          }
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  useEffect(() => {
    if (reviews.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length)
    }, 6000) // Change review every 6 seconds

    return () => clearInterval(interval)
  }, [reviews.length])

  if (loading) {
    return (
      <div className="flex min-h-[200px] w-full items-center justify-center rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-md">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
      </div>
    )
  }

  if (reviews.length === 0) {
    return null
  }

  const review = reviews[currentIndex]

  return (
    <div className="relative flex min-h-[220px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md transition-all">
      <div className="absolute -right-4 -top-4 text-[120px] leading-none text-white/5 font-serif select-none pointer-events-none">
        &rdquo;
      </div>
      
      <div 
        key={currentIndex}
        className="animate-in fade-in slide-in-from-bottom-2 duration-700 relative z-10 flex flex-col h-full"
      >
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < review.rating ? "fill-[#FFB800] text-[#FFB800]" : "text-white/20"
              }`}
            />
          ))}
        </div>
        
        <p className="text-sm italic leading-relaxed text-white/90 line-clamp-4 mb-6 flex-1">
          &quot;{review.text}&quot;
        </p>

        <div className="flex items-center gap-3 mt-auto">
          {review.profile_photo_url ? (
            <img 
              src={review.profile_photo_url} 
              alt={review.author_name}
              className="h-10 w-10 rounded-full border border-white/20 object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 text-white font-bold border border-white/20">
              {review.author_name.charAt(0)}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-white">{review.author_name}</p>
            <p className="text-xs text-white/60">Opinia z Google</p>
          </div>
        </div>
      </div>
      
      {/* Indicators */}
      {reviews.length > 1 && (
        <div className="absolute bottom-4 right-6 flex gap-1.5 z-10">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/30"
              }`}
              aria-label={`Przejdź do opinii ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
