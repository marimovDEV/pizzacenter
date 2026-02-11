"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { ArrowLeft, Search, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMenu } from "@/lib/menu-context"
import { useCart } from "@/lib/cart-context"
import { MenuItemCard } from "@/components/menu-item-card"
import { useLanguage } from "@/lib/language-context"
import type { Language } from "@/lib/types"

import { PromotionsCarousel } from "@/components/promotions-carousel"
import { CartSheet } from "@/components/cart-sheet"
import { MenuGridSkeleton } from "@/components/menu-skeleton"
import { List } from "react-window"

// --- Constants & Helper Components ---

function useWindowSize() {
  const [size, setSize] = useState([0, 0])
  useEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight])
    }
    window.addEventListener("resize", updateSize)
    updateSize()
    return () => window.removeEventListener("resize", updateSize)
  }, [])
  return size
}

interface RowComponentProps {
  index: number
  style: any
  items: any[]
  language: "uz" | "ru" | "en"
  columnCount: number
  gridGap: number
}

const Row = ({ index, style, items, language, columnCount, gridGap }: RowComponentProps) => {
  const rowItems = []
  for (let i = 0; i < columnCount; i++) {
    const itemIndex = index * columnCount + i
    if (itemIndex < items.length) {
      rowItems.push(items[itemIndex])
    }
  }

  return (
    <div
      style={{
        ...style,
        display: "grid",
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap: `${gridGap}px`,
        padding: `${gridGap / 2}px ${gridGap}px`,
      }}
    >
      {rowItems.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          language={language}
          priority={index < 2}
        />
      ))}
    </div>
  )
}

function MenuVirtualGrid({ items, language }: MenuVirtualGridProps) {
  const [width] = useWindowSize()
  const listRef = useRef<any>(null)

  // Safety check: if List is not yet defined, don't render it
  if (!List) return null

  // Responsive column count
  const columnCount = width < 768 ? 2 : width < 1024 ? 3 : 4
  const rowCount = Math.ceil(items.length / columnCount)

  // Item dimensions
  const rowHeightValue = width < 768 ? 320 : 450
  const gridGap = width < 768 ? 12 : 24

  // Calculate total height to avoid scrollbar issues
  const totalHeight = typeof window !== "undefined" ? window.innerHeight - 250 : 800

  return (
    <List
      listRef={listRef}
      style={{ height: totalHeight, width: "100%" }}
      defaultHeight={800}
      rowCount={rowCount}
      rowHeight={rowHeightValue}
      rowComponent={Row}
      rowProps={{ items, language, columnCount, gridGap }}
      className="scrollbar-hide"
    />
  )
}

