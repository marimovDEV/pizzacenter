"use client"

import { useMenu } from "@/lib/menu-context"
import { useCart } from "@/lib/cart-context"
import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PromotionModal } from "@/components/promotion-modal"
import type { Language, Promotion } from "@/lib/types"
import { formatPrice } from "@/lib/api"

interface PromotionsCarouselProps {
  language: Language
}

export function PromotionsCarousel({ language }: PromotionsCarouselProps) {
  const { promotions, loading } = useMenu()
  const { addPromotionToCart } = useCart()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Active promotions ni hisoblash (useMemo bilan optimizatsiya)
  const activePromotions = useMemo(() => {
    return promotions && Array.isArray(promotions)
      ? promotions.filter((promo) => promo.is_active)
      : []
  }, [promotions])

  // Avtomatik aylanish (har 4 soniyada, yumshoq transition)
  useEffect(() => {
    if (activePromotions.length <= 1) return
    if (isModalOpen) return // Modal ochilganda aylanmasin

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % activePromotions.length
        return nextIndex
      })
    }, 4000)

    return () => {
      clearInterval(interval)
    }
  }, [activePromotions.length, isModalOpen])

  // Modal ochish funksiyasi
  const openModal = () => {
    setSelectedPromotion(currentPromotion)
    setIsModalOpen(true)
  }

  // Modal yopish funksiyasi
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedPromotion(null)
  }

  // Promotion'ni savatga qo'shish funksiyasi
  const handleAddPromotionToCart = () => {
    if (currentPromotion) {
      addPromotionToCart(currentPromotion)

      // Qo'shilgandan keyin linked_product'ga scroll qilish
      if (currentPromotion.linked_dish) {
        setTimeout(() => {
          const linkedProductId = currentPromotion.linked_dish?.toString()
          const productElement = document.querySelector(`[data-menu-item-id="${linkedProductId}"]`)
          if (productElement) {
            productElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
            // Highlight effect uchun
            productElement.classList.add('highlight-added')
            setTimeout(() => {
              productElement.classList.remove('highlight-added')
            }, 3000)
          }
        }, 100)
      }
    }
  }

  // Loading yoki promotions yo'q bo'lsa
  if (loading || !promotions || !Array.isArray(promotions)) return null

  if (activePromotions.length === 0) return null

  const currentPromotion = activePromotions[currentIndex]

  // Agar currentPromotion yo'q bo'lsa
  if (!currentPromotion) return null

  const nextPromotion = () => {
    setCurrentIndex((prev) => (prev + 1) % activePromotions.length)
  }

  const prevPromotion = () => {
    setCurrentIndex((prev) => (prev - 1 + activePromotions.length) % activePromotions.length)
  }

  const getTitle = () => {
    if (language === "uz") return currentPromotion.title_uz || currentPromotion.title
    if (language === "ru") return currentPromotion.title_ru || currentPromotion.title
    return currentPromotion.title
  }

  const getDescription = () => {
    if (language === "uz") return currentPromotion.description_uz || currentPromotion.description
    if (language === "ru") return currentPromotion.description_ru || currentPromotion.description
    return currentPromotion.description
  }

  return (
    <div className="mb-8">
      <div className="relative">
        <div className="bg-white/10 rounded-3xl overflow-hidden border border-white/20 shadow-xl">
          <div className="relative h-48 md:h-64">
            <Image
              src={currentPromotion.image || "/placeholder.svg"}
              alt={getTitle()}
              fill
              className="object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
              onLoad={() => {
                // Image loaded successfully
              }}
              priority={currentIndex === 0}
              quality={75}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* AKSIYA Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              AKSIYA
            </div>

            {((currentPromotion.discount_percentage ?? 0) > 0 || (currentPromotion.discount_amount ?? 0) > 0) && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-full text-lg font-bold shadow-lg">
                {(currentPromotion.discount_percentage ?? 0) > 0 && `-${currentPromotion.discount_percentage}%`}
                {(currentPromotion.discount_percentage ?? 0) === 0 && (currentPromotion.discount_amount ?? 0) > 0 &&
                  `-${formatPrice(currentPromotion.discount_amount ?? 0)}`}
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{getTitle()}</h3>
              <p className="text-white/90 text-sm md:text-base line-clamp-2 mb-4">{getDescription()}</p>

              {/* Tugmalar */}
              <div className="flex gap-3">
                <Button
                  onClick={openModal}
                  size="sm"
                  className="bg-white/20 border border-white/30 text-white hover:bg-white/30 rounded-full text-sm font-semibold flex-1"
                >
                  {language === "uz" ? "Ko'rish" : language === "ru" ? "Смотреть" : "View"}
                </Button>

                <Button
                  onClick={handleAddPromotionToCart}
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full text-sm font-semibold shadow-lg shadow-emerald-500/30 flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {language === "uz" ? "Qo'shish" : language === "ru" ? "Добавить" : "Add"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {activePromotions.length > 1 && (
          <>
            <Button
              onClick={prevPromotion}
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 border border-white/30"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </Button>
            <Button
              onClick={nextPromotion}
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 border border-white/30"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </Button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {activePromotions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${index === currentIndex ? "bg-emerald-500 w-8" : "bg-white/30 w-2"
                    }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Promotion Modal */}
      <PromotionModal
        promotion={selectedPromotion}
        isOpen={isModalOpen}
        onClose={closeModal}
        language={language}
      />
    </div>
  )
}
