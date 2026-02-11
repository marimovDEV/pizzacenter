"use client"

import { useState, useEffect, useCallback } from "react"

/**
 * Debounced search hook for filtering items
 * @param delay - Debounce delay in milliseconds (default: 300ms)
 */
export function useSearchFilter(delay: number = 300) {
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, delay)

    return () => clearTimeout(timer)
  }, [searchQuery, delay])

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQuery("")
    setDebouncedQuery("")
  }, [])

  return {
    searchQuery,
    debouncedQuery,
    handleSearchChange,
    clearSearch,
  }
}

