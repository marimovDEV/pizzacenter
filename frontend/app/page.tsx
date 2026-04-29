"use client"

import { Header } from "@/components/layout/header"
import { HeroEnhanced } from "@/components/home/hero-enhanced"
import { TrustSection } from "@/components/home/trust-section"
import { PromotionDishesSection } from "@/components/home/promotion-dishes"
import { RecommendedDishesSection } from "@/components/home/recommended-dishes"

import { FloatingButtons } from "@/components/layout/floating-buttons"
import { MobileNav } from "@/components/layout/mobile-nav"
import { useLanguage } from "@/lib/language-context"
import Link from "next/link"

export default function Home() {
  const { language } = useLanguage()

  return (
    <main className="min-h-screen bg-slate-900 pb-16 md:pb-0">
      <Header />

      <HeroEnhanced />

      <TrustSection />

      {/* 1. Aksiyadagi taomlar */}
      <PromotionDishesSection />

      {/* 2. Tavsiya etiladi */}
      <RecommendedDishesSection />


      {/* Extra CTA for Menu */}
      <section className="py-20 bg-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            {language === 'uz' ? "Qorni och qoldingizmi?" : language === 'ru' ? "Проголодались?" : "Hungry?"}
          </h2>
          <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
            {language === 'uz'
              ? "Hoziroq buyurtma bering va mazali taomlardan bahramand bo'ling"
              : language === 'ru'
                ? "Закажите сейчас va наслаждайтесь вкусной едой"
                : "Order now and enjoy delicious food"}
          </p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-100 transition-colors shadow-xl"
          >
            {language === 'uz' ? "Menyuga o'tish" : language === 'ru' ? "Перейти в меню" : "Go to Menu"}
          </Link>
        </div>
      </section>

      <FloatingButtons />
      <MobileNav />
    </main>
  )
}
// Trigger Vercel Build: Wed Apr 29 19:49:34 +05 2026
