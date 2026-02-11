export interface Category {
  id: string
  name: string
  name_uz: string
  name_ru: string
  image: string
  image_thumbnail?: string
  order: number
}

export interface MenuItem {
  id: string
  name: string
  name_uz: string
  name_ru: string
  description: string
  description_uz: string
  description_ru: string
  image: string
  image_thumbnail?: string
  image_mobile?: string
  price: number
  weight?: number // in grams
  ingredients: string[]
  ingredients_uz: string[]
  ingredients_ru: string[]
  rating: number
  prep_time: string // in minutes, can be range like "15-20"
  global_order: number // Barcha taomlar orasidagi umumiy tartib
  category_order: number // Faqat o'z kategoriyasi ichidagi tartib
  category: number // category ID from backend
  available: boolean
  is_active: boolean
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
}

export interface Promotion {
  id: string
  // Asosiy ma'lumotlar
  title: string
  title_uz: string
  title_ru: string
  description: string
  description_uz: string
  description_ru: string

  // Aksiya turi
  discount_type: 'percent' | 'amount' | 'bonus' | 'standalone'

  // Chegirma ma'lumotlari
  discount_percentage?: number
  discount_amount?: number

  // Bonus ma'lumotlari
  bonus_info?: string
  bonus_info_uz?: string
  bonus_info_ru?: string

  // Rasm
  image?: string
  display_image?: string

  // Muddati
  start_date?: string
  end_date?: string
  is_active: boolean
  is_expired?: boolean

  // Bog'lanish
  linked_product?: number
  linked_product_name?: string
  linked_product_name_uz?: string
  linked_product_name_ru?: string

  // Aksiya kategoriyasi
  promotion_category?: number
  category_name?: string
  category_name_uz?: string
  category_name_ru?: string

  // Narx va tarkib
  price: number
  discounted_price?: number
  discount_display?: string
  ingredients: string[]
  ingredients_uz: string[]
  ingredients_ru: string[]

  // Legacy fields (compatibility)
  category?: number
  linked_dish?: number
}

export interface Feedback {
  id: number
  feedback_type: "suggestion" | "complaint" | "compliment" | "question"
  name: string
  email?: string
  phone?: string
  message: string
  rating?: number
  is_read: boolean
  created_at: string
  updated_at: string
}

export interface FeaturedDish {
  id: number
  menu_item: MenuItem
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Language = "uz" | "ru" | "en"
