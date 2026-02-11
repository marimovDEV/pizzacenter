"use client"

import { useState, useCallback } from "react"

export type SortField = "name" | "price" | "created" | "popularity"
export type SortOrder = "asc" | "desc"

/**
 * Sort hook for managing sorting state
 */
export function useSort(defaultField: SortField = "name", defaultOrder: SortOrder = "asc") {
  const [sortField, setSortField] = useState<SortField>(defaultField)
  const [sortOrder, setSortOrder] = useState<SortOrder>(defaultOrder)

  const handleSortChange = useCallback((field: SortField) => {
    // If clicking the same field, toggle order; otherwise set new field with asc order
    if (field === sortField) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }, [sortField])

  const setSort = useCallback((field: SortField, order: SortOrder) => {
    setSortField(field)
    setSortOrder(order)
  }, [])

  const resetSort = useCallback(() => {
    setSortField(defaultField)
    setSortOrder(defaultOrder)
  }, [defaultField, defaultOrder])

  return {
    sortField,
    sortOrder,
    handleSortChange,
    setSort,
    resetSort,
  }
}

