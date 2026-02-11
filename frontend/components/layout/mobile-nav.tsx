"use client"

import { Phone, ShoppingBag, UtensilsCrossed } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const translations = {
    uz: {
        menu: "Menyu",
        call: "Qo'ng'iroq",
        cart: "Savat",
    },
    ru: {
        menu: "Меню",
        call: "Звонок",
        cart: "Корзина",
    },
    en: {
        menu: "Menu",
        call: "Call",
        cart: "Cart",
    },
}

import { SITE_CONFIG } from "@/lib/site-config"

export function MobileNav() {
    const { language } = useLanguage()
    const pathname = usePathname()
    const t = translations[language]

    // Only show on mobile
    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 z-50 flex items-center justify-around px-2 pb-safe">
            <Link
                href="/menu"
                className={cn("flex flex-col items-center justify-center gap-1 w-full h-full text-xs font-medium transition-colors",
                    pathname === "/menu" ? "text-emerald-500" : "text-white/60")}
            >
                <UtensilsCrossed className="w-5 h-5" />
                {t.menu}
            </Link>

            <a
                href={`tel:${SITE_CONFIG.contacts.phone}`}
                className="flex flex-col items-center justify-center gap-1 w-full h-full text-xs font-medium text-white/60 active:text-emerald-400 transition-colors"
            >
                <Phone className="w-5 h-5" />
                {t.call}
            </a>

            <Link
                href="/cart"
                className={cn("flex flex-col items-center justify-center gap-1 w-full h-full text-xs font-medium transition-colors",
                    pathname === "/cart" ? "text-emerald-500" : "text-white/60")}
            >
                <ShoppingBag className="w-5 h-5" />
                {t.cart}
            </Link>
        </div>
    )
}
