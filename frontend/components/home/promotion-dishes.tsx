"use client"

import { useRef, useEffect } from "react"
import { useMenu } from "@/lib/menu-context"
import { useLanguage } from "@/lib/language-context"
import { MenuItemCard } from "@/components/menu-item-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Loader2, Sparkles } from "lucide-react"

const translations = {
    uz: {
        title: "Aksiyadagi taomlar",
        subtitle: "Hozirgi qulay narxdagi va maxsus takliflarimiz",
        viewAll: "Barchasini ko'rish",
    },
    ru: {
        title: "Блюда по акции",
        subtitle: "Наши текущие специальные предложения и скидки",
        viewAll: "Посмотреть все",
    },
    en: {
        title: "Dishes on Promotion",
        subtitle: "Our current special offers and discounted items",
        viewAll: "View All",
    },
}

export function PromotionDishesSection() {
    const { menuItems, promotions, loading } = useMenu()
    const { language } = useLanguage()
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const t = translations[language]

    // Filter items that have an active promotion
    const itemsOnPromotion = (() => {
        if (!menuItems || !promotions) return []

        const activePromos = promotions.filter(p => p.is_active)
        const promotedItemIds = activePromos
            .map(p => p.linked_dish)
            .filter(id => id !== undefined && id !== null) as number[]

        return menuItems.filter(item => {
            if (!item.is_active || !item.available) return false
            return promotedItemIds.includes(item.id)
        }).map(item => {
            // Find the specific promotion for this item to get discount info
            const promo = activePromos.find(p => p.linked_dish === item.id)
            return {
                item,
                discountBadge: promo?.discount_display || (promo?.discount_percentage ? `-${promo.discount_percentage}%` : "AKSIYA"),
                discountPrice: promo?.discounted_price || promo?.price
            }
        })
    })()

    // Auto-scroll logic for mobile/tablet
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current
        if (!scrollContainer || itemsOnPromotion.length <= 1) return

        const interval = setInterval(() => {
            if (window.innerWidth >= 1024) return // lg breakpoint

            const { scrollLeft, scrollWidth, clientWidth } = scrollContainer

            if (scrollLeft + clientWidth >= scrollWidth - 10) {
                scrollContainer.scrollTo({ left: 0, behavior: "smooth" })
            } else {
                scrollContainer.scrollBy({ left: clientWidth * 0.5, behavior: "smooth" })
            }
        }, 4000) // Slightly different interval than popular dishes for variety

        return () => clearInterval(interval)
    }, [itemsOnPromotion.length])

    if (loading) {
        return (
            <section className="py-16 bg-slate-900 border-b border-white/5">
                <div className="container mx-auto px-4 text-center">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
                </div>
            </section>
        )
    }

    if (itemsOnPromotion.length === 0) return null

    return (
        <section className="py-16 md:py-24 bg-slate-900 border-b border-white/5 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-emerald-500" />
                            <span className="text-emerald-500 font-bold tracking-widest text-sm uppercase">Hot Offers</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            {t.title}
                        </h2>
                        <p className="text-white/60 text-lg max-w-2xl">
                            {t.subtitle}
                        </p>
                    </div>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 pb-8 snap-x snap-mandatory -mx-4 px-4 lg:grid lg:grid-cols-3 lg:gap-8 lg:pb-0 lg:mx-0 lg:px-0 scrollbar-hide"
                >
                    {itemsOnPromotion.map(({ item, discountBadge, discountPrice }, idx) => (
                        <div key={item.id} className="min-w-[75vw] sm:min-w-[45vw] lg:min-w-0 snap-center animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                            <MenuItemCard
                                item={item}
                                language={language}
                                discountBadge={discountBadge}
                                discountPrice={discountPrice}
                            />
                        </div>
                    ))}
                </div>

                <div className="text-center animate-fade-in-up delay-500 mt-12 lg:hidden">
                    <Button asChild size="lg" className="rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm px-8">
                        <Link href="/menu">
                            {t.viewAll} <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
