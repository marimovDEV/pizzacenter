"use client"

import { ShoppingCart, Minus, Plus, Trash2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/api"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import type { Language } from "@/lib/types"

interface CartSheetProps {
    children?: React.ReactNode
    language: Language
}

export function CartSheet({ children, language }: CartSheetProps) {
    const { cart, updateQuantity, removeFromCart, getTotalPrice } = useCart()
    const [isOpen, setIsOpen] = useState(false)

    const totalPrice = getTotalPrice()

    const getName = (item: any) => {
        if (language === "uz") return item.name_uz
        if (language === "ru") return item.name_ru
        return item.name
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                {children || (
                    <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
                        <ShoppingCart className="w-6 h-6" />
                        {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                                {cart.length}
                            </span>
                        )}
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md bg-slate-900 border-l border-white/5 p-0 flex flex-col">
                <SheetHeader className="p-4 border-b border-white/5">
                    <SheetTitle className="text-white flex items-center gap-2 text-lg">
                        <ShoppingCart className="w-5 h-5 text-emerald-500" />
                        {language === "uz" ? "Savat" : language === "ru" ? "Корзина" : "Cart"}
                        <span className="text-xs font-normal text-white/40 ml-auto">
                            {cart.length} {language === "uz" ? "ta mahsulot" : language === "ru" ? "товаров" : "items"}
                        </span>
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-3 opacity-40">
                            <ShoppingCart className="w-12 h-12 text-white/20" />
                            <p className="text-white/60 text-base">
                                {language === "uz" ? "Savatingiz bo'sh" : language === "ru" ? "Ваша корзина пуста" : "Your cart is empty"}
                            </p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.menuItem.id} className="flex gap-3 bg-white/5 p-2 rounded-xl border border-white/10">
                                <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                                    <Image
                                        src={item.menuItem.image || "/placeholder.svg"}
                                        alt={getName(item.menuItem) || "Mahsulot rasmi"}
                                        fill
                                        className="object-cover"
                                        sizes="56px"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                        <h4 className="text-white text-sm font-bold line-clamp-1 flex-1">{getName(item.menuItem)}</h4>
                                        <p className="text-emerald-400 font-bold text-sm whitespace-nowrap">{formatPrice(item.menuItem.price)}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <div className="flex items-center gap-1.5 bg-white/5 rounded-lg p-0.5">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-white/60 hover:text-white"
                                                onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                                            >
                                                <Minus className="w-2.5 h-2.5" />
                                            </Button>
                                            <span className="text-white text-xs font-bold w-4 text-center">{item.quantity}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-white/60 hover:text-white"
                                                onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                                            >
                                                <Plus className="w-2.5 h-2.5" />
                                            </Button>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 text-white/20 hover:text-red-400"
                                            onClick={() => removeFromCart(item.menuItem.id)}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <SheetFooter className="p-4 border-t border-white/5 bg-slate-900 mt-auto">
                        <div className="w-full space-y-3">
                            <div className="flex justify-between items-center text-base font-bold text-white">
                                <span>{language === "uz" ? "Jami:" : language === "ru" ? "Итого:" : "Total:"}</span>
                                <span className="text-emerald-400">{formatPrice(totalPrice)}</span>
                            </div>
                            <Link href="/cart" onClick={() => setIsOpen(false)} className="block w-full">
                                <Button className="w-full h-11 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                                    {language === "uz" ? "Buyurtma berish" : language === "ru" ? "Оформить заказ" : "Checkout"}
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    )
}
