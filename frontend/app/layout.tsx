import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/sonner"
import { MenuProvider } from "@/lib/menu-context"
import { CartProvider } from "@/lib/cart-context"
import { FeedbackProvider } from "@/lib/feedback-context"
import { LanguageProvider } from "@/lib/language-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "PIZZA CENTR GARDEN 🍕 Urganch — Eng mazali Pizza, Grill va Setlar",
  description: "PIZZA CENTR GARDEN — Urganch shahridagi eng shinam oilaviy restoran va garden 🌿. Mazali pizza, grill, setlar va ichimliklar bilan xizmatdamiz. Yetkazib berish xizmati: +998 88 566 60 00. Ish vaqti: 09:00–02:00.",
  keywords: "Pizza Centr Garden Urganch, pizza Urganch, grill Xorazm, oilaviy restoran Urganch, garden restoran, pizza yetkazib berish, Pizza Centr",
  authors: [{ name: "PIZZA CENTR GARDEN Urganch" }],
  openGraph: {
    title: "PIZZA CENTR GARDEN Urganch 🍕🌿",
    description: "Urganchdagi eng shinam oilaviy restoran. Ish vaqti 09:00–02:00. Tel: +998 88 566 60 00",
    url: "https://pizzacentr.uz/",
    siteName: "PIZZA CENTR GARDEN Urganch",
    images: [
      {
        url: "/seo-image.png",
        width: 1200,
        height: 630,
        alt: "PIZZA CENTR GARDEN Urganch",
      },
    ],
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PIZZA CENTR GARDEN Urganch 🍕",
    description: "Pizza, grill, ichimliklar va oilaviy garden muhiti Xorazmda.",
    images: ["/seo-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
    shortcut: "/favicon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "PIZZA CENTR GARDEN Urganch",
    "image": "https://pizzacentr.uz/seo-image.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "улица Байналминал, 29",
      "addressLocality": "Ургенч",
      "addressRegion": "Хорезмская область",
      "postalCode": "220100",
      "addressCountry": "UZ"
    },
    "telephone": "+998885666000",
    "openingHours": "Mo-Su 09:00-02:00",
    "servesCuisine": ["Pizza", "European", "Uzbek"],
    "priceRange": "$$",
    "menu": "https://pizzacentr.uz/menu",
    "url": "https://pizzacentr.uz",
    "sameAs": [
      "https://www.instagram.com/pizza_centr__garden"
    ]
  }

  return (
    <html lang="uz">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="canonical" href="https://pizzacentr.uz/" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <LanguageProvider>
          <MenuProvider>
            <CartProvider>
              <FeedbackProvider>
                <Suspense fallback={null}>{children}</Suspense>
                <Toaster />
                <Analytics />
              </FeedbackProvider>
            </CartProvider>
          </MenuProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
