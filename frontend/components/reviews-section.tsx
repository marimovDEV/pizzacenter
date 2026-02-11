"use client"

import type React from "react"

import { useState } from "react"
import { Star } from "lucide-react"

interface Review {
  id: number
  name: string
  rating: number
  comment: string
  date: string
}

const mockReviews: Review[] = [
  {
    id: 1,
    name: "Aziz Rahimov",
    rating: 5,
    comment: "Ajoyib restoran! Sushi juda mazali va xizmat a'lo darajada. Albatta qaytib kelamiz!",
    date: "2025-01-05",
  },
  {
    id: 2,
    name: "Marina Ivanova",
    rating: 5,
    comment: "Прекрасная атмосфера и вкусная еда. Рекомендую всем любителям японской кухни!",
    date: "2025-01-03",
  },
  {
    id: 3,
    name: "John Smith",
    rating: 4,
    comment: "Great authentic Japanese food in Tashkent. The ramen was excellent!",
    date: "2024-12-28",
  },
]

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [firstName, setFirstName] = useState("")
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [hoveredStar, setHoveredStar] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newReview: Review = {
      id: reviews.length + 1,
      name: firstName,
      rating,
      comment,
      date: new Date().toISOString().split("T")[0],
    }

    setReviews([newReview, ...reviews])

    // Reset form
    setFirstName("")
    setRating(5)
    setComment("")
  }

  return (
    <section className="relative min-h-screen py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-16">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/hero_background.jpg')",
        }}
      />

      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Review Form */}
          <div className="p-6 md:p-8 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Izoh qoldiring</h2>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
                  Ism
                </label>
                <input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  placeholder="Ismingizni kiriting..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Baho</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${star <= (hoveredStar || rating) ? "fill-emerald-400 text-emerald-400" : "text-white/40"
                          }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-white mb-2">
                  Izoh
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all resize-none"
                  placeholder="Fikringizni yozing..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 rounded-2xl bg-white/30 backdrop-blur-md border border-white/40 text-white font-semibold hover:bg-white/40 hover:scale-[1.02] transition-all shadow-xl"
              >
                Yuborish
              </button>
            </form>
          </div>

          {/* Reviews Display */}
          <div className="p-6 md:p-8 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Izohlar</h2>
            <div className="space-y-4 md:space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {reviews.length === 0 ? (
                <p className="text-white/70 text-center py-8">Hozircha izohlar yo'q. Birinchi bo'lib izoh qoldiring!</p>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-white">{review.name}</h3>
                      <span className="text-xs text-white/70">{new Date(review.date).toLocaleDateString("uz-UZ")}</span>
                    </div>
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= review.rating ? "fill-emerald-400 text-emerald-400" : "text-white/40"
                            }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm md:text-base text-white/90 leading-relaxed">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
