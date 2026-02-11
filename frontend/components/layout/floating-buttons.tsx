"use client"

import { Phone, Send, Instagram } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

import { SITE_CONFIG } from "@/lib/site-config"

export function FloatingButtons() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 300)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div className={cn("fixed bottom-24 right-4 z-40 flex flex-col gap-3 transition-opacity duration-300 md:bottom-8",
            isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}>

            {/* Telegram */}
            <a
                href={SITE_CONFIG.socials.telegram}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-full bg-[#0088cc] shadow-lg shadow-blue-500/30 flex items-center justify-center text-white hover:scale-110 transition-transform md:w-14 md:h-14"
                aria-label="Telegram"
            >
                <Send className="w-5 h-5 md:w-6 md:h-6" />
            </a>

            {/* Instagram */}
            <a
                href={SITE_CONFIG.socials.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 shadow-lg shadow-red-500/30 flex items-center justify-center text-white hover:scale-110 transition-transform md:w-14 md:h-14"
                aria-label="Instagram"
            >
                <Instagram className="w-5 h-5 md:w-6 md:h-6" />
            </a>

            {/* Phone (Main CTA) */}
            <a
                href={`tel:${SITE_CONFIG.contacts.phone}`}
                className="w-12 h-12 rounded-full bg-green-500 shadow-lg shadow-green-500/30 flex items-center justify-center text-white animate-pulse hover:animate-none hover:scale-110 transition-transform md:w-14 md:h-14"
                aria-label="Call"
            >
                <Phone className="w-5 h-5 md:w-6 md:h-6" />
            </a>
        </div>
    )
}
