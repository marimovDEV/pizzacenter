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
            <SheetContent className="w-full sm:max-w-md bg-slate-900 border-l-slate-800 p-0 flex flex-col">
                <SheetHeader className="p-6 border-b border-slate-800">
                    <SheetTitle className="text-white flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-emerald-500" />
                        {language === "uz" ? "Savat" : language === "ru" ? "Корзина" : "Cart"}
                        <span className="text-sm font-normal text-slate-400 ml-auto">
                            {cart.length} {language === "uz" ? "ta mahsulot" : language === "ru" ? "товаров" : "items"}
                        </span>
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                            <ShoppingCart className="w-16 h-16 text-slate-600" />
                            <p className="text-slate-400 text-lg">
                                {language === "uz" ? "Savatingiz bo'sh" : language === "ru" ? "Ваша корзина пуста" : "Your cart is empty"}
                            </p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.menuItem.id} className="flex gap-4 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800">
                                    <Image
                                        src={item.menuItem.image || "/placeholder.svg"}
                                        alt={getName(item.menuItem) || "Mahsulot rasmi"}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-white font-medium line-clamp-1">{getName(item.menuItem)}</h4>
                                        <p className="text-emerald-400 font-bold text-sm">{formatPrice(item.menuItem.price)}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1 border border-slate-700">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-slate-300 hover:text-white"
                                                onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </Button>
                                            <span className="text-white text-sm font-medium w-4 text-center">{item.quantity}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-slate-300 hover:text-white"
                                                onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                                            >
                                                <Plus className="w-3 h-3" />
                                            </Button>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-500 hover:text-red-400 hover:bg-slate-800"
                                            onClick={() => removeFromCart(item.menuItem.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <SheetFooter className="p-6 border-t border-slate-800 bg-slate-900 mt-auto">
                        <div className="w-full space-y-4">
                            <div className="flex justify-between items-center text-lg font-bold text-white">
                                <span>{language === "uz" ? "Jami:" : language === "ru" ? "Итого:" : "Total:"}</span>
                                <span className="text-emerald-400">{formatPrice(totalPrice)}</span>
                            </div>
                            <Link href="/cart" onClick={() => setIsOpen(false)} className="block w-full">
                                <Button className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2">
                                    {language === "uz" ? "Buyurtma berish" : language === "ru" ? "Оформить заказ" : "Checkout"}
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    )
}
