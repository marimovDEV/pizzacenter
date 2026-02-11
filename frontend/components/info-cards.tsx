"use client"

import { Clock, MapPin, Phone, Instagram } from "lucide-react"
import { Card } from "@/components/ui/card"

const infoItems = [
  {
    icon: Clock,
    title: "Ish Vaqti",
    description: "Har kuni 10:00 - 23:00",
  },
  {
    icon: MapPin,
    title: "Manzil",
    description: "Toshkent shahar, Chilonzor tumani",
  },
  {
    icon: Phone,
    title: "Telefon",
    description: "+998 90 123 45 67",
  },
  {
    icon: Instagram,
    title: "Instagram",
    description: "@tokyorestaurant",
    link: "https://instagram.com/tokyorestaurant",
  },
]

export function InfoCards() {
  return (
    <section className="py-6 md:py-8 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {infoItems.map((item, index) => {
            const Icon = item.icon
            const content = (
              <Card className="p-4 md:p-5 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group bg-white/95 backdrop-blur-sm border-white/20 rounded-2xl min-h-[48px]">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#007A3D] to-[#00A651] flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform shadow-md">
                  <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <h3 className="text-xs md:text-sm font-bold text-foreground mb-1.5 md:mb-2 break-words">
                  {item.title}
                </h3>
                <p className="text-[10px] md:text-xs text-muted-foreground leading-relaxed break-words">
                  {item.description}
                </p>
              </Card>
            )

            if (item.link) {
              return (
                <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="block">
                  {content}
                </a>
              )
            }

            return <div key={index}>{content}</div>
          })}
        </div>
      </div>
    </section>
  )
}
