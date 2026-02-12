"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Feedback } from "./types"
import type { Language, MenuItem, Promotion } from "@/lib/types"
import { apiClient } from "./api"

// Use shared apiClient instead of forcing remote HTTPS
const correctApiClient = apiClient;

interface FeedbackContextType {
  feedbacks: Feedback[]
  loading: boolean
  addFeedback: (feedback: Omit<Feedback, "id" | "created_at" | "updated_at">) => Promise<void>
  markAsRead: (id: number) => void
  deleteFeedback: (id: number) => void
  refreshFeedbacks: () => Promise<void>
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined)

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(false)

  const fetchFeedbacks = async () => {
    try {
      setLoading(true)

      // Add cache-busting to force fresh data
      const timestamp = new Date().getTime()
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/feedback/?t=${timestamp}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        cache: 'no-cache',
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setFeedbacks(data.results || [])
    } catch (error) {
      console.error('Error fetching feedbacks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const addFeedback = async (feedback: Omit<Feedback, "id" | "created_at" | "updated_at">) => {
    try {
      const newFeedback = await correctApiClient.createFeedback(feedback)
      // Don't update local state, just refresh from API to ensure consistency
      await fetchFeedbacks()
    } catch (error) {
      console.error('Error creating feedback:', error)
      throw error
    }
  }

  const markAsRead = (id: number) => {
    setFeedbacks((prev) => prev.map((f) => (f.id === id ? { ...f, is_read: true } : f)))
  }

  const deleteFeedback = async (id: number) => {
    // Don't update local state, just refresh from API to ensure consistency
    await fetchFeedbacks()
  }

  const refreshFeedbacks = async () => {
    await fetchFeedbacks()
  }

  return (
    <FeedbackContext.Provider value={{
      feedbacks,
      loading,
      addFeedback,
      markAsRead,
      deleteFeedback,
      refreshFeedbacks
    }}>
      {children}
    </FeedbackContext.Provider>
  )
}

export function useFeedback() {
  const context = useContext(FeedbackContext)
  if (!context) {
    throw new Error("useFeedback must be used within FeedbackProvider")
  }
  return context
}
