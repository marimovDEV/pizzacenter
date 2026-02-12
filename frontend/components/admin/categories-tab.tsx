"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { Plus, Pencil, Trash2, AlertTriangle, Loader2, Search, ArrowUpDown, Info, Check, X, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useMenu } from "@/lib/menu-context"
import { useApiClient } from "@/hooks/use-api"
import { useAdminCategories } from "@/hooks/use-api"
import type { Category } from "@/lib/types"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export function CategoriesTab() {
  const { menuItems, deleteCategory } = useMenu()
  const { categories, refetch: refetchCategories, loading: categoriesLoading } = useAdminCategories()
  const api = useApiClient()

  // UI States
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null)

  // Filter & Sort
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "order" | "products">("order")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    name_uz: "",
    name_ru: "",
    is_active: true,
    order: 0,
  })

  // Language State for Inputs
  const [activeLang, setActiveLang] = useState<'uz' | 'ru' | 'en'>('uz')

  // Warning for unsaved changes
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false)

  // Initialize form when dialog opens
  useEffect(() => {
    if (isDialogOpen && !editingCategory) {
      setFormData({
        name: "",
        name_uz: "",
        name_ru: "",
        is_active: true,
        order: categories.length + 1,
      })
      setActiveLang('uz')
    }
  }, [isDialogOpen, editingCategory, categories.length])

  const handleClose = () => {
    // Check for dirty form
    const isDirty = formData.name_uz || formData.name || formData.name_ru
    if (isDirty && !editingCategory) {
      setShowUnsavedWarning(true)
    } else {
      setIsDialogOpen(false)
      resetForm()
    }
  }

  const confirmClose = () => {
    setShowUnsavedWarning(false)
    setIsDialogOpen(false)
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name_uz) {
      toast.error("Iltimos, O'zbekcha nomini kiriting")
      setActiveLang('uz')
      return
    }

    setIsSubmitting(true)

    try {
      const categoryData = {
        name: formData.name || formData.name_uz, // Fallback
        name_uz: formData.name_uz,
        name_ru: formData.name_ru,
        is_active: formData.is_active,
        order: formData.order || (categories.length + 1),
      }

      let successMessage = ""

      if (editingCategory) {
        const categoryId = editingCategory.id
        await api.patch(`/categories/${categoryId}/`, categoryData)
        successMessage = "Kategoriya yangilandi"
      } else {
        await api.post('/categories/', categoryData)
        successMessage = "Kategoriya qo'shildi"
      }

      // Refresh categories from API
      await refetchCategories()

      toast.success(successMessage)
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error("Xatolik yuz berdi. Qaytadan urinib ko'ring.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name || "",
      name_uz: category.name_uz || "",
      name_ru: category.name_ru || "",
      is_active: category.is_active !== false,
      order: category.order || 0,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      setIsDeleting(true)
      setDeletingCategoryId(categoryToDelete.id)
      try {
        const categoryId = categoryToDelete.id

        // Check local existence first
        const currentCategory = categories.find(cat => cat.id === categoryToDelete.id)
        if (!currentCategory) {
          toast.error("Bu kategoriya allaqachon o'chirilgan")
          setDeleteDialogOpen(false)
          await refetchCategories()
          return
        }

        await api.delete(`/categories/${categoryId}/`)

        // Immediately update context state (optimistic UI update)
        deleteCategory(categoryToDelete.id)

        setDeleteDialogOpen(false)
        setCategoryToDelete(null)
        await refetchCategories()

        toast.success("Kategoriya o'chirildi")
      } catch (error) {
        console.error('Error deleting category:', error)
        if (error instanceof Error && error.message.includes('404')) {
          toast.success("Kategoriya o'chirildi")
          await refetchCategories()
        } else {
          toast.error("Xatolik yuz berdi")
        }
      } finally {
        setIsDeleting(false)
        setDeletingCategoryId(null)
      }
    }
  }

  const resetForm = () => {
    setEditingCategory(null)
    setFormData({
      name: "", name_uz: "", name_ru: "",
      is_active: true,
      order: categories.length + 1,
    })
    setActiveLang('uz')
  }

  // Filtered and sorted categories
  const filteredAndSortedCategories = useMemo(() => {
    let filtered = [...categories]
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((cat) =>
        cat.name?.toLowerCase().includes(query) ||
        cat.name_uz?.toLowerCase().includes(query) ||
        cat.name_ru?.toLowerCase().includes(query)
      )
    }

    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          const nameA = (a.name_uz || a.name || "").toLowerCase()
          const nameB = (b.name_uz || b.name || "").toLowerCase()
          comparison = nameA.localeCompare(nameB)
          break
        case "order":
          comparison = (a.order || 0) - (b.order || 0)
          break
        case "products":
          // Simple Logic for now
          comparison = 0
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })
    return filtered
  }, [categories, searchQuery, sortBy, sortOrder])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Kategoriyalar</h2>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) handleClose(); else setIsDialogOpen(true)
        }}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full text-sm sm:text-base shadow-lg shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Kategoriya qo'shish</span>
              <span className="sm:hidden">Qo'shish</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-slate-900 border-white/20 text-white max-w-lg">
            {showUnsavedWarning ? (
              <div className="space-y-4 animate-in fade-in zoom-in-95">
                <div className="flex flex-col items-center text-center p-4">
                  <AlertTriangle className="w-12 h-12 text-emerald-500 mb-4" />
                  <h3 className="text-lg font-bold">Saqlanmagan o'zgarishlar bor</h3>
                  <p className="text-white/60 text-sm mt-2">Formadan chiqsangiz kiritilgan ma'lumotlar yo'qoladi.</p>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button variant="ghost" onClick={() => setShowUnsavedWarning(false)} className="text-white hover:bg-white/10">Qaytish</Button>
                  <Button variant="destructive" onClick={confirmClose}>Chiqish</Button>
                </div>
              </div>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="text-white flex items-center gap-2">
                    {editingCategory ? <Pencil className="w-5 h-5 text-emerald-500" /> : <Plus className="w-5 h-5 text-emerald-500" />}
                    {editingCategory ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}
                  </DialogTitle>
                  <DialogDescription className="text-white/60">
                    {editingCategory ? "Kategoriya ma'lumotlarini o'zgartiring" : "Yangi kategoriya yarating"}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  {/* Language Tabs */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-white">Nomi <span className="text-red-400">*</span></Label>
                      <div className="flex bg-slate-800 rounded p-0.5">
                        {(['uz', 'ru', 'en'] as const).map(lang => (
                          <button
                            type="button"
                            key={lang}
                            onClick={() => setActiveLang(lang)}
                            className={cn("px-3 py-1 text-xs rounded uppercase font-medium transition-all",
                              activeLang === lang ? "bg-emerald-500 text-white shadow" : "text-white/50 hover:text-white")}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="relative">
                      <Input
                        value={activeLang === 'uz' ? formData.name_uz : activeLang === 'ru' ? formData.name_ru : formData.name}
                        onChange={(e) => {
                          if (activeLang === 'uz') setFormData({ ...formData, name_uz: e.target.value })
                          else if (activeLang === 'ru') setFormData({ ...formData, name_ru: e.target.value })
                          else setFormData({ ...formData, name: e.target.value })
                        }}
                        placeholder={activeLang === 'uz' ? "Masalan: Ichimliklar" : activeLang === 'ru' ? "Например: Напитки" : "Example: Drinks"}
                        className={cn("bg-white/5 border-white/20 text-white h-11 text-lg",
                          activeLang === 'uz' && !formData.name_uz && "border-emerald-500/50 focus-visible:ring-emerald-500")}
                        autoFocus
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs font-mono uppercase pointer-events-none">
                        {activeLang}
                      </div>
                    </div>

                    {!formData.name_uz && activeLang === 'uz' && (
                      <p className="text-xs text-emerald-500 flex items-center gap-1 animate-pulse">
                        <AlertTriangle className="w-3 h-3" /> O'zbekcha nom majburiy
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Order Input */}
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Tartib raqami</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 border-white/20 text-white bg-transparent hover:bg-white/10"
                          onClick={() => setFormData(p => ({ ...p, order: Math.max(1, p.order - 1) }))}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 bg-white/5 border border-white/20 rounded h-10 flex items-center justify-center text-white font-mono font-bold">
                          {formData.order}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 border-white/20 text-white bg-transparent hover:bg-white/10"
                          onClick={() => setFormData(p => ({ ...p, order: p.order + 1 }))}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-[10px] text-white/40 text-center">
                        Maksimal tartib: {categories.length + (editingCategory ? 0 : 1)}
                      </p>
                    </div>

                    {/* Active Switch */}
                    <div className="space-y-2">
                      <Label className="text-white text-sm">Holati</Label>
                      <div className={cn("flex items-center justify-between p-2.5 rounded-lg border transition-colors",
                        formData.is_active ? "bg-green-500/10 border-green-500/30" : "bg-white/5 border-white/10")}>
                        <span className={cn("text-xs font-medium", formData.is_active ? "text-green-400" : "text-white/50")}>
                          {formData.is_active ? "Faol (Ko'rinadi)" : "Nofaol (Yashirin)"}
                        </span>
                        <Switch
                          checked={formData.is_active}
                          onCheckedChange={(c) => setFormData({ ...formData, is_active: c })}
                        />
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button type="button" variant="ghost" onClick={handleClose} className="text-white hover:bg-white/10">Bekor qilish</Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !formData.name_uz}
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white min-w-[100px]"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                        <>{editingCategory ? "Saqlash" : "Qo'shish"} <Check className="w-4 h-4 ml-2" /></>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Sort Controls */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
          <Input
            placeholder="Kategoriya qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-emerald-500/50"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap gap-3">
          {/* Sort By */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-white/60" />
            <Select value={sortBy} onValueChange={(value: "name" | "order" | "products") => setSortBy(value)}>
              <SelectTrigger className="w-[150px] bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Tartiblash" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-white/20">
                <SelectItem value="order" className="text-white">Tartib</SelectItem>
                <SelectItem value="name" className="text-white">Nomi</SelectItem>
                <SelectItem value="products" className="text-white">Mahsulotlar soni</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </Button>

          {/* Results Count */}
          <div className="ml-auto flex items-center text-white/60 text-sm">
            {filteredAndSortedCategories.length} ta kategoriya
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {categoriesLoading ? (
          <div className="col-span-full flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="ml-2 text-white">Yuklanmoqda...</span>
          </div>
        ) : filteredAndSortedCategories.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-white/60">
              {searchQuery
                ? "Qidiruv natijasi topilmadi"
                : "Hozircha kategoriyalar yo'q"}
            </p>
          </div>
        ) : (
          filteredAndSortedCategories.map((category, index) => (
            <div
              key={category.id}
              className={`bg-white/10 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border border-white/20 shadow-xl transition-all hover:bg-white/15 group ${deletingCategoryId === category.id ? 'opacity-50' : ''
                }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base sm:text-lg font-bold text-white truncate">{category.name_uz || category.name}</h3>
                    {!category.is_active && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 rounded uppercase font-bold">Nofaol</span>}
                  </div>
                  <p className="text-xs sm:text-sm text-white/60 flex items-center gap-4">
                    <span>#{index + 1}</span>
                    <span>•</span>
                    <span>
                      {(() => {
                        if (!menuItems || !Array.isArray(menuItems)) return 0
                        const categoryId = category.id
                        return menuItems.filter((item) => {
                          if (!item || !item.category) return false
                          const itemCategoryId = item.category
                          return itemCategoryId === categoryId
                        }).length
                      })()} ta mahsulot
                    </span>
                  </p>
                </div>
                <div className="flex gap-1 sm:gap-2 flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(category)}
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-full h-8 w-8 p-0"
                    title="Tahrirlash"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteClick(category)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-full h-8 w-8 p-0"
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <AlertDialogTitle className="text-lg font-bold">
                Kategoriyani o'chirish
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-white/70">
              <strong>"{categoryToDelete?.name_uz || categoryToDelete?.name}"</strong> kategoriyasini o'chirishni xohlaysizmi?
              <br />
              <span className="text-red-400 text-sm mt-2 block">
                ⚠️ Bu amalni qaytarib bo'lmaydi!
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogCancel
              onClick={() => setDeleteDialogOpen(false)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Bekor qilish
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  O'chirilmoqda...
                </>
              ) : (
                "O'chirish"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
