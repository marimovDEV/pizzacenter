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
import type { Language, MenuItem } from "@/lib/types"

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



const Row = ({ index, style, items, language, columnCount, gridGap }: any) => {
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

interface MenuVirtualGridProps {
  items: MenuItem[]
  language: Language
}

function MenuVirtualGrid({ items, language }: MenuVirtualGridProps) {
  const [width] = useWindowSize()
  const listRef = useRef<any>(null)

  // Safety check: if List is not yet defined, don't render it
  if (!List) return null

  // Responsive column count
  const columnCount = width < 768 ? 2 : width < 1024 ? 3 : 4
  const rowCount = Math.ceil(items.length / columnCount)

  // Item dimensions - Optimized for Tokyo density
  const rowHeightValue = width < 768 ? 280 : 380
  const gridGap = width < 768 ? 8 : 16

  // Calculate total height to avoid scrollbar issues
  const totalHeight = typeof window !== "undefined" ? window.innerHeight - 200 : 800

  return (
    <List
      rowCount={rowCount}
      rowHeight={rowHeightValue}
      rowProps={{ items, language, columnCount, gridGap }}
      rowComponent={Row}
      style={{ height: totalHeight, width: "100%" }}
      className="scrollbar-hide"
    />
  )
}

export default function MenuPage() {
  const { language, setLanguage } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
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
      // Both are numbers now
      items = items.filter((item) => {
        const itemCategoryId = item.category
        return itemCategoryId === selectedCategory
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

  // Scroll to top when category changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [selectedCategory])

  const totalCartItems = getTotalItems()

  // Loading holati
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-900 pb-20">
        <div className="fixed inset-0 bg-[url('/hero_background.jpg')] bg-cover bg-center bg-fixed opacity-10 pointer-events-none" />
        <div className="relative z-10 container mx-auto px-3 md:px-4 py-4 md:py-6">
          <div className="h-16 mb-6" />
          <MenuGridSkeleton />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-900 pb-[70px]">
      <div className="fixed inset-0 bg-[url('/hero_background.jpg')] bg-cover bg-center bg-fixed opacity-10 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-3 md:px-4 py-4 md:py-6">
        {/* Header - Simplified */}
        <header className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-white">Menu</h1>
          </div>

          <div className="flex items-center gap-3">
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

            <CartSheet language={language}>
              <Button variant="ghost" size="icon" className="text-white relative w-10 h-10">
                <ShoppingCart className="w-5 h-5" />
                {totalCartItems > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                    {totalCartItems}
                  </span>
                )}
              </Button>
            </CartSheet>
          </div>
        </header>

        <PromotionsCarousel language={language} />

        {/* Search - Tightened */}
        <div className="mb-6 px-1 md:px-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <Input
              placeholder={
                language === "uz" ? "Qidirish..." : language === "ru" ? "Поиск..." : "Search..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white/5 backdrop-blur-md border-white/10 text-white placeholder:text-white/40 h-10 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Category Filter - Sticky & Dense */}
        <div className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md py-3 -mx-3 px-3 md:-mx-4 md:px-4 mb-6 border-b border-white/5">
          <nav className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Button
              onClick={() => setSelectedCategory(null)}
              variant={selectedCategory === null ? "default" : "outline"}
              className={`rounded-full h-8 whitespace-nowrap text-xs px-4 ${selectedCategory === null
                ? "bg-emerald-500 text-white"
                : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
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
                  className={`rounded-full h-8 whitespace-nowrap text-xs px-4 ${selectedCategory === category.id
                    ? "bg-emerald-500 text-white"
                    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                    }`}
                >
                  {language === "uz" ? category.name_uz : language === "ru" ? category.name_ru : category.name}
                </Button>
              ))}
          </nav>
        </div>

        {/* Menu Items Grid - Denser */}
        <section id="menu-grid" className="max-w-7xl mx-auto">
          <MenuVirtualGrid
            items={filteredItems}
            language={language}
          />
        </section>

        {
          filteredItems.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-white/40 text-sm">
                {language === "uz" ? "Hech narsa topilmadi" : language === "ru" ? "Ничего не найдено" : "No items found"}
              </p>
            </div>
          )
        }
      </div >

      {/* Fixed bottom cart - Exact height 70px matching padding-bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-[70px] flex items-center justify-center px-4 z-50 pointer-events-none">
        {totalCartItems > 0 && (
          <div className="pointer-events-auto">
            <CartSheet language={language}>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full h-12 px-6 shadow-xl flex items-center gap-2 text-base font-bold transition-transform active:scale-95">
                <ShoppingCart className="w-5 h-5" />
                <span>{language === "uz" ? "Savat" : language === "ru" ? "Корзина" : "Cart"}</span>
                <div className="bg-white text-emerald-600 h-6 min-w-[24px] px-1.5 flex items-center justify-center rounded-full text-xs font-black">
                  {totalCartItems}
                </div>
              </Button>
            </CartSheet>
          </div>
        )}
      </div>
    </main >
  )
}
