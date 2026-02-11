"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ShoppingCart,
  Plus,
  Minus,
  Search,
  ArrowLeft,
  Star,
  ChevronDown,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { categories, menuItems, formatPrice, type MenuItem, type CartItem } from "@/lib/restaurant-data"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const promotions = [
  {
    id: 1,
    image: "/restaurant-special-offer-banner.jpg",
    titleUz: "Yangi Yozgi Menyu",
    titleRu: "Новое Летнее Меню",
    titleEn: "New Summer Menu",
    descriptionUz: "Eng yangi va mazali yozgi taomlar bilan tanishing",
    descriptionRu: "Откройте для себя новые вкусные летние блюда",
    descriptionEn: "Discover our fresh and delicious summer dishes",
  },
  {
    id: 2,
    image: "/restaurant-discount-promotion.jpg",
    titleUz: "30% Chegirma",
    titleRu: "Скидка 30%",
    titleEn: "30% Discount",
    descriptionUz: "Barcha pitsa va ichimliklar uchun maxsus chegirma",
    descriptionRu: "Специальная скидка на всю пиццу и напитки",
    descriptionEn: "Special discount on all pizzas and beverages",
  },
  {
    id: 3,
    image: "/restaurant-family-combo-meal.jpg",
    titleUz: "Oilaviy To'plam",
    titleRu: "Семейный Набор",
    titleEn: "Family Combo",
    descriptionUz: "4 kishilik to'liq taom to'plami - faqat 250,000 so'm",
    descriptionRu: "Полный набор блюд на 4 человека - всего 250,000 сум",
    descriptionEn: "Complete meal set for 4 people - only 250,000 som",
  },
]

