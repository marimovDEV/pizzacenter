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
        title: "Oshpaz tavsiyasi",
        subtitle: "Turli xil lazzatlardan siz uchun maxsus saralab olganlarimiz",
        viewAll: "Barchasini ko'rish",
    },
    ru: {
        title: "От шеф-повара",
        subtitle: "Наши специально отобранные блюда с разнообразными вкусами",
        viewAll: "Посмотреть все",
    },
    en: {
        title: "Chef's Choice",
        subtitle: "Specially selected dishes with a variety of flavors just for you",
        viewAll: "View All",
    },
}

export function RecommendedDishesSection() {
    const { menuItems, promotions, loading } = useMenu()
    const { language } = useLanguage()
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const t = translations[language]

    // Logic: Pick 1-2 items from each category for maximum variety
    const recommendedItems = (() => {
        if (!menuItems) return []

        // Enrich menuItems with promotion data
        const enrichedItems = menuItems.map(item => {
            const activePromo = promotions.find(p =>
                p.active &&
                p.menu_items?.some(miId => miId === item.id)
            )

            if (activePromo) {
                let discountPrice = item.price
                let discountLabel = ""

                if (activePromo.discount_type === 'percent') {
                    discountPrice = item.price * (1 - (activePromo.discount_percentage || 0) / 100)
                    discountLabel = `-${activePromo.discount_percentage}%`
                } else if (activePromo.discount_type === 'amount') {
                    discountPrice = Math.max(0, item.price - (activePromo.discount_amount || 0))
                    discountLabel = `Chegirma`
                }

                return {
                    ...item,
                    discountPrice,
                    discountBadge: discountLabel
                }
            }
            return item
        })

        // Group by category
        const itemsByCategory: Record<string, typeof enrichedItems> = {}
        enrichedItems.forEach(item => {
            if (item.is_active && item.available) {
                const catId = String(item.category)
                if (!itemsByCategory[catId]) {
                    itemsByCategory[catId] = []
                }
                itemsByCategory[catId].push(item)
            }
        })

        // Pick 1 high-rated item from each category
        const selectedItems: typeof enrichedItems = []
        Object.values(itemsByCategory).forEach(categoryItems => {
            const sorted = categoryItems.sort((a, b) => (b.rating || 0) - (a.rating || 0))
            if (sorted.length > 0) {
                selectedItems.push(sorted[0])
            }
        })

        // If we have few categories, pick second best too
        if (selectedItems.length < 6) {
            Object.values(itemsByCategory).forEach(categoryItems => {
                const sorted = categoryItems.sort((a, b) => (b.rating || 0) - (a.rating || 0))
                if (sorted.length > 1) {
                    // Ensure we don't add duplicates if the first item was already added
                    if (!selectedItems.some(item => item.id === sorted[1].id)) {
                        selectedItems.push(sorted[1])
                    }
                }
            })
        }

        // Shuffle slightly for "mixed" feel and limit
        return selectedItems.sort(() => Math.random() - 0.5).slice(0, 8)
    })()

    // Auto-scroll logic for mobile/tablet
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current
        if (!scrollContainer || recommendedItems.length <= 1) return

        const interval = setInterval(() => {
            if (window.innerWidth >= 1024) return // lg breakpoint

            const { scrollLeft, scrollWidth, clientWidth } = scrollContainer

            if (scrollLeft + clientWidth >= scrollWidth - 10) {
                scrollContainer.scrollTo({ left: 0, behavior: "smooth" })
            } else {
                scrollContainer.scrollBy({ left: clientWidth * 0.5, behavior: "smooth" })
            }
        }, 3500)

        return () => clearInterval(interval)
    }, [recommendedItems.length])

    if (loading) return null

    if (recommendedItems.length === 0) return null

    return (
        <section className="py-16 md:py-24 bg-slate-800/50 border-b border-white/5 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                        <span className="text-emerald-500 font-bold tracking-widest text-sm uppercase">Variety & Flavor</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {t.title}
                    </h2>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">
                        {t.subtitle}
                    </p>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 pb-8 snap-x snap-mandatory -mx-4 px-4 lg:grid lg:grid-cols-4 lg:gap-8 lg:pb-0 lg:mx-0 lg:px-0 scrollbar-hide"
                >
                    {recommendedItems.map((item, idx) => (
                        <div key={item.id} className="min-w-[75vw] sm:min-w-[45vw] lg:min-w-0 snap-center animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                            <MenuItemCard
                                item={item}
                                language={language}
                                priority={idx < 4}
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
