import { useState, useRef, useEffect } from "react"
import { Star, Plus, Minus, Check, Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ProductModal } from "@/components/product-modal"
import type { MenuItem } from "@/lib/types"
import { useCart } from "@/lib/cart-context"
import { formatPrice, getImageUrl } from "@/lib/api"

interface MenuItemCardProps {
  item: MenuItem
  language: "uz" | "ru" | "en"
  discountBadge?: string
  discountPrice?: number
  priority?: boolean
}

export function MenuItemCard({ item, language, discountBadge, discountPrice, priority }: MenuItemCardProps) {
  const { cart, addToCart, updateQuantity } = useCart()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const cartItem = cart.find((ci) => ci.menuItem.id === item.id)
  const quantity = cartItem?.quantity || 0

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => setIsSuccess(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isSuccess])

  const getName = () => {
    if (language === "uz") return item.name_uz || item.name
    if (language === "ru") return item.name_ru || item.name
    return item.name
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLoading(true)

    // Simulate network delay for better UX
    setTimeout(() => {
      // If we have a promotion, it's still a MenuItem but with extra info for display
      addToCart(item)
      setIsLoading(false)
      setIsSuccess(true)
    }, 600)
  }

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart(item)
  }

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (quantity > 0) {
      updateQuantity(item.id, quantity - 1)
    }
  }

  const openModal = () => setIsModalOpen(true)

  // Combined promotion data
  const effectiveDiscountBadge = discountBadge || (item as any).discountBadge
  const effectiveDiscountPrice = discountPrice || (item as any).discountPrice

  return (
    <>
      <div
        data-menu-item-id={item.id}
        onClick={openModal}
        className="group bg-white/10 rounded-xl md:rounded-2xl overflow-hidden border border-white/10 shadow-md hover:border-emerald-500/30 h-full flex flex-col cursor-pointer transition-colors duration-200 menu-content"
      >
        {/* Image Section - Simplified */}
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={getImageUrl(item.image_thumbnail || item.image)}
            alt={getName()}
            fill
            sizes="(max-width: 768px) 300px, (max-width: 1200px) 400px, 500px"
            className="object-cover"
            priority={priority}
            unoptimized={true}
            loading={priority ? undefined : "lazy"}
          />

          {/* Discount Badge - Smaller */}
          {effectiveDiscountBadge && (
            <div className="absolute top-1.5 left-1.5 bg-red-500 text-white px-1.5 py-0.5 rounded-md text-[10px] font-bold shadow-md z-10">
              {effectiveDiscountBadge}
            </div>
          )}

          <div className="absolute top-1.5 right-1.5 bg-black/70 px-1.5 py-0.5 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />
            <span className="text-white font-semibold text-[10px]">{item.rating}</span>
          </div>
        </div>

        {/* Content Section - Tightened Padding (12px) */}
        <div className="flex-1 flex flex-col p-3">
          {/* Title - Reduced Margin (6px) */}
          <h3 className="text-sm md:text-base font-bold text-white mb-1.5 line-clamp-1 group-hover:text-emerald-400 transition-colors">
            {getName()}
          </h3>

          {/* Description - Reduced Margin (4px) */}
          <div className="mb-2">
            <p className="text-[10px] md:text-xs text-white/50 line-clamp-2 leading-relaxed">
              {language === "uz" ? (item.description_uz || item.description) : language === "ru" ? (item.description_ru || item.description) : item.description}
            </p>
          </div>

          {/* Price and Add Button - Bottom aligned */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 mt-auto">
            <div className="flex flex-col">
              {effectiveDiscountPrice ? (
                <>
                  <span className="text-sm md:text-base font-bold text-emerald-400 whitespace-nowrap">
                    {formatPrice(effectiveDiscountPrice)}
                  </span>
                  <span className="text-[9px] md:text-[10px] text-white/30 line-through">
                    {formatPrice(item.price)}
                  </span>
                </>
              ) : (
                <span className="text-sm md:text-base font-bold text-emerald-400 whitespace-nowrap">
                  {formatPrice(item.price)}
                </span>
              )}
            </div>

            {quantity === 0 ? (
              <Button
                onClick={handleAddToCart}
                disabled={!item.available || isLoading}
                className={`
                bg-gradient-to-r text-white rounded-lg
                h-8 w-8 md:h-9 md:w-auto md:px-4 
                font-semibold shadow-sm transition-all duration-200
                flex items-center justify-center text-xs
                ${isSuccess
                    ? "from-emerald-500 to-emerald-600"
                    : "from-emerald-600 to-emerald-700 hover:from-emerald-500"
                  }
              `}
              >
                {isLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : isSuccess ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 md:mr-1" />
                    <span className="hidden md:inline">
                      {language === "uz" ? "Qo'shish" : language === "ru" ? "Добавить" : "Add"}
                    </span>
                  </>
                )}
              </Button>
            ) : (
              <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleDecrement}
                  className="h-6 w-6 rounded-md hover:bg-white/10 text-white"
                >
                  <Minus className="w-2.5 h-2.5" />
                </Button>
                <span className="text-white font-semibold w-4 text-center text-xs">{quantity}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleIncrement}
                  className="h-6 w-6 rounded-md hover:bg-white/10 text-white"
                >
                  <Plus className="w-2.5 h-2.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductModal
        item={item}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        language={language}
      />
    </>
  )
}
