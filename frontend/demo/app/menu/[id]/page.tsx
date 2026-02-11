"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Plus, Minus, ShoppingCart, Clock, Star, ChefHat } from "lucide-react"
import { menuItems, type MenuItem, type CartItem } from "@/lib/restaurant-data"
import Image from "next/image"

export default function MenuItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [language, setLanguage] = useState<"uz" | "ru" | "en">("uz")
  const [quantity, setQuantity] = useState(1)
  const [item, setItem] = useState<MenuItem | null>(null)

  useEffect(() => {
    const savedLanguage = localStorage.getItem("restaurant-language") as "uz" | "ru" | "en"
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    const foundItem = menuItems.find((i) => i.id === params.id)
    setItem(foundItem || null)
  }, [params.id])

  const translations = {
    uz: {
      back: "Ortga",
      addToCart: "Savatga Qo'shish",
      quantity: "Miqdor",
      ingredients: "Tarkibi",
      prepTime: "Tayyorlash vaqti",
      rating: "Reyting",
      minutes: "daqiqa",
    },
    ru: {
      back: "Назад",
      addToCart: "Добавить в Корзину",
      quantity: "Количество",
      ingredients: "Ингредиенты",
      prepTime: "Время приготовления",
      rating: "Рейтинг",
      minutes: "минут",
    },
    en: {
      back: "Back",
      addToCart: "Add to Cart",
      quantity: "Quantity",
      ingredients: "Ingredients",
      prepTime: "Prep time",
      rating: "Rating",
      minutes: "min",
    },
  }

  const t = translations[language]

  const addToCart = () => {
    if (!item) return

    const cart = JSON.parse(localStorage.getItem("restaurant-cart") || "[]")
    const existingItemIndex = cart.findIndex((cartItem: CartItem) => cartItem.id === item.id)

    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity
    } else {
      cart.push({ ...item, quantity })
    }

    localStorage.setItem("restaurant-cart", JSON.stringify(cart))
    router.push("/menu")
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 flex items-center justify-center">
        <p className="text-xl text-green-800">Loading...</p>
      </div>
    )
  }

  const itemName = language === "uz" ? item.nameUz : language === "ru" ? item.nameRu : item.name
  const itemDescription =
    language === "uz" ? item.descriptionUz : language === "ru" ? item.descriptionRu : item.description
  const itemIngredients =
    language === "uz" ? item.ingredientsUz : language === "ru" ? item.ingredientsRu : item.ingredients

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 via-emerald-700 to-green-800 text-white shadow-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/menu")}
              className="hover:bg-white/20 text-white"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              {t.back}
            </Button>

            <div className="flex gap-2">
              <Button
                variant={language === "uz" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLanguage("uz")}
                className={language === "uz" ? "" : "text-white hover:bg-white/20"}
              >
                O'Z
              </Button>
              <Button
                variant={language === "ru" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLanguage("ru")}
                className={language === "ru" ? "" : "text-white hover:bg-white/20"}
              >
                RU
              </Button>
              <Button
                variant={language === "en" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setLanguage("en")}
                className={language === "en" ? "" : "text-white hover:bg-white/20"}
              >
                EN
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="overflow-hidden shadow-2xl border-2 border-green-200">
          {/* Image */}
          <div className="relative h-80 bg-gray-100">
            <Image src={item.image || "/placeholder.svg"} alt={itemName} fill className="object-cover" />
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-green-900 mb-2">{itemName}</h1>
              <p className="text-green-700 text-lg mb-4">{itemDescription}</p>

              <div className="flex items-center gap-6 text-sm text-green-700">
                {item.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{item.rating}</span>
                  </div>
                )}
                {item.prepTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-5 h-5" />
                    <span>
                      {t.prepTime}: {item.prepTime} {t.minutes}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients */}
            {itemIngredients && itemIngredients.length > 0 && (
              <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                <h2 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                  <ChefHat className="w-6 h-6" />
                  {t.ingredients}
                </h2>
                <ul className="space-y-2">
                  {itemIngredients.map((ingredient, index) => (
                    <li key={index} className="text-green-800 flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price and Add to Cart */}
            <div className="flex items-center justify-between pt-4 border-t-2 border-green-200">
              <div>
                <p className="text-3xl font-bold text-green-700">{item.price.toLocaleString()} so'm</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-green-100 rounded-full px-4 py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-8 w-8 p-0 rounded-full hover:bg-green-200"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-bold text-green-900 min-w-[30px] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-8 w-8 p-0 rounded-full hover:bg-green-200"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  onClick={addToCart}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-6 rounded-full shadow-xl"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {t.addToCart}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
