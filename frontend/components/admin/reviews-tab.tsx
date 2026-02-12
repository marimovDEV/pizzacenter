"use client"

import { useState } from "react"
import {
    Star,
    Check,
    X,
    Trash2,
    MessageSquare,
    ThumbsUp,
    ThumbsDown,
    User,
    Calendar,
    AlertCircle,
    Loader2,
    Filter,
    Phone
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    useAdminReviews,
    useAdminFeedback,
    useApiClient
} from "@/hooks/use-api"
import { Review, Feedback } from "@/lib/types"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export function ReviewsTab() {
    const { reviews, loading: reviewsLoading, refetch: refetchReviews } = useAdminReviews()
    const { feedback, loading: feedbackLoading, refetch: refetchFeedback } = useAdminFeedback()
    const api = useApiClient()

    const [isProcessing, setIsProcessing] = useState<number | null>(null)

    const handleReviewStatus = async (reviewId: number, approved: boolean) => {
        setIsProcessing(reviewId)
        try {
            await api.patch(`/reviews/${reviewId}/`, { approved })
            toast.success(approved ? "Izoh tasdiqlandi" : "Izoh rad etildi")
            refetchReviews()
        } catch (error) {
            console.error("Error updating review:", error)
            toast.error("Xatolik yuz berdi")
        } finally {
            setIsProcessing(null)
        }
    }

    const handleDeleteReview = async (reviewId: number) => {
        if (!confirm("Haqiqatan ham bu izohni o'chirmoqchimisiz?")) return
        setIsProcessing(reviewId)
        try {
            await api.delete(`/reviews/${reviewId}/`)
            toast.success("Izoh o'chirildi")
            refetchReviews()
        } catch (error) {
            console.error("Error deleting review:", error)
            toast.error("Xatolik yuz berdi")
        } finally {
            setIsProcessing(null)
        }
    }

    const handleFeedbackRead = async (feedbackId: number, isRead: boolean) => {
        setIsProcessing(feedbackId)
        try {
            await api.patch(`/feedback/${feedbackId}/`, { is_read: isRead })
            refetchFeedback()
        } catch (error) {
            console.error("Error updating feedback:", error)
        } finally {
            setIsProcessing(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Sharhlar va Fikrlar</h2>
            </div>

            <Tabs defaultValue="reviews" className="w-full">
                <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl mb-6">
                    <TabsTrigger value="reviews" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                        <Star className="w-4 h-4 mr-2" />
                        Mijoz Izohlari ({(reviews || []).filter(r => !r.approved).length} yangi)
                    </TabsTrigger>
                    <TabsTrigger value="feedback" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Fikr-mulohazalar ({(feedback || []).filter(f => !f.is_read).length} yangi)
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="reviews">
                    <div className="space-y-4">
                        {reviewsLoading ? (
                            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 text-white/40">Sharhlar mavjud emas</div>
                        ) : (
                            reviews.map(review => (
                                <div key={review.id} className={cn(
                                    "bg-white/5 border rounded-2xl p-4 transition-all",
                                    review.approved ? "border-white/10" : "border-amber-500/30 bg-amber-500/5 shadow-lg shadow-amber-500/5"
                                )}>
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div className="flex-1 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold">{review.name} {review.surname}</h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <div className="flex gap-0.5">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className={cn("w-3 h-3", i < review.rating ? "text-amber-400 fill-amber-400" : "text-white/10")} />
                                                            ))}
                                                        </div>
                                                        <span className="text-[10px] text-white/40">{format(new Date(review.date), "d-MMM, yyyy")}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-white/80 text-sm leading-relaxed italic">"{review.comment}"</p>
                                        </div>

                                        <div className="flex items-center gap-2 self-end sm:self-start">
                                            {!review.approved ? (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleReviewStatus(review.id, true)}
                                                    disabled={isProcessing === review.id}
                                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg h-9 px-4"
                                                >
                                                    <Check className="w-4 h-4 mr-2" /> Tasdiqlash
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleReviewStatus(review.id, false)}
                                                    disabled={isProcessing === review.id}
                                                    className="text-white/40 hover:text-red-400 hover:bg-red-400/10 h-9 px-4"
                                                >
                                                    Rad etish
                                                </Button>
                                            )}

                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleDeleteReview(review.id)}
                                                disabled={isProcessing === review.id}
                                                className="text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg h-9 w-9"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="feedback">
                    <div className="space-y-4">
                        {feedbackLoading ? (
                            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
                        ) : feedback.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10 text-white/40">Fikr-mulohazalar mavjud emas</div>
                        ) : (
                            feedback.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => !item.is_read && handleFeedbackRead(item.id, true)}
                                    className={cn(
                                        "bg-white/5 border rounded-2xl p-4 transition-all cursor-pointer",
                                        item.is_read ? "border-white/10 opacity-70" : "border-emerald-500/30 bg-emerald-500/5"
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center border",
                                                    item.feedback_type === "complaint" ? "bg-red-500/10 border-red-500/20 text-red-500" :
                                                        item.feedback_type === "suggestion" ? "bg-blue-500/10 border-blue-500/20 text-blue-500" :
                                                            "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                                )}>
                                                    {item.feedback_type === "complaint" ? <AlertCircle className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold flex items-center gap-2">
                                                        {item.name}
                                                        {!item.is_read && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                                                    </h4>
                                                    <p className="text-[10px] text-white/40 uppercase font-black">{item.feedback_type}</p>
                                                </div>
                                            </div>

                                            <p className="text-white/80 text-sm">{item.message}</p>

                                            <div className="flex flex-wrap gap-4 pt-2 border-t border-white/5">
                                                {item.phone && (
                                                    <div className="flex items-center gap-1.5 text-xs text-white/40">
                                                        <Phone className="w-3 h-3" /> {item.phone}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-1.5 text-xs text-white/40">
                                                    <Calendar className="w-3 h-3" /> {format(new Date(item.created_at), "d-MMM, HH:mm")}
                                                </div>
                                            </div>
                                        </div>

                                        {!item.is_read && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleFeedbackRead(item.id, true)
                                                }}
                                                className="text-emerald-400 hover:bg-emerald-400/10"
                                            >
                                                O'qildi deb belgilash
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
