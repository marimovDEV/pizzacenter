"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { MenuItem, Promotion } from "./types"

// Local state uchun alohida type (backend'ning CartItem'idan farq qiladi)
interface LocalCartItem {
  menuItem: MenuItem
  quantity: number
}

interface CartContextType {
  cart: LocalCartItem[]
  addToCart: (item: MenuItem) => void
  addPromotionToCart: (promotion: Promotion) => void
  removeFromCart: (itemId: number | string) => void
  updateQuantity: (itemId: number | string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<LocalCartItem[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e)
        setCart([])
      }
    }
  }, [])

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.menuItem.id === item.id)
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.menuItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }
      return [...prev, { menuItem: item, quantity: 1 }]
    })
  }

  const addPromotionToCart = (promotion: Promotion) => {
    // Promotion'ni MenuItem format'iga o'tkazish
    // Promotion ID'si number bo'lgani uchun, string ID bilan muammo bo'lishi mumkin
    // Lekin frontend logic uchun bizga faqat ID kerak.
    const promotionAsMenuItem: MenuItem = {
      id: promotion.id as any, // Bypass for promotion ID
      name: promotion.title,
      name_uz: promotion.title_uz,
      name_ru: promotion.title_ru,
      description: promotion.description,
      description_uz: promotion.description_uz,
      description_ru: promotion.description_ru,
      image: promotion.image,
      price: promotion.price || 0,
      weight: 0,
      ingredients: promotion.ingredients || [],
      ingredients_uz: promotion.ingredients_uz || [],
      ingredients_ru: promotion.ingredients_ru || [],
      rating: 5,
      prep_time: "0-5",
      category: promotion.category || 0,
      available: true,
      is_active: promotion.is_active,
      global_order: 0,
      category_order: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    setCart((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.menuItem.id === promotion.id)
      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.menuItem.id === promotion.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      }
      return [...prev, { menuItem: promotionAsMenuItem, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId: number | string) => {
    setCart((prev) => prev.filter((item) => item.menuItem.id !== itemId))
  }

  const updateQuantity = (itemId: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart((prev) => prev.map((item) => (item.menuItem.id === itemId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.menuItem.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addPromotionToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
