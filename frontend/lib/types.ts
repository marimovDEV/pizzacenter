export interface Category {
  id: number
  name: string
  name_uz: string
  name_ru: string
  icon: string
  image?: string
  image_thumbnail?: string
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: number
  name: string
  name_uz: string
  name_ru: string
  description: string
  description_uz: string
  description_ru: string
  price: number
  weight?: number // in grams
  image?: string
  image_thumbnail?: string
  image_mobile?: string
  category: number // category ID
  category_name?: string
  category_name_uz?: string
  category_name_ru?: string
  global_order: number
  category_order: number
  available: boolean
  is_active: boolean
  prep_time?: string
  rating?: number
  ingredients: string[]
  ingredients_uz: string[]
  ingredients_ru: string[]
  created_at: string
  updated_at: string
}

export interface Promotion {
  id: number
  title: string
  title_uz: string
  title_ru: string
  description: string
  description_uz: string
  description_ru: string
  discount_type: 'percent' | 'amount' | 'bonus' | 'standalone'
  discount_percentage?: number
  discount_amount?: number
  bonus_info?: string
  bonus_info_uz?: string
  bonus_info_ru?: string
  image?: string
  display_image?: string
  start_date?: string
  end_date?: string
  is_active: boolean
  is_expired?: boolean
  category?: number
  category_name?: string
  category_name_uz?: string
  category_name_ru?: string
  linked_dish?: number
  linked_dish_name?: string
  linked_dish_name_uz?: string
  linked_dish_name_ru?: string
  price: number
  discounted_price?: number
  discount_display?: string
  ingredients: string[]
  ingredients_uz: string[]
  ingredients_ru: string[]
  created_at: string
  updated_at: string
}

export interface Review {
  id: number
  name: string
  surname: string
  comment: string
  rating: number
  date: string
  approved: boolean
  deleted: boolean
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

export interface OrderItem {
  id: number
  menu_item: number
  menu_item_name: string
  menu_item_name_uz: string
  menu_item_name_ru: string
  quantity: number
  notes?: string
  price: number
  total_price: number
}

export interface Order {
  id: number
  table_number: number
  customer_name?: string
  total: number
  status: "pending" | "preparing" | "ready" | "served" | "cancelled"
  notes?: string
  created_at: string
  updated_at: string
  items: OrderItem[]
}

export interface CartItem {
  id: number
  menu_item: number
  menu_item_name: string
  menu_item_name_uz: string
  menu_item_name_ru: string
  menu_item_image?: string
  menu_item_price: number
  quantity: number
  notes?: string
  price: number
  total_price: number
  created_at: string
  updated_at: string
}

export interface Cart {
  id: number
  session_key: string
  table_number?: number | null
  customer_name?: string | null
  notes?: string | null
  total_items: number
  total_price: number
  items: CartItem[]
  created_at: string
  updated_at: string
}

export interface SiteSettings {
  id: number
  site_name: string
  site_name_uz: string
  site_name_ru: string
  logo?: string
  favicon?: string
  phone: string
  email: string
  address: string
  address_uz: string
  address_ru: string
  working_hours: string
  working_hours_uz: string
  working_hours_ru: string
  facebook_url?: string
  instagram_url?: string
  telegram_url?: string
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  is_maintenance_mode: boolean
  maintenance_message?: string
  created_at: string
  updated_at: string
}

export interface RestaurantInfo {
  id: number
  restaurant_name: string
  restaurant_name_uz: string
  restaurant_name_ru: string
  about_title: string
  about_title_uz: string
  about_title_ru: string
  about_description_1: string
  about_description_1_uz: string
  about_description_1_ru: string
  about_description_2: string
  about_description_2_uz: string
  about_description_2_ru: string
  hero_title: string
  hero_subtitle: string
  hero_subtitle_uz: string
  hero_subtitle_ru: string
  view_menu_button: string
  view_menu_button_uz: string
  view_menu_button_ru: string
  go_to_menu_button: string
  go_to_menu_button_uz: string
  go_to_menu_button_ru: string
  reviews_title: string
  reviews_title_uz: string
  reviews_title_ru: string
  leave_review_title: string
  leave_review_title_uz: string
  leave_review_title_ru: string
  first_name_label: string
  first_name_label_uz: string
  first_name_label_ru: string
  last_name_label: string
  last_name_label_uz: string
  last_name_label_ru: string
  comment_label: string
  comment_label_uz: string
  comment_label_ru: string
  rate_us_label: string
  rate_us_label_uz: string
  rate_us_label_ru: string
  submit_button: string
  submit_button_uz: string
  submit_button_ru: string
  no_reviews_text: string
  no_reviews_text_uz: string
  no_reviews_text_ru: string
  hero_image?: string
  about_image?: string
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

export interface TextContent {
  id: number
  content_type: string
  key: string
  title?: string
  subtitle?: string
  description?: string
  content?: string
  title_uz?: string
  subtitle_uz?: string
  description_uz?: string
  content_uz?: string
  title_ru?: string
  subtitle_ru?: string
  description_ru?: string
  content_ru?: string
  button_text?: string
  button_text_uz?: string
  button_text_ru?: string
  is_active: boolean
  order: number
  created_at: string
  updated_at: string
}

export type Language = "uz" | "ru" | "en"