export default function MenuPage() {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"categories" | "products">("categories")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [itemNotes, setItemNotes] = useState("")
  const [language, setLanguage] = useState<"uz" | "ru" | "en">("uz")
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const carouselRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const [carouselEnabled, setCarouselEnabled] = useState(true)

  useEffect(() => {
    const savedCart = localStorage.getItem("restaurant-cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    const savedLanguage = localStorage.getItem("restaurant-language") as "uz" | "ru" | "en" | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
    const savedCarouselSetting = localStorage.getItem("carousel-enabled")
    if (savedCarouselSetting !== null) {
      setCarouselEnabled(savedCarouselSetting === "true")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("restaurant-cart", JSON.stringify(cart))
    localStorage.setItem("restaurant-language", language)
    localStorage.setItem("carousel-enabled", carouselEnabled.toString())
  }, [cart, language, carouselEnabled])

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % promotions.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swipe left
      nextSlide()
    }
    if (touchStartX.current - touchEndX.current < -50) {
      // Swipe right
      prevSlide()
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % promotions.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = item.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameUz.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch && item.available
  })

  const addToCart = (item: MenuItem, quantity = 1, notes?: string) => {
    setCart((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id)
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity, notes: notes || cartItem.notes }
            : cartItem,
        )
      }
      return [...prev, { ...item, quantity, notes }]
    })
  }

  const updateCartQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== itemId))
    } else {
      setCart((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handleItemClick = (item: MenuItem) => {
    router.push(`/menu/${item.id}`)
  }

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setViewMode("products")
    setSearchQuery("")
  }

  const handleBackToCategories = () => {
    setViewMode("categories")
    setSelectedCategory("")
    setSearchQuery("")
  }

  const translations = {
    uz: {
      title: "Restoran Menyusi",
      subtitle: "Eng mazali taomlar",
      cart: "Savatcha",
      search: "🔍 Taom qidirish...",
      categories: "Kategoriyalar",
      selectCategory: "Kategoriyani tanlang",
      all: "Barchasi",
      notFound: "Hech narsa topilmadi",
      tryAgain: "Boshqa kalit so'z bilan qidiring",
      items: "ta mahsulot",
      total: "Jami:",
      viewCart: "Ko'rish",
      add: "Qo'shish",
      addToCart: "Savatchaga qo'shish",
      specialNotes: "Qo'shimcha izoh (ixtiyoriy)",
      notesPlaceholder: "Masalan: achchiq bo'lmasin, tuzni kam qo'ying...",
      backToCategories: "Kategoriyalarga qaytish",
      languageUz: "O'zbekcha",
      languageRu: "Русский",
      languageEn: "English",
      learnMore: "Batafsil",
    },
    ru: {
      title: "Меню Ресторана",
      subtitle: "Самые вкусные блюда",
      cart: "Корзина",
      search: "🔍 Поиск блюд...",
      categories: "Категории",
      selectCategory: "Выберите категорию",
      all: "Все",
      notFound: "Ничего не найдено",
      tryAgain: "Попробуйте другие ключевые слова",
      items: "товаров",
      total: "Итого:",
      viewCart: "Посмотреть",
      add: "Добавить",
      addToCart: "Добавить в корзину",
      specialNotes: "Особые пожелания (необязательно)",
      notesPlaceholder: "Например: не острое, меньше соли...",
      backToCategories: "Вернуться к категориям",
      languageUz: "O'zbekcha",
      languageRu: "Русский",
      languageEn: "English",
      learnMore: "Подробнее",
    },
    en: {
      title: "Restaurant Menu",
      subtitle: "Delicious dishes await",
      cart: "Cart",
      search: "🔍 Search dishes...",
      categories: "Categories",
      selectCategory: "Select a category",
      all: "All",
      notFound: "No items found",
      tryAgain: "Try searching with different keywords",
      items: "items",
      total: "Total:",
      viewCart: "View Cart",
      add: "Add",
      addToCart: "Add to Cart",
      specialNotes: "Special notes (optional)",
      notesPlaceholder: "e.g., no spicy, less salt...",
      backToCategories: "Back to Categories",
      languageUz: "O'zbekcha",
      languageRu: "Русский",
      languageEn: "English",
      learnMore: "Learn More",
    },
  }

  const t = translations[language]

  const getCategoryName = (category: (typeof categories)[0]) => {
    if (language === "uz") return category.nameUz
    if (language === "ru") return category.nameRu
    return category.name
  }

  const getLanguageCode = () => {
    return language === "uz" ? "UZ" : language === "ru" ? "RU" : "EN"
  }

  const getPromotionText = (promotion: (typeof promotions)[0], field: "title" | "description") => {
    if (field === "title") {
      return language === "uz" ? promotion.titleUz : language === "ru" ? promotion.titleRu : promotion.titleEn
    }
    return language === "uz"
      ? promotion.descriptionUz
      : language === "ru"
        ? promotion.descriptionRu
        : promotion.descriptionEn
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-green-700 to-green-600 text-white shadow-lg backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => (viewMode === "categories" ? router.push("/") : handleBackToCategories())}
                className="hover:bg-white/20 text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-9 h-9 bg-white/20 rounded-full shadow-md">
                  <img
                    src="/logo.jpg"
                    alt="Tokyo Logo"
                    className="w-5 h-5 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                      e.currentTarget.nextElementSibling?.classList.remove("hidden")
                    }}
                  />
                  <UtensilsCrossed className="w-4 h-4 text-white hidden" />
                </div>
                <div>
                  <h1 className="text-lg font-bold">{t.title}</h1>
                  <p className="text-xs opacity-90">{viewMode === "categories" ? t.selectCategory : t.subtitle}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu open={languageDropdownOpen} onOpenChange={setLanguageDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-white/20 font-semibold flex items-center gap-1 text-white"
                  >
                    {getLanguageCode()}
                    <ChevronDown className="h-3 w-3" />
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
              <Button
                variant="default"
                size="sm"
                className="relative bg-white/20 hover:bg-white/30 shadow-md text-white"
                onClick={() => router.push("/cart")}
              >
                <ShoppingCart className="h-4 w-4" />
                {getCartItemCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-green-500 text-white animate-pulse">
                    {getCartItemCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {viewMode === "categories" && carouselEnabled && (
        <div className="w-full bg-gradient-to-b from-green-50/50 to-transparent py-6">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div
              ref={carouselRef}
              className="relative overflow-hidden rounded-3xl shadow-2xl group"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Carousel slides */}
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {promotions.map((promotion) => (
                  <div key={promotion.id} className="min-w-full relative">
                    <div className="aspect-[16/7] md:aspect-[21/9] relative overflow-hidden">
                      <img
                        src={promotion.image || "/placeholder.svg"}
                        alt={getPromotionText(promotion, "title")}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-16">
                        <div className="max-w-2xl">
                          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 leading-tight">
                            {getPromotionText(promotion, "title")}
                          </h2>
                          <p className="text-sm md:text-lg lg:text-xl text-white/90 mb-4 md:mb-6 leading-relaxed">
                            {getPromotionText(promotion, "description")}
                          </p>
                          <Button
                            size="lg"
                            onClick={() => handleCategoryClick("7")}
                            className="bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-semibold"
                          >
                            {t.learnMore}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 md:p-3 transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 md:p-3 transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Next slide"
              >
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
              </button>

              {/* Indicator dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {promotions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentSlide ? "bg-white w-8 h-2" : "bg-white/50 hover:bg-white/70 w-2 h-2"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 pb-32">
        {viewMode === "categories" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="menu-card hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden group"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={getCategoryName(category)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <div className="text-4xl md:text-5xl mb-2 transform group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="text-base md:text-lg font-bold text-center px-2">{getCategoryName(category)}</h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {viewMode === "products" && (
          <>
            <div className="mb-8">
              <div className="relative search-glow">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder={t.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 text-lg rounded-2xl border-2 border-border/50 focus:border-primary bg-card shadow-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="menu-card hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-lg bg-card/80 backdrop-blur-sm rounded-3xl overflow-hidden"
                >
                  <div onClick={() => handleItemClick(item)}>
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={language === "uz" ? item.nameUz : item.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-4 right-4">
                        <Badge className="price-badge text-sm px-3 py-1 rounded-full shadow-lg">
                          {formatPrice(item.price)}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <div className="flex items-center gap-1 text-white/90 text-sm">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">4.8</span>
                        </div>
                      </div>
                    </div>
                    <CardHeader className="pb-4 pt-6">
                      <CardTitle className="text-xl font-bold text-foreground leading-tight">
                        {language === "uz" ? item.nameUz : language === "ru" ? item.nameRu : item.name}
                      </CardTitle>
                      <CardDescription className="text-muted-foreground leading-relaxed">
                        {language === "uz"
                          ? item.descriptionUz
                          : language === "ru"
                            ? item.descriptionRu
                            : item.description}
                      </CardDescription>
                    </CardHeader>
                  </div>
                  <CardContent className="pt-0 pb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="text-2xl font-bold text-primary">{formatPrice(item.price)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {cart.find((cartItem) => cartItem.id === item.id) ? (
                          <div className="flex items-center gap-3 bg-muted rounded-2xl p-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                const cartItem = cart.find((ci) => ci.id === item.id)
                                if (cartItem) {
                                  updateCartQuantity(item.id, cartItem.quantity - 1)
                                }
                              }}
                              className="h-8 w-8 rounded-xl hover:bg-destructive hover:text-destructive-foreground"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-bold text-lg min-w-[24px] text-center text-primary">
                              {cart.find((cartItem) => cartItem.id === item.id)?.quantity || 0}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                const cartItem = cart.find((ci) => ci.id === item.id)
                                if (cartItem) {
                                  updateCartQuantity(item.id, cartItem.quantity + 1)
                                }
                              }}
                              className="h-8 w-8 rounded-xl hover:bg-primary hover:text-primary-foreground"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="lg"
                            onClick={(e) => {
                              e.stopPropagation()
                              addToCart(item)
                            }}
                            className="rounded-2xl px-6 py-2 bg-primary hover:bg-primary/90 shadow-lg font-semibold"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            {t.add}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <div className="text-xl text-muted-foreground font-medium">{t.notFound}</div>
                <div className="text-muted-foreground mt-2">{t.tryAgain}</div>
              </div>
            )}
          </>
        )}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
          <div className="bg-white text-green-700 px-6 py-2 rounded-full shadow-xl text-base font-bold border-2 border-green-600">
            {formatPrice(getCartTotal())}
          </div>
          <Button
            onClick={() => router.push("/cart")}
            className="relative bg-gradient-to-r from-green-700 to-green-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-full h-16 w-16 p-0 hover:scale-110 active:scale-95"
          >
            <ShoppingCart className="h-6 w-6" />
            <Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 text-xs bg-green-500 text-white animate-pulse flex items-center justify-center border-2 border-white">
              {getCartItemCount()}
            </Badge>
          </Button>
        </div>
      )}
    </div>
  )
}
