"use client"

import * as React from "react"
import { useState, useMemo, memo, useEffect } from "react"
import { Plus, Pencil, Trash2, Search, Filter, X, ChevronRight, ChevronLeft, Upload, Check, ImageIcon, AlertCircle, Info, Eye } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { formatPrice, formatWeight, getImageUrl } from "@/lib/api"
import { useMenu } from "@/lib/menu-context"
import { useApiClient } from "@/hooks/use-api"
import { useAdminMenuItems, useAdminCategories } from "@/hooks/use-api"
import { useSearchFilter } from "@/hooks/use-search-filter"
import { useCategoryFilter } from "@/hooks/use-category-filter"
import { useSort } from "@/hooks/use-sort"
import { usePagination } from "@/hooks/use-pagination"
import type { MenuItem } from "@/lib/types"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Memoized Menu Item Card Component
const MenuItemCard = memo(({
  item,
  adminCategories,
  deletingItemId,
  onEdit,
  onDelete,
  onStatusToggle
}: {
  item: MenuItem
  adminCategories: any[]
  deletingItemId?: string | null
  onEdit?: (item: MenuItem) => void
  onDelete?: (item: MenuItem) => void
  onStatusToggle?: (item: MenuItem, isActive: boolean) => void
}) => {
  const categoryId = item.category
  const category = adminCategories?.find((cat) => cat.id === categoryId)

  // Format ingredients for display card
  const ingredientsList = [
    ...(item.ingredients_uz || []),
    ...(typeof item.ingredients === 'string' ? (item.ingredients as string).split(',') : item.ingredients || [])
  ].slice(0, 3).join(', ')

  return (
    <div
      className={cn(
        "bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 shadow-xl transition-opacity group relative",
        String(deletingItemId) === String(item.id) && 'opacity-50',
        !item.is_active && 'grayscale-[0.5] opacity-80'
      )}
    >
      <div className="relative h-40 sm:h-48">
        <Image src={getImageUrl(item.image)} alt={item.name_uz || item.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized={true} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {item.is_active ? (
            <span className="px-2 py-1 rounded-md bg-green-500/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">Faol</span>
          ) : (
            <span className="px-2 py-1 rounded-md bg-slate-500/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">Faol emas</span>
          )}
          {!item.available && <span className="px-2 py-1 rounded-md bg-red-500/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">Mavjud emas</span>}
        </div>

        {category && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/50 text-white text-xs font-medium backdrop-blur-md border border-white/10">
            {category.name_uz || category.name}
          </span>
        )}
      </div>

      <div className="p-4 relative">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-white leading-tight line-clamp-1" title={item.name_uz || item.name}>
            {item.name_uz || item.name}
          </h3>
          <div className="flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-500 text-xs font-bold border border-emerald-500/20">
            <span>★</span> {item.rating || 5}
          </div>
        </div>

        <p className="text-white/60 text-xs line-clamp-2 mb-3 min-h-[2.5em]">
          {item.description_uz || item.description || "Tavsif yo'q"}
        </p>

        {ingredientsList && (
          <div className="flex flex-wrap gap-1 mb-3">
            {ingredientsList.split(',').map((ing, i) => (
              <span key={i} className="text-[10px] text-white/40 bg-white/5 px-1.5 py-0.5 rounded">
                {ing.trim()}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/10">
          <div className="flex flex-col">
            <span className="text-xs text-white/40 font-medium">Narxi</span>
            <span className="text-emerald-400 font-bold text-lg">{formatPrice(item.price || 0)}</span>
          </div>

          <div className="flex items-center gap-3">
            {onStatusToggle && (
              <div className="flex items-center gap-2">
                <Switch
                  checked={item.is_active}
                  onCheckedChange={(checked) => onStatusToggle(item, checked)}
                  className="scale-75 data-[state=checked]:bg-emerald-500"
                />
              </div>
            )}
            {onEdit && onDelete && (
              <div className="flex gap-1 border-l border-white/10 pl-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(item)}
                  className="h-8 w-8 rounded-full bg-white/5 hover:bg-blue-500/20 text-blue-400 p-0"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(item)}
                  className="h-8 w-8 rounded-full bg-white/5 hover:bg-red-500/20 text-red-400 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
MenuItemCard.displayName = "MenuItemCard"


export function MenuItemsTab() {
  const { categories, deleteMenuItem } = useMenu()
  const { menuItems, refetch: refetchMenuItems, loading: menuItemsLoading } = useAdminMenuItems()
  const { categories: adminCategories } = useAdminCategories()
  const api = useApiClient()

  // UI States
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  // Wizard State
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  // Filter & Search
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const { searchQuery, debouncedQuery, handleSearchChange, clearSearch } = useSearchFilter(300)
  const { selectedCategory, handleCategoryChange } = useCategoryFilter("all")
  const { sortField, sortOrder } = useSort("name", "asc")

  // Form Data
  const [formData, setFormData] = useState({
    name: "", name_uz: "", name_ru: "",
    description: "", description_uz: "", description_ru: "",
    image: null as File | null, imagePreview: "",
    price: 0, weight: 0,
    ingredients: [] as string[], ingredients_uz: [] as string[], ingredients_ru: [] as string[],
    rating: 5, prep_time: "15",
    global_order: 0, category_order: 0,
    category: "",
    available: true, is_active: true,
  })

  // Language State for Inputs
  const [activeLang, setActiveLang] = useState<'uz' | 'ru' | 'en'>('uz')

  // Combobox State
  const [openCombobox, setOpenCombobox] = useState(false)

  // Tag Input State
  const [tagInput, setTagInput] = useState("")

  // Reset steps when closing dialog
  useEffect(() => {
    if (!isDialogOpen) {
      setCurrentStep(1)
      setActiveLang('uz')
    }
  }, [isDialogOpen])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Rasm hajmi 2MB dan oshmasligi kerak")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, image: file, imagePreview: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  // Tag Input Handlers
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const val = tagInput.trim()
      if (val) {
        const langKey = activeLang === 'uz' ? 'ingredients_uz' : activeLang === 'ru' ? 'ingredients_ru' : 'ingredients'
        const ingredients = formData[langKey as keyof typeof formData] as string[]
        if (!ingredients.includes(val)) {
          setFormData(prev => ({ ...prev, [langKey]: [...(prev[langKey as keyof typeof formData] as string[]), val] }))
        }
        setTagInput("")
      }
    }
  }

  const removeTag = (tag: string, lang: 'uz' | 'ru' | 'en') => {
    const langKey = lang === 'uz' ? 'ingredients_uz' : lang === 'ru' ? 'ingredients_ru' : 'ingredients'
    setFormData(prev => ({ ...prev, [langKey]: (prev[langKey as keyof typeof formData] as string[]).filter(t => t !== tag) }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name || formData.name_uz) // Fallback
      formDataToSend.append('name_uz', formData.name_uz)
      formDataToSend.append('name_ru', formData.name_ru)
      formDataToSend.append('description', formData.description || formData.description_uz)
      formDataToSend.append('description_uz', formData.description_uz)
      formDataToSend.append('description_ru', formData.description_ru)
      formDataToSend.append('price', formData.price.toString())
      formDataToSend.append('weight', formData.weight > 0 ? formData.weight.toString() : '')

      // Convert arrays back to strings/JSON for backend compatibility
      formDataToSend.append('ingredients', JSON.stringify(formData.ingredients))
      formDataToSend.append('ingredients_uz', JSON.stringify(formData.ingredients_uz))
      formDataToSend.append('ingredients_ru', JSON.stringify(formData.ingredients_ru))

      formDataToSend.append('rating', formData.rating.toString())
      formDataToSend.append('prep_time', formData.prep_time)
      formDataToSend.append('global_order', formData.global_order.toString())
      formDataToSend.append('category_order', formData.category_order.toString())
      formDataToSend.append('category', formData.category.toString())
      formDataToSend.append('available', formData.available.toString())
      formDataToSend.append('is_active', formData.is_active.toString())

      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }

      if (editingItem) {
        const itemId = editingItem.id
        await api.patchFormData(`/menu-items/${itemId}/`, formDataToSend)
        toast.success("Taom yangilandi")
      } else {
        await api.postFormData('/menu-items/', formDataToSend)
        toast.success("Taom qo'shildi")
      }

      // Refetch to sync with backend (this updates both hook state and context via useEffect)
      await refetchMenuItems()
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving menu item:', error)
      toast.error("Xatolik yuz berdi")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)

    // Parse ingredients safely
    const parseIngredients = (ing: string | string[]) => {
      if (Array.isArray(ing)) return ing
      if (typeof ing === 'string') return ing.split(',').map(s => s.trim()).filter(Boolean)
      return []
    }

    setFormData({
      name: item.name || "",
      name_uz: item.name_uz || "",
      name_ru: item.name_ru || "",
      description: item.description || "",
      description_uz: item.description_uz || "",
      description_ru: item.description_ru || "",
      image: null,
      imagePreview: item.image || "",
      price: item.price || 0,
      weight: item.weight || 0,
      ingredients: parseIngredients(item.ingredients),
      ingredients_uz: parseIngredients(item.ingredients_uz),
      ingredients_ru: parseIngredients(item.ingredients_ru),
      rating: item.rating || 5,
      prep_time: item.prep_time || "15",
      global_order: item.global_order || 0,
      category_order: item.category_order || 0,
      category: item.category ? item.category.toString() : "", // Convert ID to string
      available: item.available !== false,
      is_active: item.is_active !== false,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (item: MenuItem) => {
    setItemToDelete(item)
    setDeleteDialogOpen(true)
  }

  const handleToggleActive = async (item: MenuItem, isActive: boolean) => {
    try {
      await api.patch(`/menu-items/${item.id}/`, { is_active: isActive })
      await refetchMenuItems()
      toast.success(isActive ? "Taom faollashtirildi" : "Taom o'chirib qo'yildi")
    } catch (error) {
      console.error('Error toggling menu item status:', error)
      toast.error("Holatni o'zgartirishda xatolik")
    }
  }

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      setDeletingItemId(itemToDelete.id)
      try {
        const itemId = itemToDelete.id
        await api.delete(`/menu-items/${itemId}/`)

        // Immediately update context state (optimistic UI update)
        deleteMenuItem(itemToDelete.id)

        setDeleteDialogOpen(false)
        setItemToDelete(null)
        await refetchMenuItems()
        toast.success("Taom o'chirildi")
      } catch (error) {
        console.error('Error deleting menu item:', error)
        toast.error("O'chirishda xatolik")
      } finally {
        setDeletingItemId(null)
      }
    }
  }

  const resetForm = () => {
    setEditingItem(null)
    setFormData({
      name: "", name_uz: "", name_ru: "",
      description: "", description_uz: "", description_ru: "",
      image: null, imagePreview: "",
      price: 0, weight: 0,
      ingredients: [], ingredients_uz: [], ingredients_ru: [],
      rating: 5, prep_time: "15",
      global_order: 0, category_order: 0,
      category: "",
      available: true, is_active: true,
    })
    setCurrentStep(1)
    setActiveLang('uz')
  }

  // Simplified and fixed filtered logic
  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...menuItems]

    // Status filter
    if (statusFilter === "active") {
      filtered = filtered.filter(item => item.is_active)
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter(item => !item.is_active)
    }

    // Search filter
    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase().trim()
      filtered = filtered.filter((item) =>
        item.name_uz?.toLowerCase().includes(query) ||
        item.name_ru?.toLowerCase().includes(query) ||
        item.name?.toLowerCase().includes(query) ||
        item.description_uz?.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === parseInt(selectedCategory))
    }

    // Sort logic
    filtered.sort((a, b) => {
      // Basic sort by global order
      return (a.global_order || 0) - (b.global_order || 0)
    })

    return filtered
  }, [menuItems, debouncedQuery, selectedCategory, statusFilter])

  const { currentPage, totalPages, paginatedItems, nextPage, prevPage, hasNextPage, hasPrevPage } = usePagination(filteredAndSortedItems, 20)

  // Step Validation
  const validateStep = (step: number) => {
    if (step === 1) {
      if (!formData.name_uz) { toast.error("O'zbekcha nomini kiritish shart"); return false }
      if (!formData.category) { toast.error("Kategoriya tanlanishi shart"); return false }
    }
    if (step === 2) {
      if (formData.price < 0) { toast.error("Narx manfiy bo'lishi mumkin emas"); return false }
    }
    return true
  }

  const nextStep = () => {
    if (validateStep(currentStep)) setCurrentStep(p => Math.min(totalSteps, p + 1))
  }

  const prevStep = () => setCurrentStep(p => Math.max(1, p - 1))

  return (
    <div className="space-y-8">
      {/* Header with Search and Add Button */}
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Taomlar</h2>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger className="w-full sm:w-[140px] bg-white/5 border-white/10 text-white rounded-full h-11 focus:ring-emerald-500/50">
                <SelectValue placeholder="Holat" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/10 text-white">
                <SelectItem value="all">Barchasi</SelectItem>
                <SelectItem value="active">Faol</SelectItem>
                <SelectItem value="inactive">Faol emas</SelectItem>
              </SelectContent>
            </Select>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Qidirish..."
                className="pl-10 bg-white/5 border-white/10 text-white rounded-full h-11 focus:ring-emerald-500/50"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Add Button and Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={resetForm}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full h-11 px-6 shadow-lg shadow-emerald-500/20 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Taom qo'shish
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-white/10 text-white max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
                <DialogHeader className="p-6 pb-2 border-b border-white/10 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
                  <div className="flex justify-between items-center pr-8">
                    <div>
                      <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        {editingItem ? <Pencil className="w-5 h-5 text-emerald-500" /> : <Plus className="w-5 h-5 text-emerald-500" />}
                        {editingItem ? "Taomni Tahrirlash" : "Yangi Taom"}
                      </DialogTitle>
                      <DialogDescription className="text-white/60">
                        {currentStep} / {totalSteps} - Qadam
                      </DialogDescription>
                    </div>
                    {/* Step Indicator */}
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(s => (
                        <div key={s} className={cn("h-1 w-8 rounded-full transition-all", s <= currentStep ? "bg-emerald-500" : "bg-white/10")} />
                      ))}
                    </div>
                  </div>
                </DialogHeader>

                <div className="p-6">
                  {/* Wizard Steps Content */}
                  {currentStep === 1 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4">
                      {/* Left: Image Upload */}
                      <div className="space-y-4">
                        <Label className="text-white font-medium">Taom Rasmi</Label>
                        <div className="border-2 border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center min-h-[250px] bg-white/5 hover:bg-white/10 transition-colors relative group text-center">
                          {formData.imagePreview ? (
                            <>
                              <Image src={getImageUrl(formData.imagePreview)} alt="Preview" fill className="object-cover rounded-lg opacity-80 group-hover:opacity-40 transition-opacity" unoptimized={true} />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur">O'zgartirish</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-3 text-emerald-500">
                                <ImageIcon className="w-8 h-8" />
                              </div>
                              <p className="text-sm text-white/60 mb-1">Rasm yuklash uchun bosing</p>
                            </>
                          )}
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                        </div>
                      </div>

                      {/* Right: Info */}
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label className="text-white">Kategoriya <span className="text-red-400">*</span></Label>
                          <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-between bg-white/5 border-white/20 text-white h-11">
                                {formData.category ? adminCategories.find(c => c.id === parseInt(formData.category))?.name_uz || "Tanlandi" : "Tanlang..."}
                                <Search className="ml-2 h-4 w-4 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0 bg-slate-900 border-white/20 shadow-2xl pointer-events-auto" align="start">
                              <Command className="bg-slate-900 text-white">
                                <CommandInput placeholder="Qidirish..." className="h-11" />
                                <CommandList className="max-h-[300px] overflow-y-auto overscroll-contain pointer-events-auto">
                                  <CommandEmpty>Topilmadi</CommandEmpty>
                                  <CommandGroup>
                                    {adminCategories.map(cat => (
                                      <CommandItem
                                        key={cat.id}
                                        onSelect={() => {
                                          setFormData({ ...formData, category: cat.id.toString() });
                                          setOpenCombobox(false)
                                        }}
                                        className="text-white hover:bg-white/10 cursor-pointer py-2.5"
                                      >
                                        <Check className={cn("mr-2 h-4 w-4", formData.category === cat.id.toString() ? "opacity-100" : "opacity-0")} />
                                        {cat.name_uz || cat.name}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-white">Taom Nomi <span className="text-red-400">*</span></Label>
                          <div className="flex bg-slate-800 rounded p-0.5 w-fit">
                            {(['uz', 'ru', 'en'] as const).map(lang => (
                              <button key={lang} type="button" onClick={() => setActiveLang(lang)} className={cn("px-3 py-1 text-xs rounded uppercase font-medium", activeLang === lang ? "bg-emerald-500 text-white" : "text-white/50")}>{lang}</button>
                            ))}
                          </div>
                          <Input
                            value={activeLang === 'uz' ? formData.name_uz : activeLang === 'ru' ? formData.name_ru : formData.name}
                            onChange={(e) => {
                              if (activeLang === 'uz') setFormData({ ...formData, name_uz: e.target.value })
                              else if (activeLang === 'ru') setFormData({ ...formData, name_ru: e.target.value })
                              else setFormData({ ...formData, name: e.target.value })
                            }}
                            className="bg-white/5 border-white/20 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-6 max-w-2xl mx-auto">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2 col-span-2">
                          <Label className="text-white">Narxi (so'm)</Label>
                          <Input type="number" value={formData.price || ""} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="bg-white/5 border-white/20 text-white h-14 text-2xl font-bold" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white">Vazni (gr)</Label>
                          <Input type="number" value={formData.weight || ""} onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })} className="bg-white/5 border-white/20 text-white" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-white">Vaqt (min)</Label>
                          <Input value={formData.prep_time} onChange={(e) => setFormData({ ...formData, prep_time: e.target.value })} className="bg-white/5 border-white/20 text-white" />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Label className="text-white font-medium">Tavsif (Tarkibi emas) <span className="text-[10px] text-white/30 ml-2">Ixtiyoriy</span></Label>
                        <div className="flex justify-center mb-2">
                          <div className="flex bg-slate-800 rounded p-1">
                            {(['uz', 'ru', 'en'] as const).map(lang => (
                              <button key={lang} type="button" onClick={() => setActiveLang(lang)} className={cn("px-6 py-1.5 text-sm rounded uppercase font-medium", activeLang === lang ? "bg-emerald-500 text-white" : "text-white/50")}>{lang}</button>
                            ))}
                          </div>
                        </div>
                        <Textarea
                          value={activeLang === 'uz' ? formData.description_uz : activeLang === 'ru' ? formData.description_ru : formData.description}
                          onChange={(e) => {
                            if (activeLang === 'uz') setFormData({ ...formData, description_uz: e.target.value })
                            else if (activeLang === 'ru') setFormData({ ...formData, description_ru: e.target.value })
                            else setFormData({ ...formData, description: e.target.value })
                          }}
                          className="bg-white/5 border-white/20 text-white min-h-[100px]"
                          placeholder="Taom haqida qisqacha ma'lumot..."
                        />
                      </div>

                      {/* Ingredients Section */}
                      <div className="space-y-4 pt-4 border-t border-white/5">
                        <Label className="text-white font-medium flex items-center gap-2">
                          Taom Tarkibi (Masalan: go'sht, piyoz)
                          <span className="text-[10px] text-white/30 italic">Step 3/4</span>
                        </Label>
                        <div className="relative">
                          <Input
                            placeholder="Add ingredient and press Enter..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            className="bg-white/5 border-white/10 text-white pl-4 pr-12 h-11 focus:ring-emerald-500/50"
                          />
                          <Button
                            size="sm"
                            type="button"
                            onClick={() => {
                              const val = tagInput.trim()
                              if (val) {
                                const langKey = activeLang === 'uz' ? 'ingredients_uz' : activeLang === 'ru' ? 'ingredients_ru' : 'ingredients'
                                const ingredients = formData[langKey as keyof typeof formData] as string[]
                                if (!ingredients.includes(val)) {
                                  setFormData(prev => ({ ...prev, [langKey]: [...(prev[langKey as keyof typeof formData] as string[]), val] }))
                                }
                                setTagInput("")
                              }
                            }}
                            className="absolute right-1 top-1 h-9 bg-white/10 hover:bg-emerald-500 transition-colors"
                          >
                            Add
                          </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4 min-h-[40px] p-3 rounded-xl bg-white/5 border border-white/5">
                          {(activeLang === 'uz' ? formData.ingredients_uz : activeLang === 'ru' ? formData.ingredients_ru : formData.ingredients).length === 0 && (
                            <span className="text-white/20 text-xs italic">Hech narsa qo'shilmagan</span>
                          )}
                          {(activeLang === 'uz' ? formData.ingredients_uz : activeLang === 'ru' ? formData.ingredients_ru : formData.ingredients).map((tag, i) => (
                            <span key={i} className="group flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/20 hover:bg-emerald-500/30 transition-all">
                              {tag}
                              <button onClick={() => removeTag(tag, activeLang)} className="hover:text-red-400 transition-colors">
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
                            <div className="flex items-center justify-between">
                              <Label className="text-white">Faol</Label>
                              <Switch checked={formData.is_active} onCheckedChange={(c) => setFormData({ ...formData, is_active: c })} />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-white">Mavjud</Label>
                              <Switch checked={formData.available} onCheckedChange={(c) => setFormData({ ...formData, available: c })} />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-white/5 p-5 rounded-xl border border-white/10 space-y-5">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-white">Global tartib raqami</Label>
                                <span className="text-[10px] text-white/30 font-mono">global_order</span>
                              </div>
                              <Input
                                type="number"
                                value={formData.global_order || ""}
                                placeholder="Masalan: 10"
                                onChange={(e) => setFormData({ ...formData, global_order: e.target.value === "" ? 0 : parseInt(e.target.value) })}
                                className="bg-white/5 border-white/20 text-white h-11"
                              />
                              <p className="text-[10px] text-white/40 italic">Agar bo'sh qolsa, oxiriga qo'shiladi</p>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-white">Kategoriya ichida tartibi</Label>
                                <span className="text-[10px] text-white/30 font-mono">category_order</span>
                              </div>
                              <Input
                                type="number"
                                value={formData.category_order || ""}
                                placeholder="Masalan: 5"
                                onChange={(e) => setFormData({ ...formData, category_order: e.target.value === "" ? 0 : parseInt(e.target.value) })}
                                className="bg-white/5 border-white/20 text-white h-11"
                              />
                              <p className="text-[10px] text-white/40 italic">Bu kategoriya ichidagi o'rnini belgilaydi</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter className="p-6 border-t border-white/10 bg-slate-900/50">
                  <Button variant="ghost" onClick={currentStep === 1 ? () => setIsDialogOpen(false) : prevStep} className="text-white">{currentStep === 1 ? "Bekor qilish" : "Ortga"}</Button>
                  <Button onClick={currentStep < totalSteps ? nextStep : handleSubmit} className="bg-emerald-600 text-white">{currentStep < totalSteps ? "Keyingisi" : "Saqlash"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Category List */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => handleCategoryChange("all")}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border border-white/5",
              selectedCategory === "all"
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            )}
          >
            Barchasi
          </button>
          {adminCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id.toString())}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border border-white/5",
                selectedCategory === cat.id.toString()
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              )}
            >
              {cat.name_uz || cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List for Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedItems.map((item) => (
          <MenuItemCard
            key={item.id}
            item={item}
            adminCategories={adminCategories}
            deletingItemId={String(deletingItemId)}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onStatusToggle={handleToggleActive}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={prevPage} className={cn(!hasPrevPage && "pointer-events-none opacity-50")} />
            </PaginationItem>
            <div className="flex items-center gap-1 mx-4">
              <span className="text-white/60 text-sm">{currentPage} / {totalPages} sahifa</span>
            </div>
            <PaginationItem>
              <PaginationNext onClick={nextPage} className={cn(!hasNextPage && "pointer-events-none opacity-50")} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-900 border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Haqiqatan ham o'chirmoqchimisiz?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">Bu amalni ortga qaytarib bo'lmaydi.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">Bekor qilish</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700 text-white">O'chirish</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
