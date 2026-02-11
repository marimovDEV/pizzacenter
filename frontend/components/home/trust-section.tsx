"use client"

import { useLanguage } from "@/lib/language-context"
import { Clock, Star, Users, Award } from "lucide-react"

const translations = {
    uz: {
        happyClients: "3000+ Mamnun mijozlar",
        rating: "4.9/5 Reyting",
        delivery: "15-30 daqiqa yetkazish",
        chefs: "Tajribali oshpazlar",
    },
    ru: {
        happyClients: "3000+ Довольных клиентов",
        rating: "4.9/5 Рейтинг",
        delivery: "Доставка 15-30 мин",
        chefs: "Опытные повара",
    },
    en: {
        happyClients: "3000+ Happy Clients",
        rating: "4.9/5 Rating",
        delivery: "15-30 min Delivery",
        chefs: "Expert Chefs",
    },
}

export function TrustSection() {
    const { language } = useLanguage()
    const t = translations[language]

    const items = [
        { icon: Star, text: t.rating, color: "text-emerald-400" },
        { icon: Clock, text: t.delivery, color: "text-blue-400" },
        { icon: Award, text: t.chefs, color: "text-emerald-500" },
        { icon: Users, text: t.happyClients, color: "text-emerald-400" },
    ]

    return (
        <div className="bg-slate-900 border-b border-white/5 py-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                    {items.map((item, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur hover:bg-white/10 transition-colors">
                            <item.icon className={`w-8 h-8 mb-3 ${item.color}`} />
                            <span className="text-white font-medium text-sm md:text-base">{item.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
