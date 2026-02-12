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

        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Header - Tightened */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <Link
                href="/menu"
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              <h1 className="text-xl md:text-3xl font-bold text-white">
                {language === "uz" ? "Savat" : language === "ru" ? "Корзина" : "Cart"}
              </h1>
            </div>

            {/* Language Switcher - Compact */}
            <div className="flex bg-white/5 backdrop-blur-md rounded-lg p-1 border border-white/10">
              {(["uz", "ru", "en"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-1 rounded-md text-[10px] md:text-xs font-medium transition-all ${language === lang ? "bg-white text-slate-900" : "text-white/60 hover:text-white"
                    }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Cart Items */}
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                <ShoppingBag className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">
                  {language === "uz"
                    ? "Savatingiz bo'sh"
                    : language === "ru"
                      ? "Ваша корзина пуста"
                      : "Your cart is empty"}
                </h2>
                <p className="text-white/40 text-sm mb-6">
                  {language === "uz"
                    ? "Menuga o'ting va sevimli taomlaringizni tanlang"
                    : language === "ru"
                      ? "Перейдите в меню и выберите любимые блюда"
                      : "Go to menu and choose your favorite dishes"}
                </p>
                <Link href="/menu">
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-6 h-11 text-sm font-bold shadow-lg shadow-emerald-500/10">
                    {language === "uz" ? "Menuga o'tish" : language === "ru" ? "Перейти в меню" : "Go to Menu"}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div
                    key={item.menuItem.id}
                    className="bg-white/5 backdrop-blur-md rounded-2l p-3 md:p-4 border border-white/10 shadow-sm transition-all"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                        <Image
                          src={item.menuItem.image || "/placeholder.svg"}
                          alt={getName(item.menuItem)}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 80px, 96px"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="text-base md:text-lg font-bold text-white truncate">{getName(item.menuItem)}</h3>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removeFromCart(item.menuItem.id)}
                              className="text-white/20 hover:text-red-400 h-8 w-8 rounded-full"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* Ingredient & Description - Tightened */}
                          <div className="mt-1">
                            {getDescription(item.menuItem) && (
                              <p className="text-[10px] md:text-xs text-white/50 line-clamp-1">
                                {getDescription(item.menuItem)}
                              </p>
                            )}
                            {getIngredients(item.menuItem) && (
                              <p className="text-[10px] md:text-xs text-white/30 line-clamp-1 mt-0.5">
                                {Array.isArray(getIngredients(item.menuItem))
                                  ? getIngredients(item.menuItem).join(", ")
                                  : getIngredients(item.menuItem)
                                }
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 mt-2">
                          <div className="text-lg md:text-xl font-black text-emerald-400">
                            {formatPrice(item.menuItem.price * item.quantity)}
                          </div>

                          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-0.5">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                              className="h-7 w-7 md:h-8 md:w-8 rounded-md hover:bg-white/10 text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-white font-bold w-6 md:w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                              className="h-7 w-7 md:h-8 md:w-8 rounded-md hover:bg-white/10 text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total and Checkout - Balanced */}
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-lg sticky bottom-4 z-20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg text-white font-bold">
                    {language === "uz" ? "Jami:" : language === "ru" ? "Итого:" : "Total:"}
                  </span>
                  <span className="text-2xl font-black text-emerald-400">{formatPrice(getTotalPrice())}</span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-12 text-base font-bold shadow-lg shadow-emerald-500/10 transition-all active:scale-[0.98]"
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
