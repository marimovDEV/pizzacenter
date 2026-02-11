"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, ChevronDown } from "lucide-react"
import { formatPrice, saveOrder, type CartItem, type Order } from "@/lib/restaurant-data"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [language, setLanguage] = useState<"uz" | "ru" | "en">("uz")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)

  useEffect(() => {
    const savedCart = localStorage.getItem("restaurant-cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    const savedLanguage = localStorage.getItem("restaurant-language") as "uz" | "ru" | "en" | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("restaurant-cart", JSON.stringify(cart))
  }, [cart])

  const updateCartQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== itemId))
    } else {
      setCart((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId))
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handleSubmitOrder = async () => {
    if (cart.length === 0) return

    setIsSubmitting(true)

    try {
      const order: Order = {
        id: Date.now().toString(),
        tableNumber: 0,
        items: cart,
        total: getCartTotal(),
        status: "pending",
        timestamp: new Date(),
      }

      saveOrder(order)
      setCart([])
      localStorage.removeItem("restaurant-cart")

      alert(
        language === "uz"
          ? `Buyurtmangiz qabul qilindi! Buyurtma raqami: ${order.id}`
          : language === "ru"
            ? `Заказ принят! Номер заказа: ${order.id}`
            : `Order submitted successfully! Order ID: ${order.id}`,
      )

      window.location.href = "/menu"
    } catch (error) {
      console.error("Error submitting order:", error)
      alert(language === "uz" ? "Xatolik yuz berdi" : language === "ru" ? "Произошла ошибка" : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const translations = {
    uz: {
      cart: "Savatcha",
      emptyCart: "Savatchangiz bo'sh",
      chooseItems: "Menyudan taom tanlang",
      backToMenu: "Menyuga qaytish",
      items: "ta",
      selectedItems: "Tanlangan taomlar",
      modifyItems: "Miqdorni o'zgartiring yoki olib tashlang",
      notes: "Izoh:",
      orderSummary: "Buyurtma xulosasi",
      itemsCount: "Mahsulotlar soni:",
      subtotal: "Subtotal:",
      total: "Jami:",
      placeOrder: "Buyurtma berish",
      submitting: "Yuborilmoqda...",
      orderNote: "Buyurtmangiz ofitsiantga yuboriladi va tez orada tayyorlanadi",
      languageUz: "O'zbekcha",
      languageRu: "Русский",
      languageEn: "English",
    },
    ru: {
      cart: "Корзина",
      emptyCart: "Ваша корзина пуста",
      chooseItems: "Выберите блюда из меню",
      backToMenu: "Вернуться в меню",
      items: "шт",
      selectedItems: "Выбранные блюда",
      modifyItems: "Измените количество или удалите",
      notes: "Примечание:",
      orderSummary: "Итоги заказа",
      itemsCount: "Количество товаров:",
      subtotal: "Промежуточный итог:",
      total: "Итого:",
      placeOrder: "Оформить заказ",
      submitting: "Отправка...",
      orderNote: "Ваш заказ будет отправлен официанту и скоро будет готов",
      languageUz: "O'zbekcha",
      languageRu: "Русский",
      languageEn: "English",
    },
    en: {
      cart: "Cart",
      emptyCart: "Your cart is empty",
      chooseItems: "Choose items from the menu",
      backToMenu: "Back to Menu",
      items: "items",
      selectedItems: "Selected Items",
      modifyItems: "Modify quantities or remove items",
      notes: "Notes:",
      orderSummary: "Order Summary",
      itemsCount: "Items:",
      subtotal: "Subtotal:",
      total: "Total:",
      placeOrder: "Place Order",
      submitting: "Submitting...",
      orderNote: "Your order will be sent to the waiter and prepared shortly",
      languageUz: "O'zbekcha",
      languageRu: "Русский",
      languageEn: "English",
    },
  }

  const t = translations[language]

  const getLanguageCode = () => {
    return language === "uz" ? "UZ" : language === "ru" ? "RU" : "EN"
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <header className="bg-gradient-to-r from-green-700 to-green-600 text-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => (window.location.href = "/menu")}
                  className="hover:bg-white/20 text-white"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-xl font-bold">{t.cart}</h1>
              </div>
              <DropdownMenu open={languageDropdownOpen} onOpenChange={setLanguageDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-white/20 font-semibold flex items-center gap-1.5 text-white"
                  >
                    {getLanguageCode()}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => {
                      setLanguage("uz")
                      localStorage.setItem("restaurant-language", "uz")
                      setLanguageDropdownOpen(false)
                    }}
                    className={language === "uz" ? "bg-accent" : ""}
                  >
                    {t.languageUz}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setLanguage("ru")
                      localStorage.setItem("restaurant-language", "ru")
                      setLanguageDropdownOpen(false)
                    }}
                    className={language === "ru" ? "bg-accent" : ""}
                  >
                    {t.languageRu}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setLanguage("en")
                      localStorage.setItem("restaurant-language", "en")
                      setLanguageDropdownOpen(false)
                    }}
                    className={language === "en" ? "bg-accent" : ""}
                  >
                    {t.languageEn}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">{t.emptyCart}</h2>
            <p className="text-gray-600 mb-8">{t.chooseItems}</p>
            <Button
              onClick={() => (window.location.href = "/menu")}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              {t.backToMenu}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="bg-gradient-to-r from-green-700 to-green-600 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => (window.location.href = "/menu")}
                className="hover:bg-white/20 text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold">{t.cart}</h1>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                {getCartItemCount()} {t.items}
              </div>
            </div>
            <DropdownMenu open={languageDropdownOpen} onOpenChange={setLanguageDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-white/20 font-semibold flex items-center gap-1.5 text-white"
                >
                  {getLanguageCode()}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => {
                    setLanguage("uz")
                    localStorage.setItem("restaurant-language", "uz")
                    setLanguageDropdownOpen(false)
                  }}
                  className={language === "uz" ? "bg-accent" : ""}
                >
                  {t.languageUz}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setLanguage("ru")
                    localStorage.setItem("restaurant-language", "ru")
                    setLanguageDropdownOpen(false)
                  }}
                  className={language === "ru" ? "bg-accent" : ""}
                >
                  {t.languageRu}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setLanguage("en")
                    localStorage.setItem("restaurant-language", "en")
                    setLanguageDropdownOpen(false)
                  }}
                  className={language === "en" ? "bg-accent" : ""}
                >
                  {t.languageEn}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 pb-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4">
              <h2 className="text-lg font-bold">{t.selectedItems}</h2>
              <p className="text-sm text-green-50 mt-1">{t.modifyItems}</p>
            </div>
            <div className="divide-y">
              {cart.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={language === "uz" ? item.nameUz : language === "ru" ? item.nameRu : item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 leading-tight">
                        {language === "uz" ? item.nameUz : language === "ru" ? item.nameRu : item.name}
                      </h3>
                      <p className="text-sm text-gray-600 font-medium">{formatPrice(item.price)}</p>
                      {item.notes && (
                        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">
                          {t.notes} {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 rounded-full"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="font-semibold text-base min-w-[32px] text-center">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 rounded-full"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="font-bold text-green-700 text-base">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4">
              <h2 className="text-lg font-bold">{t.orderSummary}</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">{t.itemsCount}</span>
                  <span className="font-semibold">{getCartItemCount()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">{t.subtotal}</span>
                  <span className="font-semibold">{formatPrice(getCartTotal())}</span>
                </div>

                <div className="border-t-2 border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">{t.total}</span>
                    <span className="text-2xl font-bold text-green-700">{formatPrice(getCartTotal())}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSubmitOrder}
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-base shadow-md hover:shadow-lg transition-all"
                size="lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t.submitting}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5" />
                    {t.placeOrder}
                  </span>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center leading-relaxed px-2">{t.orderNote}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
