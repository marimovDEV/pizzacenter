"use client"

import { useState, useCallback } from "react"

/**
 * Category filter hook for managing category selection
 */
export function useCategoryFilter(defaultCategory: string = "all") {
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory)

  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
  }, [])

  const resetCategory = useCallback(() => {
    setSelectedCategory(defaultCategory)
  }, [defaultCategory])

  return {
    selectedCategory,
    handleCategoryChange,
    resetCategory,
  }
}