export default function MenuPage() {
  const { language, setLanguage } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { categories, menuItems, loading } = useMenu()
  const { getTotalItems } = useCart()

  const filteredItems = useMemo(() => {
    // Agar loading yoki menuItems yo'q bo'lsa, bo'sh array qaytarish
    if (loading || !menuItems || !Array.isArray(menuItems)) {
      return []
    }

    let items = menuItems

    // Kategoriya bo'yicha filtrlash
    if (selectedCategory) {
      // Convert both to numbers for comparison to handle type mismatches
      const selectedCategoryId = parseInt(selectedCategory)
      items = items.filter((item) => {
        const itemCategoryId = parseInt(item.category.toString())
        return itemCategoryId === selectedCategoryId
      })

      // Agar kategoriya tanlangan bo'lsa, faqat o'sha kategoriya ichidagi tartib bo'yicha saralash
      items = items.sort((a, b) => {
        const orderA = a.category_order ?? 0
        const orderB = b.category_order ?? 0

        // Agar order 0 yoki undefined bo'lsa, oxiriga qo'yish
        if (orderA === 0 && orderB === 0) return 0
        if (orderA === 0) return 1  // a oxiriga
        if (orderB === 0) return -1  // b oxiriga

        return orderA - orderB
      })
    } else {
      // "Hammasi" tanlangan bo'lsa - kategoriyalar tartibi bo'yicha guruhlash
      if (!categories || !Array.isArray(categories) || categories.length === 0) {
        // Agar kategoriyalar yo'q bo'lsa, oddiy tartiblash
        return items.sort((a, b) => {
          const orderA = a.category_order ?? 0
          const orderB = b.category_order ?? 0
          if (orderA === 0 && orderB === 0) return 0
          if (orderA === 0) return 1
          if (orderB === 0) return -1
          return orderA - orderB
        })
      }

      // Kategoriyalarni order bo'yicha tartiblash
      const sortedCategories = [...categories]
        .filter(cat => cat && cat.id) // Faqat to'g'ri kategoriyalarni olish
        .sort((a, b) => {
          const orderA = a.order ?? 0
          const orderB = b.order ?? 0
          return orderA - orderB
        })

      // Har bir kategoriya uchun mahsulotlarni to'plash va tartiblash
      const groupedItems: typeof items = []

      for (const category of sortedCategories) {
        // Kategoriya ID'ni turli formatlardan olish
        const categoryId = typeof category.id === 'number'
          ? category.id
          : parseInt(String(category.id))

        // Bu kategoriyaga tegishli mahsulotlarni topish
        const categoryItems = items.filter((item) => {
          if (!item || !item.category) return false

          const itemCategoryId = typeof item.category === 'number'
            ? item.category
            : parseInt(String(item.category))

          return itemCategoryId === categoryId
        })

        // Agar bu kategoriyada mahsulotlar bo'lsa, tartiblash va qo'shish
        if (categoryItems.length > 0) {
          // Kategoriya ichidagi mahsulotlarni category_order bo'yicha tartiblash
          const sortedCategoryItems = categoryItems.sort((a, b) => {
            const orderA = a.category_order ?? 0
            const orderB = b.category_order ?? 0

            // Agar order 0 yoki undefined bo'lsa, oxiriga qo'yish
            if (orderA === 0 && orderB === 0) return 0
            if (orderA === 0) return 1  // a oxiriga
            if (orderB === 0) return -1  // b oxiriga

            return orderA - orderB
          })

          groupedItems.push(...sortedCategoryItems)
        }
      }

      // Agar ba'zi mahsulotlar kategoriyaga bog'lanmagan bo'lsa, ularni oxiriga qo'shish
      const usedItemIds = new Set(groupedItems.map(item => item.id))
      const ungroupedItems = items.filter(item => !usedItemIds.has(item.id))
      if (ungroupedItems.length > 0) {
        groupedItems.push(...ungroupedItems)
      }

      items = groupedItems
    }

    // Qidiruv bo'yicha filtrlash - name, description, ingredients bo'yicha
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim()
      items = items.filter((item) => {
        // Name bo'yicha qidirish
        const nameMatch =
          item.name?.toLowerCase().includes(query) ||
          item.name_uz?.toLowerCase().includes(query) ||
          item.name_ru?.toLowerCase().includes(query)

        // Description bo'yicha qidirish
        const descriptionMatch =
          item.description?.toLowerCase().includes(query) ||
          item.description_uz?.toLowerCase().includes(query) ||
          item.description_ru?.toLowerCase().includes(query)

        // Ingredients bo'yicha qidirish
        const ingredients = Array.isArray(item.ingredients) ? item.ingredients : []
        const ingredientsUz = Array.isArray(item.ingredients_uz) ? item.ingredients_uz : []
        const ingredientsRu = Array.isArray(item.ingredients_ru) ? item.ingredients_ru : []

        const ingredientsMatch =
          ingredients.some(ing => ing?.toLowerCase().includes(query)) ||
          ingredientsUz.some(ing => ing?.toLowerCase().includes(query)) ||
          ingredientsRu.some(ing => ing?.toLowerCase().includes(query))

        return nameMatch || descriptionMatch || ingredientsMatch
      })
    }

    return items
  }, [menuItems, selectedCategory, searchQuery, loading, categories])

  const totalCartItems = getTotalItems()

  // Loading holati
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-24">
        <div className="fixed inset-0 bg-[url('/hero_background.jpg')] bg-cover bg-center bg-fixed opacity-40 pointer-events-none" />
        <div className="relative z-10 container mx-auto px-3 md:px-4 py-4 md:py-8">
          {/* Header Skeleton or simple spacing */}
          <div className="h-20 mb-8" />
          <MenuGridSkeleton />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pb-24">
      <div className="fixed inset-0 bg-[url('/hero_background.jpg')] bg-cover bg-center bg-fixed opacity-10 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* Header */}
        <header className="flex items-center justify-between gap-2 md:gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href="/"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center hover:bg-white/30 transition-all border border-white/30"
            >
              <ArrowLeft className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </Link>
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-white">Menu</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex gap-1 md:gap-1 bg-white/10 backdrop-blur-xl rounded-full p-1 border border-white/20">
              {(["uz", "ru", "en"] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${language === lang ? "bg-white text-slate-900" : "text-white/70 hover:text-white"
                    }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <CartSheet language={language}>
              <Button variant="ghost" size="icon" className="text-white relative">
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                    {totalCartItems}
                  </span>
                )}
              </Button>
            </CartSheet>
          </div>
        </header>

        <PromotionsCarousel language={language} />

        {/* Search */}
        <div className="mb-6 md:mb-8 px-2 md:px-0">
          <div className="relative">
            <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-white/60" />
            <Input
              placeholder={
                language === "uz" ? "Mahsulot nomini yozing (masalan: Lavash)..." : language === "ru" ? "Введите название блюда (например: Лаваш)..." : "Type dish name (e.g. Lavash)..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 md:pl-12 bg-white/10 backdrop-blur-xl border-white/30 text-white placeholder:text-white/60 h-12 md:h-14 rounded-xl md:rounded-2xl text-sm md:text-base"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="sticky top-0 z-40 bg-transparent backdrop-blur-sm py-4 -mx-2 px-2 md:-mx-4 md:px-4 mb-6 md:mb-8 transition-all border-b border-white/5">
          <nav className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-transparent">
            <Button
              onClick={() => setSelectedCategory(null)}
              variant={selectedCategory === null ? "default" : "outline"}
              className={`rounded-full whitespace-nowrap text-xs md:text-sm px-3 md:px-4 py-2 md:py-2.5 ${selectedCategory === null
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                : "bg-white/10 backdrop-blur-xl border-white/30 text-white hover:bg-white/20"
                }`}
            >
              {language === "uz" ? "Hammasi" : language === "ru" ? "Все" : "All"}
            </Button>
            {categories && Array.isArray(categories) && categories
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={`rounded-full whitespace-nowrap text-xs md:text-sm px-3 md:px-4 py-2 md:py-2.5 ${selectedCategory === category.id
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                    : "bg-white/10 backdrop-blur-xl border-white/30 text-white hover:bg-white/20"
                    }`}
                >
                  {language === "uz" ? category.name_uz : language === "ru" ? category.name_ru : category.name}
                </Button>
              ))}
          </nav>
        </div>

        {/* Menu Items Grid - Optimized with Virtual Scrolling */}
        <section id="menu-grid" className="max-w-7xl mx-auto px-2 md:px-0">
          <MenuVirtualGrid
            items={filteredItems}
            language={language}
          />
        </section>

        {
          filteredItems.length === 0 && !loading && (
            <div className="text-center py-16">
              <p className="text-white/60 text-lg">
                {language === "uz" ? "Hech narsa topilmadi" : language === "ru" ? "Ничего не найдено" : "No items found"}
              </p>
            </div>
          )
        }
      </div >

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        {totalCartItems > 0 && (
          <CartSheet language={language}>
            <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full h-16 px-8 shadow-2xl shadow-emerald-500/50 flex items-center gap-3 text-lg font-semibold transform hover:scale-105 transition-all">
              <ShoppingCart className="w-6 h-6" />
              <span>{language === "uz" ? "Savat" : language === "ru" ? "Корзина" : "Cart"}</span>
              <Badge className="bg-white text-emerald-600 font-bold text-base h-8 w-8 flex items-center justify-center p-0 rounded-full">
                {totalCartItems}
              </Badge>
            </Button>
          </CartSheet>
        )}
      </div>
    </main >
  )
}
