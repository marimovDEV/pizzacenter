"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Category, MenuItem, Promotion } from "./types"
import { useCategories, useAdminMenuItems, useMenuItems, usePromotions } from "@/hooks/use-api"

interface MenuContextType {
  categories: Category[]
  menuItems: MenuItem[]
  promotions: Promotion[]
  loading: boolean
  error: Error | null
  addCategory: (category: Category) => void
  updateCategory: (id: number, category: Partial<Category>) => void
  deleteCategory: (id: number) => void
  addMenuItem: (item: MenuItem) => void
  updateMenuItem: (id: number, item: Partial<MenuItem>) => void
  deleteMenuItem: (id: number) => void
  addPromotion: (promotion: Promotion) => void
  updatePromotion: (id: number, promotion: Partial<Promotion>) => void
  deletePromotion: (id: number) => void
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

// Sample data (updated to match snake_case types)
const sampleCategories: Category[] = [
  {
    id: 1,
    name: "Sushi",
    name_uz: "Sushi",
    name_ru: "Суши",
    icon: "sushi",
    image: "/assorted-sushi-platter.png",
    order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const sampleMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "California Roll",
    name_uz: "Kaliforniya Roll",
    name_ru: "Калифорния Ролл",
    description: "Classic sushi roll with crab, avocado, and cucumber",
    description_uz: "Klassik sushi roll qisqichbaqa, avokado va bodring bilan",
    description_ru: "Классический суши-ролл с крабом, авокадо и огурцом",
    image: "/california-roll.png",
    price: 45000,
    weight: 250,
    ingredients: ["Crab", "Avocado", "Cucumber", "Rice", "Nori"],
    ingredients_uz: ["Qisqichbaqa", "Avokado", "Bodring", "Guruch", "Nori"],
    ingredients_ru: ["Краб", "Авокадо", "Огурец", "Рис", "Нори"],
    rating: 4.8,
    prep_time: "15",
    category: 1,
    available: true,
    is_active: true,
    global_order: 1,
    category_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const samplePromotions: Promotion[] = [
  {
    id: 1,
    title: "Happy Hour Special",
    title_uz: "Happy Hour Maxsus",
    title_ru: "Счастливые часы",
    description: "20% off all sushi rolls from 2-5 PM",
    description_uz: "Barcha sushi rollarga 14:00-17:00 oralig'ida 20% chegirma",
    description_ru: "Скидка 20% на все суши-роллы с 14:00 до 17:00",
    image: "/sushi-promotion.jpg",
    discount_type: 'percent',
    discount_percentage: 20,
    price: 0,
    is_active: true,
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    ingredients: [],
    ingredients_uz: [],
    ingredients_ru: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export function MenuProvider({ children }: { children: React.ReactNode }) {
  // API dan ma'lumot olish
  const { categories: apiCategories, loading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useCategories()
  const {
    menuItems: apiMenuItems,
    loading: rawMenuItemsLoading,
    error: rawMenuItemsError,
    refetch: refetchMenuItems,
  } = useMenuItems()
  const { promotions: apiPromotions, loading: promotionsLoading, error: promotionsError, refetch: refetchPromotions } = usePromotions()

  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])

  const loading = categoriesLoading || rawMenuItemsLoading || promotionsLoading
  const error = (categoriesError || rawMenuItemsError || promotionsError) as Error | null

  // API dan kelgan ma'lumotlarni saqlash
  useEffect(() => {
    if (apiCategories && Array.isArray(apiCategories)) {
      setCategories([...apiCategories].sort((a, b) => (a.order || 0) - (b.order || 0)))
    } else if (!categoriesLoading && apiCategories === null) {
      setCategories([])
    }
  }, [apiCategories, categoriesLoading])

  useEffect(() => {
    if (apiMenuItems && Array.isArray(apiMenuItems)) {
      // More lenient filtering: don't filter out if category is missing or id is 0
      const activeItems = apiMenuItems.filter(
        (item: MenuItem) => item && item.is_active !== false
      )
      setMenuItems(activeItems)
    } else if (!rawMenuItemsLoading && apiMenuItems === null) {
      setMenuItems([])
    }
  }, [apiMenuItems, rawMenuItemsLoading])

  // Force refresh on mount
  useEffect(() => {
    refetchMenuItems()
  }, [])

  useEffect(() => {
    if (apiPromotions && Array.isArray(apiPromotions)) {
      setPromotions(apiPromotions)
    } else if (!promotionsLoading && apiPromotions === null) {
      setPromotions([])
    }
  }, [apiPromotions, promotionsLoading])


  const addCategory = (category: Category) => {
    setCategories((prev) => {
      if (prev.some(cat => cat.id === category.id)) return prev;
      return [...prev, category].sort((a, b) => (a.order || 0) - (b.order || 0))
    })
    refetchCategories()
  }

  const updateCategory = (id: number, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((cat) => (cat.id === id ? { ...cat, ...updates } : cat)))
    refetchCategories()
  }

  const deleteCategory = (id: number) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id))
    refetchCategories()
  }

  const addMenuItem = (item: MenuItem) => {
    setMenuItems((prev) => {
      if (prev.some(mi => mi.id === item.id)) return prev;
      return [...prev, item]
    })
    setTimeout(() => {
      refetchMenuItems()
    }, 500)
  }

  const updateMenuItem = (id: number, updates: Partial<MenuItem>) => {
    setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)))
    setTimeout(() => {
      refetchMenuItems()
    }, 500)
  }

  const deleteMenuItem = (id: number) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id))
    setTimeout(() => {
      refetchMenuItems()
    }, 500)
  }

  const addPromotion = (promotion: Promotion) => {
    setPromotions((prev) => {
      if (prev.some(p => p.id === promotion.id)) return prev;
      return [...prev, promotion]
    })
    refetchPromotions()
  }

  const updatePromotion = (id: number, updates: Partial<Promotion>) => {
    setPromotions((prev) => prev.map((promo) => (promo.id === id ? { ...promo, ...updates } : promo)))
    refetchPromotions()
  }

  const deletePromotion = (id: number) => {
    setPromotions((prev) => prev.filter((promo) => promo.id !== id))
    refetchPromotions()
  }


  return (
    <MenuContext.Provider
      value={{
        categories,
        menuItems,
        promotions,
        loading,
        error,
        addCategory,
        updateCategory,
        deleteCategory,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        addPromotion,
        updatePromotion,
        deletePromotion,
      }}
    >
      {children}
    </MenuContext.Provider>
  )
}

export function useMenu() {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider")
  }
  return context
}
