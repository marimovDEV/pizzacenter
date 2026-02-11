"use client"

import type React from "react"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useFeedback } from "@/lib/feedback-context"

export default function FeedbackPage() {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [type, setType] = useState<"suggestion" | "complaint">("suggestion")
  const { addFeedback } = useFeedback()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addFeedback({
        name,
        phone,
        message,
        feedback_type: type,
        email: null,
        rating: null,
        is_read: false
      })
      toast.success("Xabaringiz yuborildi! Tez orada siz bilan bog'lanamiz.")
      setName("")
      setPhone("")
      setMessage("")
    } catch (error) {
      console.error('Error submitting feedback:', error)
      toast.error("Xatolik yuz berdi. Qaytadan urinib ko'ring.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="relative">
        <div className="absolute inset-0 bg-[url('/hero_background.jpg')] bg-cover bg-center opacity-10" />

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/"
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center hover:bg-white/30 transition-all border border-white/30"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Taklif va Shikoyatlar</h1>
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/20 shadow-xl">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setType("suggestion")}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${type === "suggestion"
                    ? "bg-white/30 text-white border-2 border-white/50"
                    : "bg-white/10 text-white/70 border border-white/20"
                  }`}
              >
                Taklif
              </button>
              <button
                onClick={() => setType("complaint")}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${type === "complaint"
                    ? "bg-white/30 text-white border-2 border-white/50"
                    : "bg-white/10 text-white/70 border border-white/20"
                  }`}
              >
                Shikoyat
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-white mb-2 block">
                  Ismingiz
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-white/10 backdrop-blur-xl border-white/30 text-white placeholder:text-white/60 h-12 rounded-xl"
                  placeholder="Ismingizni kiriting"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-white mb-2 block">
                  Telefon raqam
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="bg-white/10 backdrop-blur-xl border-white/30 text-white placeholder:text-white/60 h-12 rounded-xl"
                  placeholder="+998 __ ___ __ __"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-white mb-2 block">
                  Xabar
                </Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  className="bg-white/10 backdrop-blur-xl border-white/30 text-white placeholder:text-white/60 rounded-xl resize-none"
                  placeholder={type === "suggestion" ? "Taklifingizni yozing..." : "Shikoyatingizni yozing..."}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-14 bg-white/20 hover:bg-white/30 text-white font-semibold text-lg rounded-xl backdrop-blur-xl border border-white/30 transition-all"
              >
                <Send className="w-5 h-5 mr-2" />
                Yuborish
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
