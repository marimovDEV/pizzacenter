"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Check, ChevronsUpDown, Image as ImageIcon, ExternalLink, Calendar, Percent, DollarSign, AlertCircle } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { formatPrice, getImageUrl } from "@/lib/api"
import { useMenu } from "@/lib/menu-context"
import { useApiClient } from "@/hooks/use-api"
import { usePromotions, useAdminCategories, useMenuItems } from "@/hooks/use-api"
import type { Promotion } from "@/lib/types"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function PromotionsTab() {
  const { promotions, deletePromotion } = useMenu()
  const { refetch: refetchPromotions, loading: promotionsLoading } = usePromotions()
  const { categories } = useAdminCategories()
  const { menuItems } = useMenuItems()
  const api = useApiClient()

  // UI States
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [promotionToDelete, setPromotionToDelete] = useState<Promotion | null>(null)
  const [deletingPromotionId, setDeletingPromotionId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Combobox State
  const [openCombobox, setOpenCombobox] = useState(false)

  // Form Data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    imageFile: null as File | null,
    discount_percentage: 0,
    discount_amount: 0,
    is_active: true,
    start_date: "",
    end_date: "",
    category: "none",
    linked_dish: "none",
    price: 0,
    ingredients: "",
  })

  // UX Logic States
  const [discountType, setDiscountType] = useState<"percentage" | "amount" | "none">("none")
  const [imageError, setImageError] = useState<string | null>(null)
  const [pricePreview, setPricePreview] = useState<number | null>(null)

  // Language selection for multilingual fields
  const [currentLang, setCurrentLang] = useState<'uz' | 'ru' | 'en'>('uz')
  const [multilingualData, setMultilingualData] = useState({
    title_uz: "",
    title_ru: "",
    description_uz: "",
    description_ru: "",
    ingredients_uz: "",
    ingredients_ru: "",
  })

  // Refresh promotions data when component mounts
  useEffect(() => {
    const refreshPromotions = async () => {
      try {
        await refetchPromotions()
      } catch (error) {
        console.error('Error refreshing promotions:', error)
      }
    }
    refreshPromotions()
  }, [])

  // Calculate price preview when discount or linked dish changes
  useEffect(() => {
    if (formData.linked_dish && formData.linked_dish !== 'none') {
      const dish = menuItems.find(item => item.id.toString() === formData.linked_dish)
      if (dish) {
        let finalPrice = dish.price

        if (discountType === 'percentage' && formData.discount_percentage > 0) {
          finalPrice = dish.price * (1 - formData.discount_percentage / 100)
        } else if (discountType === 'amount' && formData.discount_amount > 0) {
          finalPrice = Math.max(0, dish.price - formData.discount_amount)
        }

        // Auto-fill price if it's 0 or user hasn't manually set a weird price
        if (formData.price === 0) {
          setFormData(prev => ({ ...prev, price: Math.round(finalPrice) }))
        }
        setPricePreview(Math.round(finalPrice))
      }
    } else {
      setPricePreview(null)
    }
  }, [formData.linked_dish, formData.discount_percentage, formData.discount_amount, discountType, menuItems])

  const autofillFromFood = (food: any) => {
    // Only autofill if fields are currently empty (to avoid overwriting manual edits)
    // or if we're creating a new promotion.

    setMultilingualData(prev => ({
      ...prev,
      title_uz: prev.title_uz || "Super aksiya",
      title_ru: prev.title_ru || "Супер акция",
      description_uz: prev.description_uz || `${food.name_uz || food.name} uchun maxsus aksiya`,
      description_ru: prev.description_ru || `Специальная акция на ${food.name_ru || food.name}`,
      ingredients_uz: prev.ingredients_uz || (Array.isArray(food.ingredients_uz) ? food.ingredients_uz.join(", ") : ""),
      ingredients_ru: prev.ingredients_ru || (Array.isArray(food.ingredients_ru) ? food.ingredients_ru.join(", ") : ""),
    }))

    setFormData(prev => ({
      ...prev,
      title: prev.title || "Super promotion",
      description: prev.description || `Special offer for ${food.name_en || food.name}`,
      ingredients: prev.ingredients || (Array.isArray(food.ingredients_en || food.ingredients) ? (food.ingredients_en || food.ingredients).join(", ") : ""),
      category: food.category || prev.category,
      // If price is 0, set it to dish price (discount will be applied by the useEffect)
      price: prev.price === 0 ? food.price : prev.price
    }))

    toast.info("Ma'lumotlar avtomatik to'ldirildi ✨")
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setImageError(null)

    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setImageError("Rasm hajmi 2MB dan oshmasligi kerak")
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setImageError("Faqat rasm fayllari yuklanishi mumkin")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string, imageFile: file })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDiscountTypeChange = (type: "percentage" | "amount" | "none") => {
    setDiscountType(type)
    // Clear the other value logic
    if (type === 'percentage') {
      setFormData(prev => ({ ...prev, discount_amount: 0 }))
    } else if (type === 'amount') {
      setFormData(prev => ({ ...prev, discount_percentage: 0 }))
    } else {
      setFormData(prev => ({ ...prev, discount_percentage: 0, discount_amount: 0 }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Client-side Validation
    if (discountType === 'percentage' && (formData.discount_percentage <= 0 || formData.discount_percentage > 100)) {
      toast.error("Chegirma foizi 0 va 100 orasida bo'lishi kerak")
      setIsSubmitting(false)
      return
    }



    if (formData.price < 0) {
      toast.error("Narx manfiy bo'lishi mumkin emas")
      setIsSubmitting(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('title_uz', multilingualData.title_uz)
      formDataToSend.append('title_ru', multilingualData.title_ru)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('description_uz', multilingualData.description_uz)
      formDataToSend.append('description_ru', multilingualData.description_ru)
      formDataToSend.append('discount_percentage', (formData.discount_percentage || 0).toString())
      formDataToSend.append('discount_amount', (formData.discount_amount || 0).toString())
      formDataToSend.append('is_active', formData.is_active.toString())
      formDataToSend.append('start_date', formData.start_date)
      formDataToSend.append('end_date', formData.end_date)
      formDataToSend.append('price', (formData.price || 0).toString())

      // Convert comma-separated strings to JSON arrays
      const ingredientsArray = formData.ingredients ? formData.ingredients.split(',').map(item => item.trim()).filter(item => item) : []
      const ingredientsUzArray = multilingualData.ingredients_uz ? multilingualData.ingredients_uz.split(',').map(item => item.trim()).filter(item => item) : []
      const ingredientsRuArray = multilingualData.ingredients_ru ? multilingualData.ingredients_ru.split(',').map(item => item.trim()).filter(item => item) : []

      formDataToSend.append('ingredients', JSON.stringify(ingredientsArray))
      formDataToSend.append('ingredients_uz', JSON.stringify(ingredientsUzArray))
      formDataToSend.append('ingredients_ru', JSON.stringify(ingredientsRuArray))

      if (formData.category && formData.category !== 'none') formDataToSend.append('category', formData.category)
      if (formData.linked_dish && formData.linked_dish !== 'none') formDataToSend.append('linked_dish', formData.linked_dish)

      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile)
      }

      if (editingPromotion) {
        const promotionId = editingPromotion.id
        await api.patchFormData(`/promotions/${promotionId}/`, formDataToSend)
        toast.success("Aksiya muvaffaqiyatli yangilandi")
      } else {
        await api.postFormData('/promotions/', formDataToSend)
        toast.success("Yangi aksiya muvaffaqiyatli qo'shildi")
      }

      await refetchPromotions()
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving promotion:', error)
      toast.error("Saqlashda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (promotion: Promotion) => {
    setEditingPromotion(promotion)

    const formatDateForInput = (dateString: string) => {
      if (!dateString) return ""
      try {
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`
      } catch {
        return ""
      }
    }

    // Determine initial discount type
    let initialDiscountType: "percentage" | "amount" | "none" = "none"
    if ((promotion.discount_percentage ?? 0) > 0) initialDiscountType = "percentage"
    else if ((promotion.discount_amount ?? 0) > 0) initialDiscountType = "amount"

    setDiscountType(initialDiscountType)

    setFormData({
      title: promotion.title,
      description: promotion.description,
      image: promotion.image || "",
      imageFile: null,
      discount_percentage: promotion.discount_percentage || 0,
      discount_amount: promotion.discount_amount || 0,
      is_active: promotion.is_active !== false,
      start_date: formatDateForInput(promotion.start_date || ""),
      end_date: formatDateForInput(promotion.end_date || ""),
      category: (promotion.category || 0).toString(),
      linked_dish: (promotion.linked_dish || 0).toString(),
      price: promotion.price || 0,
      ingredients: Array.isArray(promotion.ingredients) ? promotion.ingredients.join(", ") : "",
    })
    setMultilingualData({
      title_uz: promotion.title_uz || "",
      title_ru: promotion.title_ru || "",
      description_uz: promotion.description_uz || "",
      description_ru: promotion.description_ru || "",
      ingredients_uz: Array.isArray(promotion.ingredients_uz) ? promotion.ingredients_uz.join(", ") : "",
      ingredients_ru: Array.isArray(promotion.ingredients_ru) ? promotion.ingredients_ru.join(", ") : "",
    })
    setCurrentLang('uz')
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (promotion: Promotion) => {
    setPromotionToDelete(promotion)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (promotionToDelete) {
      setDeletingPromotionId(promotionToDelete.id)
      try {
        const promotionId = promotionToDelete.id

        await api.delete(`/promotions/${promotionId}/`)

        // Immediately update context state (optimistic UI update)
        deletePromotion(promotionToDelete.id)

        setDeleteDialogOpen(false)
        setPromotionToDelete(null)
        await refetchPromotions()

        toast.success("Aksiya o'chirildi")
      } catch (error) {
        console.error('Error deleting promotion:', error)
        toast.error("O'chirishda xatolik yuz berdi")
      } finally {
        setDeletingPromotionId(null)
      }
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setPromotionToDelete(null)
  }

  const resetForm = () => {
    setEditingPromotion(null)
    setDiscountType("none")
    setImageError(null)
    setPricePreview(null)
    setFormData({
      title: "",
      description: "",
      image: "",
      imageFile: null,
      discount_percentage: 0,
      discount_amount: 0,
      is_active: true,
      start_date: "",
      end_date: "",
      category: "none",
      linked_dish: "none",
      price: 0,
      ingredients: "",
    })
    setMultilingualData({
      title_uz: "",
      title_ru: "",
      description_uz: "",
      description_ru: "",
      ingredients_uz: "",
      ingredients_ru: "",
    })
    setCurrentLang('uz')
  }

  // Helper for language label
  const getLangLabel = (lang: string) => {
    switch (lang) {
      case 'uz': return "O'zbek";
      case 'ru': return "Русский";
      case 'en': return "English";
      default: return lang.toUpperCase();
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Aksiyalar</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full text-sm sm:text-base shadow-lg hover:shadow-emerald-500/20 transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Yangi Aksiya</span>
              <span className="sm:hidden">Qo'shish</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/10 text-white max-w-4xl max-h-[90vh] overflow-y-auto w-full p-0 gap-0">
            <DialogHeader className="p-6 pb-2 border-b border-white/10 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                {editingPromotion ? <Pencil className="w-5 h-5 text-emerald-500" /> : <Plus className="w-5 h-5 text-emerald-500" />}
                {editingPromotion ? "Aksiyani tahrirlash" : "Yangi aksiya yaratish"}
              </DialogTitle>
              <DialogDescription className="text-white/60">
                Quyidagi formani to'ldirish orqali {editingPromotion ? "aksiyani yangilang" : "yangi aksiya yarating"}.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="p-6 space-y-8">

              {/* SECTION 1: BASIC INFO */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-500 font-semibold border-b border-white/10 pb-2">
                  <ImageIcon className="w-5 h-5" />
                  <h3>Asosiy Ma'lumotlar</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column: Image & Category */}
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
                      <Label className="text-white font-medium block mb-2">Aksiya Rasmi</Label>
                      <div className="flex items-start gap-4">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-slate-800 border border-white/20 flex-shrink-0">
                          {formData.image ? (
                            <Image
                              src={getImageUrl(formData.image)}
                              alt={formData.title || "Aksiya rasmi preview"}
                              fill
                              className="object-cover"
                              sizes="96px"
                              unoptimized={true}
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-white/20">
                              <ImageIcon className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-2">
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="bg-slate-800 border-white/20 text-white text-xs file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-emerald-500 file:text-white hover:file:bg-emerald-600"
                          />
                          {imageError ? (
                            <p className="text-red-400 text-xs flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {imageError}
                            </p>
                          ) : (
                            <p className="text-white/40 text-xs">
                              JPG, PNG. Max 2MB. Tavsiya: 1200x600px
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Discount & Price Group */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
                      <Label className="text-white font-medium block">Chegirma va Narx</Label>

                      {/* Discount Type Toggle */}
                      <div className="grid grid-cols-3 gap-2 bg-slate-950/50 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => handleDiscountTypeChange('none')}
                          className={cn("text-xs py-2 rounded-md font-medium transition-all",
                            discountType === 'none' ? "bg-slate-700 text-white shadow-sm" : "text-white/60 hover:text-white")}
                        >
                          Yo'q
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDiscountTypeChange('percentage')}
                          className={cn("text-xs py-2 rounded-md font-medium transition-all flex items-center justify-center gap-1",
                            discountType === 'percentage' ? "bg-emerald-600 text-white shadow-sm" : "text-white/60 hover:text-white")}
                        >
                          <Percent className="w-3 h-3" /> Foiz (%)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDiscountTypeChange('amount')}
                          className={cn("text-xs py-2 rounded-md font-medium transition-all flex items-center justify-center gap-1",
                            discountType === 'amount' ? "bg-green-600 text-white shadow-sm" : "text-white/60 hover:text-white")}
                        >
                          <DollarSign className="w-3 h-3" /> Summa
                        </button>
                      </div>

                      {/* Conditional Inputs */}
                      {discountType === 'percentage' && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                          <Label className="text-xs text-emerald-400">Chegirma Foizi (%)</Label>
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={formData.discount_percentage || ""}
                              onChange={(e) => setFormData({ ...formData, discount_percentage: parseInt(e.target.value) || 0 })}
                              className="bg-slate-900 border-emerald-500/50 focus:border-emerald-500 text-white pl-9"
                              placeholder="20"
                            />
                            <Percent className="w-4 h-4 text-emerald-500 absolute left-3 top-3" />
                          </div>
                        </div>
                      )}

                      {discountType === 'amount' && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                          <Label className="text-xs text-green-400">Chegirma Summasi (so'm)</Label>
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              value={formData.discount_amount || ""}
                              onChange={(e) => setFormData({ ...formData, discount_amount: parseInt(e.target.value) || 0 })}
                              className="bg-slate-900 border-green-500/50 focus:border-green-500 text-white pl-9"
                              placeholder="5000"
                            />
                            <span className="absolute left-3 top-2.5 text-green-500 font-bold text-sm">∑</span>
                          </div>
                        </div>
                      )}

                      {/* Final Price */}
                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <Label className="text-sm text-white font-medium">
                          Aksiya Narxi (Yakuniy) <span className="text-red-400">*</span>
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          value={formData.price || ""}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) || 0 })}
                          className="bg-slate-900 border-white/20 text-white font-bold text-lg"
                          placeholder="0"
                          required
                        />
                        {pricePreview !== null && (
                          <p className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded inline-block">
                            Hisoblangan narx: <strong>{formatPrice(pricePreview)}</strong>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Text Fields & Language */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col h-full">
                    {/* Language Tabs */}
                    <div className="flex bg-slate-900 p-1 rounded-lg mb-4 self-start">
                      {(['uz', 'ru', 'en'] as const).map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => setCurrentLang(lang)}
                          className={cn("px-4 py-1.5 rounded-md text-xs font-semibold transition-all uppercase",
                            currentLang === lang ? "bg-emerald-500 text-white shadow-md" : "text-white/50 hover:text-white hover:bg-white/5")}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4 flex-1">
                      <div className="space-y-1">
                        <Label className="text-white text-xs">Sarlavha ({getLangLabel(currentLang)})</Label>
                        <Input
                          value={currentLang === 'uz' ? multilingualData.title_uz :
                            currentLang === 'ru' ? multilingualData.title_ru : formData.title}
                          onChange={(e) => {
                            if (currentLang === 'uz') setMultilingualData({ ...multilingualData, title_uz: e.target.value });
                            else if (currentLang === 'ru') setMultilingualData({ ...multilingualData, title_ru: e.target.value });
                            else setFormData({ ...formData, title: e.target.value });
                          }}
                          className="bg-slate-900 border-white/20 text-white"
                          placeholder={currentLang === 'uz' ? "Masalan: Super Aksiya" : "Example: Super Sale"}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-white text-xs">Tavsif ({getLangLabel(currentLang)})</Label>
                        <Textarea
                          value={currentLang === 'uz' ? multilingualData.description_uz :
                            currentLang === 'ru' ? multilingualData.description_ru : formData.description}
                          onChange={(e) => {
                            if (currentLang === 'uz') setMultilingualData({ ...multilingualData, description_uz: e.target.value });
                            else if (currentLang === 'ru') setMultilingualData({ ...multilingualData, description_ru: e.target.value });
                            else setFormData({ ...formData, description: e.target.value });
                          }}
                          className="bg-slate-900 border-white/20 text-white min-h-[100px]"
                          placeholder={currentLang === 'uz' ? "Aksiya haqida batafsil..." : "About promotion..."}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-white text-xs">Tarkibi / Ingredients</Label>
                        <Input
                          value={currentLang === 'uz' ? multilingualData.ingredients_uz :
                            currentLang === 'ru' ? multilingualData.ingredients_ru : formData.ingredients}
                          onChange={(e) => {
                            if (currentLang === 'uz') setMultilingualData({ ...multilingualData, ingredients_uz: e.target.value });
                            else if (currentLang === 'ru') setMultilingualData({ ...multilingualData, ingredients_ru: e.target.value });
                            else setFormData({ ...formData, ingredients: e.target.value });
                          }}
                          className="bg-slate-900 border-white/20 text-white text-sm"
                          placeholder="Comma separated: A, B, C"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: LINKING & TIME */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">

                {/* Linking */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-500 font-semibold border-b border-white/10 pb-2">
                    <ExternalLink className="w-5 h-5" />
                    <h3>Bog'lash (Majburiy emas)</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white text-xs">Kategoriya</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Tanlang..." />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-white/20">
                          <SelectItem value="none" className="text-white">Hech qanday</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()} className="text-white">
                              {cat.name_uz || cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white text-xs">Taom (Avto to'ldirish uchun)</Label>
                      <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCombobox}
                            className="w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white overflow-hidden"
                          >
                            {formData.linked_dish && formData.linked_dish !== 'none'
                              ? menuItems.find((item) => item.id.toString() === formData.linked_dish)?.name_uz || "Taom tanlandi"
                              : "Taomni qidirish..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0 bg-slate-900 border-white/20">
                          <Command className="bg-slate-900 text-white">
                            <CommandInput placeholder="Taom nomini yozing..." className="text-white" />
                            <CommandList>
                              <CommandEmpty className="py-2 text-center text-sm text-white/50">Taom topilmadi.</CommandEmpty>
                              <CommandGroup className="text-white">
                                <CommandItem
                                  value="none"
                                  onSelect={() => {
                                    setFormData({
                                      ...formData,
                                      linked_dish: 'none',
                                      title: "",
                                      description: "",
                                      ingredients: "",
                                      price: 0
                                    })
                                    setMultilingualData({
                                      title_uz: "",
                                      title_ru: "",
                                      description_uz: "",
                                      description_ru: "",
                                      ingredients_uz: "",
                                      ingredients_ru: "",
                                    })
                                    setOpenCombobox(false)
                                  }}
                                  className="text-white hover:bg-white/10 cursor-pointer"
                                >
                                  <Check className={cn("mr-2 h-4 w-4 opacity-0")} />
                                  Hech qanday
                                </CommandItem>
                                {menuItems.map((item) => (
                                  <CommandItem
                                    key={item.id}
                                    value={item.id.toString() + " " + item.name_uz + " " + item.name} // Hack for search
                                    onSelect={() => {
                                      setFormData({ ...formData, linked_dish: item.id.toString() })
                                      autofillFromFood(item)
                                      setOpenCombobox(false)
                                    }}
                                    className="text-white hover:bg-white/10 cursor-pointer"
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        formData.linked_dish === item.id.toString() ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {item.name_uz || item.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {/* Status Only - Date fields removed */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-500 font-semibold border-b border-white/10 pb-2">
                    <Calendar className="w-5 h-5" />
                    <h3>Holat</h3>
                  </div>

                  <div className="bg-white/5 rounded-lg p-3 flex items-center justify-between border border-white/10">
                    <div className="space-y-1">
                      <Label className="text-white font-medium">Saytda ko'rsatiladi</Label>
                      <p className="text-[10px] text-white/50">Yoqilsa, aksiya foydalanuvchilar ilovasida darhol ko'rinadi.</p>
                    </div>
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-white/10 flex gap-4">
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10">
                    Bekor qilish
                  </Button>
                </DialogTrigger>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saqlanmoqda...
                    </div>
                  ) : (
                    editingPromotion ? "Aksiyani Yangilash" : "Aksiya Yaratish"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Grid List - Kept Same */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promotionsLoading ? (
          <div className="col-span-full flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="ml-2 text-white">Yuklanmoqda...</span>
          </div>
        ) : promotions.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-white/60">Hozircha aksiyalar yo'q</p>
          </div>
        ) : (
          promotions.map((promotion) => (
            <div
              key={promotion.id}
              className={`bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 shadow-xl transition-opacity ${deletingPromotionId === promotion.id ? 'opacity-50' : ''
                }`}
            >
              <div className="relative h-40">
                <Image
                  src={getImageUrl(promotion.image)}
                  alt={promotion.title_uz || "Aksiya rasmi"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized={true}
                />
                {promotion.is_active && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Faol
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{promotion.title_uz}</h3>
                    <p className="text-sm text-white/60 mb-2">{promotion.description_uz}</p>
                    <div className="text-emerald-400 font-bold text-lg">
                      {(promotion.discount_percentage ?? 0) > 0 && (
                        <p>{promotion.discount_percentage}% chegirma</p>
                      )}
                      {(promotion.discount_percentage ?? 0) === 0 && (promotion.discount_amount ?? 0) > 0 && (
                        <p>{formatPrice(promotion.discount_amount ?? 0)} chegirma</p>
                      )}
                      {promotion.price > 0 && (
                        <p>Narx: {formatPrice(promotion.price)}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(promotion)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-full h-8 w-8"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteClick(promotion)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-full h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-white max-w-md mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white text-lg">Aksiyani o'chirish</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-300">
              Siz haqiqatan ham <strong>"{promotionToDelete?.title_uz}"</strong> aksiyasini o'chirishni xohlaysizmi?
              <br />
              <span className="text-red-400 text-sm mt-2 block">
                ⚠️ Bu amalni qaytarib bo'lmaydi!
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel
              onClick={handleDeleteCancel}
              className="bg-gray-600 hover:bg-gray-700 text-white border-gray-600"
            >
              Bekor qilish
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              O'chirish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
