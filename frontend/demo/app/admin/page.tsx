"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  LogOut,
  ChefHat,
  FolderOpen,
  Upload,
  Megaphone,
  MessageSquare,
  Check,
  X,
  Star,
  Info,
} from "lucide-react"
import {
  promotions,
  menuItems,
  categories,
  formatPrice,
  type MenuItem,
  type Category,
  type Promotion,
} from "@/lib/restaurant-data"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Review {
  id: string
  name: string
  surname: string
  comment: string
  rating: number
  date: string
  approved: boolean
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [language, setLanguage] = useState<"en" | "uz" | "ru">("uz")

  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)

  const [isAddingItem, setIsAddingItem] = useState(false)
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [isAddingPromotion, setIsAddingPromotion] = useState(false)

  const [newItem, setNewItem] = useState<Partial<MenuItem>>({
    name: "",
    nameUz: "",
    nameRu: "",
    description: "",
    descriptionUz: "",
    descriptionRu: "",
    price: 0,
    category: "1",
    available: true,
    image: "",
    prepTime: "",
    rating: 5,
    ingredients: [],
    ingredientsUz: [],
    ingredientsRu: [],
  })
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: "",
    nameUz: "",
    nameRu: "",
    icon: "🍽️",
    image: "",
  })
  const [newPromotion, setNewPromotion] = useState<Partial<Promotion>>({
    title: "",
    titleUz: "",
    titleRu: "",
    description: "",
    descriptionUz: "",
    descriptionRu: "",
    image: "",
    active: true,
    category: "7",
  })

  const [ingredientInputUz, setIngredientInputUz] = useState("")
  const [ingredientInputRu, setIngredientInputRu] = useState("")
  const [ingredientInputEn, setIngredientInputEn] = useState("")

  const [reviews, setReviews] = useState<Review[]>([])
  const [pendingReviews, setPendingReviews] = useState<Review[]>([])

  const [carouselEnabled, setCarouselEnabled] = useState(true)

  useEffect(() => {
    // Check authentication
    const authToken = localStorage.getItem("admin-auth")
    if (authToken === "true") {
      setIsAuthenticated(true)
      loadReviews()
      const savedCarouselSetting = localStorage.getItem("carousel-enabled")
      if (savedCarouselSetting !== null) {
        setCarouselEnabled(savedCarouselSetting === "true")
      }
    } else {
      router.push("/admin/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin-auth")
    router.push("/admin/login")
  }

  const handleSaveItem = () => {
    if (!newItem.nameUz || !newItem.nameRu || !newItem.name || !newItem.image) {
      alert(
        language === "uz"
          ? "Iltimos, barcha maydonlarni to'ldiring"
          : language === "ru"
            ? "Пожалуйста, заполните все поля"
            : "Please fill all fields",
      )
      return
    }

    console.log("[v0] Adding new item:", newItem)
    alert(
      language === "uz"
        ? "Taom muvaffaqiyatli qo'shildi!"
        : language === "ru"
          ? "Блюдо успешно добавлено!"
          : "Dish added successfully!",
    )
    setIsAddingItem(false)
    setNewItem({
      name: "",
      nameUz: "",
      nameRu: "",
      description: "",
      descriptionUz: "",
      descriptionRu: "",
      price: 0,
      category: "1",
      available: true,
      image: "",
      prepTime: "",
      rating: 5,
      ingredients: [],
      ingredientsUz: [],
      ingredientsRu: [],
    })
    setEditingItem(null) // Clear editing state
  }

  const handleSaveCategory = () => {
    if (!newCategory.nameUz || !newCategory.nameRu || !newCategory.name || !newCategory.image) {
      alert(
        language === "uz"
          ? "Iltimos, barcha maydonlarni to'ldiring"
          : language === "ru"
            ? "Пожалуйста, заполните все поля"
            : "Please fill all fields",
      )
      return
    }

    console.log("[v0] Adding new category:", newCategory)
    alert(
      language === "uz"
        ? "Kategoriya muvaffaqiyatli qo'shildi!"
        : language === "ru"
          ? "Категория успешно добавлена!"
          : "Category added successfully!",
    )
    setIsAddingCategory(false)
    setNewCategory({
      name: "",
      nameUz: "",
      nameRu: "",
      icon: "🍽️",
      image: "",
    })
    setEditingCategory(null) // Clear editing state
  }

  const handleSavePromotion = () => {
    if (!newPromotion.titleUz || !newPromotion.titleRu || !newPromotion.title || !newPromotion.image) {
      alert(
        language === "uz"
          ? "Iltimos, barcha maydonlarni to'ldiring"
          : language === "ru"
            ? "Пожалуйста, заполните все поля"
            : "Please fill all fields",
      )
      return
    }

    console.log("[v0] Adding new promotion:", newPromotion)
    alert(
      language === "uz"
        ? "Aksiya muvaffaqiyatli qo'shildi!"
        : language === "ru"
          ? "Акция успешно добавлена!"
          : "Promotion added successfully!",
    )
    setIsAddingPromotion(false)
    setNewPromotion({
      title: "",
      titleUz: "",
      titleRu: "",
      description: "",
      descriptionUz: "",
      descriptionRu: "",
      image: "",
      active: true,
      category: "7",
    })
    setEditingPromotion(null) // Clear editing state
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "item" | "category" | "promotion") => {
    const file = e.target.files?.[0]
    if (file) {
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        alert(
          language === "uz"
            ? "Rasm hajmi 5MB dan oshmasligi kerak"
            : language === "ru"
              ? "Размер изображения не должен превышать 5MB"
              : "Image size should not exceed 5MB",
        )
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const imageUrl = reader.result as string
        if (type === "item") {
          setNewItem({ ...newItem, image: imageUrl })
        } else if (type === "category") {
          setNewCategory({ ...newCategory, image: imageUrl })
        } else if (type === "promotion") {
          setNewPromotion({ ...newPromotion, image: imageUrl })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const loadReviews = () => {
    const savedReviews = localStorage.getItem("restaurant-reviews")
    if (savedReviews) {
      const allReviews: Review[] = JSON.parse(savedReviews)
      setReviews(allReviews)
      setPendingReviews(allReviews.filter((review) => !review.approved))
    }
  }

  const handleApproveReview = (reviewId: string) => {
    const updatedReviews = reviews.map((review) => (review.id === reviewId ? { ...review, approved: true } : review))
    localStorage.setItem("restaurant-reviews", JSON.stringify(updatedReviews))
    setReviews(updatedReviews)
    setPendingReviews(updatedReviews.filter((review) => !review.approved))
  }

  const handleRejectReview = (reviewId: string) => {
    const updatedReviews = reviews.filter((review) => review.id !== reviewId)
    localStorage.setItem("restaurant-reviews", JSON.stringify(updatedReviews))
    setReviews(updatedReviews)
    setPendingReviews(updatedReviews.filter((review) => !review.approved))
  }

  const handleCarouselToggle = (enabled: boolean) => {
    setCarouselEnabled(enabled)
    localStorage.setItem("carousel-enabled", enabled.toString())
  }

  const handleDeleteItem = (itemId: string) => {
    if (
      confirm(
        language === "uz" ? "Taomni o'chirishni xohlaysizmi?" : language === "ru" ? "Удалить блюдо?" : "Delete dish?",
      )
    ) {
      console.log("[v0] Deleting item:", itemId)
      alert(
        language === "uz"
          ? "Taom muvaffaqiyatli o'chirildi!"
          : language === "ru"
            ? "Блюдо успешно удалено!"
            : "Dish deleted successfully!",
      )
      // In a real app, you'd call an API here to delete the item.
      // For now, we'll just simulate the deletion.
      // const updatedMenuItems = menuItems.filter(item => item.id !== itemId);
      // setMenuItems(updatedMenuItems); // Assuming you have a state for menuItems
    }
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (
      confirm(
        language === "uz"
          ? "Kategoriyani o'chirishni xohlaysizmi?"
          : language === "ru"
            ? "Удалить категорию?"
            : "Delete category?",
      )
    ) {
      console.log("[v0] Deleting category:", categoryId)
      alert(
        language === "uz"
          ? "Kategoriya muvaffaqiyatli o'chirildi!"
          : language === "ru"
            ? "Категория успешно удалена!"
            : "Category deleted successfully!",
      )
      // In a real app, you'd call an API here to delete the category.
      // For now, we'll just simulate the deletion.
      // const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      // setCategories(updatedCategories); // Assuming you have a state for categories
    }
  }

  const handleDeletePromotion = (promotionId: string) => {
    if (
      confirm(
        language === "uz"
          ? "Aksiyani o'chirishni xohlaysizmi?"
          : language === "ru"
            ? "Удалить акцию?"
            : "Delete promotion?",
      )
    ) {
      console.log("[v0] Deleting promotion:", promotionId)
      alert(
        language === "uz"
          ? "Aksiya muvaffaqiyatli o'chirildi!"
          : language === "ru"
            ? "Акция успешно удалена!"
            : "Promotion deleted successfully!",
      )
      // In a real app, you'd call an API here to delete the promotion.
      // For now, we'll just simulate the deletion.
      // const updatedPromotions = promotions.filter(promo => promo.id !== promotionId);
      // setPromotions(updatedPromotions); // Assuming you have a state for promotions
    }
  }

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item)
    setNewItem({
      ...item,
      // Ensure ingredients are correctly copied if they are arrays
      ingredients: item.ingredients ? [...item.ingredients] : [],
      ingredientsUz: item.ingredientsUz ? [...item.ingredientsUz] : [],
      ingredientsRu: item.ingredientsRu ? [...item.ingredientsRu] : [],
    })
    setIsAddingItem(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setNewCategory({
      ...category,
    })
    setIsAddingCategory(true)
  }

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion)
    setNewPromotion({
      ...promotion,
    })
    setIsAddingPromotion(true)
  }

  const addIngredient = () => {
    if (ingredientInputUz && ingredientInputRu && ingredientInputEn) {
      setNewItem({
        ...newItem,
        ingredientsUz: [...(newItem.ingredientsUz || []), ingredientInputUz],
        ingredientsRu: [...(newItem.ingredientsRu || []), ingredientInputRu],
        ingredients: [...(newItem.ingredients || []), ingredientInputEn],
      })
      setIngredientInputUz("")
      setIngredientInputRu("")
      setIngredientInputEn("")
    }
  }

  const removeIngredient = (index: number) => {
    setNewItem({
      ...newItem,
      ingredientsUz: newItem.ingredientsUz?.filter((_, i) => i !== index) || [],
      ingredientsRu: newItem.ingredientsRu?.filter((_, i) => i !== index) || [],
      ingredients: newItem.ingredients?.filter((_, i) => i !== index) || [],
    })
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-r from-green-700 to-green-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-bold">
                {language === "uz" ? "Admin Panel" : language === "ru" ? "Админ Панель" : "Admin Panel"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Select value={language} onValueChange={(value: any) => setLanguage(value)}>
                <SelectTrigger className="w-20 bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uz">UZ</SelectItem>
                  <SelectItem value="ru">RU</SelectItem>
                  <SelectItem value="en">EN</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-white hover:bg-white/20">
                <LogOut className="h-4 w-4 mr-2" />
                {language === "uz" ? "Chiqish" : language === "ru" ? "Выйти" : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="menu">
              <ChefHat className="h-4 w-4 mr-2" />
              {language === "uz" ? "Taomlar" : language === "ru" ? "Блюда" : "Dishes"}
            </TabsTrigger>
            <TabsTrigger value="categories">
              <FolderOpen className="h-4 w-4 mr-2" />
              {language === "uz" ? "Kategoriyalar" : language === "ru" ? "Категории" : "Categories"}
            </TabsTrigger>
            <TabsTrigger value="promotions">
              <Megaphone className="h-4 w-4 mr-2" />
              {language === "uz" ? "Aksiyalar" : language === "ru" ? "Акции" : "Promotions"}
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <MessageSquare className="h-4 w-4 mr-2" />
              {language === "uz" ? "Izohlar" : language === "ru" ? "Отзывы" : "Reviews"}
              {pendingReviews.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {pendingReviews.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 mb-6">
            <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Megaphone className="h-5 w-5 text-green-600" />
                      {language === "uz"
                        ? "Karusel Sozlamalari"
                        : language === "ru"
                          ? "Настройки Карусели"
                          : "Carousel Settings"}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {language === "uz"
                        ? "Asosiy sahifadagi aksiyalar karuselini yoqish yoki o'chirish"
                        : language === "ru"
                          ? "Включить или отключить карусель акций на главной странице"
                          : "Enable or disable the promotions carousel on the main page"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      id="carousel-toggle"
                      checked={carouselEnabled}
                      onCheckedChange={handleCarouselToggle}
                      className="data-[state=checked]:bg-green-600"
                    />
                    <Badge variant={carouselEnabled ? "default" : "secondary"} className="text-sm">
                      {carouselEnabled
                        ? language === "uz"
                          ? "Yoniq"
                          : language === "ru"
                            ? "Включено"
                            : "Enabled"
                        : language === "uz"
                          ? "O'chiq"
                          : language === "ru"
                            ? "Выключено"
                            : "Disabled"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          <TabsContent value="menu" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {language === "uz"
                  ? "Taomlar boshqaruvi"
                  : language === "ru"
                    ? "Управление блюдами"
                    : "Dishes Management"}
              </h2>
              <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "uz" ? "Yangi taom" : language === "ru" ? "Новое блюдо" : "Add Dish"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingItem
                        ? language === "uz"
                          ? "Taomni tahrirlash"
                          : language === "ru"
                            ? "Редактировать блюдо"
                            : "Edit Dish"
                        : language === "uz"
                          ? "Yangi taom qo'shish"
                          : language === "ru"
                            ? "Добавить новое блюдо"
                            : "Add New Dish"}
                    </DialogTitle>
                    <DialogDescription>
                      {language === "uz"
                        ? "Yangi taom ma'lumotlarini 3 tilda kiriting"
                        : language === "ru"
                          ? "Введите информацию о новом блюде на 3 языках"
                          : "Enter dish information in 3 languages"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Image Upload with instructions */}
                    <div>
                      <Label>{language === "uz" ? "Rasm" : language === "ru" ? "Изображение" : "Image"}</Label>
                      <Alert className="mt-2 mb-3">
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {language === "uz"
                            ? "Format: JPG, PNG, WEBP | O'lcham: 800x600px (tavsiya) | Maksimal hajm: 5MB"
                            : language === "ru"
                              ? "Формат: JPG, PNG, WEBP | Размер: 800x600px (рекомендуется) | Макс. размер: 5MB"
                              : "Format: JPG, PNG, WEBP | Size: 800x600px (recommended) | Max size: 5MB"}
                        </AlertDescription>
                      </Alert>
                      <div className="flex items-center gap-4">
                        {newItem.image && (
                          <div className="w-48 h-32 rounded-lg overflow-hidden border">
                            <img
                              src={newItem.image || "/placeholder.svg"}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <Input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => handleImageUpload(e, "item")}
                            className="hidden"
                            id="item-image"
                          />
                          <Label htmlFor="item-image" className="cursor-pointer">
                            <div className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
                              <Upload className="h-4 w-4" />
                              {language === "uz"
                                ? "Rasm yuklash"
                                : language === "ru"
                                  ? "Загрузить изображение"
                                  : "Upload Image"}
                            </div>
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Category Selection */}
                    <div>
                      <Label htmlFor="category">
                        {language === "uz" ? "Kategoriya" : language === "ru" ? "Категория" : "Category"}
                      </Label>
                      <Select
                        value={newItem.category}
                        onValueChange={(value) => setNewItem({ ...newItem, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.icon} {language === "uz" ? cat.nameUz : language === "ru" ? cat.nameRu : cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Names in 3 languages */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="nameUz">
                          {language === "uz"
                            ? "Nomi (O'zbek)"
                            : language === "ru"
                              ? "Название (Узбекский)"
                              : "Name (Uzbek)"}
                        </Label>
                        <Input
                          id="nameUz"
                          value={newItem.nameUz}
                          onChange={(e) => setNewItem({ ...newItem, nameUz: e.target.value })}
                          placeholder="Masalan: Qovurilgan tovuq"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nameRu">
                          {language === "uz"
                            ? "Nomi (Rus)"
                            : language === "ru"
                              ? "Название (Русский)"
                              : "Name (Russian)"}
                        </Label>
                        <Input
                          id="nameRu"
                          value={newItem.nameRu}
                          onChange={(e) => setNewItem({ ...newItem, nameRu: e.target.value })}
                          placeholder="Например: Жареная курица"
                        />
                      </div>
                      <div>
                        <Label htmlFor="name">
                          {language === "uz"
                            ? "Nomi (Ingliz)"
                            : language === "ru"
                              ? "Название (Английский)"
                              : "Name (English)"}
                        </Label>
                        <Input
                          id="name"
                          value={newItem.name}
                          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                          placeholder="Example: Grilled Chicken"
                        />
                      </div>
                    </div>

                    {/* Descriptions in 3 languages */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="descriptionUz">
                          {language === "uz"
                            ? "Tavsif (O'zbek)"
                            : language === "ru"
                              ? "Описание (Узбекский)"
                              : "Description (Uzbek)"}
                        </Label>
                        <Textarea
                          id="descriptionUz"
                          value={newItem.descriptionUz}
                          onChange={(e) => setNewItem({ ...newItem, descriptionUz: e.target.value })}
                          rows={3}
                          placeholder="Taom haqida batafsil ma'lumot..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="descriptionRu">
                          {language === "uz"
                            ? "Tavsif (Rus)"
                            : language === "ru"
                              ? "Описание (Русский)"
                              : "Description (Russian)"}
                        </Label>
                        <Textarea
                          id="descriptionRu"
                          value={newItem.descriptionRu}
                          onChange={(e) => setNewItem({ ...newItem, descriptionRu: e.target.value })}
                          rows={3}
                          placeholder="Подробное описание блюда..."
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">
                          {language === "uz"
                            ? "Tavsif (Ingliz)"
                            : language === "ru"
                              ? "Описание (Английский)"
                              : "Description (English)"}
                        </Label>
                        <Textarea
                          id="description"
                          value={newItem.description}
                          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                          rows={3}
                          placeholder="Detailed dish description..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="prepTime">
                          {language === "uz"
                            ? "Tayyorlash vaqti (daqiqa)"
                            : language === "ru"
                              ? "Время приготовления (минуты)"
                              : "Preparation Time (minutes)"}
                        </Label>
                        <Input
                          id="prepTime"
                          value={newItem.prepTime}
                          onChange={(e) => setNewItem({ ...newItem, prepTime: e.target.value })}
                          placeholder="15-20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rating">
                          {language === "uz" ? "Reyting (0-5)" : language === "ru" ? "Рейтинг (0-5)" : "Rating (0-5)"}
                        </Label>
                        <Input
                          id="rating"
                          type="number"
                          min="0"
                          max="5"
                          step="0.1"
                          value={newItem.rating}
                          onChange={(e) => setNewItem({ ...newItem, rating: Number.parseFloat(e.target.value) })}
                          placeholder="4.8"
                        />
                      </div>
                    </div>

                    {/* Price */}
                    <div>
                      <Label htmlFor="price">
                        {language === "uz" ? "Narxi (so'm)" : language === "ru" ? "Цена (сум)" : "Price (sum)"}
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                        placeholder="50000"
                      />
                    </div>

                    <div>
                      <Label>{language === "uz" ? "Tarkibi" : language === "ru" ? "Ингредиенты" : "Ingredients"}</Label>
                      <div className="space-y-3 mt-2">
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            value={ingredientInputUz}
                            onChange={(e) => setIngredientInputUz(e.target.value)}
                            placeholder="O'zbek tilida"
                          />
                          <Input
                            value={ingredientInputRu}
                            onChange={(e) => setIngredientInputRu(e.target.value)}
                            placeholder="На русском"
                          />
                          <Input
                            value={ingredientInputEn}
                            onChange={(e) => setIngredientInputEn(e.target.value)}
                            placeholder="In English"
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={addIngredient}
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {language === "uz"
                            ? "Ingredient qo'shish"
                            : language === "ru"
                              ? "Добавить ингредиент"
                              : "Add Ingredient"}
                        </Button>
                        {newItem.ingredientsUz && newItem.ingredientsUz.length > 0 && (
                          <div className="space-y-2 mt-3">
                            {newItem.ingredientsUz.map((ing, index) => (
                              <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                                <div className="grid grid-cols-3 gap-2 flex-1 text-sm">
                                  <span>{ing}</span>
                                  <span>{newItem.ingredientsRu?.[index]}</span>
                                  <span>{newItem.ingredients?.[index]}</span>
                                </div>
                                <Button type="button" variant="ghost" size="sm" onClick={() => removeIngredient(index)}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Available Switch */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="available"
                        checked={newItem.available}
                        onCheckedChange={(checked) => setNewItem({ ...newItem, available: checked })}
                      />
                      <Label htmlFor="available">
                        {language === "uz" ? "Mavjud" : language === "ru" ? "Доступно" : "Available"}
                      </Label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingItem(false)
                        setNewItem({
                          name: "",
                          nameUz: "",
                          nameRu: "",
                          description: "",
                          descriptionUz: "",
                          descriptionRu: "",
                          price: 0,
                          category: "1",
                          available: true,
                          image: "",
                          prepTime: "",
                          rating: 5,
                          ingredients: [],
                          ingredientsUz: [],
                          ingredientsRu: [],
                        })
                        setEditingItem(null)
                      }}
                    >
                      {language === "uz" ? "Bekor qilish" : language === "ru" ? "Отмена" : "Cancel"}
                    </Button>
                    <Button onClick={handleSaveItem} className="bg-gradient-to-r from-green-700 to-green-600">
                      {language === "uz" ? "Saqlash" : language === "ru" ? "Сохранить" : "Save"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <Card key={item.id}>
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={language === "uz" ? item.nameUz : language === "ru" ? item.nameRu : item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant={item.available ? "default" : "secondary"}>
                        {item.available
                          ? language === "uz"
                            ? "Mavjud"
                            : language === "ru"
                              ? "Доступно"
                              : "Available"
                          : language === "uz"
                            ? "Mavjud emas"
                            : language === "ru"
                              ? "Недоступно"
                              : "Unavailable"}
                      </Badge>
                    </div>
                    {item.rating && (
                      <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded-md flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-semibold">{item.rating}</span>
                      </div>
                    )}
                    {item.prepTime && (
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded-md text-xs">
                        {item.prepTime} {language === "uz" ? "daq" : language === "ru" ? "мин" : "min"}
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {language === "uz" ? item.nameUz : language === "ru" ? item.nameRu : item.name}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {language === "uz"
                        ? item.descriptionUz
                        : language === "ru"
                          ? item.descriptionRu
                          : item.description}
                    </CardDescription>
                    <div className="text-lg font-bold text-primary mt-2">{formatPrice(item.price)}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditItem(item)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteItem(item.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {language === "uz"
                  ? "Kategoriyalar boshqaruvi"
                  : language === "ru"
                    ? "Управление категориями"
                    : "Categories Management"}
              </h2>
              <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "uz" ? "Yangi kategoriya" : language === "ru" ? "Новая категория" : "Add Category"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCategory
                        ? language === "uz"
                          ? "Kategoriyani tahrirlash"
                          : language === "ru"
                            ? "Редактировать категорию"
                            : "Edit Category"
                        : language === "uz"
                          ? "Yangi kategoriya qo'shish"
                          : language === "ru"
                            ? "Добавить новую категорию"
                            : "Add New Category"}
                    </DialogTitle>
                    <DialogDescription>
                      {language === "uz"
                        ? "Yangi kategoriya ma'lumotlarini 3 tilda kiriting"
                        : language === "ru"
                          ? "Введите информацию о новой категории на 3 языках"
                          : "Enter category information in 3 languages"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Image Upload with instructions */}
                    <div>
                      <Label>{language === "uz" ? "Rasm" : language === "ru" ? "Изображение" : "Image"}</Label>
                      <Alert className="mt-2 mb-3">
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {language === "uz"
                            ? "Format: JPG, PNG, WEBP | O'lcham: 1200x800px (tavsiya) | Maksimal hajm: 5MB"
                            : language === "ru"
                              ? "Формат: JPG, PNG, WEBP | Размер: 1200x800px (рекомендуется) | Макс. размер: 5MB"
                              : "Format: JPG, PNG, WEBP | Size: 1200x800px (recommended) | Max size: 5MB"}
                        </AlertDescription>
                      </Alert>
                      <div className="flex items-center gap-4">
                        {newCategory.image && (
                          <div className="w-64 h-40 rounded-lg overflow-hidden border">
                            <img
                              src={newCategory.image || "/placeholder.svg"}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <Input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => handleImageUpload(e, "category")}
                            className="hidden"
                            id="category-image"
                          />
                          <Label htmlFor="category-image" className="cursor-pointer">
                            <div className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
                              <Upload className="h-4 w-4" />
                              {language === "uz"
                                ? "Rasm yuklash"
                                : language === "ru"
                                  ? "Загрузить изображение"
                                  : "Upload Image"}
                            </div>
                          </Label>
                        </div>
                      </div>
                    </div>

                    {/* Icon */}
                    <div>
                      <Label htmlFor="icon">
                        {language === "uz" ? "Emoji belgisi" : language === "ru" ? "Emoji символ" : "Emoji Icon"}
                      </Label>
                      <Input
                        id="icon"
                        value={newCategory.icon}
                        onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                        placeholder="🍽️"
                        maxLength={2}
                      />
                    </div>

                    {/* Names in 3 languages */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="catNameUz">
                          {language === "uz"
                            ? "Nomi (O'zbek)"
                            : language === "ru"
                              ? "Название (Узбекский)"
                              : "Name (Uzbek)"}
                        </Label>
                        <Input
                          id="catNameUz"
                          value={newCategory.nameUz}
                          onChange={(e) => setNewCategory({ ...newCategory, nameUz: e.target.value })}
                          placeholder="Masalan: Salatlar"
                        />
                      </div>
                      <div>
                        <Label htmlFor="catNameRu">
                          {language === "uz"
                            ? "Nomi (Rus)"
                            : language === "ru"
                              ? "Название (Русский)"
                              : "Name (Russian)"}
                        </Label>
                        <Input
                          id="catNameRu"
                          value={newCategory.nameRu}
                          onChange={(e) => setNewCategory({ ...newCategory, nameRu: e.target.value })}
                          placeholder="Например: Салаты"
                        />
                      </div>
                      <div>
                        <Label htmlFor="catName">
                          {language === "uz"
                            ? "Nomi (Ingliz)"
                            : language === "ru"
                              ? "Название (Английский)"
                              : "Name (English)"}
                        </Label>
                        <Input
                          id="catName"
                          value={newCategory.name}
                          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                          placeholder="Example: Salads"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingCategory(false)
                        setNewCategory({
                          name: "",
                          nameUz: "",
                          nameRu: "",
                          icon: "🍽️",
                          image: "",
                        })
                        setEditingCategory(null)
                      }}
                    >
                      {language === "uz" ? "Bekor qilish" : language === "ru" ? "Отмена" : "Cancel"}
                    </Button>
                    <Button onClick={handleSaveCategory} className="bg-gradient-to-r from-green-700 to-green-600">
                      {language === "uz" ? "Saqlash" : language === "ru" ? "Сохранить" : "Save"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card key={category.id}>
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={language === "uz" ? category.nameUz : language === "ru" ? category.nameRu : category.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-5xl mb-2">{category.icon}</div>
                        <h3 className="text-xl font-bold">
                          {language === "uz" ? category.nameUz : language === "ru" ? category.nameRu : category.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditCategory(category)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeleteCategory(category.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="promotions" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {language === "uz"
                  ? "Aksiyalar boshqaruvi"
                  : language === "ru"
                    ? "Управление акциями"
                    : "Promotions Management"}
              </h2>
              <Dialog open={isAddingPromotion} onOpenChange={setIsAddingPromotion}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "uz" ? "Yangi aksiya" : language === "ru" ? "Новая акция" : "Add Promotion"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPromotion
                        ? language === "uz"
                          ? "Aksiyani tahrirlash"
                          : language === "ru"
                            ? "Редактировать акцию"
                            : "Edit Promotion"
                        : language === "uz"
                          ? "Yangi aksiya qo'shish"
                          : language === "ru"
                            ? "Добавить новую акцию"
                            : "Add New Promotion"}
                    </DialogTitle>
                    <DialogDescription>
                      {language === "uz"
                        ? "Yangi aksiya ma'lumotlarini 3 tilda kiriting"
                        : language === "ru"
                          ? "Введите информацию о новой акции на 3 языках"
                          : "Enter promotion information in 3 languages"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <Label>{language === "uz" ? "Rasm" : language === "ru" ? "Изображение" : "Image"}</Label>
                      <Alert className="mt-2 mb-3">
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {language === "uz"
                            ? "Format: JPG, PNG, WEBP | O'lcham: 1200x600px (tavsiya) | Maksimal hajm: 5MB"
                            : language === "ru"
                              ? "Формат: JPG, PNG, WEBP | Размер: 1200x600px (рекомендуется) | Макс. размер: 5MB"
                              : "Format: JPG, PNG, WEBP | Size: 1200x600px (recommended) | Max size: 5MB"}
                        </AlertDescription>
                      </Alert>
                      <div className="flex items-center gap-4">
                        {newPromotion.image && (
                          <div className="w-48 h-32 rounded-lg overflow-hidden border">
                            <img
                              src={newPromotion.image || "/placeholder.svg"}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <Input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={(e) => handleImageUpload(e, "promotion")}
                            className="hidden"
                            id="promotion-image"
                          />
                          <Label htmlFor="promotion-image" className="cursor-pointer">
                            <div className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
                              <Upload className="h-4 w-4" />
                              {language === "uz"
                                ? "Rasm yuklash"
                                : language === "ru"
                                  ? "Загрузить изображение"
                                  : "Upload Image"}
                            </div>
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category">
                        {language === "uz" ? "Kategoriya" : language === "ru" ? "Категория" : "Category"}
                      </Label>
                      <Select
                        value={newPromotion.category}
                        onValueChange={(value) => setNewPromotion({ ...newPromotion, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.icon} {language === "uz" ? cat.nameUz : language === "ru" ? cat.nameRu : cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Titles in 3 languages */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="titleUz">
                          {language === "uz"
                            ? "Sarlavha (O'zbek)"
                            : language === "ru"
                              ? "Заголовок (Узбекский)"
                              : "Title (Uzbek)"}
                        </Label>
                        <Input
                          id="titleUz"
                          value={newPromotion.titleUz}
                          onChange={(e) => setNewPromotion({ ...newPromotion, titleUz: e.target.value })}
                          placeholder="Masalan: Yozgi maxsus taklif"
                        />
                      </div>
                      <div>
                        <Label htmlFor="titleRu">
                          {language === "uz"
                            ? "Sarlavha (Rus)"
                            : language === "ru"
                              ? "Заголовок (Русский)"
                              : "Title (Russian)"}
                        </Label>
                        <Input
                          id="titleRu"
                          value={newPromotion.titleRu}
                          onChange={(e) => setNewPromotion({ ...newPromotion, titleRu: e.target.value })}
                          placeholder="Например: Летнее специальное предложение"
                        />
                      </div>
                      <div>
                        <Label htmlFor="title">
                          {language === "uz"
                            ? "Sarlavha (Ingliz)"
                            : language === "ru"
                              ? "Заголовок (Английский)"
                              : "Title (English)"}
                        </Label>
                        <Input
                          id="title"
                          value={newPromotion.title}
                          onChange={(e) => setNewPromotion({ ...newPromotion, title: e.target.value })}
                          placeholder="Example: Summer Special"
                        />
                      </div>
                    </div>

                    {/* Descriptions in 3 languages */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="descriptionUz">
                          {language === "uz"
                            ? "Tavsif (O'zbek)"
                            : language === "ru"
                              ? "Описание (Узбекский)"
                              : "Description (Uzbek)"}
                        </Label>
                        <Textarea
                          id="descriptionUz"
                          value={newPromotion.descriptionUz}
                          onChange={(e) => setNewPromotion({ ...newPromotion, descriptionUz: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="descriptionRu">
                          {language === "uz"
                            ? "Tavsif (Rus)"
                            : language === "ru"
                              ? "Описание (Русский)"
                              : "Description (Russian)"}
                        </Label>
                        <Textarea
                          id="descriptionRu"
                          value={newPromotion.descriptionRu}
                          onChange={(e) => setNewPromotion({ ...newPromotion, descriptionRu: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">
                          {language === "uz"
                            ? "Tavsif (Ingliz)"
                            : language === "ru"
                              ? "Описание (Английский)"
                              : "Description (English)"}
                        </Label>
                        <Textarea
                          id="description"
                          value={newPromotion.description}
                          onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Active Switch */}
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="active"
                        checked={newPromotion.active}
                        onCheckedChange={(checked) => setNewPromotion({ ...newPromotion, active: checked })}
                      />
                      <Label htmlFor="active">
                        {language === "uz" ? "Faol" : language === "ru" ? "Активно" : "Active"}
                      </Label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingPromotion(false)
                        setNewPromotion({
                          title: "",
                          titleUz: "",
                          titleRu: "",
                          description: "",
                          descriptionUz: "",
                          descriptionRu: "",
                          image: "",
                          active: true,
                          category: "7",
                        })
                        setEditingPromotion(null)
                      }}
                    >
                      {language === "uz" ? "Bekor qilish" : language === "ru" ? "Отмена" : "Cancel"}
                    </Button>
                    <Button onClick={handleSavePromotion} className="bg-gradient-to-r from-green-700 to-green-600">
                      {language === "uz" ? "Saqlash" : language === "ru" ? "Сохранить" : "Save"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((promotion) => (
                <Card key={promotion.id}>
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={promotion.image || "/placeholder.svg"}
                      alt={
                        language === "uz" ? promotion.titleUz : language === "ru" ? promotion.titleRu : promotion.title
                      }
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant={promotion.active ? "default" : "secondary"}>
                        {promotion.active
                          ? language === "uz"
                            ? "Faol"
                            : language === "ru"
                              ? "Активно"
                              : "Active"
                          : language === "uz"
                            ? "Faol emas"
                            : language === "ru"
                              ? "Неактивно"
                              : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      {language === "uz" ? promotion.titleUz : language === "ru" ? promotion.titleRu : promotion.title}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-2">
                      {language === "uz"
                        ? promotion.descriptionUz
                        : language === "ru"
                          ? promotion.descriptionRu
                          : promotion.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditPromotion(promotion)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDeletePromotion(promotion.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                {language === "uz"
                  ? "Izohlar boshqaruvi"
                  : language === "ru"
                    ? "Управление отзывами"
                    : "Reviews Management"}
              </h2>
              <p className="text-muted-foreground mt-2">
                {language === "uz"
                  ? "Foydalanuvchilar izohlarini ko'rib chiqing va tasdiqlang"
                  : language === "ru"
                    ? "Просмотрите и одобрите отзывы пользователей"
                    : "Review and approve user reviews"}
              </p>
            </div>

            {/* Pending Reviews */}
            {pendingReviews.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Badge variant="secondary">{pendingReviews.length}</Badge>
                  {language === "uz"
                    ? "Tasdiqlanmagan izohlar"
                    : language === "ru"
                      ? "Ожидающие одобрения"
                      : "Pending Approval"}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {pendingReviews.map((review) => (
                    <Card key={review.id} className="border-yellow-200 bg-yellow-50/50">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              {review.name} {review.surname}
                            </CardTitle>
                            <CardDescription>{review.date}</CardDescription>
                          </div>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4 leading-relaxed">{review.comment}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveReview(review.id)}
                            className="bg-green-600 hover:bg-green-700 flex-1"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            {language === "uz" ? "Tasdiqlash" : language === "ru" ? "Одобрить" : "Approve"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectReview(review.id)}
                            className="flex-1"
                          >
                            <X className="h-4 w-4 mr-2" />
                            {language === "uz" ? "Rad etish" : language === "ru" ? "Отклонить" : "Reject"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Approved Reviews */}
            <div>
              <h3 className="text-xl font-semibold mb-4">
                {language === "uz"
                  ? "Tasdiqlangan izohlar"
                  : language === "ru"
                    ? "Одобренные отзывы"
                    : "Approved Reviews"}
              </h3>
              {reviews.filter((r) => r.approved).length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    {language === "uz"
                      ? "Hozircha tasdiqlangan izohlar yo'q"
                      : language === "ru"
                        ? "Пока нет одобренных отзывов"
                        : "No approved reviews yet"}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reviews
                    .filter((r) => r.approved)
                    .map((review) => (
                      <Card key={review.id}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-base">
                                {review.name} {review.surname}
                              </CardTitle>
                              <CardDescription className="text-xs">{review.date}</CardDescription>
                            </div>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${
                                    star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm leading-relaxed line-clamp-3">{review.comment}</p>
                          <div className="flex justify-end mt-3">
                            <Button size="sm" variant="outline" onClick={() => handleRejectReview(review.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
