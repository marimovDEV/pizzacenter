"use client"

import { useState } from "react"
import { Instagram, Phone, Send, UtensilsCrossed, MessageSquare, PhoneCall, Truck, X } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import type { Language } from "@/lib/types"

const translations = {
  uz: {
    title: "Tokyo Restaurant",
    menu: "Menu",
    suggestions: "Taklif va shikoyatlar uchun",
    reservation: "Bron",
    delivery: "Dastavka",
    callNow: "Qo'ng'iroq qilish",
  },
  ru: {
    title: "Tokyo Restaurant",
    menu: "Меню",
    suggestions: "Для предложений и жалоб",
    reservation: "Бронь",
    delivery: "Доставка",
    callNow: "Позвонить",
  },
  en: {
    title: "Tokyo Restaurant",
    menu: "Menu",
    suggestions: "For suggestions and complaints",
    reservation: "Reservation",
    delivery: "Delivery",
    callNow: "Call Now",
  },
}

export function HeroSection() {
  const { language, setLanguage } = useLanguage()
  const [showPhoneModal, setShowPhoneModal] = useState(false)
  const [selectedPhone, setSelectedPhone] = useState<{ number: string; type: string }>({ number: "", type: "" })
  const t = translations[language]

  const openPhoneModal = (number: string, type: string) => {
    setSelectedPhone({ number, type })
    setShowPhoneModal(true)
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-12 md:py-20 px-4">
      <header className="absolute top-4 right-4 md:top-6 md:right-6 z-20">
        <div className="flex items-center gap-1.5 md:gap-2 bg-white/20 backdrop-blur-xl rounded-full px-2 py-2 shadow-xl border border-white/30">
          {(["uz", "ru", "en"] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                language === lang
                  ? "bg-white/40 backdrop-blur-md text-white shadow-lg scale-105 border border-white/50"
                  : "text-white/80 hover:text-white hover:bg-white/20"
              }`}
              style={{
                WebkitTextStroke: language === lang ? "1px #fbbf24" : "none",
                paintOrder: "stroke fill",
                textShadow: language === lang ? "0 0 8px rgba(251, 191, 36, 0.3)" : "none",
              }}
            >
              {lang === "uz" ? "O'zbekcha" : lang === "ru" ? "Русский" : "English"}
            </button>
          ))}
        </div>
      </header>

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center animate-fade-up">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8 text-balance drop-shadow-2xl tracking-wide">
          {t.title}
        </h1>

        <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-10">
          <a
            href="https://www.instagram.com/tokyo.urgench?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110 shadow-lg"
          >
            <Instagram className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </a>
          <a
            href="tel:+998914331110"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110 shadow-lg"
          >
            <Phone className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </a>
          <a
            href="https://t.me/PizzaCentr_Bot"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110 shadow-lg"
          >
            <Send className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </a>
        </div>

        <div className="w-full space-y-3 md:space-y-4">
          <Link
            href="/menu"
            className="w-full flex items-center gap-3 md:gap-4 px-4 md:px-8 py-3 md:py-5 rounded-2xl md:rounded-3xl bg-white/20 backdrop-blur-xl hover:bg-white/30 transition-all hover:scale-[1.02] shadow-xl border border-white/30 group"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/30 flex items-center justify-center group-hover:bg-white/40 transition-all">
              <UtensilsCrossed className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span
              className="text-base md:text-2xl font-semibold text-white text-left flex-1"
              style={{
                WebkitTextStroke: "1px #fbbf24",
                paintOrder: "stroke fill",
                textShadow: "0 0 8px rgba(251, 191, 36, 0.3)",
              }}
            >
              {t.menu}
            </span>
          </Link>

          <Link
            href="/feedback"
            className="w-full flex items-center gap-3 md:gap-4 px-4 md:px-8 py-3 md:py-5 rounded-2xl md:rounded-3xl bg-white/20 backdrop-blur-xl hover:bg-white/30 transition-all hover:scale-[1.02] shadow-xl border border-white/30 group"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/30 flex items-center justify-center group-hover:bg-white/40 transition-all">
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span
              className="text-base md:text-2xl font-semibold text-white text-left flex-1"
              style={{
                WebkitTextStroke: "1px #fbbf24",
                paintOrder: "stroke fill",
                textShadow: "0 0 8px rgba(251, 191, 36, 0.3)",
              }}
            >
              {t.suggestions}
            </span>
          </Link>

          <button
            onClick={() => openPhoneModal("+998914331110", t.reservation)}
            className="w-full flex items-center gap-3 md:gap-4 px-4 md:px-8 py-3 md:py-5 rounded-2xl md:rounded-3xl bg-white/20 backdrop-blur-xl hover:bg-white/30 transition-all hover:scale-[1.02] shadow-xl border border-white/30 group"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/30 flex items-center justify-center group-hover:bg-white/40 transition-all">
              <PhoneCall className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="text-left flex-1">
              <div
                className="text-base md:text-2xl font-semibold text-white"
                style={{
                  WebkitTextStroke: "1px #fbbf24",
                  paintOrder: "stroke fill",
                  textShadow: "0 0 8px rgba(251, 191, 36, 0.3)",
                }}
              >
                {t.reservation}
              </div>
              <div className="text-xs md:text-sm text-white/80">+998914331110</div>
            </div>
          </button>

          <button
            onClick={() => openPhoneModal("+998942311010", t.delivery)}
            className="w-full flex items-center gap-3 md:gap-4 px-4 md:px-8 py-3 md:py-5 rounded-2xl md:rounded-3xl bg-white/20 backdrop-blur-xl hover:bg-white/30 transition-all hover:scale-[1.02] shadow-xl border border-white/30 group"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/30 flex items-center justify-center group-hover:bg-white/40 transition-all">
              <Truck className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="text-left flex-1">
              <div
                className="text-base md:text-2xl font-semibold text-white"
                style={{
                  WebkitTextStroke: "1px #fbbf24",
                  paintOrder: "stroke fill",
                  textShadow: "0 0 8px rgba(251, 191, 36, 0.3)",
                }}
              >
                {t.delivery}
              </div>
              <div className="text-xs md:text-sm text-white/80">+998942311010</div>
            </div>
          </button>
        </div>
      </div>

      {showPhoneModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-lg animate-in fade-in duration-200"
          onClick={() => setShowPhoneModal(false)}
        >
          <div
            className="relative bg-white/20 backdrop-blur-2xl rounded-3xl p-8 md:p-12 max-w-md w-full shadow-2xl border border-white/30 animate-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowPhoneModal(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/30 flex items-center justify-center">
                <Phone className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{selectedPhone.type}</h3>

              <div className="text-4xl md:text-5xl font-bold text-white tracking-wide">{selectedPhone.number}</div>
            </div>
          </div>
        </div>
      )}

    </section>
  )
}
