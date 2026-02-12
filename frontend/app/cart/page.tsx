"use client"
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useLanguage } from "@/lib/language-context"
import type { Language } from "@/lib/types"
import { toast } from "sonner"
import { formatPrice, formatWeight } from "@/lib/api"

export default function CartPage() {
  const { language, setLanguage } = useLanguage()
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart()

  const handlePlaceOrder = () => {
    if (cart.length === 0) return

    const message =
      language === "uz"
        ? "Buyurtma muvaffaqiyatli qabul qilindi!"
        : language === "ru"
          ? "Заказ успешно принят!"
          : "Order placed successfully!"

    toast.success(message)
    clearCart()
  }

  const getName = (item: (typeof cart)[0]["menuItem"]) => {
    if (language === "uz") return item.name_uz || item.name
    if (language === "ru") return item.name_ru || item.name
    return item.name
  }

  const getDescription = (item: (typeof cart)[0]["menuItem"]) => {
    if (language === "uz") return item.description_uz || item.description
    if (language === "ru") return item.description_ru || item.description
    return item.description
  }

  const getIngredients = (item: (typeof cart)[0]["menuItem"]) => {
    if (language === "uz") return item.ingredients_uz || item.ingredients
    if (language === "ru") return item.ingredients_ru || item.ingredients
    return item.ingredients
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="fixed inset-0 bg-[url('/hero_background.jpg')] bg-cover bg-center bg-fixed opacity-10 pointer-events-none" />
      <div className="relative z-10">

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link
                href="/menu"
                className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center hover:bg-white/30 transition-all border border-white/30"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {language === "uz" ? "Savat" : language === "ru" ? "Корзина" : "Cart"}
              </h1>
            </div>

            {/* Language Switcher */}
            <div className="flex gap-1 bg-white/10 backdrop-blur-xl rounded-full p-1 border border-white/20">
              {(["uz", "ru", "en"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${language === lang ? "bg-white text-slate-900" : "text-white/70 hover:text-white"
                    }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Cart Items */}
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20">
                <ShoppingBag className="w-24 h-24 text-white/40 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-3">
                  {language === "uz"
                    ? "Savatingiz bo'sh"
                    : language === "ru"
                      ? "Ваша корзина пуста"
                      : "Your cart is empty"}
                </h2>
                <p className="text-white/60 mb-6">
                  {language === "uz"
                    ? "Menuga o'ting va sevimli taomlaringizni tanlang"
                    : language === "ru"
                      ? "Перейдите в меню и выберите любимые блюда"
                      : "Go to menu and choose your favorite dishes"}
                </p>
                <Link href="/menu">
                  <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full px-8 h-12 shadow-lg shadow-emerald-500/30">
                    {language === "uz" ? "Menuga o'tish" : language === "ru" ? "Перейти в меню" : "Go to Menu"}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {cart.map((item) => (
                  <div
                    key={item.menuItem.id}
                    className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 md:p-6 border border-white/20 shadow-xl"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden flex-shrink-0">
                        <Image
                          src={item.menuItem.image || "/placeholder.svg"}
                          alt={getName(item.menuItem)}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <h3 className="text-lg md:text-xl font-bold text-white truncate">{getName(item.menuItem)}</h3>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeFromCart(item.menuItem.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-full flex-shrink-0"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>

                        {/* Description */}
                        {getDescription(item.menuItem) && (
                          <p className="text-sm text-white/70 mb-2 line-clamp-2">
                            {getDescription(item.menuItem)}
                          </p>
                        )}

                        {/* Ingredients */}
                        {getIngredients(item.menuItem) && (
                          <p className="text-xs text-white/50 mb-2">
                            <span className="font-medium">
                              {language === "uz" ? "Tarkib:" : language === "ru" ? "Состав:" : "Ingredients:"}
                            </span>{" "}
                            {Array.isArray(getIngredients(item.menuItem))
                              ? getIngredients(item.menuItem).join(", ")
                              : getIngredients(item.menuItem)
                            }
                          </p>
                        )}

                        {/* Weight and Prep Time */}
                        <div className="flex items-center gap-3 text-sm text-white/60 mb-3">
                          {item.menuItem.weight && (
                            <span>{formatWeight(item.menuItem.weight)}</span>
                          )}
                          {item.menuItem.prep_time && (
                            <span>
                              {language === "uz" ? "Tayyorlanish:" : language === "ru" ? "Приготовление:" : "Prep time:"} {item.menuItem.prep_time}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <div className="text-xl md:text-2xl font-bold text-emerald-400">
                            {formatPrice(item.menuItem.price * item.quantity)}
                          </div>

                          <div className="flex items-center gap-2 bg-white/10 rounded-full p-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                              className="h-8 w-8 md:h-10 md:w-10 rounded-full hover:bg-white/20 text-white"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="text-white font-semibold w-8 md:w-10 text-center">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                              className="h-8 w-8 md:h-10 md:w-10 rounded-full hover:bg-white/20 text-white"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total and Checkout */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl sticky bottom-4">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl text-white font-semibold">
                    {language === "uz" ? "Jami:" : language === "ru" ? "Итого:" : "Total:"}
                  </span>
                  <span className="text-3xl font-bold text-emerald-400">{formatPrice(getTotalPrice())}</span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full h-14 text-lg font-semibold shadow-lg shadow-emerald-500/30"
                >
                  {language === "uz" ? "Buyurtma berish" : language === "ru" ? "Оформить заказ" : "Place Order"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
