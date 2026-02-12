"use client"

import { useState } from "react"
import { useFeedback } from "@/lib/feedback-context"
import { useApiClient } from "@/hooks/use-api"
import { ApiClient } from "@/lib/api"

// Use localized API client
const correctApiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api')
import { Trash2, Mail, Phone, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function FeedbackTab() {
  const { feedbacks, deleteFeedback, loading, refreshFeedbacks } = useFeedback()
  const api = useApiClient()
  const [deletingFeedbackId, setDeletingFeedbackId] = useState<number | null>(null)

  const handleDelete = async (id: number) => {
    if (confirm("Ushbu fikrni o'chirmoqchimisiz?")) {
      setDeletingFeedbackId(id)
      try {
        await correctApiClient.deleteFeedback(id)
        await deleteFeedback(id) // Wait for refresh

        // Force refresh to ensure UI updates immediately
        setTimeout(() => {
          refreshFeedbacks()
        }, 200)

        toast.success("Fikr o'chirildi")
      } catch (error: any) {
        console.error('Error deleting feedback:', error)
        // If it's a 404 error, it means the feedback was already deleted
        if (error.message && error.message.includes('404')) {
          toast.success("Fikr o'chirildi")
          await refreshFeedbacks()
        } else {
          toast.error("Xatolik yuz berdi. Qaytadan urinib ko'ring.")
        }
      } finally {
        setDeletingFeedbackId(null)
      }
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "complaint":
        return "bg-red-500/20 border-red-500/30 text-red-300"
      case "compliment":
        return "bg-yellow-500/20 border-yellow-500/30 text-yellow-300"
      case "question":
        return "bg-blue-500/20 border-blue-500/30 text-blue-300"
      default:
        return "bg-green-500/20 border-green-500/30 text-green-300"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "complaint":
        return "⚠️"
      case "compliment":
        return "⭐"
      case "question":
        return "❓"
      default:
        return "💡"
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "complaint":
        return "Shikoyat"
      case "compliment":
        return "Maqtov"
      case "question":
        return "Savol"
      default:
        return "Taklif"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Takliflar va Shikoyatlar</h2>
        <div className="flex items-center gap-4">
          <div className="text-white/60">Jami: {feedbacks.length}</div>
          <Button
            onClick={refreshFeedbacks}
            disabled={loading}
            variant="outline"
            size="sm"
            className="text-white border-white/20 hover:bg-white/10"
          >
            {loading ? "Yuklanmoqda..." : "Yangilash"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 border border-white/20 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto mb-4"></div>
          <p className="text-white/60 text-lg">Fikrlar yuklanmoqda...</p>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-12 border border-white/20 text-center">
          <MessageSquare className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <p className="text-white/60 text-lg">Hozircha fikrlar yo'q</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className={`backdrop-blur-xl rounded-2xl p-6 border hover:bg-opacity-20 transition-all ${feedback.feedback_type === "complaint"
                ? "bg-red-500/10 border-red-500/30"
                : feedback.feedback_type === "compliment"
                  ? "bg-yellow-500/10 border-yellow-500/30"
                  : feedback.feedback_type === "question"
                    ? "bg-blue-500/10 border-blue-500/30"
                    : "bg-green-500/10 border-green-500/30"
                } ${deletingFeedbackId === feedback.id ? 'opacity-50' : ''
                }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{feedback.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getTypeColor(feedback.feedback_type)}`}>
                      <span className="mr-1">{getTypeIcon(feedback.feedback_type)}</span>
                      {getTypeLabel(feedback.feedback_type)}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-white/70">
                    {feedback.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <a href={`tel:${feedback.phone}`} className="hover:text-emerald-400 transition-colors">
                          {feedback.phone}
                        </a>
                      </div>
                    )}
                    {feedback.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${feedback.email}`} className="hover:text-emerald-400 transition-colors">
                          {feedback.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDelete(feedback.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>

              <div className={`rounded-xl p-4 border ${feedback.feedback_type === "complaint"
                ? "bg-red-500/5 border-red-500/20"
                : feedback.feedback_type === "compliment"
                  ? "bg-yellow-500/5 border-yellow-500/20"
                  : feedback.feedback_type === "question"
                    ? "bg-blue-500/5 border-blue-500/20"
                    : "bg-green-500/5 border-green-500/20"
                }`}>
                <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{feedback.message}</p>
              </div>

              <div className="mt-4 text-xs text-white/50">
                {new Date(feedback.created_at).toLocaleString("uz-UZ", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
