"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Plus, Minus, ShoppingCart, Star, Clock, Weight, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import type { Promotion, Language } from "@/lib/types"
import { formatPrice } from "@/lib/api"

interface PromotionModalProps {
  promotion: Promotion | null
  isOpen: boolean
  onClose: () => void
  language: Language
}

export function PromotionModal({ promotion, isOpen, onClose, language }: PromotionModalProps) {
  const { cart, addPromotionToCart, updateQuantity } = useCart()
  const [quantity, setQuantity] = useState(1)

  if (!isOpen || !promotion) return null

  const cartItem = cart.find((ci) => ci.menuItem.id === promotion.id)
  const cartQuantity = cartItem?.quantity || 0

  const getTitle = () => {
    if (language === "uz") return promotion.title_uz || promotion.title
    if (language === "ru") return promotion.title_ru || promotion.title
    return promotion.title
  }

  const getDescription = () => {
    if (language === "uz") return promotion.description_uz || promotion.description
    if (language === "ru") return promotion.description_ru || promotion.description
    return promotion.description
  }

  const getIngredients = () => {
    if (language === "uz") return promotion.ingredients_uz || []
    if (language === "ru") return promotion.ingredients_ru || []
    return promotion.ingredients || []
  }

  const getBonusInfo = () => {
    if (language === "uz") return promotion.bonus_info_uz || promotion.bonus_info
    if (language === "ru") return promotion.bonus_info_ru || promotion.bonus_info
    return promotion.bonus_info
  }

  const getDiscountDisplay = () => {
    if (promotion.discount_type === 'percent') {
      return `-${promotion.discount_percentage}%`
    } else if (promotion.discount_type === 'amount') {
      return `-${formatPrice(promotion.discount_amount || 0)}`
    } else if (promotion.discount_type === 'bonus') {
      return getBonusInfo() || "Bonus"
    } else {
      return "Aksiya"
    }
  }

  const getFinalPrice = () => {
    if (promotion.discounted_price) {
      return promotion.discounted_price
    }
    return promotion.price || 0
  }

  const handleAddToCart = () => {
    addPromotionToCart(promotion)
  }

  const handleIncrement = () => {
    addPromotionToCart(promotion)
  }

  const handleDecrement = () => {
    if (cartQuantity > 0) {
      updateQuantity(promotion.id, cartQuantity - 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Image Section */}
        <div className="relative h-64 md:h-80">
          <Image
            src={getImageUrl(promotion.image || promotion.display_image)}
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
            unoptimized={true}
            quality={75}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5PKX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Discount Badge */}
          <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
            {getDiscountDisplay()}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{getTitle()}</h2>

          {/* Description */}
          <p className="text-lg text-white/80 mb-6 leading-relaxed">{getDescription()}</p>

          {/* Promotion Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-400" />
                {language === "uz" ? "Aksiya Ma'lumotlari" : language === "ru" ? "Информация об акции" : "Promotion Info"}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">
                    {language === "uz" ? "Turi:" : language === "ru" ? "Тип:" : "Type:"}
                  </span>
                  <span className="text-white font-medium">{getDiscountDisplay()}</span>
                </div>
                {promotion.start_date && (
                  <div className="flex justify-between">
                    <span className="text-white/70">
                      {language === "uz" ? "Boshlanish:" : language === "ru" ? "Начало:" : "Start:"}
                    </span>
                    <span className="text-white font-medium">
                      {new Date(promotion.start_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {promotion.end_date && (
                  <div className="flex justify-between">
                    <span className="text-white/70">
                      {language === "uz" ? "Tugash:" : language === "ru" ? "Конец:" : "End:"}
                    </span>
                    <span className="text-white font-medium">
                      {new Date(promotion.end_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients */}
            {getIngredients().length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-3">
                  {language === "uz" ? "Tarkibi" : language === "ru" ? "Состав" : "Ingredients"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {getIngredients().map((ingredient, index) => (
                    <span
                      key={index}
                      className="text-sm bg-white/20 text-white px-3 py-1 rounded-full"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bonus Info */}
          {getBonusInfo() && (
            <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 backdrop-blur-xl rounded-2xl p-4 border border-emerald-500/30 mb-6">
              <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                {language === "uz" ? "Bonus Ma'lumoti" : language === "ru" ? "Бонусная информация" : "Bonus Info"}
              </h3>
              <p className="text-white">{getBonusInfo()}</p>
            </div>
          )}

          {/* Price and Add Button */}
          <div className="flex items-center justify-between gap-4 pt-6 border-t border-white/20">
            <div className="text-3xl font-bold text-emerald-400">
              {formatPrice(getFinalPrice())}
            </div>

            {cartQuantity === 0 ? (
              <Button
                onClick={handleAddToCart}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full h-14 px-8 text-lg font-semibold shadow-lg shadow-emerald-500/30 flex items-center gap-3"
              >
                <ShoppingCart className="w-5 h-5" />
                {language === "uz" ? "Savatga qo'shish" : language === "ru" ? "Добавить в корзину" : "Add to Cart"}
              </Button>
            ) : (
              <div className="flex items-center gap-3 bg-white/10 rounded-full p-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleDecrement}
                  className="h-10 w-10 rounded-full hover:bg-white/20 text-white transition-all duration-200"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-white font-semibold text-xl min-w-[40px] text-center">{cartQuantity}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleIncrement}
                  className="h-10 w-10 rounded-full hover:bg-white/20 text-white transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
